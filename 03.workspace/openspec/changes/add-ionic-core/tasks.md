# Tasks

## 1. Dependency setup

- [ ] 1.1 Add `@ionic/core` ^9.x to `package.json` dependencies and verify `npm install` succeeds
- [ ] 1.2 Register Ionic custom elements via `defineCustomElements()` from `@ionic/core/loader` in `src/main.ts` and verify no console errors on page load
- [ ] 1.3 Import `@ionic/core/css/core.css` in `src/main.ts` and verify Ionic component styles are applied

## 2. Ionic UI chrome

- [ ] 2.1 Add an empty Ionic `<ion-header>` above the map and an empty Ionic `<ion-footer>` below the map (both visible, no buttons) and verify both render

## 3. Layout and viewport sharing

- [ ] 3.1 Adjust `style.css` so the map fills the viewport space between the Ionic header and Ionic footer (flexbox or `calc(100vh - header-height - footer-height)`) and verify the map is visible between them
- [ ] 3.2 Call `map.invalidateSize()` when the header/footer mount and on viewport resize/orientation change, and verify tiles redraw correctly

## 4. Build and verification

- [ ] 4.1 Run `tsc` and `vite build` and verify the production build succeeds with no type errors
- [ ] 4.2 Run `vite preview` and verify the map renders with the Ionic header present and no console errors
- [ ] 4.3 Test at mobile viewport width (dev tools device mode) and verify Ionic safe-area handling does not clip the map or header
