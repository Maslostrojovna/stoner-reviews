from urllib.parse import quote


def review_path(review):
    slug = review["slug"]
    year = review.get("release_year")
    if year is not None and not slug.endswith(f"-{year}"):
        slug += f"-{year}"
    return f"/reviews/{quote(slug, safe='')}/"
