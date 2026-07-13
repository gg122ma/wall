# Handoff

Version: `feature-foundation-2026-07-13`

## Completed

- Preserved original static architecture.
- Added building directory, profile and dedicated wall routes.
- Added popular-note building overview.
- Added local prototype registration and login gate for posting.
- Added anonymous/named posting for authenticated users.
- Added note position selection, more shapes and photo crop controls.
- Added three-language UI framework and user-note translation adapter.
- Added light/dark/system theme.
- Added Cloudinary and BISHENG adapters.
- Left map region redesign deferred.

## Important limitations

- Local auth is not secure enough for public deployment.
- Translation requires an endpoint.
- Cloudinary requires a backend signature endpoint.
- BISHENG requires the group member's endpoint and credentials strategy.
- No full browser visual regression was completed in the build container.

## Do not modify without a separate approved stage

- Existing community hierarchy.
- Existing Leaflet region logic.
- Existing admin prototype authentication.
- Existing colleges, batches and majors.

## Next approved stage

Run full desktop/mobile visual QA, then connect production authentication or translation as separate stages. Do not combine both integrations in one change.
