# SpeedyVan Admin iOS build 43 vs 46 provenance

Date: 2026-10-02
Repository: `https://github.com/speedy-van/speedy-van-platform` (`origin`)
Local branch: `admin-build46-repair-redesign-2026-10-02`
App identity: SpeedyVan Admin, `co.uk.speedy-van.admin`, EAS project `37fb9ca1-cad4-4b02-b3d9-b79f67372bf0`

## Verified sources

- EAS CLI authenticated as `wakaaahmad607`.
- `eas project:info --json` returned `@wakaaahmad607/speedyvan-admin`, project ID `37fb9ca1-cad4-4b02-b3d9-b79f67372bf0`.
- `eas build:list --platform ios --limit 10 --json` and `eas build:view` were used for build metadata.
- EAS build logs were read for project root, package metadata, build image, dependency install command and native module compilation markers.
- Supplied static IPA findings recorded build 46 IPA SHA-256 `6cb9cf96c4a9e02ad9f62b2123b331fd5dd86f84c7ffbf14dd8410eeae6f152b`, Mach-O UUID `359D5CAB-39BF-360E-BC45-F172FD3AD7C7`, Expo SDK 52, Hermes, `EXUpdatesEnabled=false` and bundled `new-booking.mp3`.

Signed EAS log URLs are intentionally not stored in this document.

## Build table

| Build | EAS build ID | Created | App root from EAS log | SDK / RN / engine | Git SHA reported by EAS | Build message | Key findings |
|---|---|---:|---|---|---|---|---|
| 43 | `0d13146c-8165-4c05-a86b-ae79af834475` | 2026-09-27 19:31 UTC | `apps/ios-admin-clean` | Expo 54 / RN 0.81.5 / Hermes in Xcode log despite local app config selecting JSC | `d2b9e3d97c438909bc33146aba04ebfd8298f05e` | `Fix iOS admin crash build 43` | Different app root and native stack under the same bundle/EAS identity. EAS ran `npm ci --include=dev`. |
| 44 | `17897bb8-0e23-41b8-9aaf-17652843cb0b` | 2026-10-02 10:45 UTC | `apps/ios-admin` | Expo 52 / RN 0.76.9 / Hermes | `4e6492bf035ab8b5927970b9159e5eeb65b88008` | `Admin pending bookings and payment UX build 44` | `package.json` contained `react-native-worklets` and Xcode compiled `RNWorklets` plus `RNReanimated`. |
| 45 | `6298aa4d-f7c6-4029-853c-75f92463888f` | 2026-10-02 19:17 UTC | `apps/ios-admin` | Expo 52 / RN 0.76.9 / Hermes | `05c76fbbca9943a0532907e53c76dd599e1085ed` | `Fix iOS admin launch crash build 45` | Xcode log still contained `RNWorklets` compilation/linkage. The commit title alone did not prove the native crash was fixed. |
| 46 | `0acbf8b4-0878-4343-a88e-9b56c8f3a9ed` | 2026-10-02 20:31 UTC | `apps/ios-admin` | Expo 52 / RN 0.76.9 / Hermes | `1099573b0b75f772527de94a480cef144cc4adc0` | `Build 46: fix launch crash (remove worklets), design overhaul` | EAS `READ_PACKAGE_JSON` omitted `react-native-worklets`; Xcode log had zero `RNWorklets` hits. EAS ran `npm install --include=dev`, and the uploaded working tree differed from the reported commit. |

## Current conclusion

Build 43 and build 46 are not comparable as simple successive commits: they came from different app roots and different Expo/RN stacks while sharing the production bundle ID and EAS project. Build 44 and build 45 from `apps/ios-admin` did include the known Reanimated 3 plus standalone Worklets conflict at native build time. Build 46 removed that native module from the uploaded package and Xcode logs, so if build 46 still crashes on launch, Worklets is not proven as the remaining crash mechanism.

The current source fix therefore keeps the Worklets removal, removes stale lockfile entries, adds preflight checks to refuse the wrong app root and stale Worklets state, and hardens startup notification/session paths that can fail before the first usable screen.

## Evidence-supported fixes in this branch

- `apps/ios-admin/package.json`: `react-native-worklets` remains removed; EAS pre-install preflight added.
- `package-lock.json`: stale `apps/ios-admin/node_modules/react-native-worklets` and `react-native-worklets` dependency entries removed.
- `apps/ios-admin-clean/package.json`: EAS pre-install hook refuses production builds from the clean app root.
- `apps/ios-admin/app.json`: next candidate build number set to `47` after EAS confirmed builds through `46`; iOS notification sound switched to bundled WAV.
- Startup path: storage restore catches SecureStore/localStorage failures and malformed persisted user JSON.
- Notifications: no `setNotificationHandler` side effect at module import; setup is lazy and permission denial leaves the app usable.
- New-booking alerts: visible modal queue is separated from optional notification sound and does not mutate booking state.

## External documentation checked

- Reanimated compatibility docs state that `react-native-worklets` is a Reanimated 4 dependency and that Reanimated 3 will not work with `react-native-worklets` installed: https://docs.swmansion.com/react-native-reanimated/docs/guides/compatibility/
- Expo runtime-debugging guidance says production launch crashes require platform crash reports/native logs and warns that JavaScript output may not show the full story: https://docs.expo.dev/debugging/runtime-issues/
- Expo app-version guidance was used to keep the candidate native build number greater than the submitted build 46: https://docs.expo.dev/build-reference/app-versions/
- Apple `UNNotificationSound` guidance says custom notification sounds must be bundled/on-device, under 30 seconds, and in supported audio data packaged as `aiff`, `wav`, or `caf`: https://developer.apple.com/documentation/usernotifications/unnotificationsound

## Missing evidence / unverified

- No build 43 or 46 physical-device crash reproduction was available in this Windows workspace.
- No `.ips` crash report or matching dSYM/source-map bundle was found locally.
- App Store Connect crash diagnostics were not accessible through EAS CLI.
- The exact uploaded working-tree diff for build 46 cannot be reconstructed from EAS metadata alone; logs prove at least `package.json` differed from commit `1099573`.
- No claim is made that the final app is fixed on a real iPhone until a signed build is installed and cold-launched repeatedly with retained production-like state.

## Rollback note

Because build 46 has `EXUpdatesEnabled=false`, OTA rollback cannot repair a compiled native dependency or startup native crash in that binary. The last reported working owner build is build 43, but build 43 came from `apps/ios-admin-clean`; preserving its artifact and symbols remains required for rollback.
