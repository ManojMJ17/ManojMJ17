#!/usr/bin/env node
// Generates dark_mode.svg and light_mode.svg for the profile README terminal panel.
// Run: node scripts/generate-profile-svg.js

const fs = require('fs');
const path = require('path');

const WIDTH = 1150;
const HEIGHT = 560;

const THEMES = {
  dark: {
    file: 'dark_mode.svg',
    background: '#0d1117',
    panelBorder: '#30363d',
    divider: '#21262d',
    windowTitle: '#8b949e',
    headerAccent: '#56d4dd',
    valueText: '#c9d1d9',
    mutedText: '#6e7681',
    asciiPrimary: '#56d4dd',
    asciiSecondary: '#ffa657',
    asciiMuted: '#30363d',
    asciiFaint: '#21262d',
    labelColors: {
      Name: '#7ee787',
      Role: '#79c0ff',
      Focus: '#56d4dd',
      Languages: '#ffa657',
      Backend: '#d2a8ff',
      Frontend: '#ff7b72',
      Database: '#a5d6ff',
      Tools: '#f2cc60',
      Location: '#7ee787',
      Website: '#56d4dd',
    },
  },
  light: {
    file: 'light_mode.svg',
    background: '#ffffff',
    panelBorder: '#d0d7de',
    divider: '#eaeef2',
    windowTitle: '#57606a',
    headerAccent: '#116872',
    valueText: '#24292f',
    mutedText: '#8c959f',
    asciiPrimary: '#116872',
    asciiSecondary: '#bc4c00',
    asciiMuted: '#d0d7de',
    asciiFaint: '#eaeef2',
    labelColors: {
      Name: '#1a7f37',
      Role: '#0969da',
      Focus: '#116872',
      Languages: '#bc4c00',
      Backend: '#8250df',
      Frontend: '#cf222e',
      Database: '#205081',
      Tools: '#9a6700',
      Location: '#1a7f37',
      Website: '#116872',
    },
  },
};

// Original monogram: a block "M" built from plain ASCII, with a fading
// reflection underneath. Deliberately avoids Unicode block-shading glyphs
// (█▓░) — they aren't guaranteed to exist in every monospace fallback font,
// and a missing glyph gets substituted with an inconsistent-width fallback
// box, which breaks the whole layout (confirmed by render testing below).
// Each row is a list of [text, colorKey] segments (colorKey is null for plain space).
const LEG = '####'; // solid outer strokes of the letter
const legGap = (n) => ' '.repeat(n);

const ASCII_ROWS = [
  [
    [LEG, 'primary'],
    [legGap(13), null],
    [LEG, 'primary'],
  ],
  [
    [LEG, 'primary'],
    ['\\', 'secondary'],
    [legGap(11), null],
    ['/', 'secondary'],
    [LEG, 'primary'],
  ],
  [
    [LEG, 'primary'],
    [legGap(1), null],
    ['\\', 'secondary'],
    [legGap(9), null],
    ['/', 'secondary'],
    [legGap(1), null],
    [LEG, 'primary'],
  ],
  [
    [LEG, 'primary'],
    [legGap(2), null],
    ['\\', 'secondary'],
    [legGap(7), null],
    ['/', 'secondary'],
    [legGap(2), null],
    [LEG, 'primary'],
  ],
  [
    [LEG, 'primary'],
    [legGap(3), null],
    ['\\', 'secondary'],
    [legGap(5), null],
    ['/', 'secondary'],
    [legGap(3), null],
    [LEG, 'primary'],
  ],
  [
    [LEG, 'primary'],
    [legGap(4), null],
    ['\\', 'secondary'],
    [legGap(3), null],
    ['/', 'secondary'],
    [legGap(4), null],
    [LEG, 'primary'],
  ],
  [
    [LEG, 'primary'],
    [legGap(5), null],
    ['\\', 'secondary'],
    [legGap(1), null],
    ['/', 'secondary'],
    [legGap(5), null],
    [LEG, 'primary'],
  ],
  [
    [LEG, 'primary'],
    [legGap(6), null],
    ['V', 'secondary'],
    [legGap(6), null],
    [LEG, 'primary'],
  ],
  [
    [LEG, 'primary'],
    [legGap(13), null],
    [LEG, 'primary'],
  ],
  [
    [LEG, 'primary'],
    [legGap(13), null],
    [LEG, 'primary'],
  ],
  [
    ['----', 'muted'],
    [legGap(13), null],
    ['----', 'muted'],
  ],
  [
    ['....', 'faint'],
    [legGap(13), null],
    ['....', 'faint'],
  ],
];

const INFO_ROWS = [
  ['Name', 'Manoj Kumar Chilukoti'],
  ['Role', 'Software Engineer'],
  ['Focus', 'Full Stack Development'],
  ['Languages', 'Java, TypeScript, JavaScript, Python, C++'],
  ['Backend', 'Spring Boot, Node.js, Express.js'],
  ['Frontend', 'React, Next.js, Tailwind CSS'],
  ['Database', 'PostgreSQL, MongoDB'],
  ['Tools', 'Git, GitHub, Docker'],
  ['Location', 'India'],
  ['Website', 'manoj-kumar.me'],
];

function escapeXml(str) {
  return String(str)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;');
}

function buildSvg(theme) {
  const t = THEMES[theme];
  const fontStack =
    "ui-monospace, SFMono-Regular, 'SF Mono', Consolas, 'Liberation Mono', Menlo, monospace";

  const asciiX = 60;
  const asciiStartY = 165;
  const asciiLineHeight = 26;
  const asciiFontSize = 20;

  const asciiColors = {
    primary: t.asciiPrimary,
    secondary: t.asciiSecondary,
    muted: t.asciiMuted,
    faint: t.asciiFaint,
  };

  const asciiTspans = ASCII_ROWS.map((segments, rowIndex) => {
    return segments
      .map(([text, colorKey], segIndex) => {
        const fill = colorKey ? asciiColors[colorKey] : 'transparent';
        const dyAttr =
          rowIndex === 0 && segIndex === 0
            ? ` dy="0"`
            : segIndex === 0
              ? ` dy="${asciiLineHeight}"`
              : '';
        const xAttr = segIndex === 0 ? ` x="${asciiX}"` : '';
        return `    <tspan${xAttr}${dyAttr} fill="${fill}">${escapeXml(text)}</tspan>`;
      })
      .join('\n');
  }).join('\n');

  const rightX = 400;
  const labelWidth = 175;
  const headerY = 118;
  const dividerY = 138;
  const rowsStartY = 182;
  const rowHeight = 34;

  const infoRows = INFO_ROWS.map(([label, value], i) => {
    const y = rowsStartY + i * rowHeight;
    const labelColor = t.labelColors[label] || t.headerAccent;
    return `  <text x="${rightX}" y="${y}" font-family="${fontStack}" font-size="19" font-weight="600" fill="${labelColor}">${escapeXml(
      label,
    )}:</text>
  <text x="${rightX + labelWidth}" y="${y}" font-family="${fontStack}" font-size="19" fill="${
    t.valueText
  }">${escapeXml(value)}</text>`;
  }).join('\n');

  return `<svg width="${WIDTH}" height="${HEIGHT}" viewBox="0 0 ${WIDTH} ${HEIGHT}" fill="none" xmlns="http://www.w3.org/2000/svg" role="img" aria-label="Manoj Kumar Chilukoti - Software Engineer, Full Stack Developer - terminal profile card">
  <rect x="1" y="1" width="${WIDTH - 2}" height="${HEIGHT - 2}" rx="18" fill="${t.background}" stroke="${t.panelBorder}" stroke-width="1.5"/>

  <circle cx="34" cy="32" r="6" fill="#ff5f56"/>
  <circle cx="58" cy="32" r="6" fill="#ffbd2e"/>
  <circle cx="82" cy="32" r="6" fill="#27c93f"/>
  <text x="${WIDTH / 2}" y="37" text-anchor="middle" font-family="${fontStack}" font-size="14" fill="${
    t.windowTitle
  }">manoj@github &#8212; zsh</text>
  <line x1="32" y1="60" x2="${WIDTH - 32}" y2="60" stroke="${t.divider}" stroke-width="1"/>

  <text x="${asciiX}" y="${asciiStartY}" font-family="${fontStack}" font-size="${asciiFontSize}" xml:space="preserve">
${asciiTspans}
  </text>

  <text x="${rightX}" y="${headerY}" font-family="${fontStack}" font-size="23" font-weight="700" fill="${
    t.headerAccent
  }">manoj@github<tspan fill="${t.mutedText}" font-weight="400">
    <animate attributeName="opacity" values="1;0;1" dur="1.1s" repeatCount="indefinite"/>&#9608;</tspan></text>
  <line x1="${rightX}" y1="${dividerY}" x2="${WIDTH - 40}" y2="${dividerY}" stroke="${
    t.divider
  }" stroke-width="2" stroke-linecap="round" stroke-dasharray="1.5,7"/>

${infoRows}
</svg>
`;
}

for (const theme of Object.keys(THEMES)) {
  const svg = buildSvg(theme);
  const outPath = path.join(__dirname, '..', THEMES[theme].file);
  fs.writeFileSync(outPath, svg, 'utf8');
  console.log(`Wrote ${outPath}`);
}
