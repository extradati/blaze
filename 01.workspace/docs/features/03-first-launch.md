# 03 — First launch

- Location permission is requested only when the locate button is pressed. If already granted, the map still opens on the user.
- One-time hint bubble "Tap to see where you are" next to the button; hidden for good after closing it or using the button (AsyncStorage key `hint.locate.dismissed`).

Tests: `e2e/map.spec.ts` (first launch).
