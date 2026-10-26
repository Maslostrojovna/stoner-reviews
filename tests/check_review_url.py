"""HTTP integration checks against a running local Wrangler server (no browser JS).

Run: python3 tests/check_review_url.py [http://127.0.0.1:8788]
Requires the existing Fear and Loathing seed in local D1.
"""
import json
import re
import sys
import unittest
from html.parser import HTMLParser
from urllib.error import HTTPError
from urllib.request import HTTPRedirectHandler, build_opener

BASE = (sys.argv.pop(1) if len(sys.argv) > 1 else "http://127.0.0.1:8788").rstrip("/")
PATH = "/reviews/fear-and-loathing-in-las-vegas/"


class NoRedirect(HTTPRedirectHandler):
    def redirect_request(self, *args):
        return None


def get(path, *, binary=False):
    try:
        response = build_opener(NoRedirect).open(BASE + path, timeout=15)
    except HTTPError as error:
        response = error
    with response:
        body = response.read()
        return response.status, response.headers, body if binary else body.decode("utf-8")


class Document(HTMLParser):
    def __init__(self, html):
        super().__init__(convert_charrefs=True)
        self.text = []
        self.elements = []
        self.feed(html)

    def handle_data(self, text):
        self.text.append(text)

    def handle_starttag(self, tag, attrs):
        self.elements.append((tag, dict(attrs)))


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
        text = normalize(" ".join(document.text))
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
        self.assertIn(("link", {"rel": "canonical", "href": BASE + PATH}), document.elements)
        self.assertEqual(sum(tag == "h1" for tag, _ in document.elements), 1)
        self.assertFalse(any(tag == "details" for tag, _ in document.elements))
        self.assertTrue(all(attrs.get("src") == "/theme.js"
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
        text = normalize(" ".join(document.text))
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
        text = normalize(" ".join(document.text))
        for label in ["Fun", "Action", "Mind-blowing", "Smart", "Feels", "Brain Effort", "Overall",
                      "Brain off", "Easy does it", "Pay attention", "Keep up", "Full CPU usage"]:
            self.assertIn(label, text)
        self.assertIn("Brain Effort doesn't measure quality.", text)
        self.assertIn("not a mathematical average of the other scores", text)
        self.assertIn(("link", {"rel": "canonical", "href": BASE + "/stoner-scores/"}), document.elements)
        self.assertEqual(sum(tag == "h1" for tag, _ in document.elements), 1)
        self.assertEqual(sum(tag == "li" for tag, _ in document.elements), 5)
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
                text = normalize(" ".join(Document(html).text))
                for block in re.split(r"\n\s*\n", review["body_md"].strip()):
                    self.assertIn(normalize(re.sub(r"^#{1,6}\s+", "", block).replace("*", "")), text)
                self.assertIn(review["verdict"], text)
                self.assertIn(review["tagline"], text)
                for field, label in [("overall", "Overall:"), ("fun", "Fun"), ("action", "Action"),
                                     ("mind_blowing", "Mind-blowing"), ("smart", "Smart"), ("feels", "Feels")]:
                    if review[field] is not None:
                        self.assertRegex(text, re.escape(label) + r"\s*" + str(review[field]) + r"\s*/5")
                self.assertNotIn("Brain Effort", text)

    def test_theme_bootstrap_runs_before_styles_and_body(self):
        for path in ["/", "/reviews/", "/stoner-scores/", PATH, "/missing-page/"]:
            with self.subTest(path=path):
                html = get(path)[2]
                head = html.split("</head>", 1)[0]
                self.assertIn('<script src="/theme.js"></script>', head)
                self.assertLess(head.index('<script src="/theme.js">'), head.index('rel="stylesheet"'))
                theme_script = next(attrs for tag, attrs in Document(head).elements if tag == "script")
                self.assertNotIn("async", theme_script)
                self.assertNotIn("defer", theme_script)


if __name__ == "__main__":
    unittest.main(verbosity=2)
