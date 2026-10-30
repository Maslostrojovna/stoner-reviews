"""HTTP integration checks against a running local Wrangler server (no browser JS).

Run: python3 tests/check_review_url.py [http://127.0.0.1:8788]
Requires local migrations plus Fear and Loathing and Wolf imports in local D1.
See database/WOLF-2026-10-26.md.
"""
import json
import os
import re
import sys
import unittest
from html.parser import HTMLParser
from urllib.error import HTTPError
from urllib.request import HTTPRedirectHandler, Request, build_opener

BASE = (sys.argv.pop(1) if len(sys.argv) > 1 else "http://127.0.0.1:8788").rstrip("/")
PATH = "/reviews/fear-and-loathing-in-las-vegas/"


class NoRedirect(HTTPRedirectHandler):
    def redirect_request(self, *args):
        return None


def get(path, *, binary=False):
    try:
        headers = {"User-Agent": os.environ["STONER_TEST_USER_AGENT"]} if os.environ.get("STONER_TEST_USER_AGENT") else {}
        response = build_opener(NoRedirect).open(Request(BASE + path, headers=headers), timeout=15)
    except HTTPError as error:
        response = error
    with response:
        body = response.read()
        return response.status, response.headers, body if binary else body.decode("utf-8")


class Document(HTMLParser):
    blocks = {"article", "div", "p", "h1", "h2", "h3", "header", "footer", "main", "nav", "section", "dt", "dd", "li", "br"}

    def __init__(self, html):
        super().__init__(convert_charrefs=True)
        self.text = []
        self.elements = []
        self.feed(html)

    def handle_data(self, text):
        self.text.append(text)

    def handle_starttag(self, tag, attrs):
        attributes = dict(attrs)
        self.elements.append((tag, attributes))
        if tag in self.blocks or "rating-note" in attributes.get("class", "").split():
            self.text.append(" ")

    def handle_endtag(self, tag):
        if tag in self.blocks:
            self.text.append(" ")


def normalize(text):
    return " ".join(text.split())


class ReviewURLChecks(unittest.TestCase):
    def test_full_review_and_metadata_in_initial_html(self):
        api_status, _, api_body = get("/api/editorial-reviews")
        self.assertEqual(api_status, 200)
        review = next(r for r in json.loads(api_body)["editorial_reviews"]
                      if r["slug"] == "fear-and-loathing-in-las-vegas")
        status, headers, html = get(PATH)
        self.assertEqual(status, 200)
        self.assertIn("text/html", headers["Content-Type"])
        document = Document(html)
        text = normalize("".join(document.text))
        for block in re.split(r"\n\s*\n", review["body_md"].strip()):
            plain = re.sub(r"^#{1,6}\s+", "", block).replace("*", "")
            self.assertIn(normalize(plain), text)
        self.assertIn(review["verdict"], text)
        self.assertIn(review["tagline"], text)
        self.assertIn("Why watch it high?", text)
        self.assertIn("Published by Stoner Reviews", text)
        for field, label in [("overall", "Overall:"), ("fun", "Fun"),
                             ("action", "Action"), ("mind_blowing", "Mind-blowing"),
                             ("smart", "Smart"), ("feels", "Feels")]:
            self.assertRegex(text, re.escape(label) + r"\s*" + str(review[field]) + r"\s*/5")
        self.assertIn("<title>Fear and Loathing in Las Vegas (1998) review — Stoner Reviews</title>", html)
        self.assertIn(("meta", {"name": "description", "content": review["verdict"]}), document.elements)
        self.assertIn(("link", {"rel": "canonical", "href": "https://stoner.reviews" + PATH}), document.elements)
        self.assertEqual(sum(tag == "h1" for tag, _ in document.elements), 1)
        self.assertFalse(any(tag == "details" for tag, _ in document.elements))
        self.assertTrue(all(attrs.get("src") == "/theme.js" or "data-theme-bootstrap" in attrs
                            for tag, attrs in document.elements if tag == "script"))

    def test_direct_request_and_reload(self):
        first = get(PATH)
        reload = get(PATH)
        self.assertEqual((first[0], reload[0]), (200, 200))
        self.assertEqual(first[2], reload[2])

    def test_unknown_review_is_404(self):
        status, headers, html = get("/reviews/this-review-does-not-exist/")
        self.assertEqual(status, 404)
        self.assertIn("Review not found", html)
        self.assertEqual(headers["X-Robots-Tag"], "noindex")
        self.assertFalse(any(tag == "link" and attrs.get("rel") == "canonical"
                             for tag, attrs in Document(html).elements))

    def test_slash_redirect(self):
        status, headers, _ = get(PATH.rstrip("/"))
        self.assertEqual(status, 308)
        self.assertEqual(headers["Location"], BASE + PATH)

    def test_listing_links_to_review_and_home_still_works(self):
        status, _, html = get("/reviews/")
        self.assertEqual(status, 200)
        self.assertIn(f'href="{PATH}"', html)
        self.assertEqual(get("/")[0], 200)

    def test_homepage_has_real_review_links_in_initial_html(self):
        status, _, html = get("/")
        self.assertEqual(status, 200)
        document = Document(html)
        text = normalize("".join(document.text))
        self.assertIn("What should I watch high tonight?", text)
        self.assertIn("An excellent question.", text)
        self.assertIn("The wonderful thing about weed is that it can make almost any film worth watching. But some films are particularly good company when you're high.", text)
        self.assertIn("Stoner Reviews is here to find those films, share unexpected observations, discover things hiding in plain sight, and occasionally take cinema far more seriously than anyone intended.", text)
        self.assertIn("By a stoner. For stoners.", text)
        self.assertIn("We review films and series specifically for the experience of watching them high.", text)
        self.assertNotIn("Brand reference", text)
        self.assertNotIn("design-tokens.json", html)
        self.assertFalse(any(tag == "a" and attrs.get("href", "").endswith(".md")
                             for tag, attrs in document.elements))
        api_status, _, api_body = get("/api/editorial-reviews")
        self.assertEqual(api_status, 200)
        for review in json.loads(api_body)["editorial_reviews"]:
            path = f'/reviews/{review["slug"]}/'
            self.assertIn(f'href="{path}"', html)
            self.assertEqual(get(path)[0], 200)

    def test_work_files_and_brand_previews_return_404(self):
        for path in ["/BRAND.md", "/COMPONENTS.md", "/design-tokens.json",
                     "/brand-preview.html", "/brand.css", "/references-v7/README.md",
                     "/references-v7/provenance.json", "/logos/README.txt",
                     "/logo-decide/stoner-reviews-logo-02-light-on-teal.png"]:
            with self.subTest(path=path):
                self.assertEqual(get(path)[0], 404)

    def test_page_assets_exist(self):
        for path in ["/", "/reviews/", "/stoner-scores/", PATH, "/reviews/this-review-does-not-exist/"]:
            document = Document(get(path)[2])
            for tag, attrs in document.elements:
                asset = attrs.get("src") if tag in ("img", "script") else (
                    attrs.get("href") if tag == "link" and attrs.get("rel") in ("stylesheet", "icon") else None)
                if asset:
                    with self.subTest(page=path, asset=asset):
                        self.assertEqual(get(asset, binary=True)[0], 200)

    def test_scores_page_and_redirect(self):
        status, headers, _ = get("/stoner-scores")
        self.assertEqual(status, 308)
        self.assertEqual(headers["Location"], BASE + "/stoner-scores/")
        status, _, html = get("/stoner-scores/")
        self.assertEqual(status, 200)
        document = Document(html)
        text = normalize("".join(document.text))
        for label in ["Fun", "Action", "Mind-blowing", "Smart", "Feels", "Brain Effort", "Overall"]:
            self.assertIn(label, text)
        self.assertIn("How much concentration the movie demands.", text)
        self.assertNotIn("Full CPU usage", text)
        self.assertIn("not an average of the other scores", text)
        self.assertIn(("link", {"rel": "canonical", "href": "https://stoner.reviews/stoner-scores/"}), document.elements)
        self.assertEqual(sum(tag == "h1" for tag, _ in document.elements), 1)
        self.assertEqual(sum(tag == "li" for tag, _ in document.elements), 0)
        self.assertEqual(get("/stoner-scores/")[2], html)

    def test_consistent_primary_navigation(self):
        for path in ["/", "/reviews/", "/stoner-scores/", PATH, "/reviews/no-such-review/", "/missing-page/"]:
            with self.subTest(path=path):
                html = get(path)[2]
                nav = re.search(r'<nav[^>]*aria-label="Main navigation"[^>]*>(.*?)</nav>', html, re.S)
                self.assertIsNotNone(nav)
                elements = Document(nav[1]).elements
                self.assertEqual([attrs["href"] for tag, attrs in elements if tag == "a"],
                                 ["/", "/reviews/", "/stoner-scores/"])
                if path in ["/", "/reviews/", "/stoner-scores/"]:
                    self.assertEqual([attrs["href"] for tag, attrs in elements
                                      if attrs.get("aria-current") == "page"], [path])

    def test_all_stored_reviews_remain_complete(self):
        status, _, body = get("/api/editorial-reviews")
        self.assertEqual(status, 200)
        for review in json.loads(body)["editorial_reviews"]:
            with self.subTest(review=review["slug"]):
                status, _, html = get(f'/reviews/{review["slug"]}/')
                self.assertEqual(status, 200)
                text = normalize("".join(Document(html).text))
                for block in re.split(r"\n\s*\n", review["body_md"].strip()):
                    self.assertIn(normalize(re.sub(r"^#{1,6}\s+", "", block).replace("*", "")), text)
                self.assertIn(review["verdict"], text)
                self.assertIn(review["tagline"], text)
                for field, label in [("overall", "Overall:"), ("fun", "Fun"), ("action", "Action"),
                                     ("mind_blowing", "Mind-blowing"), ("smart", "Smart"), ("feels", "Feels")]:
                    if review[field] is not None:
                        self.assertRegex(text, re.escape(label) + r"\s*" + str(review[field]) + r"\s*/5")
                if review.get("brain_effort") is None:
                    self.assertNotIn("Brain Effort", text)
                else:
                    self.assertRegex(text, r"Brain Effort\s*" + str(review["brain_effort"]) + r"\s*/5")

    def test_wolf_review_has_approved_seven_scores(self):
        status, _, api = get("/api/editorial-reviews")
        self.assertEqual(status, 200)
        reviews = json.loads(api)["editorial_reviews"]
        wolf = next(review for review in reviews if review["slug"] == "the-wolf-of-wall-street")
        self.assertEqual(wolf["runtime_minutes"], 180)
        self.assertEqual(wolf["release_year"], 2013)
        self.assertEqual(wolf["tagline"], "An awful person but excellent company.")
        self.assertEqual([wolf[key] for key in ["fun", "action", "mind_blowing", "smart", "feels", "brain_effort", "overall"]],
                         [5, 4, 3, 4, 2, 2, 5])
        approved_effort = {"fear-and-loathing-in-las-vegas": 2, "coherence": 4, "a-complete-unknown": 2}
        for review in reviews:
            if review["slug"] in approved_effort:
                self.assertEqual(review["brain_effort"], approved_effort[review["slug"]])
        status, _, html = get("/reviews/the-wolf-of-wall-street/")
        self.assertEqual(status, 200)
        self.assertIn("The Wolf of Wall Street (2013) review — Stoner Reviews", html)
        self.assertIn('datetime="PT180M">3h</time>', html)
        self.assertIn("Brain Effort", html)
        self.assertNotIn("Attention required", html)
        self.assertEqual(get("/reviews/the-wolf-of-wall-street/")[2], html)

    def test_predator_review_has_approved_seven_scores(self):
        status, _, api = get("/api/editorial-reviews")
        self.assertEqual(status, 200)
        review = next(r for r in json.loads(api)["editorial_reviews"] if r["slug"] == "predator-badlands")
        self.assertEqual(review["runtime_minutes"], 107)
        self.assertEqual(review["release_year"], 2025)
        self.assertEqual(review["tagline"], "The Predator somehow has friends now.")
        self.assertEqual([review[k] for k in ["fun", "action", "mind_blowing", "smart", "feels", "brain_effort", "overall"]],
                         [3, 5, 3, 2, 3, 2, 4])
        path = "/reviews/predator-badlands/"
        status, _, html = get(path)
        self.assertEqual(status, 200)
        self.assertIn("Predator: Badlands (2025) review — Stoner Reviews", html)
        self.assertIn('datetime="PT107M">1h 47m</time>', html)
        self.assertEqual(get(path)[2], html)

    def test_verified_media_identifiers(self):
        status, _, api = get("/api/editorial-reviews")
        self.assertEqual(status, 200)
        expected = {
            "fear-and-loathing-in-las-vegas": (1878, "tt0120669"),
            "coherence": (220289, "tt2866360"),
            "a-complete-unknown": (661539, "tt11563598"),
            "the-wolf-of-wall-street": (106646, "tt0993846"),
            "predator-badlands": (1242898, "tt31227572"),
        }
        reviews = {r["slug"]: r for r in json.loads(api)["editorial_reviews"]}
        for slug, identifiers in expected.items():
            with self.subTest(review=slug):
                self.assertEqual((reviews[slug]["tmdb_id"], reviews[slug]["imdb_id"]), identifiers)
                self.assertEqual(reviews[slug]["media_type"], "movie")

    def test_theme_bootstrap_runs_before_styles_and_body(self):
        for path in ["/", "/reviews/", "/stoner-scores/", PATH, "/missing-page/"]:
            with self.subTest(path=path):
                html = get(path)[2]
                head = html.split("</head>", 1)[0]
                elements = Document(head).elements
                bootstrap = [attrs for tag, attrs in elements if tag == "script" and "data-theme-bootstrap" in attrs]
                self.assertEqual(len(bootstrap), 1)
                self.assertNotIn("src", bootstrap[0])
                self.assertNotIn("defer", bootstrap[0])
                self.assertLess(head.index("data-theme-bootstrap"), head.index("data-stylesheet"))
                theme_script = next(attrs for tag, attrs in elements if tag == "script" and attrs.get("src") == "/theme.js")
                self.assertIn("defer", theme_script)
                self.assertNotIn("async", theme_script)

    def test_page_styles_are_in_initial_html_without_blocking_css_requests(self):
        expected = {
            "/": ["/site.css", "/home.css", "/site-nav.css"],
            "/reviews/": ["/site.css", "/reviews.css", "/site-nav.css"],
            "/stoner-scores/": ["/site.css", "/scores.css", "/site-nav.css"],
            PATH: ["/site.css", "/reviews.css", "/site-nav.css"],
            "/missing-page/": ["/site.css", "/reviews.css", "/site-nav.css"],
        }
        for path, stylesheets in expected.items():
            with self.subTest(path=path):
                html = get(path)[2]
                elements = Document(html.split("</head>", 1)[0]).elements
                self.assertFalse(any(tag == "link" and attrs.get("rel") == "stylesheet" for tag, attrs in elements))
                self.assertEqual([attrs["data-stylesheet"] for tag, attrs in elements
                                  if tag == "style" and "data-stylesheet" in attrs], stylesheets)
                for stylesheet in stylesheets:
                    status, _, css = get(stylesheet)
                    self.assertEqual(status, 200)
                    self.assertIn(css, html)


if __name__ == "__main__":
    unittest.main(verbosity=2)
