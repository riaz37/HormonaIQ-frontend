#!/usr/bin/env bash
# Design audit screenshot runner.
# Usage: ./maestro/run-design-audit.sh [ios|android]
#
# Prerequisites:
#   1. maestro CLI installed: curl -Ls "https://get.maestro.mobile.dev" | bash
#   2. App running on simulator/emulator (npm run ios  OR  npm run android)
#
# Screenshots land in maestro/screenshots/.
# After running, share the screenshots path with Claude for design audit.

set -euo pipefail

PLATFORM="${1:-ios}"
SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
SCREENSHOTS_DIR="$SCRIPT_DIR/screenshots"
FLOWS_DIR="$SCRIPT_DIR/flows"
TIMESTAMP=$(date +%Y%m%d-%H%M%S)
REPORT_DIR="$SCREENSHOTS_DIR/$TIMESTAMP"

mkdir -p "$REPORT_DIR"

echo ""
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo "  HormonaIQ Design Audit — $PLATFORM"
echo "  Output: $REPORT_DIR"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo ""

# Check maestro is installed
if ! command -v maestro &>/dev/null; then
  echo "❌  maestro not found. Install it:"
  echo "    curl -Ls \"https://get.maestro.mobile.dev\" | bash"
  exit 1
fi

MAESTRO_OPTS=""
if [ "$PLATFORM" = "android" ]; then
  MAESTRO_OPTS="--platform android"
fi

FLOWS=(
  "00-onboarding.yaml"
  "02-main-tabs.yaml"
  "03-log-interaction.yaml"
  "04-modules.yaml"
)

PASS=0
FAIL=0

for FLOW in "${FLOWS[@]}"; do
  FLOW_PATH="$FLOWS_DIR/$FLOW"
  FLOW_NAME="${FLOW%.yaml}"

  echo "▶  $FLOW_NAME"

  if maestro test $MAESTRO_OPTS \
      --format junit \
      --output "$REPORT_DIR/${FLOW_NAME}-results.xml" \
      "$FLOW_PATH" 2>&1; then
    echo "   ✅ passed"
    PASS=$((PASS + 1))
  else
    echo "   ⚠️  failed (screenshots may be partial)"
    FAIL=$((FAIL + 1))
  fi

  echo ""
done

# Move screenshots from maestro default location to our report dir
# Maestro writes screenshots to ~/.maestro/tests/<timestamp>/ by default
LATEST_MAESTRO=$(find "$HOME/.maestro/tests" -maxdepth 1 -mindepth 1 -type d 2>/dev/null | sort | tail -1)
if [ -n "$LATEST_MAESTRO" ]; then
  find "$LATEST_MAESTRO" -name "*.png" -exec cp {} "$REPORT_DIR/" \; 2>/dev/null || true
fi

# Count screenshots captured
SCREENSHOT_COUNT=$(find "$REPORT_DIR" -name "*.png" | wc -l | tr -d ' ')

echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo "  Flows:       $PASS passed, $FAIL failed"
echo "  Screenshots: $SCREENSHOT_COUNT captured"
echo "  Location:    $REPORT_DIR"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo ""

if [ "$SCREENSHOT_COUNT" -gt 0 ]; then
  echo "Share the screenshot paths with Claude for design audit:"
  find "$REPORT_DIR" -name "*.png" | sort | sed "s|$HOME|~|"
  echo ""
fi

exit $FAIL
