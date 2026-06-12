# Deploying World Cup Fantasy

The app is fully client-side: submissions are bundled as JSON, live scores are fetched from ESPN at runtime, and player selection is stored locally (AsyncStorage). No backend to deploy.

## Prerequisites

| Requirement | Notes |
|-------------|-------|
| [Expo account](https://expo.dev) | Free |
| [EAS CLI](https://docs.expo.dev/build/introduction/) | `npm install -g eas-cli` |
| Apple Developer Program | $99/yr — required for TestFlight / App Store |
| Google Play Console | $25 one-time — only if publishing to Play Store |

## One-time setup

```bash
cd mobile
npx expo login
eas build:configure
```

Add bundle identifiers to `mobile/app.json` before your first build:

```json
"ios": {
  "bundleIdentifier": "com.yourname.worldcupfantasy",
  "supportsTablet": true
},
"android": {
  "package": "com.yourname.worldcupfantasy"
}
```

## Two targets, one codebase

Everything is built from the `mobile/` directory. The command you run decides the platform:

| Command (run from `mobile/`) | Builds | Config |
|------------------------------|--------|--------|
| `npx vercel` | Web version | `mobile/vercel.json` |
| `eas build` | Native iOS / Android | `mobile/eas.json` |

Platform-specific code is branched at runtime via `Platform.OS` (e.g. the web dropdown nav vs. native tab bar), so no separate projects are needed.

## Deployment options

### 1. Internal distribution (recommended for friends)

```bash
cd mobile
eas build --platform ios --profile preview      # → TestFlight
eas build --platform android --profile preview  # → shareable APK
```

| Platform | Distribution |
|----------|----------------|
| iOS | `eas submit --platform ios` → invite testers via TestFlight |
| Android | Share the APK download link from EAS |

### 2. App Store / Play Store

```bash
eas build --platform ios --profile production
eas build --platform android --profile production
eas submit --platform ios
eas submit --platform android
```

Requires store listings, screenshots, and a privacy policy.

### 3. Web (no install required)

```bash
cd mobile
npm run export:web
```

This generates a static site in `mobile/dist/` with routes for `/`, `/picks`, and `/matches`.

#### Vercel (recommended)

`mobile/vercel.json` handles everything — Vercel runs `npx expo export --platform web` and serves `dist/` with clean URLs. Just run:

```bash
cd mobile
npx vercel          # preview deploy
npx vercel --prod   # production deploy
```

No build settings to configure; the first run links the project. If connecting the GitHub repo via the dashboard instead, set **Root Directory** = `mobile`.

#### Netlify

```bash
cd mobile
npm run export:web
npx netlify deploy --prod --dir=dist
```

Build settings: publish directory `dist`, build command `npm run export:web`.

#### Local preview

```bash
cd mobile
npm run export:web
npx serve dist
```

Open the URL shown (usually http://localhost:3000).

## Updating data & code

Re-extract submissions after editing `submissions.numbers`:

```bash
.venv/bin/python3 scripts/extract_submissions.py
```

| Change | Action |
|--------|--------|
| UI / logic | `eas build` or `eas update` (OTA) |
| `submissions.json` | Rebuild, or `eas update` to skip store review |
| Live scores | Nothing — fetched from ESPN at runtime |

## Quick recommendation

- **iPhone friends** → TestFlight build + email invites
- **Android friends** → preview APK link from EAS
- **No install** → web export on a shared URL
