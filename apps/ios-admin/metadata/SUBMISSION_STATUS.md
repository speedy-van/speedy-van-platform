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
- EAS Submit uploaded build `1.0.0 (46)` to App Store Connect/TestFlight on 2026-10-02.
- New booking local notifications use the bundled `new-booking.wav` sound without enabling the remote push entitlement.

## Submitted Build

Command:

```bash
npm run preflight -w apps/ios-admin
eas build --platform ios --profile production --auto-submit --non-interactive --no-wait --message "SpeedyVan Admin build 47"
```

Result:

- EAS build ID: `0acbf8b4-0878-4343-a88e-9b56c8f3a9ed`
- EAS submission ID: `68170afe-0256-454e-82bd-9fd44fae76c4`
- App Store Connect app ID: `6812268357`
- Bundle ID: `co.uk.speedy-van.admin`
- Version/build: `1.0.0 (46)`
- Build image: `macos-sequoia-15.6-xcode-26.2`
- Build status: `FINISHED`
- Submit status: `FINISHED`
- Apple upload result: successfully uploaded package to App Store Connect; Apple may take a few minutes to finish TestFlight processing.
- App Store Connect distribution URL: `https://appstoreconnect.apple.com/apps/6812268357/distribution`

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
