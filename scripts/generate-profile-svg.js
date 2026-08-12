#!/usr/bin/env node
// Generates dark_mode.svg and light_mode.svg for the profile README terminal panel.
// Run: node scripts/generate-profile-svg.js

const fs = require("fs");
const path = require("path");

const WIDTH = 1150;
const HEIGHT = 560;

const THEMES = {
  dark: {
    file: "dark_mode.svg",
    background: "#0d1117",
    panelBorder: "#30363d",
    divider: "#21262d",
    windowTitle: "#8b949e",
    headerAccent: "#56d4dd",
    valueText: "#c9d1d9",
    mutedText: "#6e7681",
    asciiFrame: "#56d4dd",
    asciiText: "#e6edf3",
    asciiCaption: "#7ee787",
    labelColors: {
      Name: "#7ee787",
      Role: "#79c0ff",
      Focus: "#56d4dd",
      Languages: "#ffa657",
      Backend: "#d2a8ff",
      Frontend: "#ff7b72",
      Database: "#a5d6ff",
      Tools: "#f2cc60",
      Location: "#7ee787",
      Website: "#56d4dd",
    },
  },
  light: {
    file: "light_mode.svg",
    background: "#ffffff",
    panelBorder: "#d0d7de",
    divider: "#eaeef2",
    windowTitle: "#57606a",
    headerAccent: "#116872",
    valueText: "#24292f",
    mutedText: "#8c959f",
    asciiFrame: "#116872",
    asciiText: "#24292f",
    asciiCaption: "#1a7f37",
    labelColors: {
      Name: "#1a7f37",
      Role: "#0969da",
      Focus: "#116872",
      Languages: "#bc4c00",
      Backend: "#8250df",
      Frontend: "#cf222e",
      Database: "#205081",
      Tools: "#9a6700",
      Location: "#1a7f37",
      Website: "#116872",
    },
  },
};

// Original monogram: "M K" initials inside a framed terminal card.
const ASCII_INNER_WIDTH = 21;

function centerText(text, width) {
  const total = width - text.length;
  const left = Math.floor(total / 2);
  const right = total - left;
  return " ".repeat(left) + text + " ".repeat(right);
}

const ASCII_LINES = [
  "┌" + "─".repeat(ASCII_INNER_WIDTH) + "┐",
  "│" + " ".repeat(ASCII_INNER_WIDTH) + "│",
  "│" + centerText("M  K", ASCII_INNER_WIDTH) + "│",
  "│" + centerText("·".repeat(15), ASCII_INNER_WIDTH) + "│",
  "│" + centerText("DEVELOPER", ASCII_INNER_WIDTH) + "│",
  "│" + " ".repeat(ASCII_INNER_WIDTH) + "│",
  "└" + "─".repeat(ASCII_INNER_WIDTH) + "┘",
];

const INFO_ROWS = [
  ["Name", "Manoj Kumar Chilukoti"],
  ["Role", "Software Engineer"],
  ["Focus", "Full Stack Development"],
  ["Languages", "Java, TypeScript, JavaScript, Python, C++"],
  ["Backend", "Spring Boot, Node.js, Express.js"],
  ["Frontend", "React, Next.js, Tailwind CSS"],
  ["Database", "PostgreSQL, MongoDB"],
  ["Tools", "Git, GitHub, Docker"],
  ["Location", "India"],
  ["Website", "manoj-kumar.me"],
];

function escapeXml(str) {
  return String(str)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;");
}

function buildSvg(theme) {
  const t = THEMES[theme];
  const fontStack =
    "ui-monospace, SFMono-Regular, 'SF Mono', Consolas, 'Liberation Mono', Menlo, monospace";

  const asciiX = 60;
  const asciiStartY = 222;
  const asciiLineHeight = 29;
  const asciiFontSize = 21;

  const asciiTspans = ASCII_LINES.map((line, i) => {
    let fill = t.asciiText;
    if (i === 0 || i === ASCII_LINES.length - 1) fill = t.asciiFrame;
    if (line.includes("M  K")) fill = t.headerAccent;
    if (line.includes("·")) fill = t.mutedText;
    if (line.includes("DEVELOPER")) fill = t.asciiCaption;
    return `    <tspan x="${asciiX}" dy="${i === 0 ? 0 : asciiLineHeight}" fill="${fill}">${escapeXml(
      line
    )}</tspan>`;
  }).join("\n");

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
      label
    )}:</text>
  <text x="${rightX + labelWidth}" y="${y}" font-family="${fontStack}" font-size="19" fill="${
      t.valueText
    }">${escapeXml(value)}</text>`;
  }).join("\n");

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
  const outPath = path.join(__dirname, "..", THEMES[theme].file);
  fs.writeFileSync(outPath, svg, "utf8");
  console.log(`Wrote ${outPath}`);
}
