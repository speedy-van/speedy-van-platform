# EAS Submission Commands

## Validate

```bash
npm run typecheck -w apps/ios-admin
npm run preflight -w apps/ios-admin
npx expo-doctor
npx expo export:embed --eager --platform ios --dev false
```

## Build and Submit to TestFlight

Run from `apps/ios-admin`:

```bash
$env:EAS_BUILD_NO_EXPO_GO_WARNING="true"
eas build --platform ios --profile production --non-interactive
eas submit --platform ios --profile production --latest --non-interactive
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

- EAS build ID: `b018360f-3257-4d16-a004-eef7b9956d8f`
- EAS submission ID: `236da256-7c93-4ccc-94d9-8d2316ed5c45`
- App Store Connect app ID: `6812268357`
- Version/build: `1.0.0 (47)`
- Submit result: uploaded to App Store Connect/TestFlight processing on 2026-10-02.
- Artifact: `https://expo.dev/artifacts/eas/TrV_EniDwedpmTx-2jMnorJe-aaNnKuA77Kzevu1UhM.ipa`
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
eas build:view b018360f-3257-4d16-a004-eef7b9956d8f --json
eas submit:view 236da256-7c93-4ccc-94d9-8d2316ed5c45 --json
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
