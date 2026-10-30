# Stoner Reviews

Plain HTML/CSS/JavaScript movie reviews on a Cloudflare Worker with D1.
Live site: https://stoner.reviews. No frontend framework or image service.

- [Deployment and development](Deployment/test-brand-reference-cloudflare/README.md)
- [Database and editorial publishing](database/README.md)
- [Complete 30 October release](tests/RELEASE-2026-10-30.md)
- [Prior image SEO release](tests/DEPLOYMENT-2026-10-30.md)

Shared product, brand and editorial knowledge is maintained once in the external
Stoner Reviews knowledge library; root document pointers identify that authority.
Local checkouts/worktrees live under its Code/ folder and link to shared documents.
The repository retains technical guides, release evidence and editorial/SQL snapshots.

```sh
npm ci
npm run build
```

`npm run deploy` and pushes to main publish production and require explicit user
authorization. Building does not import editorial data or run D1 migrations.
