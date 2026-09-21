# SpeedyVan Admin App Store / TestFlight Profile

## App Identity

- App name: SpeedyVan Admin
- Subtitle: Internal booking, driver, and jobs operations
- Bundle ID: co.uk.speedy-van.admin
- SKU: speedyvan-admin
- Version: 1.0.0
- App Store Connect Apple ID / `ascAppId`: 6812268357
- Remote iOS build number: 20
- EAS project: @ahmadawadalwakai/speedyvan-admin
- EAS project ID: 24bad6a1-a00e-425a-88fa-c4c9e38208e1
- Platform: iOS
- Primary category: Business
- Secondary category: Productivity
- Age rating target: 4+
- Encryption: Uses standard HTTPS only; `ITSAppUsesNonExemptEncryption` is set to `false`.
- Content rights: SpeedyVan-owned branding and application content.
- Advertising identifier: Not used.
- Third-party tracking: Not used.

## App Store Connect Record

Create the app record with:

- Platform: iOS
- Name: SpeedyVan Admin
- Primary language: English (U.K.)
- Bundle ID: co.uk.speedy-van.admin
- SKU: speedyvan-admin
- User access: Full access
- Apple ID / `ascAppId`: 6812268357

After creation, copy the numeric Apple ID from App Store Connect and place it in `eas.json` under:

```json
{
  "submit": {
    "production": {
      "ios": {
        "ascAppId": "NUMERIC_APPLE_ID"
      }
    }
  }
}
```

## Build / Submission State

- Expo SDK: 52.0.0
- Expo Router: 4.x
- NativeWind: 4.x
- TypeScript: Enabled
- EAS account: ahmadawadalwakai
- EAS cloud project: Linked
- Apple Developer team: AHMAD AWAD ALWAKAI
- Apple Developer team ID: BXK52CMHR2
- App Store Connect record: Created
- Last local validation: `npm run typecheck -w apps/ios-admin`, `npx expo-doctor`, and `npx expo config --type introspect --json` on 2026-09-21.
- Last EAS build: `678edf94-94e4-445c-9885-695ea081fe56`
- Last EAS submission: `6eabc027-7ddf-4f5b-ab05-ea2b60c00ff4`
- Last EAS result: build `1.0.0 (20)` uploaded successfully to App Store Connect/TestFlight processing on 2026-09-21.
- Build image: `macos-sequoia-15.6-xcode-26.2`
- Signing credentials: Valid EAS remote iOS distribution certificate and App Store provisioning profile.
- App Store screenshots: generated under `assets/screenshots`.

## TestFlight Beta App Review Information

- Contact first name: SpeedyVan
- Contact last name: Admin
- Contact phone: +44 7700 900000
- Contact email: support@speedyvan.uk
- Demo account email: admin@speedyvan.com
- Demo account password: Admin123!
- Sign-in required: Yes

Review notes:

SpeedyVan Admin is an internal operations app for SpeedyVan administrators. The app lets authorised staff view operational KPIs, manage customer bookings, assign drivers, publish driver jobs, review European removals enquiries, and monitor admin notifications. The app connects to the SpeedyVan API at `https://www.speedyvan.uk/api` and requires an admin JWT login.

Use the demo admin credentials above to sign in. After login, the Dashboard tab shows KPIs; Bookings shows searchable booking records and booking detail actions; Drivers shows driver status and earnings; Jobs shows available driver jobs; More links to Analytics, Enquiries, and Notifications.

## TestFlight Beta Details

- Beta app name: SpeedyVan Admin
- Beta app description: Internal mobile operations app for authorised SpeedyVan administrators.
- Feedback email: support@speedyvan.uk
- Beta license agreement: Standard Apple beta agreement is acceptable unless SpeedyVan has a custom agreement.
- What to test: Login, Dashboard KPIs, Bookings list/detail workflows, Drivers list/detail workflows, Jobs controls, Analytics charts, Enquiries, and Notifications.

## Promotional Text

Manage SpeedyVan operations from your phone: bookings, drivers, jobs, analytics, enquiries, and notifications in one secure admin app.

## Description

SpeedyVan Admin is the mobile command centre for SpeedyVan operations teams.

Administrators can securely sign in, monitor business KPIs, review and manage bookings, assign drivers, control driver job visibility, set driver pay, respond to European removal enquiries, and keep track of operational notifications.

The app is designed for authorised SpeedyVan staff only and requires an active admin account.

Core features:

- Secure admin login with stored session
- Dashboard KPIs for bookings, revenue, drivers, jobs, and visitors
- Searchable booking list and booking detail workflows
- Driver list, active status, earnings, mark-paid, and reset-password actions
- Job board publishing, pause/resume controls, and driver pay editing
- Analytics charts for bookings, revenue, and service mix
- European enquiry quote management
- Admin notification read/delete workflow

## Keywords

SpeedyVan, admin, removals, van, bookings, drivers, jobs, logistics, operations

## Support / Marketing / Privacy URLs

- Marketing URL: https://www.speedyvan.uk
- Support URL: https://www.speedyvan.uk/contact
- Privacy Policy URL: https://www.speedyvan.uk/privacy

## Privacy / App Privacy Answers

- Data used to track users: No
- Third-party advertising: No
- Third-party analytics SDKs: No
- Login required: Yes
- Account data handled by the app: Admin email/password login is sent to the SpeedyVan API over HTTPS; the returned JWT is stored with Expo SecureStore.
- Customer/job data displayed by the app: Bookings, drivers, jobs, enquiries, analytics, and notifications are retrieved from the SpeedyVan API for authorised admin use.
- Data linked to the admin user: Login/account identifier and operational actions can be associated with an authorised admin account by the backend.
- Precise location collection from the admin device: No
- Contacts, photos, camera, microphone, Bluetooth, Health, HomeKit: Not used
- Push notifications: Local new-booking alerts are configured in-app; remote push notifications are not configured.
- Tracking permission prompt: Not required

Suggested App Privacy categories in App Store Connect:

- Contact Info: Email Address, used for app functionality, linked to user.
- User Content / Customer Support Data: Operational booking/enquiry content displayed for app functionality, linked to SpeedyVan operational records.
- Identifiers: User ID/account token, used for app functionality, linked to user.
- Diagnostics: Not collected unless Apple crash diagnostics are enabled separately.

## Export Compliance

- Uses encryption: Yes, standard HTTPS/TLS only.
- Uses non-exempt encryption: No.
- App config includes `ITSAppUsesNonExemptEncryption: false`.

## Age Rating

Expected answers:

- Unrestricted web access: No
- Gambling/contests: No
- Medical/treatment information: No
- Violence, sexual content, profanity, alcohol, tobacco, drugs: None
- User-generated content: No public user-generated content
- Target age rating: 4+

## Copyright

2026 SpeedyVan

## App Icon Assets

- Expo icon: `assets/icon.png`
- iOS/App Store source: `assets/app-store-icon.png`
- Splash: `assets/splash.png`
- Favicon: `assets/favicon.png`
- Icon format: PNG, 1024 x 1024 source artwork
- Visual profile: Dark slate background, indigo SpeedyVan brand ring, white van mark, SV initials, green admin/security badge
- Safe area: Centered mark with padding for iOS mask cropping

## Screenshot Assets

- `assets/screenshots/iphone-65-01-login.png` - login screen
- `assets/screenshots/iphone-65-02-dashboard.png` - dashboard KPIs and priority jobs
- `assets/screenshots/iphone-65-03-bookings.png` - booking search, filters, status cards, and actions
- `assets/screenshots/iphone-65-04-drivers.png` - driver availability and protected admin actions
- `assets/screenshots/iphone-65-05-analytics.png` - analytics charts and service split
- Size: 1242 x 2688 PNG, suitable for the App Store Connect 6.5-inch iPhone screenshot slot

## Current Submission Result

- App Store Connect distribution URL: `https://appstoreconnect.apple.com/apps/6812268357/distribution`
- EAS build ID: `678edf94-94e4-445c-9885-695ea081fe56`
- EAS submission ID: `6eabc027-7ddf-4f5b-ab05-ea2b60c00ff4`
- Version/build: `1.0.0 (20)`
- Upload status: EAS Submit finished successfully.
- Apple processing: App Store Connect/TestFlight may take a few minutes after upload before the build is visible and selectable.

Successful upload log excerpt:

```text
Successfully uploaded package to App Store Connect. It might take a few minutes until it's visible online.
Successfully uploaded the new binary to App Store Connect.
```

## Setup Notes

- App Store Connect was opened in the signed-in browser session.
- The New App dialog was filled with:
  - Platform: iOS
  - Name: SpeedyVan Admin
  - Primary language: English (U.K.)
  - SKU: speedyvan-admin
  - User access: Full Access
- The Bundle ID dropdown did not contain `co.uk.speedy-van.admin`.
- Apple Developer Identifiers page was opened for team `BXK52CMHR2`.
- The App ID was registered as `SpeedyVan Admin - co.uk.speedy-van.admin`.
- The App Store Connect New App dialog was completed and the app record was created.
- App Store Connect reported: user access settings could not be saved, so all users currently have access to the app.
- Apple Developer Certificates page listed existing distribution certificates on 2026-09-15.
- EAS credentials were completed with a valid distribution certificate, App Store provisioning profile, and App Store Connect API key.
