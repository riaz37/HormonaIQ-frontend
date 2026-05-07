#!/usr/bin/env node
// scripts/design-audit.mjs — HormonaIQ persistent design audit tool
// READ-ONLY: never modifies app source code.
// Writes only: maestro/.audit-state.json and DESIGN-ISSUES.md

import { createHash } from 'node:crypto';
import { readFileSync, writeFileSync, existsSync, readdirSync, statSync } from 'node:fs';
import { join, relative, dirname, extname } from 'node:path';
import { fileURLToPath } from 'node:url';

// ─────────────────────────────────────────────────────────────────────────────
// Root resolution
// ─────────────────────────────────────────────────────────────────────────────

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const ROOT = join(__dirname, '..'); // hormona-iq/

const STATE_FILE = join(ROOT, 'maestro', '.audit-state.json');
const REPORT_FILE = join(ROOT, 'DESIGN-ISSUES.md');
const SRC_DIR = join(ROOT, 'src');
const SCREENSHOTS_DIR = join(ROOT, 'maestro', 'screenshots');

// ─────────────────────────────────────────────────────────────────────────────
// Design-system constants (sourced from src/constants/tokens.ts)
// ─────────────────────────────────────────────────────────────────────────────

// All hex values from colors and phase in tokens.ts
const TOKEN_HEX_VALUES = new Set([
  '#3F6F5A', '#2C5443', '#5C8A75', '#9CB89A', '#C7D9C5', '#DCEBDD', '#ECF4EC',
  '#1B2E25', '#4A5C53', '#7A8B82', '#B5C0BA', '#FFFFFF', '#FAFBF6', '#F4F0E5',
  '#F5E4B8', '#E8C97A', '#E89F86', '#F5C8B5', '#D88A95', '#5C4A7A', '#B95446',
  '#5C8A75', '#E8C97A', '#C97962',
  '#EEF4EE', '#FAF0EE', '#FBF6E9',
  '#2B4E3C',
  // phase tokens
  '#C7D9C5', '#F5E4B8', '#E89F86', '#C97962', '#B97A8A',
]);

const ALLOWED_FONT_FAMILIES = new Set([
  'InstrumentSerif_400Regular',
  'InstrumentSerif_400Regular_Italic',
  'Inter_400Regular',
  'Inter_500Medium',
  'Inter_600SemiBold',
  'Inter_700Bold',
  'JetBrainsMono_400Regular',
  'JetBrainsMono_500Medium',
]);

const ALLOWED_SPACING = new Set([2, 3, 4, 6, 8, 10, 12, 16, 20, 24, 32, 40, 48, 64, 80]);
// Small radii (2-6) are valid for hairlines, progress bars, chart elements, and chip borders
const ALLOWED_RADIUS = new Set([2, 3, 4, 5, 6, 10, 12, 18, 28, 40, 9999]);
// Extended font sizes cover display-xl (56), large data displays (36, 44), and legacy body (16)
const ALLOWED_FONT_SIZES = new Set([11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 22, 24, 26, 28, 30, 32, 36, 40, 44, 56, 76]);
const SYSTEM_FONTS = ['system-ui', '-apple-system', 'Helvetica', 'Arial', 'sans-serif'];

// ─────────────────────────────────────────────────────────────────────────────
// Utility helpers
// ─────────────────────────────────────────────────────────────────────────────

function md5(str) {
  return createHash('md5').update(str).digest('hex');
}

function md5File(filePath) {
  const content = readFileSync(filePath);
  return createHash('md5').update(content).digest('hex');
}

function readJson(filePath) {
  if (!existsSync(filePath)) return null;
  try {
    return JSON.parse(readFileSync(filePath, 'utf8'));
  } catch {
    return null;
  }
}

function writeJson(filePath, data) {
  writeFileSync(filePath, JSON.stringify(data, null, 2), 'utf8');
}

function relPath(absPath) {
  return relative(ROOT, absPath);
}

// Walk a directory, returning all files matching an extension filter.
// Skips node_modules, __tests__, coverage.
function walkDir(dir, extFilter) {
  const results = [];
  if (!existsSync(dir)) return results;

  const SKIP_DIRS = new Set(['node_modules', '__tests__', 'coverage', '.git']);
  // Token/style definition files — they contain the source values, not violations
  const SKIP_FILES = new Set(['tokens.ts']);

  function walk(current) {
    let entries;
    try {
      entries = readdirSync(current, { withFileTypes: true });
    } catch {
      return;
    }
    for (const entry of entries) {
      if (SKIP_DIRS.has(entry.name)) continue;
      const full = join(current, entry.name);
      if (entry.isDirectory()) {
        walk(full);
      } else if (entry.isFile()) {
        const ext = extname(entry.name);
        if ((!extFilter || extFilter.has(ext)) && !SKIP_FILES.has(entry.name)) {
          results.push(full);
        }
      }
    }
  }
  walk(dir);
  return results;
}

// Find the most recent timestamped screenshot directory
function findLatestScreenshotDir() {
  if (!existsSync(SCREENSHOTS_DIR)) return null;
  let entries;
  try {
    entries = readdirSync(SCREENSHOTS_DIR, { withFileTypes: true });
  } catch {
    return null;
  }
  const dirs = entries
    .filter((e) => e.isDirectory())
    .map((e) => {
      const full = join(SCREENSHOTS_DIR, e.name);
      try {
        const stat = statSync(full);
        return { name: e.name, full, mtime: stat.mtime.getTime() };
      } catch {
        return null;
      }
    })
    .filter(Boolean)
    .sort((a, b) => b.mtime - a.mtime);

  return dirs.length > 0 ? dirs[0].full : null;
}

// ─────────────────────────────────────────────────────────────────────────────
// Static analysis rules
// ─────────────────────────────────────────────────────────────────────────────

function analyzeFile(filePath) {
  const content = readFileSync(filePath, 'utf8');
  const lines = content.split('\n');
  const issues = [];
  const rel = relPath(filePath);

  // ── HIGH: Hardcoded hex color ──────────────────────────────────────────────
  {
    const HEX_COLOR_RE = /(?:color|backgroundColor|borderColor|tintColor|shadowColor|fill|stroke)\s*:\s*'(#[0-9a-fA-F]{3,8})'/g;
    lines.forEach((line, idx) => {
      let m;
      const re = new RegExp(HEX_COLOR_RE.source, 'g');
      while ((m = re.exec(line)) !== null) {
        const hexVal = m[1].toUpperCase();
        const normalizedTokens = [...TOKEN_HEX_VALUES].map((h) => h.toUpperCase());
        if (normalizedTokens.includes(hexVal)) {
          // It's a known token value — only flag if not using a token reference on the same line
          // (e.g., still using the raw hex instead of colors.X)
          // Check if the line also references `colors.` — if not, it might be bypassing the token
          // We flag hardcoded hex even if it matches a token value — the rule is to USE the token name
          if (!/colors\.|phase\.|shadows\./.test(line)) {
            issues.push({
              severity: 'high',
              rule: 'hardcoded-color',
              file: rel,
              line: idx + 1,
              description: `Hardcoded color \`${m[1]}\` bypasses token system`,
              fix: `Replace with the matching \`colors.X\` token from \`constants/tokens.ts\``,
            });
          }
        } else {
          // Hex not in token set at all — definitely flag it
          issues.push({
            severity: 'high',
            rule: 'hardcoded-color',
            file: rel,
            line: idx + 1,
            description: `Hardcoded color \`${m[1]}\` not in design token set`,
            fix: `Add to tokens or replace with nearest matching \`colors.X\` token`,
          });
        }
      }
    });
  }

  // ── HIGH: Touch target below 44px ─────────────────────────────────────────
  {
    const TOUCH_RE = /(?:minHeight|minWidth)\s*:\s*([0-9]+)/g;
    lines.forEach((line, idx) => {
      let m;
      const re = new RegExp(TOUCH_RE.source, 'g');
      while ((m = re.exec(line)) !== null) {
        const val = parseInt(m[1], 10);
        if (val < 44) {
          issues.push({
            severity: 'high',
            rule: 'touch-target',
            file: rel,
            line: idx + 1,
            description: `Touch target ${val}px is below 44px minimum`,
            fix: `Increase \`minHeight\`/\`minWidth\` to at least 44`,
          });
        }
      }
    });
  }

  // ── HIGH: System/fallback font ────────────────────────────────────────────
  {
    lines.forEach((line, idx) => {
      for (const sf of SYSTEM_FONTS) {
        if (line.includes(`fontFamily`) && line.includes(sf)) {
          issues.push({
            severity: 'high',
            rule: 'system-font',
            file: rel,
            line: idx + 1,
            description: `System/fallback font \`${sf}\` used instead of design-system font`,
            fix: `Replace with a font from \`fonts.X\` in \`constants/tokens.ts\``,
          });
        }
      }
    });
  }

  // ── MEDIUM: Raw font family string not from tokens ─────────────────────────
  {
    const FONT_RE = /fontFamily\s*:\s*'([^']+)'/g;
    lines.forEach((line, idx) => {
      let m;
      const re = new RegExp(FONT_RE.source, 'g');
      while ((m = re.exec(line)) !== null) {
        const fam = m[1];
        if (!ALLOWED_FONT_FAMILIES.has(fam)) {
          // Skip if it's clearly a token reference pattern
          if (!line.includes('fonts.')) {
            issues.push({
              severity: 'medium',
              rule: 'raw-font-family',
              file: rel,
              line: idx + 1,
              description: `Raw font family string \`'${fam}'\` not in allowed token set`,
              fix: `Replace with \`fonts.X\` reference from \`constants/tokens.ts\``,
            });
          }
        }
      }
    });
  }

  // ── MEDIUM: Magic spacing value ───────────────────────────────────────────
  {
    const SPACING_RE = /(?:margin|padding)(?:Top|Bottom|Left|Right|Horizontal|Vertical)?\s*:\s*([0-9]+)/g;
    lines.forEach((line, idx) => {
      let m;
      const re = new RegExp(SPACING_RE.source, 'g');
      while ((m = re.exec(line)) !== null) {
        const val = parseInt(m[1], 10);
        if (val >= 1 && val <= 100 && !ALLOWED_SPACING.has(val)) {
          issues.push({
            severity: 'medium',
            rule: 'magic-spacing',
            file: rel,
            line: idx + 1,
            description: `Magic spacing value \`${val}\` not on 4px scale (allowed: 2,4,6,8,10,12,16,20,24,32,48,64)`,
            fix: `Replace with nearest allowed spacing value or \`spacing.X\` token`,
          });
        }
      }
    });
  }

  // ── MEDIUM: Magic border radius ───────────────────────────────────────────
  {
    const RADIUS_RE = /borderRadius\s*:\s*([0-9]+)/g;
    lines.forEach((line, idx) => {
      let m;
      const re = new RegExp(RADIUS_RE.source, 'g');
      while ((m = re.exec(line)) !== null) {
        const val = parseInt(m[1], 10);
        if (!ALLOWED_RADIUS.has(val)) {
          issues.push({
            severity: 'medium',
            rule: 'magic-radius',
            file: rel,
            line: idx + 1,
            description: `Border radius \`${val}\` not in token set (allowed: 10,12,18,28,40,9999)`,
            fix: `Replace with \`radius.X\` token from \`constants/tokens.ts\``,
          });
        }
      }
    });
  }

  // ── MEDIUM: Font size outside type scale ──────────────────────────────────
  {
    const FONTSIZE_RE = /fontSize\s*:\s*([0-9]+)/g;
    lines.forEach((line, idx) => {
      let m;
      const re = new RegExp(FONTSIZE_RE.source, 'g');
      while ((m = re.exec(line)) !== null) {
        const val = parseInt(m[1], 10);
        if (!ALLOWED_FONT_SIZES.has(val)) {
          issues.push({
            severity: 'medium',
            rule: 'off-scale-font-size',
            file: rel,
            line: idx + 1,
            description: `Font size \`${val}\` outside type scale (allowed: 11,12,13,14,15,17,18,19,20,22,24,26,30,32,40,76)`,
            fix: `Use a font size from the Morning Garden type scale`,
          });
        }
      }
    });
  }

  // ── MEDIUM: Italic display overuse ────────────────────────────────────────
  {
    const ITALIC_PATTERNS = [
      'InstrumentSerif_400Regular_Italic',
      'displayItalic',
      'italicDisplay',
    ];
    let italicCount = 0;
    // Count only in StyleSheet style contexts (inside StyleSheet.create or style props)
    for (const pattern of ITALIC_PATTERNS) {
      const re = new RegExp(pattern.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'), 'g');
      const matches = content.match(re) || [];
      italicCount += matches.length;
    }
    if (italicCount >= 2) {
      issues.push({
        severity: 'medium',
        rule: 'italic-overuse',
        file: rel,
        line: 1,
        description: `Italic display font used ${italicCount} times — consider limiting to one primary italic accent per screen`,
        fix: `Reduce italic usage; use plain display font (\`fonts.display\`) for secondary headings`,
      });
    }
  }

  // ── MEDIUM: Hardcoded shadow object ───────────────────────────────────────
  {
    // Look for shadowColor + shadowOffset + shadowOpacity all inline (not spread from shadows.X)
    const hasShadowColor = /shadowColor\s*:/.test(content);
    const hasShadowOffset = /shadowOffset\s*:/.test(content);
    const hasShadowOpacity = /shadowOpacity\s*:/.test(content);

    if (hasShadowColor && hasShadowOffset && hasShadowOpacity) {
      // Check if ALL shadow props appear without spreading shadows.X nearby
      lines.forEach((line, idx) => {
        if (/shadowColor\s*:/.test(line) && !/shadows\./.test(content.slice(0, content.indexOf(line)))) {
          // Look at a window of ±5 lines for the spread pattern
          const window = lines.slice(Math.max(0, idx - 5), Math.min(lines.length, idx + 6)).join('\n');
          if (!window.includes('...shadows.') && /shadowOffset\s*:/.test(window) && /shadowOpacity\s*:/.test(window)) {
            issues.push({
              severity: 'medium',
              rule: 'inline-shadow',
              file: rel,
              line: idx + 1,
              description: `Inline shadow object defined instead of spreading \`shadows.X\` token`,
              fix: `Replace with \`...shadows.sm\`, \`...shadows.md\`, or \`...shadows.lg\` from tokens`,
            });
          }
        }
      });
    }
  }

  // ── LOW: Missing accessibilityLabel on Pressable/TouchableOpacity ─────────
  {
    const pressableCount = (content.match(/<Pressable[\s>]/g) || []).length
      + (content.match(/<TouchableOpacity[\s>]/g) || []).length;
    const labelCount = (content.match(/accessibilityLabel=/g) || []).length;
    if (pressableCount > 0) {
      const ratio = labelCount / pressableCount;
      if (ratio < 0.8) {
        issues.push({
          severity: 'low',
          rule: 'missing-accessibility-label',
          file: rel,
          line: 1,
          description: `${pressableCount} pressable(s) found but only ${labelCount} \`accessibilityLabel\` prop(s) — coverage ${Math.round(ratio * 100)}% (threshold 80%)`,
          fix: `Add \`accessibilityLabel\` to all interactive elements`,
        });
      }
    }
  }

  // ── LOW: console.log in non-test files ────────────────────────────────────
  {
    if (!filePath.includes('__tests__') && !filePath.includes('.test.')) {
      lines.forEach((line, idx) => {
        if (/console\.log\s*\(/.test(line)) {
          issues.push({
            severity: 'low',
            rule: 'console-log',
            file: rel,
            line: idx + 1,
            description: `\`console.log\` in production source file`,
            fix: `Remove or replace with a proper logging utility`,
          });
        }
      });
    }
  }

  return issues;
}

// ─────────────────────────────────────────────────────────────────────────────
// Visual analysis via Claude API
// ─────────────────────────────────────────────────────────────────────────────

async function analyzeScreenshot(screenshotPath, apiKey) {
  const filename = relative(ROOT, screenshotPath);
  const imageData = readFileSync(screenshotPath);
  const base64 = imageData.toString('base64');

  const prompt = `You are a senior product designer auditing a React Native mobile app called HormonaIQ.
Design system: "Morning Garden" — organic minimalism. Eucalyptus greens, warm neutrals (cream/ink),
Instrument Serif for display, Inter for body, JetBrains Mono for numbers.

Screenshot: ${filename}

Analyze this screenshot and report ONLY real issues you can clearly see. Be specific about what's wrong.

Check for:
1. Typography hierarchy — is H1 vs body vs caption visually distinct and clear?
2. Color palette — does it match Morning Garden (greens, warm neutrals) or look off?
3. Spacing — does content feel cramped, mis-aligned, or inconsistently spaced?
4. Visual noise — too many things competing for attention?
5. Broken layout — anything obviously cut off, overlapping, or misaligned?
6. Empty states — if the screen has no data, does it look intentional or broken?
7. Overall polish — would a designer at a top mobile studio be proud of this? (score 1-10)

Return a JSON array of issues (empty array if none):
[
  {
    "severity": "high|medium|low",
    "category": "typography|color|spacing|layout|polish|visual-noise",
    "description": "Specific description of what's wrong and where on screen",
    "suggestion": "Specific fix suggestion"
  }
]

Only report real, visible issues. Do not hallucinate issues that aren't there.`;

  const body = {
    model: 'claude-sonnet-4-6',
    max_tokens: 1024,
    messages: [
      {
        role: 'user',
        content: [
          {
            type: 'image',
            source: { type: 'base64', media_type: 'image/png', data: base64 },
          },
          { type: 'text', text: prompt },
        ],
      },
    ],
  };

  const response = await fetch('https://api.anthropic.com/v1/messages', {
    method: 'POST',
    headers: {
      'x-api-key': apiKey,
      'anthropic-version': '2023-06-01',
      'content-type': 'application/json',
    },
    body: JSON.stringify(body),
  });

  if (!response.ok) {
    const errText = await response.text();
    throw new Error(`Anthropic API error ${response.status}: ${errText}`);
  }

  const data = await response.json();
  const textContent = data.content?.find((c) => c.type === 'text')?.text ?? '[]';

  // Extract JSON array from the response text
  const jsonMatch = textContent.match(/\[[\s\S]*\]/);
  if (!jsonMatch) return [];

  try {
    const parsed = JSON.parse(jsonMatch[0]);
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

// ─────────────────────────────────────────────────────────────────────────────
// State management
// ─────────────────────────────────────────────────────────────────────────────

function loadState() {
  const raw = readJson(STATE_FILE);
  if (!raw) {
    return {
      nextIssueId: 1,
      lastRun: null,
      files: {},      // filePath -> { hash, lastAudited, issueIds }
      screenshots: {}, // screenshotPath -> { hash, lastAudited, issueIds }
      issues: {},     // issueId -> issue object
    };
  }
  return raw;
}

function saveState(state) {
  writeJson(STATE_FILE, state);
}

// ─────────────────────────────────────────────────────────────────────────────
// Issue ID management
// ─────────────────────────────────────────────────────────────────────────────

function issueKey(issue) {
  // Deterministic key for deduplication: rule + file + line (or rule + file for file-level)
  return `${issue.rule}::${issue.file}::${issue.line ?? 1}`;
}

function formatIssueId(num) {
  return `DES-${String(num).padStart(3, '0')}`;
}

// ─────────────────────────────────────────────────────────────────────────────
// Report generation
// ─────────────────────────────────────────────────────────────────────────────

const SEVERITY_EMOJI = { high: '🔴', medium: '🟡', low: '🟢' };
const SEVERITY_LABEL = { high: 'High', medium: 'Medium', low: 'Low' };

function renderIssueBlock(issueId, issue) {
  const emoji = SEVERITY_EMOJI[issue.severity] ?? '⚪';
  const isFixed = issue.status === 'fixed';

  if (isFixed) {
    return [
      `### ✅ ~~[${issueId}] ${issue.description}~~`,
      `**File:** \`${issue.file}:${issue.line}\`  `,
      `**Fixed:** ${issue.fixedAt ?? 'unknown'}  `,
      '',
      '---',
      '',
    ].join('\n');
  }

  const lines = [
    `### ${emoji} [${issueId}] ${issue.description}`,
    `**File:** \`${issue.file}:${issue.line}\`  `,
    `**Rule:** ${issue.rule}  `,
    `**Fix:** ${issue.fix ?? issue.suggestion ?? 'See rule documentation'}  `,
    `**First seen:** ${issue.firstSeen} · **Last seen:** ${issue.lastSeen}  `,
    '',
    '---',
    '',
  ];

  if (issue.category) {
    lines.splice(3, 0, `**Category:** ${issue.category}  `);
  }

  return lines.join('\n');
}

function buildReport(state, scanStats) {
  const today = new Date().toISOString().slice(0, 10);
  const allIssues = Object.entries(state.issues); // [id, issue]

  const open = allIssues.filter(([, i]) => i.status !== 'fixed');
  const fixed = allIssues.filter(([, i]) => i.status === 'fixed');

  const countBySev = (list, sev) => list.filter(([, i]) => i.severity === sev).length;

  const openHigh = countBySev(open, 'high');
  const openMed = countBySev(open, 'medium');
  const openLow = countBySev(open, 'low');
  const fixedHigh = countBySev(fixed, 'high');
  const fixedMed = countBySev(fixed, 'medium');
  const fixedLow = countBySev(fixed, 'low');

  const header = [
    '# HormonaIQ — Design Issues Report',
    '',
    '> **Read-only audit.** This tool never modifies app source code.  ',
    '> Re-run: `node scripts/design-audit.mjs`  ',
    `> Last run: ${new Date().toISOString()} · Files scanned: ${scanStats.filesScanned} · Screenshots analyzed: ${scanStats.screenshotsAnalyzed}`,
    '',
    '## Summary',
    '',
    '| Severity | Open | Fixed |',
    '|----------|------|-------|',
    `| 🔴 High   | ${openHigh}    | ${fixedHigh}     |`,
    `| 🟡 Medium | ${openMed}    | ${fixedMed}     |`,
    `| 🟢 Low    | ${openLow}    | ${fixedLow}     |`,
    '',
    '---',
    '',
  ].join('\n');

  // Sort open issues: high first, then medium, then low; then by id
  const sortedOpen = [...open].sort(([idA, iA], [idB, iB]) => {
    const sevOrder = { high: 0, medium: 1, low: 2 };
    const sevDiff = (sevOrder[iA.severity] ?? 3) - (sevOrder[iB.severity] ?? 3);
    if (sevDiff !== 0) return sevDiff;
    return idA.localeCompare(idB);
  });

  let openSection = '## Open Issues\n\n';
  if (sortedOpen.length === 0) {
    openSection += '_No open issues — ship it!_ 🌿\n\n---\n\n';
  } else {
    for (const [id, issue] of sortedOpen) {
      openSection += renderIssueBlock(id, issue);
    }
  }

  let fixedSection = '## Fixed Issues\n\n';
  if (fixed.length === 0) {
    fixedSection += '_No fixed issues yet._\n\n';
  } else {
    for (const [id, issue] of fixed) {
      fixedSection += renderIssueBlock(id, issue);
    }
  }

  return header + openSection + fixedSection;
}

// ─────────────────────────────────────────────────────────────────────────────
// Main audit loop
// ─────────────────────────────────────────────────────────────────────────────

async function main() {
  const apiKey = process.env.ANTHROPIC_API_KEY ?? null;
  const today = new Date().toISOString().slice(0, 10);
  const nowIso = new Date().toISOString();

  // ── Banner ──────────────────────────────────────────────────────────────────
  console.log('\n━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
  console.log('  HormonaIQ Design Audit');
  console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n');

  // ── Load state ──────────────────────────────────────────────────────────────
  const state = loadState();

  // Build a lookup of existing issues by their deterministic key
  // key -> issueId
  const existingKeyToId = {};
  for (const [id, issue] of Object.entries(state.issues)) {
    const k = issueKey(issue);
    existingKeyToId[k] = id;
  }

  // ── Discover source files ──────────────────────────────────────────────────
  const sourceFiles = walkDir(SRC_DIR, new Set(['.ts', '.tsx']));
  const totalSourceFiles = sourceFiles.length;

  // Determine which files changed since last run
  const changedSourceFiles = sourceFiles.filter((fp) => {
    const rel = relPath(fp);
    const saved = state.files[rel];
    const hash = md5File(fp);
    return !saved || saved.hash !== hash;
  });

  console.log(`  Scanning ${totalSourceFiles} source files (${changedSourceFiles.length} changed since last run)...`);

  // ── Discover screenshots ───────────────────────────────────────────────────
  const latestScreenshotDir = findLatestScreenshotDir();
  const screenshotFiles = latestScreenshotDir
    ? walkDir(latestScreenshotDir, new Set(['.png']))
    : [];

  const changedScreenshots = screenshotFiles.filter((fp) => {
    const rel = relPath(fp);
    const saved = state.screenshots[rel];
    const hash = md5File(fp);
    return !saved || saved.hash !== hash;
  });

  if (apiKey && screenshotFiles.length > 0) {
    console.log(`  Analyzing ${changedScreenshots.length} screenshots with Claude vision (${screenshotFiles.length} total)...`);
  } else if (!apiKey) {
    console.log(`  Skipping visual analysis (ANTHROPIC_API_KEY not set)`);
  } else {
    console.log(`  No screenshots found in ${SCREENSHOTS_DIR}`);
  }

  console.log('');

  // ── Counters ────────────────────────────────────────────────────────────────
  let newIssueCount = 0;
  let fixedIssueCount = 0;
  let unchangedIssueCount = 0;

  // Track which issue IDs were found in this run (to detect fixed ones)
  const foundIssueIds = new Set();

  // ── Run static analysis on changed files ───────────────────────────────────
  for (const fp of changedSourceFiles) {
    const rel = relPath(fp);
    const hash = md5File(fp);
    const fileIssues = analyzeFile(fp);

    // Clear old issues for this file (mark them for potential fixing)
    const prevIssueIds = state.files[rel]?.issueIds ?? [];

    // Map new issues to IDs
    const newIssueIds = [];
    for (const issue of fileIssues) {
      const k = issueKey(issue);
      if (existingKeyToId[k]) {
        // Issue already exists — update lastSeen, keep status
        const id = existingKeyToId[k];
        if (state.issues[id].status !== 'fixed') {
          state.issues[id].lastSeen = today;
          unchangedIssueCount++;
        }
        foundIssueIds.add(id);
        newIssueIds.push(id);
      } else {
        // New issue
        const id = formatIssueId(state.nextIssueId++);
        state.issues[id] = {
          ...issue,
          status: 'open',
          firstSeen: today,
          lastSeen: today,
        };
        existingKeyToId[k] = id;
        foundIssueIds.add(id);
        newIssueIds.push(id);
        newIssueCount++;
      }
    }

    // Check for issues from previous scan that are no longer found in this file
    for (const prevId of prevIssueIds) {
      if (!newIssueIds.includes(prevId) && state.issues[prevId]?.status !== 'fixed') {
        state.issues[prevId].status = 'fixed';
        state.issues[prevId].fixedAt = today;
        fixedIssueCount++;
      }
    }

    // Update file state
    state.files[rel] = {
      hash,
      lastAudited: nowIso,
      issueIds: newIssueIds,
    };
  }

  // For unchanged files, mark their issues as still seen
  for (const fp of sourceFiles) {
    const rel = relPath(fp);
    if (!changedSourceFiles.includes(fp)) {
      const savedFile = state.files[rel];
      if (savedFile) {
        for (const id of savedFile.issueIds ?? []) {
          if (state.issues[id] && state.issues[id].status !== 'fixed') {
            foundIssueIds.add(id);
          }
        }
      }
    }
  }

  // ── Run visual analysis on changed screenshots ────────────────────────────
  let screenshotsAnalyzed = 0;
  if (apiKey && changedScreenshots.length > 0) {
    for (const fp of changedScreenshots) {
      const rel = relPath(fp);
      const hash = md5File(fp);
      const prevIssueIds = state.screenshots[rel]?.issueIds ?? [];

      let visualIssues = [];
      try {
        visualIssues = await analyzeScreenshot(fp, apiKey);
        screenshotsAnalyzed++;
      } catch (err) {
        console.error(`  Warning: Could not analyze ${rel}: ${err.message}`);
      }

      const newIssueIds = [];
      for (const vi of visualIssues) {
        // Visual issues use screenshot path + description as their key
        const vIssue = {
          severity: vi.severity ?? 'medium',
          rule: `visual-${vi.category ?? 'layout'}`,
          file: rel,
          line: 1,
          description: vi.description,
          fix: vi.suggestion,
          category: vi.category,
        };
        const k = issueKey(vIssue);
        if (existingKeyToId[k]) {
          const id = existingKeyToId[k];
          if (state.issues[id].status !== 'fixed') {
            state.issues[id].lastSeen = today;
            unchangedIssueCount++;
          }
          foundIssueIds.add(id);
          newIssueIds.push(id);
        } else {
          const id = formatIssueId(state.nextIssueId++);
          state.issues[id] = {
            ...vIssue,
            status: 'open',
            firstSeen: today,
            lastSeen: today,
          };
          existingKeyToId[k] = id;
          foundIssueIds.add(id);
          newIssueIds.push(id);
          newIssueCount++;
        }
      }

      // Fix visual issues from previous screenshot scan that are gone
      for (const prevId of prevIssueIds) {
        if (!newIssueIds.includes(prevId) && state.issues[prevId]?.status !== 'fixed') {
          state.issues[prevId].status = 'fixed';
          state.issues[prevId].fixedAt = today;
          fixedIssueCount++;
        }
      }

      state.screenshots[rel] = {
        hash,
        lastAudited: nowIso,
        issueIds: newIssueIds,
      };
    }

    // For unchanged screenshots, carry forward issue IDs
    for (const fp of screenshotFiles) {
      const rel = relPath(fp);
      if (!changedScreenshots.includes(fp)) {
        const saved = state.screenshots[rel];
        if (saved) {
          for (const id of saved.issueIds ?? []) {
            if (state.issues[id] && state.issues[id].status !== 'fixed') {
              foundIssueIds.add(id);
            }
          }
        }
      }
    }
  }

  // ── Update state timestamp ─────────────────────────────────────────────────
  state.lastRun = nowIso;

  // ── Persist state ──────────────────────────────────────────────────────────
  saveState(state);

  // ── Generate report ────────────────────────────────────────────────────────
  const scanStats = {
    filesScanned: totalSourceFiles,
    screenshotsAnalyzed,
  };

  const reportContent = buildReport(state, scanStats);
  writeFileSync(REPORT_FILE, reportContent, 'utf8');

  // ── Summary output ─────────────────────────────────────────────────────────
  const allOpen = Object.values(state.issues).filter((i) => i.status !== 'fixed');
  const highCount = allOpen.filter((i) => i.severity === 'high').length;
  const medCount = allOpen.filter((i) => i.severity === 'medium').length;
  const lowCount = allOpen.filter((i) => i.severity === 'low').length;

  const newHigh = allOpen.filter((i) => i.firstSeen === today && i.severity === 'high').length;
  const newMed = allOpen.filter((i) => i.firstSeen === today && i.severity === 'medium').length;

  // Persistent open issues: open issues that were NOT first seen today
  const persistentCount = allOpen.filter((i) => i.firstSeen !== today).length;

  console.log(`  NEW issues:   ${newIssueCount}  (${newHigh} high, ${newMed} medium)`);
  console.log(`  FIXED issues: ${fixedIssueCount}`);
  console.log(`  PERSISTENT:   ${persistentCount}  (open from prior runs)`);
  console.log('');
  console.log(`  Report: DESIGN-ISSUES.md`);
  console.log('  State:  maestro/.audit-state.json');
  console.log('\n━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n');

  if (highCount > 0 || medCount > 0) {
    console.log(`  Open: ${highCount} high, ${medCount} medium — see DESIGN-ISSUES.md\n`);
  }
}

main().catch((err) => {
  console.error('Design audit failed:', err);
  process.exit(1);
});
