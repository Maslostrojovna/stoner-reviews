> Historical verification/development record. For the current published scope and status, read [the complete release report](RELEASE-2026-10-30.md). Earlier local-only or old-state statements below describe the original capture.

# stoner.reviews deployment — 26 October 2026

Explicitly authorized by the user. Published at 22:19 Europe/Prague with
`npm run build` followed by `npm run deploy` using the existing Wrangler login.

- Worker: `stoner-reviews`.
- Version: `faa1cbce-67e5-458e-a327-21cb016a3614`, 100% traffic.
- Primary domain: `https://stoner.reviews/`.
- Active Cloudflare zone: `1aec63e5ada0aa42efe55964aee2fd35`.
- Same production D1 database/binding; no migration or editorial-data write.
- Public allowlist: 19 website files, including the non-public `_headers` config.
- Prior version: `c9a4e715-b64f-400c-89b1-22bc1efda63e`.

## Domain routing

Both the new and existing Custom Domains are enabled. The old hostname returns
308 to the primary, preserving path and query. The middleware runs before every
request so old static and removed-file URLs also redirect. Other hosts, including
localhost, pass through. Non-function paths still use the ASSETS fallback.

Verified example:

```text
https://stoner.danimaslo.dev/reviews/coherence/?from=old
308 → https://stoner.reviews/reviews/coherence/?from=old
```

## Verification

Build, website-only asset guard, deployment dry-run, 12 local HTTP tests and a
focused redirect check passed before publishing. Cloudflare deployment listing
confirms the new version at 100% traffic; its API confirms the enabled domain and
issued certificate attachment.

After publishing:

| Check | Result |
| --- | --- |
| Authoritative DNS plus 1.1.1.1 / 8.8.8.8 | New Cloudflare addresses returned |
| HTTPS certificate / hostname validation | Pass; no insecure TLS option used |
| Full HTTP integration suite against new domain | 12 checks pass |
| Homepage, listing, Scores, three individual reviews, API | 200 |
| Review text in initial HTML, own metadata/canonicals, direct reload | Pass |
| Unknown review | 404 |
| Three production reviews vs approved local data | Exact prose, six scores, and runtimes match |
| Served CSS/JS/images vs local source | All 13 files byte-match |
| Removed public work files / examples | All 39 URLs return 404 |
| API POST | 405 |
| Legacy review path and query | Permanent 308 to primary, preserved |

## Verification limits

This machine and in-app browser retained an earlier negative DNS cache after the
public and authoritative records were live. For the live suite, only hostname
resolution was directed to the public DNS result; HTTPS still used `stoner.reviews`
as its host and verified its certificate normally. Normal browser UI verification
awaits local DNS cache expiry. The exact deployed assets already passed the local
desktop/mobile and theme checks in `CORE-SITE-CHECKS.md`.

Default Python urllib identification receives Cloudflare 403 / error 1010. The
suite passed with the accepted curl User-Agent, and actual curl requests passed.
Cloudflare bot/security settings were not changed; real crawler access remains
an independent unverified SEO concern.

## Source and future releases

This was a direct deployment of the reviewed uncommitted working tree, on
`codex/session-2026-10-23`. GitHub main remains `cc9c53d`. No commit or push ran.
The exact application source, compiled Worker, config, previous deployment record,
and public asset hashes are preserved in ignored
`.local-backups/deploy-stoner-reviews-2026-10-26/`.

Before the next GitHub-driven deployment, reconcile these application changes onto
current main; otherwise an old main build could replace this release. A rollback
requires explicit authorization and may need separate domain-binding restoration.
No credential files were read manually or included in the upload or release record.

## GitHub main source synchronization — 2026-10-26

The user authorized updating GitHub main after the direct domain deployment. This
commit reconciles the exact deployed website and application code onto remote main
`cc9c53d`, preserving its approved editorial content, migrations and existing
history. It includes the public upload allowlist, both domain bindings, old-host
redirect, shared theme code, Scores page, and integration checks. Unrelated local
notes, source drafts, private backups and credentials are excluded.

Pushing this commit to main triggers the existing Cloudflare Workers Builds
integration. That build should redeploy the same application; no database write
is configured. Earlier warnings about main lacking this release are historical
once this commit is on main. The primary local workspace remains on its older
session branch with existing changes preserved; do not reset or push that branch
over the updated main.
