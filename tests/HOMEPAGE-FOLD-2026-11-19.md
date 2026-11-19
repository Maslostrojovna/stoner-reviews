# Homepage introduction below-fold boundary — 19 November 2026

User requested that “The reviews” start below the homepage’s initial viewport. Changed only home.css: viewport-relative minimum intro height, with centered grid content and existing responsive padding/type retained. The 128px masthead allowance is below the actual minimum desktop (136px) and mobile (161px) header heights. Short/narrow viewports can grow naturally with content. Uses svh, with vh fallback.

All 33 local release checks passed; asset allowlist/build and Impeccable detector passed. Browser geometry confirmed reviews start below the fold with no horizontal overflow at 1440×900 (top 908), 1440×1080 (1088), 768×1024 (1032), 390×844 (877), 320×568 (819). Desktop and mobile screenshots inspected, with both themes inspected on mobile. No text, images, ratings or database data changed. Existing unrelated deletions and review release notes excluded from commit.

Production verification to be appended after deployment.
