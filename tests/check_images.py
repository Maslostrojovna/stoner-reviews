"""HTTP checks of SSR image references, candidates, names and original URLs."""
import json
import os
import struct
import sys
import unittest
from html.parser import HTMLParser
from urllib.error import HTTPError
from urllib.parse import quote
from urllib.request import Request, urlopen

BASE = (sys.argv.pop(1) if len(sys.argv) > 1 else "http://127.0.0.1:8792").rstrip("/")


def get(path):
    try:
        headers = {"User-Agent": os.environ["STONER_TEST_USER_AGENT"]} if os.environ.get("STONER_TEST_USER_AGENT") else {}
        response = urlopen(Request(BASE + path, headers=headers), timeout=15)
    except HTTPError as error:
        response = error
    with response:
        return response.status, response.headers, response.read()


class Images(HTMLParser):
    def __init__(self, body):
        super().__init__(convert_charrefs=True)
        self.images = []
        self.feed(body.decode())

    def handle_starttag(self, tag, attrs):
        if tag == "img":
            self.images.append(dict(attrs))


def candidates(image):
    return [(part.strip().split()[0], int(part.strip().split()[1][:-1]))
            for part in image["srcset"].split(",")]


def webp_dimensions(body):
    # Generated lossy WebP: walk the RIFF chunks to the VP8 frame header.
    if body[:4] != b"RIFF" or body[8:12] != b"WEBP":
        raise AssertionError("Not a WebP response")
    offset = 12
    while offset + 8 <= len(body):
        kind = body[offset:offset + 4]
        size = struct.unpack("<I", body[offset + 4:offset + 8])[0]
        frame = body[offset + 8:offset + 8 + size]
        if kind == b"VP8 ":
            if frame[3:6] != b"\x9d\x01\x2a":
                raise AssertionError("Invalid VP8 keyframe")
            width, height = struct.unpack("<HH", frame[6:10])
            return width & 0x3fff, height & 0x3fff
        offset += 8 + size + size % 2
    raise AssertionError("Missing generated VP8 frame")


class ImageChecks(unittest.TestCase):
    @classmethod
    def setUpClass(cls):
        status, _, body = get("/api/editorial-reviews")
        if status != 200:
            raise AssertionError("Review fixtures unavailable")
        cls.reviews = json.loads(body)["editorial_reviews"]

    def test_artwork_is_in_raw_html_with_film_year_alt_and_reserved_space(self):
        paths = ["/", "/reviews/"] + [f'/reviews/{quote(r["slug"], safe="")}/' for r in self.reviews]
        for path in paths:
            with self.subTest(path=path):
                status, _, body = get(path)
                self.assertEqual(status, 200)
                art = [i for i in Images(body).images if i["src"].startswith("/posters/")]
                reviews = self.reviews if path in ["/", "/reviews/"] else [r for r in self.reviews if path == f'/reviews/{quote(r["slug"], safe="")}/']
                self.assertEqual(len(art), len(reviews))
                for index, (image, review) in enumerate(zip(art, reviews)):
                    film = review["movie_title"] + (f' ({review["release_year"]})' if review["release_year"] is not None else "")
                    self.assertEqual(image["alt"], f"Illustrated poster for {film}.")
                    self.assertEqual(image["width"], image["height"])
                    self.assertGreater(int(image["width"]), 0)
                    self.assertEqual(image["decoding"], "async")
                    self.assertEqual(image["fetchpriority"], "high" if (path == "/" and index == 0) or path not in ["/", "/reviews/"] else "auto")
                    self.assertEqual([width for _, width in candidates(image)], [320, 720, 1152])
                    for url, _ in candidates(image):
                        self.assertRegex(url, r"-stoner-reviews\.webp$")
                        self.assertNotRegex(url, r"-(?:320|720|1152|v1)(?:-|\.)")
                    if path == "/":
                        self.assertIn("calc(100vw - 36px)", image["sizes"])
                        self.assertTrue(image["src"].endswith("-stoner-reviews.webp"))
                        self.assertNotIn("-thumbnail-", image["src"])
                    elif path == "/reviews/":
                        self.assertIn("200px, 256px", image["sizes"])
                        self.assertIn("-thumbnail-stoner-reviews.webp", image["src"])
                    else:
                        self.assertIn("400px", image["sizes"])
                        self.assertIn("-large-stoner-reviews.webp", image["src"])

    def test_every_candidate_response_has_matching_type_and_dimensions(self):
        art = [i for i in Images(get("/")[2]).images if "srcset" in i]
        checked = set()
        for image in art:
            for url, width in candidates(image):
                with self.subTest(url=url):
                    status, headers, body = get(url)
                    self.assertEqual(status, 200)
                    self.assertEqual(headers.get_content_type(), "image/webp")
                    self.assertNotIn("X-Robots-Tag", headers)
                    self.assertEqual(webp_dimensions(body), (width, width))
                    # Preserve high-density detail rather than enforce a 200KB
                    # ceiling on the rare largest candidate.
                    self.assertLess(len(body), 350_000)
                    if width <= 720:
                        self.assertLess(len(body), 200_000)
                    checked.add(url)
        self.assertEqual(len(checked), len(self.reviews) * 3)

    def test_eager_first_view_and_native_lazy_loading(self):
        for path, eager_count in [("/", 3), ("/reviews/", 1)]:
            art = [i for i in Images(get(path)[2]).images if "srcset" in i]
            self.assertEqual([i["loading"] for i in art],
                             ["eager"] * eager_count + ["lazy"] * (len(art) - eager_count))
        for review in self.reviews:
            art = [i for i in Images(get(f'/reviews/{quote(review["slug"], safe="")}/')[2]).images if "srcset" in i]
            self.assertEqual(art[0]["loading"], "eager")

    def test_original_public_images_still_resolve(self):
        for name in ["fear-and-loathing-1998.png", "coherence-2013.svg", "a-complete-unknown-2024.svg",
                     "the-wolf-of-wall-street-2013.svg", "predator-badlands-2025.svg"]:
            with self.subTest(original=name):
                self.assertEqual(get("/posters/" + name)[0], 200)

    def test_review_icons_and_overall_tickets_retain_text_scores(self):
        labels = {"fun": "Fun", "action": "Action", "mind_blowing": "Mind-blowing",
                  "smart": "Smart", "feels": "Feels", "brain_effort": "Brain Effort"}
        tickets = {1: "hard-pass", 2: "maybe-another-night", 3: "worth-the-trip",
                   4: "a-proper-treat", 5: "peak-cinema"}
        for review in self.reviews:
            path = f'/reviews/{quote(review["slug"], safe="")}/'
            with self.subTest(path=path):
                status, _, body = get(path)
                self.assertEqual(status, 200)
                images = Images(body).images
                text = body.decode()
                for key, label in labels.items():
                    if not isinstance(review.get(key), int) or not 1 <= review[key] <= 5:
                        continue
                    url = f'/icons/stoner-scores/{key.replace("_", "-")}-stoner-reviews.svg'
                    icon = next(i for i in images if i["src"] == url)
                    self.assertEqual(icon["alt"], "")
                    self.assertEqual(icon["aria-hidden"], "true")
                    self.assertIn(f"<span>{label}</span>", text)
                    self.assertEqual(get(url)[0], 200)
                score = review.get("overall")
                if isinstance(score, int) and score in tickets:
                    url = f'/icons/stoner-scores/overall-{score}-{tickets[score]}-stoner-reviews.svg'
                    icon = next(i for i in images if i["src"] == url)
                    self.assertEqual(icon["alt"], "")
                    self.assertIn(f"Overall: <strong>{score}/5</strong>", text)
                    self.assertEqual(get(url)[0], 200)

    def test_scores_has_named_logo_and_six_decorative_category_icons(self):
        images = Images(get("/stoner-scores/")[2]).images
        self.assertEqual(len(images), 7)
        self.assertEqual(images[0]["src"], "/logos/stoner-reviews-v7-transparent.svg")
        self.assertEqual(images[0]["alt"], "Stoner Reviews")
        for image in images[1:]:
            self.assertTrue(image["src"].startswith("/icons/stoner-scores/"))
            self.assertEqual(image["alt"], "")
            self.assertEqual(image["aria-hidden"], "true")
            self.assertEqual(get(image["src"])[0], 200)


if __name__ == "__main__":
    unittest.main(verbosity=2)
