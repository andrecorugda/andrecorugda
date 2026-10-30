// Generates the profile's SVG artwork in light and dark variants.
// Run: node scripts/build-assets.mjs
import { mkdirSync, writeFileSync } from 'node:fs';

const OUT = new URL('../assets/', import.meta.url);
mkdirSync(OUT, { recursive: true });

const THEMES = {
  dark: { mode: 'dark', bg: '#0d1117', panel: '#161b22', border: '#30363d', text: '#e6edf3', muted: '#8b949e', code: '#0b0f14',
          kw: '#ff7b72', fn: '#d2a8ff', ty: '#79c0ff', str: '#a5d6ff', num: '#79c0ff', cm: '#8b949e', id: '#e6edf3' },
  light: { mode: 'light', bg: '#ffffff', panel: '#f6f8fa', border: '#d0d7de', text: '#1f2328', muted: '#59636e', code: '#f6f8fa',
           kw: '#cf222e', fn: '#8250df', ty: '#0550ae', str: '#0a3069', num: '#0550ae', cm: '#6e7781', id: '#1f2328' },
};

const SANS = "-apple-system, 'Segoe UI', Helvetica, Arial, sans-serif";
const MONO = "ui-monospace, SFMono-Regular, 'SF Mono', Menlo, Consolas, monospace";
// Accents are tuned for dark backgrounds; light mode uses deeper shades so text keeps its contrast.
const DEEP = { '#f97316': '#c2410c', '#a78bfa': '#7c3aed', '#facc15': '#a16207', '#38bdf8': '#0369a1',
               '#6366f1': '#4f46e5', '#f59e0b': '#b45309', '#10b981': '#047857' };
const ink = (t, c) => (t.mode === 'light' ? DEEP[c] || c : c);
const esc = (s) => s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
// Non-ASCII characters become numeric entities so the SVGs render the same
// whatever charset they are served with.
const ascii = (s) => s.replace(/[^\x00-\x7f]/gu, (c) => `&#${c.codePointAt(0)};`);
const write = (name, svg) => writeFileSync(new URL(name, OUT), ascii(svg.trim()) + '\n');

// ---------- Hero: name + a Burxt "contract" that describes me ----------
function hero(t) {
  // Each line is a list of [tokenType, text] pairs.
  const lines = [
    [['kw', 'function'], ['id', ' (self) '], ['fn', 'andre'], ['id', '() -> '], ['ty', 'Engineer']],
    [['id', '    '], ['kw', 'requires'], ['id', ' years >= '], ['num', '9'], ['cm', '      // 7 classic, 2 AI-native']],
    [['id', '    '], ['kw', 'touches'], ['id', '  laravel, react, rust, azure, aws']],
    [['id', '    '], ['kw', 'touches'], ['id', '  llm, mcp, agents']],
    [['id', '    '], ['kw', 'refuses'], ['id', '  quiet_mistakes']],
    [['id', '{ '], ['kw', 'return'], ['id', ' '], ['fn', 'ship'], ['id', '(products); }']],
  ];
  const code = lines.map((toks, i) =>
    `<text x="0" y="${i * 24}" xml:space="preserve">${toks.map(([k, s]) => `<tspan fill="${t[k]}">${esc(s)}</tspan>`).join('')}</text>`
  ).join('\n      ');
  return `
<svg xmlns="http://www.w3.org/2000/svg" width="880" height="250" viewBox="0 0 880 250" role="img" aria-label="Andre Corugda — Senior Full-Stack Engineer">
  <style>
    .cursor { animation: blink 1.1s steps(1) infinite; }
    @keyframes blink { 50% { opacity: 0; } }
    .glow { animation: pulse 4s ease-in-out infinite; }
    @keyframes pulse { 0%,100% { opacity: .55; } 50% { opacity: 1; } }
  </style>
  <defs>
    <linearGradient id="accent" x1="0" y1="0" x2="1" y2="0">
      <stop offset="0" stop-color="#f97316"/><stop offset=".5" stop-color="#a78bfa"/><stop offset="1" stop-color="#38bdf8"/>
    </linearGradient>
  </defs>
  <rect x=".5" y=".5" width="879" height="249" rx="16" fill="${t.bg}" stroke="${t.border}"/>
  <rect class="glow" x="1" y="1" width="878" height="4" rx="2" fill="url(#accent)"/>
  <g font-family="${SANS}">
    <text x="36" y="78" font-size="34" font-weight="700" fill="${t.text}">Andre Corugda</text>
    <text x="36" y="110" font-size="16" fill="${t.muted}">Senior Full-Stack Engineer</text>
    <text x="36" y="134" font-size="16" fill="${t.muted}">Product &amp; AI Architecture</text>
    <text x="36" y="168" font-size="13" fill="${t.text}" font-weight="600">Creator of Burxt · Apex JS · Synapse</text>
    <path d="M42 203a5 5 0 0 0-5 5c0 4 5 9 5 9s5-5 5-9a5 5 0 0 0-5-5z" fill="${t.muted}"/><circle cx="42" cy="208" r="1.8" fill="${t.bg}"/>
    <text x="52" y="214" font-size="12" fill="${t.muted}">Bacolod, Philippines · Remote</text>
  </g>
  <rect x="360" y="34" width="490" height="182" rx="10" fill="${t.code}" stroke="${t.border}"/>
  <circle cx="380" cy="52" r="5" fill="#ff5f57"/><circle cx="397" cy="52" r="5" fill="#febc2e"/><circle cx="414" cy="52" r="5" fill="#28c840"/>
  <text x="832" y="56" text-anchor="end" font-family="${MONO}" font-size="11" fill="${t.muted}">andre.bx</text>
  <g font-family="${MONO}" font-size="13.5" transform="translate(380 88)">
      ${code}
    <rect class="cursor" x="${'{ return ship(products); }'.length * 8.15}" y="110" width="8" height="16" fill="${t.text}"/>
  </g>
</svg>`;
}

// ---------- The Burxt stack: language -> markup -> framework -> playground ----------
function stack(t) {
  const nodes = [
    ['Burxt', 'language', '#f97316'],
    ['BMX', 'markup', '#a78bfa'],
    ['star-burxt', 'framework', '#facc15'],
    ['Comet', 'playground', '#38bdf8'],
  ];
  const w = 170, gap = 50, x0 = 25;
  const parts = nodes.map(([name, role, c], i) => {
    const x = x0 + i * (w + gap);
    const arrow = i < nodes.length - 1
      ? `<path d="M${x + w + 8} 55 h${gap - 18}" stroke="${t.muted}" stroke-width="1.5" marker-end="url(#arr)"/>`
      : '';
    return `
    <rect x="${x}" y="20" width="${w}" height="70" rx="12" fill="${t.panel}" stroke="${c}" stroke-width="1.5"/>
    <text x="${x + w / 2}" y="51" text-anchor="middle" font-size="17" font-weight="700" fill="${t.text}">${name}</text>
    <text x="${x + w / 2}" y="72" text-anchor="middle" font-size="12" fill="${ink(t, c)}" font-family="${MONO}">${role}</text>
    ${arrow}`;
  }).join('');
  return `
<svg xmlns="http://www.w3.org/2000/svg" width="880" height="110" viewBox="0 0 880 110" role="img" aria-label="The Burxt stack: Burxt language, BMX markup, star-burxt framework, Comet playground">
  <defs><marker id="arr" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="7" markerHeight="7" orient="auto"><path d="M0 0 L10 5 L0 10z" fill="${t.muted}"/></marker></defs>
  <g font-family="${SANS}">${parts}
  </g>
</svg>`;
}

// ---------- Project cards ----------
const PROJECTS = [
  { file: 'burxt', name: 'Burxt', tag: 'Contract-first programming language', color: '#f97316',
    lines: ["A function's promises live in its signature,", 'and the compiler enforces every word.'],
    chips: ['Rust', 'Compiler', 'burxt-lang.org'] },
  { file: 'star-burxt', name: 'star-burxt', tag: 'Front-end framework in Burxt', color: '#facc15',
    lines: ['A .sbmx document is the component:', 'markup and logic, compiled to WebAssembly.'],
    chips: ['WebAssembly', 'Burxt', 'star.burxt-lang.org'] },
  { file: 'bmx', name: 'BMX', tag: 'Burxt Markup Language', color: '#a78bfa',
    lines: ['Markdown with one reading and a typed hole.', 'It refuses to be nearly right.'],
    chips: ['Markup', 'JavaScript', 'bmx.burxt-lang.org'] },
  { file: 'comet', name: 'Comet', tag: 'Code playground', color: '#38bdf8',
    lines: ['One embeddable, client-only playground', 'for Burxt, BMX and star-burxt.'],
    chips: ['Playground', 'JavaScript', 'Embeddable'] },
  { file: 'apexjs', name: 'Apex JS', tag: 'AI-native meta-framework for Alpine.js', color: '#6366f1',
    lines: ['File routing, SSR and islands, and every', 'typed API route is also an MCP tool.'],
    chips: ['TypeScript', 'MCP', 'apex-js.site'] },
  { file: 'synapse', name: 'Synapse', tag: 'App builder for Laravel + Filament', color: '#f59e0b',
    lines: ['Visual pages, typed collections + REST,', 'n8n-style flows, SSO/2FA, AI companion.'],
    chips: ['PHP', 'Filament plugin', 'synapse-app.site'] },
  { file: 'ai-gateway', name: 'AI OpenRouter Gateway', tag: 'AI gateway for Laravel', color: '#10b981',
    lines: ['Versioned, runtime-tunable AI features', 'with rate and cost limits and an admin UI.'],
    chips: ['PHP', 'OpenRouter', 'Filament plugin'] },
];

function card(t, p) {
  let cx = 24;
  const chips = p.chips.map((c) => {
    const w = Math.round(c.length * 6.6 + 18);
    const out = `<rect x="${cx}" y="128" width="${w}" height="22" rx="11" fill="${t.panel}" stroke="${t.border}"/>
    <text x="${cx + w / 2}" y="143" text-anchor="middle" font-size="11" fill="${t.muted}">${esc(c)}</text>`;
    cx += w + 6;
    return out;
  }).join('\n    ');
  return `
<svg xmlns="http://www.w3.org/2000/svg" width="420" height="170" viewBox="0 0 420 170" role="img" aria-label="${esc(p.name)} — ${esc(p.tag)}">
  <rect x=".5" y=".5" width="419" height="169" rx="14" fill="${t.bg}" stroke="${t.border}"/>
  <rect x="1" y="14" width="4" height="40" rx="2" fill="${p.color}"/>
  <g font-family="${SANS}">
    <circle cx="30" cy="34" r="6" fill="${p.color}"/>
    <text x="44" y="40" font-size="19" font-weight="700" fill="${t.text}">${esc(p.name)}</text>
    <text x="24" y="66" font-size="12.5" font-weight="600" fill="${ink(t, p.color)}">${esc(p.tag)}</text>
    <text x="24" y="92" font-size="13" fill="${t.muted}">${esc(p.lines[0])}</text>
    <text x="24" y="110" font-size="13" fill="${t.muted}">${esc(p.lines[1])}</text>
    ${chips}
  </g>
</svg>`;
}

// ---------- AI toolkit strip (things skillicons.dev doesn't have) ----------
function aiStrip(t) {
  const items = ['Model Context Protocol', 'Claude', 'OpenAI', 'OpenRouter', 'Codex', 'RAG', 'AI Agents', 'Playwright', 'Jira'];
  let x = 0;
  const chips = items.map((c) => {
    const w = Math.round(c.length * 7.1 + 24);
    const out = `<rect x="${x + .5}" y=".5" width="${w}" height="30" rx="15" fill="${t.panel}" stroke="${t.border}"/>
  <text x="${x + w / 2}" y="20" text-anchor="middle" font-size="12.5" fill="${t.text}">${esc(c)}</text>`;
    x += w + 8;
    return out;
  }).join('\n  ');
  return `
<svg xmlns="http://www.w3.org/2000/svg" width="${x}" height="32" viewBox="0 0 ${x} 32" role="img" aria-label="AI toolkit: ${items.join(', ')}">
  <g font-family="${SANS}">
  ${chips}
  </g>
</svg>`;
}

for (const [mode, t] of Object.entries(THEMES)) {
  write(`hero-${mode}.svg`, hero(t));
  write(`stack-${mode}.svg`, stack(t));
  write(`ai-${mode}.svg`, aiStrip(t));
  for (const p of PROJECTS) write(`card-${p.file}-${mode}.svg`, card(t, p));
}
console.log('assets written');
