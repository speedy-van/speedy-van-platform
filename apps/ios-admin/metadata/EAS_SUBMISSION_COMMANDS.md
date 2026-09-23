# EAS Submission Commands

## Validate

```bash
npm run typecheck -w apps/ios-admin
npx expo-doctor
npx expo export:embed --eager --platform ios --dev false
```

## Build and Submit to TestFlight

Run from `apps/ios-admin`:

```bash
$env:EAS_BUILD_NO_EXPO_GO_WARNING="true"
eas build --platform ios --profile production --auto-submit --non-interactive --no-wait --message "SpeedyVan Admin TestFlight build - 2026-09-21"
```

The production profile is configured to use Apple's required iOS 26 SDK builder:

```json
{
  "build": {
    "production": {
      "ios": {
        "image": "macos-sequoia-15.6-xcode-26.2"
      }
    }
  }
}
```

## Current Submitted Build

- EAS build ID: `678edf94-94e4-445c-9885-695ea081fe56`
- EAS submission ID: `6eabc027-7ddf-4f5b-ab05-ea2b60c00ff4`
- App Store Connect app ID: `6812268357`
- Version/build: `1.0.0 (20)`
- Submit result: uploaded successfully to App Store Connect/TestFlight processing on 2026-09-21.
- App Store Connect distribution URL: `https://appstoreconnect.apple.com/apps/6812268357/distribution`

## App Store Connect App ID

The numeric `ascAppId` is already present in `eas.json`:

```json
{
  "submit": {
    "production": {
      "ios": {
        "ascAppId": "6812268357"
      }
    }
  }
}
```

## Check Status

```bash
eas build:view 678edf94-94e4-445c-9885-695ea081fe56 --json
eas submit:view 6eabc027-7ddf-4f5b-ab05-ea2b60c00ff4 --json
```

## If Using Local Apple Credentials

Place credentials under `apps/ios-admin/credentials/ios`, keep that directory ignored, then create `apps/ios-admin/credentials.json`:

```json
{
  "ios": {
    "provisioningProfilePath": "credentials/ios/profile.mobileprovision",
    "distributionCertificate": {
      "path": "credentials/ios/dist.p12",
      "password": "DISTRIBUTION_CERTIFICATE_PASSWORD"
    }
  }
}
```

Then set the iOS build profile to use local credentials:

```json
{
  "build": {
    "production": {
      "ios": {
        "credentialsSource": "local"
      }
    }
  }
}
```
