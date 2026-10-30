"""Inspect actual HTTP HTML and PNG responses; no browser JavaScript.

python3 tests/check_social_metadata.py http://127.0.0.1:8792
STONER_TEST_HARNESS=1 additionally enables local-only escaping/failure fixtures.
"""
import json
import os
import struct
import sys
import unittest
from html.parser import HTMLParser
from urllib.error import HTTPError
from urllib.parse import quote, urlsplit
from urllib.request import HTTPRedirectHandler, Request, build_opener

BASE = (sys.argv.pop(1) if len(sys.argv) > 1 else "http://127.0.0.1:8792").rstrip("/")
ORIGIN = "https://stoner.reviews"
HARNESS = os.environ.get("STONER_TEST_HARNESS") == "1"


class NoRedirect(HTTPRedirectHandler):
    def redirect_request(self, *args):
        return None


def get(path, headers=None):
    request_headers = {"User-Agent": os.environ["STONER_TEST_USER_AGENT"]} if os.environ.get("STONER_TEST_USER_AGENT") else {}
    request_headers.update(headers or {})
    try:
        response = build_opener(NoRedirect).open(Request(BASE + path, headers=request_headers), timeout=20)
    except HTTPError as error:
        response = error
    with response:
        return response.status, response.headers, response.read()


class Head(HTMLParser):
    def __init__(self, body):
        super().__init__(convert_charrefs=True)
        self.meta = {}
        self.canonicals = []
        self.title = ""
        self.in_title = False
        self.tags = []
        self.in_head = False
        self.feed(body.decode())

    def handle_starttag(self, tag, attrs):
        if tag == "head":
            self.in_head = True
        if not self.in_head:
            return
        attrs = dict(attrs)
        self.tags.append((tag, attrs))
        if tag == "meta":
            key = attrs.get("property") or attrs.get("name")
            if key:
                self.meta.setdefault(key, []).append(attrs.get("content", ""))
        if tag == "link" and attrs.get("rel") == "canonical":
            self.canonicals.append(attrs["href"])
        if tag == "title":
            self.in_title = True

    def handle_endtag(self, tag):
        if tag == "head":
            self.in_head = False
        if tag == "title":
            self.in_title = False

    def handle_data(self, data):
        if self.in_title:
            self.title += data


class SocialMetadataChecks(unittest.TestCase):
    @classmethod
    def setUpClass(cls):
        status, _, body = get("/api/editorial-reviews")
        if status != 200:
            raise AssertionError(f"API returned {status}")
        cls.reviews = json.loads(body)["editorial_reviews"]
        if not cls.reviews:
            raise AssertionError("Tests require existing published-review fixtures")

    def assert_metadata(self, path, title, description, kind, headers=None):
        status, response_headers, body = get(path + "?utm_source=metadata-test", headers)
        self.assertEqual(status, 200)
        self.assertIn("text/html", response_headers["Content-Type"])
        head = Head(body)
        self.assertEqual(head.title, title)
        self.assertEqual(head.canonicals, [ORIGIN + path])
        expected = {
            "description": description, "og:title": title, "og:description": description,
            "og:type": kind, "og:url": ORIGIN + path, "og:site_name": "Stoner Reviews",
            "og:image:width": "1200", "og:image:height": "630", "og:image:type": "image/png",
            "twitter:card": "summary_large_image", "twitter:title": title,
            "twitter:description": description,
        }
        for key, value in expected.items():
            self.assertEqual(head.meta.get(key), [value], key)
        self.assertNotIn("social-metadata", head.meta)
        self.assertNotIn("robots", head.meta)
        self.assertNotIn("X-Robots-Tag", response_headers)
        image = head.meta["og:image"]
        self.assertEqual(len(image), 1)
        self.assertTrue(image[0].startswith(ORIGIN + "/social/"))
        self.assertRegex(image[0], r"-stoner-reviews\.png$")
        self.assertEqual(head.meta["twitter:image"], image)
        self.assertEqual(head.meta["twitter:image:alt"], head.meta["og:image:alt"])
        self.assertTrue(head.meta["og:image:alt"][0])
        return head, body

    def test_site_pages_are_specific_and_canonical(self):
        pages = [
            ("/", "Stoner Reviews – Movie Reviews & Recommendations",
             "What should I watch high tonight? Movie reviews, new perspectives, and inspiration for your next film."),
            ("/reviews/", "Movie reviews — Stoner Reviews",
             "Movie recommendations for watching high, with honest reviews and five independent mood ratings."),
            ("/stoner-scores/", "Stoner Scores — Our movie rating system | Stoner Reviews",
             "Six movie rating categories explained, plus our independent Overall editorial recommendation."),
        ]
        for path, title, description in pages:
            with self.subTest(path=path):
                self.assert_metadata(path, title, description, "website")

    def test_every_review_uses_stored_editorial_content(self):
        images = set()
        for review in self.reviews:
            with self.subTest(slug=review["slug"]):
                film = review["movie_title"] + (f' ({review["release_year"]})' if review["release_year"] is not None else "")
                head, body = self.assert_metadata(
                    f'/reviews/{quote(review["slug"], safe="")}/', film + " review — Stoner Reviews",
                    (review["verdict"] or "").strip() or (review["tagline"] or "").strip(), "article")
                self.assertEqual(head.meta["og:image:alt"], [f"Illustrated Stoner Reviews poster for {film}."])
                images.add(head.meta["og:image"][0])
                self.assertIn(b'Why watch it high?', body)
        self.assertEqual(len(images), len(self.reviews))

    def test_image_responses_match_declared_dimensions_and_type(self):
        paths = ["/", "/reviews/", "/stoner-scores/"] + [f'/reviews/{quote(r["slug"], safe="")}/' for r in self.reviews]
        checked = set()
        for path in paths:
            head = Head(get(path)[2])
            image = head.meta["og:image"][0]
            if image in checked:
                continue
            checked.add(image)
            parsed = urlsplit(image)
            self.assertEqual((parsed.scheme, parsed.netloc), ("https", "stoner.reviews"))
            status, headers, png = get(parsed.path)
            self.assertEqual(status, 200)
            self.assertEqual(headers.get_content_type(), "image/png")
            self.assertEqual(png[:8], b"\x89PNG\r\n\x1a\n")
            self.assertEqual(png[12:16], b"IHDR")
            dimensions = struct.unpack(">II", png[16:24])
            self.assertEqual(dimensions, (int(head.meta["og:image:width"][0]), int(head.meta["og:image:height"][0])))

    def assert_unindexable(self, path, status, headers=None):
        actual, response_headers, body = get(path, headers)
        self.assertEqual(actual, status)
        self.assertEqual(response_headers["X-Robots-Tag"], "noindex")
        head = Head(body)
        self.assertEqual(head.canonicals, [])
        self.assertEqual(head.meta.get("robots"), ["noindex"])
        self.assertFalse(any(key.startswith(("og:", "twitter:")) for key in head.meta))
        return response_headers

    def test_unknown_review_has_no_social_identity(self):
        for path in ["/reviews/no-such-film/", "/reviews/no-such-film"]:
            self.assert_unindexable(path, 404)

    @unittest.skipUnless(HARNESS, "Local test entry only")
    def test_unavailable_inline_css_keeps_original_stylesheet_links(self):
        status, _, body = get("/", {"x-test-scenario": "css-unavailable"})
        self.assertEqual(status, 200)
        head = Head(body)
        self.assertEqual([attrs["href"] for tag, attrs in head.tags
                          if tag == "link" and attrs.get("rel") == "stylesheet"],
                         ["/site.css", "/home.css", "/site-nav.css"])
        self.assertEqual(head.meta["og:url"], [ORIGIN + "/"])

    @unittest.skipUnless(HARNESS, "Local test entry only")
    def test_database_errors_have_no_indexable_metadata(self):
        for path in ["/", "/reviews/", f'/reviews/{self.reviews[0]["slug"]}/']:
            headers = self.assert_unindexable(path, 503, {"x-test-scenario": "database-error"})
            self.assertEqual(headers["Retry-After"], "60")

    @unittest.skipUnless(HARNESS, "Local test entry only")
    def test_stored_quotes_ampersands_and_markup_cannot_inject_tags(self):
        head, _ = self.assert_metadata(
            "/reviews/metadata-escaping/",
            'A "quote" & <script id="injected">alert(1)</script> (' + str(self.reviews[0]["release_year"]) + ') review — Stoner Reviews',
            'A "verdict" & </title><meta name="injected" content="yes">',
            "article", {"x-test-scenario": "escaping"})
        self.assertNotIn("injected", head.meta)
        self.assertFalse(any(attrs.get("id") == "injected" for _, attrs in head.tags))

    @unittest.skipUnless(HARNESS, "Local test entry only")
    def test_description_fallback_does_not_invent_a_synopsis(self):
        review = self.reviews[0]
        film = f'{review["movie_title"]} ({review["release_year"]})'
        for scenario, description in [("tagline", review["tagline"]), ("empty-description", "")]:
            self.assert_metadata(f'/reviews/{review["slug"]}/', film + " review — Stoner Reviews",
                                 description, "article", {"x-test-scenario": scenario})

    @unittest.skipUnless(HARNESS, "Local test entry only")
    def test_alternate_request_host_never_leaks_into_metadata(self):
        paths = ["/", "/reviews/", "/stoner-scores/"] + [f'/reviews/{r["slug"]}/' for r in self.reviews]
        for path in paths:
            status, _, body = get(path + "?tracking=1", {"x-test-request-host": "alternate.example"})
            self.assertEqual(status, 200)
            head = Head(body)
            self.assertEqual(head.canonicals, [ORIGIN + path])
            self.assertEqual(head.meta["og:url"], [ORIGIN + path])
            self.assertNotIn("alternate.example", body.decode())

    @unittest.skipUnless(HARNESS, "Local test entry only")
    def test_old_domain_redirect_preserves_path_and_query(self):
        for path in ["/?from=old", "/reviews/coherence/?from=old", "/social/homepage-stoner-reviews.png?from=old"]:
            status, headers, _ = get(path, {"x-test-request-host": "stoner.danimaslo.dev"})
            self.assertEqual(status, 308)
            self.assertEqual(headers["Location"], ORIGIN + path)


if __name__ == "__main__":
    unittest.main(verbosity=2)
