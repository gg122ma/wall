# Echo Wall Current Code Audit

## Result

The optimized build passes JavaScript syntax, CSS parsing, HTML ID and local asset checks.

## Fixed

- Invalid CSS declaration in the original map selector.
- Incorrect college / batch / major state carry-over.
- Invalid wall route combinations.
- Misleading encryption claim.
- Missing photo validation and storage failure handling.
- Map popup HTML injection risk.
- Mobile absolute-positioned note layout.
- Insufficient wall canvas height.
- Missing keyboard focus and reduced-motion support.
- Favicon path inconsistency.

## Remaining deployment risks

1. Admin credentials are still present in client-side JavaScript.
2. Notes and votes still use localStorage.
3. Photo notes still use compressed Data URLs.
4. Public moderation is not protected by Supabase Auth or RLS.
5. Cloudinary signed upload and deletion are not connected.

These remaining items require the planned Supabase and Cloudinary integration; they are not visual defects.

## Validation performed

- `node --check` on all JavaScript files: passed.
- CSS parser check on all CSS files: passed.
- Duplicate HTML IDs: none.
- Missing local HTML assets: none.
- Local HTTP response for `index.html` and `map.html`: 200.

The available Chromium headless process did not exit reliably, so a full automated visual-browser test is not claimed.

## Fixed — 2026-07-12 UI cleanup

- Removed the redundant public `Local prototype` navbar status.
- Replaced the prototype footer wording with `© 2026 Matriks EchoWall`.
- Removed duplicate Echo Wall branding from the logged-in admin sidebar.
- Removed the logged-in admin `Local prototype auth` warning card while preserving bottom-aligned sign-out behaviour.

## Deferred — Echo Map functional zones

- Default map view still shows overlapping functional-zone labels and outlines that can feel cluttered.
- Existing zone extents require a separate review against the intended campus functional grouping.
- Agreed later direction: keep zone labels hidden by default and reveal the selected area only after interaction, subject to a dedicated map design and data pass.

## Feature Foundation Audit — 2026-07-13

### Fixed

- Added building-specific profiles and walls without batch or major selection.
- Added an authenticated posting gate.
- Added anonymous or named publishing for authenticated users.
- Replaced random-only placement with user-selected note coordinates.
- Expanded and improved note shapes.
- Added photo crop-scale and fit metadata.
- Added persisted language and theme preferences.
- Added escaped rendering for building metadata and note translations.
- Added explicit adapters for translation, Cloudinary and BISHENG.

### High — Required before production

1. Replace local prototype authentication with a server-side identity provider.
2. Move notes, votes, sessions and moderation records out of LocalStorage.
3. Configure database authorization policies.
4. Configure a protected translation proxy with rate limits.
5. Configure Cloudinary signed upload and authorized deletion endpoints.
6. Protect BISHENG private credentials behind a backend proxy.

### Medium

- UI locale coverage focuses on core user flows; remaining legacy admin and community copy should be converted to locale keys in a dedicated language-completion stage.
- Building overview note positions may overlap when users select the same area; collision assistance or optional drag-and-drop can be added later.
- Current building outlines are lightweight profile illustrations, not official surveyed drawings.

### Deferred

- Map region redesign.
- Map-to-building profile linking.
- Full browser visual regression in this build environment.
