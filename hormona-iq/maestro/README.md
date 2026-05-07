# Maestro Design Audit

Visual screenshot capture for design review. Read-only — no app code is touched.

## Setup (one time)

```bash
# 1. Install Maestro CLI (free, open source)
curl -Ls "https://get.maestro.mobile.dev" | bash

# 2. Start the app on a simulator/emulator
npm run ios      # iOS Simulator
npm run android  # Android Emulator
```

## Run the audit

```bash
./maestro/run-design-audit.sh ios      # iOS screenshots
./maestro/run-design-audit.sh android  # Android screenshots
```

Screenshots land in `maestro/screenshots/<timestamp>/`.

## What gets captured

| Flow | Screens |
|------|---------|
| `00-onboarding.yaml` | All 7 onboarding steps |
| `02-main-tabs.yaml` | Home, Log, Cycle, Insights, Profile |
| `03-log-interaction.yaml` | Log form states (empty → filled) |
| `04-modules.yaml` | Profile, Ora |

## After running

Share the screenshot paths with Claude:

> "Here are my latest screenshots: maestro/screenshots/20260507-143021/"

Claude will audit each screen against `DESIGN.md` and generate an issues report.

## State tracking

The `01-setup-state.yaml` helper flow completes onboarding programmatically
(minimum taps, no screenshots) so each audit flow starts from a known state.
Always runs with `clearState: true` — the simulator's AsyncStorage is wiped
before each run for consistency.
