# SpeedyVan Admin Submission Status

## Completed

- Expo SDK 52 app created under `apps/ios-admin`.
- TypeScript, Expo Router, NativeWind v4, SecureStore, and typed models are in place.
- Bundle ID configured as `co.uk.speedy-van.admin`.
- EAS project linked as `@wakaaahmad607/speedyvan-admin`.
- EAS project ID configured as `37fb9ca1-cad4-4b02-b3d9-b79f67372bf0`.
- Apple Developer team visible in the browser as `AHMAD AWAD ALWAKAI - BXK52CMHR2`.
- Apple Bundle ID registered as `SpeedyVan Admin - co.uk.speedy-van.admin`.
- App Store Connect record created with `ascAppId` `6812268357`.
- App icon, adaptive icon, App Store icon source, favicon, and splash assets generated.
- App Store screenshot assets generated under `assets/screenshots`.
- Export compliance flag set for standard HTTPS only.
- App Store/TestFlight review profile created in `metadata/APP_STORE_PROFILE.md`.
- TestFlight review notes created in `metadata/TESTFLIGHT_REVIEW_NOTES.txt`.
- Expo web preview verified at `http://localhost:8082/login`.
- `expo-font`, `react-native-web`, `react-dom`, and `@expo/metro-runtime` added for web/NativeWind compatibility.
- Web token storage fallback added; iOS still uses SecureStore.
- `react-native-worklets` is intentionally absent; Reanimated 3 in the Expo SDK 52 app must not ship with standalone Worklets.
- Production iOS EAS builds pinned to `macos-sequoia-15.6-xcode-26.2` to satisfy Apple's iOS 26 SDK upload requirement.
- TypeScript validation, Expo Doctor, and local iOS bundle export passed on 2026-09-15.
- EAS iOS signing credentials are configured and valid for `co.uk.speedy-van.admin`.
- EAS Submit uploaded build `1.0.0 (50)` to App Store Connect/TestFlight on 2026-10-03.
- New booking local notifications use the bundled `new-booking.wav` sound without enabling the remote push entitlement.
- Build 48 superseded build 47 after fixing the Expo Router `queryString.stringify` display crash.
- Build 49 supersedes build 48 after adding the consented live-visitors tracker, API activity repair, shared iOS visitor provider, animated header counter and reliable Visitors/More navigation.
- Build 50 supersedes build 49 after repairing booking detail data completeness, journey/access display, timestamp labelling, extras states and read-only detail loading.

## Submitted Build

Command:

```bash
npm run preflight -w apps/ios-admin
eas build --platform ios --profile production --non-interactive
eas submit --platform ios --profile production --latest --non-interactive
```

Result:

- EAS build ID: `2a65b363-7455-4867-8457-260ee8009dcc`
- EAS submission ID: `1ff5d098-08a5-406c-8e76-95e3fae067e1`
- App Store Connect app ID: `6812268357`
- Bundle ID: `co.uk.speedy-van.admin`
- Version/build: `1.0.0 (50)`
- Build image: `macos-sequoia-15.6-xcode-26.2`
- Build status: `FINISHED`
- Submit status: `FINISHED`
- Apple upload result: successfully uploaded package to App Store Connect; Apple may take a few minutes to finish TestFlight processing.
- Artifact: `https://expo.dev/artifacts/eas/CfoOblFOzVV1J8_9yz-28nBZ90Dm8oY_GvyxgbBpZwc.ipa`
- EAS fingerprint hash: `f469e74b2c6b541a2aa5d1c4bc92df58425f05c4`
- Git commit: `3c11952aee2e7b5947f198f0e812f377f62b367e`
- App Store Connect TestFlight URL: `https://appstoreconnect.apple.com/apps/6812268357/testflight/ios`

## App Store Assets

- App icon: `assets/icon.png`
- App Store icon source: `assets/app-store-icon.png`
- Splash: `assets/splash.png`
- Screenshots:
  - `assets/screenshots/iphone-65-01-login.png`
  - `assets/screenshots/iphone-65-02-dashboard.png`
  - `assets/screenshots/iphone-65-03-bookings.png`
  - `assets/screenshots/iphone-65-04-drivers.png`
  - `assets/screenshots/iphone-65-05-analytics.png`
