// Atelier : l'IDE intégré de NeoDex. Explorateur de projets, éditeur avec coloration (HTML, CSS, JavaScript, Python, JSON, Markdown),
// aperçu instantané des pages web, console, bac à sable JavaScript, exécution de Python (si Python est installé sur le PC),
// modèles de projets, création / test / validation / export de plugins NeoDex.
// Les projets sont dans le dossier du plugin (sauvegardé et synchronisé par NeoDex). Ton code ne tourne jamais dans NeoDex : toujours dans un cadre isolé.
const CSS = `
.ide{--bg:#0d0620;--bg2:#120a2c;--bg3:#1a1240;--line:#3a2a6e;--hi:#8a5cf0;--acc:#ff5ad9;--txt:#f3eaff;--sub:#9a88c4;--ok:#5be37d;--warn:#ffd07a;--err:#ff6b6b;display:flex;flex-direction:column;gap:8px;height:calc(100vh - 110px);min-height:520px;color:var(--txt);font-family:var(--text,'Pixelify Clair',monospace);font-size:14px}
.ide *{box-sizing:border-box;scrollbar-width:thin;scrollbar-color:var(--line) var(--bg)}
.ide button{font:inherit;color:inherit;cursor:var(--cp,pointer)}
.ide-bar{display:flex;gap:6px;align-items:center;flex-wrap:wrap;padding:6px 8px;background:var(--bg3);box-shadow:0 0 0 2px var(--line),0 3px 0 2px #05010b}
.ide-b{border:0;background:#241a52;padding:6px 10px;font-weight:600;font-size:13px;box-shadow:0 0 0 2px var(--line),0 3px 0 2px #05010b;margin:0 2px 3px 0;white-space:nowrap}
.ide-b:hover{background:#2f2268;box-shadow:0 0 0 2px var(--hi),0 3px 0 2px #05010b}.ide-b:active{transform:translateY(2px)}
.ide-b.run{background:var(--ok);color:#06240f}.ide-b.acc{background:var(--acc);color:#2a0a28}.ide-b.sm{padding:3px 7px;font-size:12px}
.ide-b[disabled]{opacity:.4;pointer-events:none}
.ide-sel,.ide-in{background:#0a0418;border:0;color:#fff;padding:6px 8px;font:inherit;box-shadow:inset 0 0 0 2px var(--line);outline:0}.ide-in:focus,.ide-sel:focus{box-shadow:inset 0 0 0 2px var(--hi)}
.ide-main{flex:1;min-height:0;display:grid;grid-template-columns:200px minmax(0,1fr) var(--rw,42%);gap:8px}
.ide-pane{background:var(--bg2);box-shadow:0 0 0 2px var(--line),0 3px 0 2px #05010b;display:flex;flex-direction:column;min-height:0;min-width:0}
.ide-ph{display:flex;align-items:center;gap:6px;padding:6px 8px;background:var(--bg3);font:9px var(--title,monospace);letter-spacing:1px;color:var(--acc);text-transform:uppercase;flex:none}
.ide-tree{flex:1;overflow:auto;padding:4px 0}
.ide-f{display:flex;align-items:center;gap:6px;padding:4px 8px;white-space:nowrap;cursor:var(--cp,pointer);font-size:13px}
.ide-f:hover{background:#241a52}.ide-f.on{background:var(--hi);color:#fff}
.ide-f i{font-style:normal;width:16px;text-align:center;font-size:10px;font-weight:800;color:#10061c;background:var(--c,#9a88c4);padding:1px 0}
.ide-f .x{margin-left:auto;opacity:0;font-size:11px}.ide-f:hover .x{opacity:.8}
.ide-tabs{display:flex;overflow-x:auto;flex:none;background:var(--bg3)}
.ide-t{display:flex;align-items:center;gap:6px;padding:6px 10px;border:0;background:none;white-space:nowrap;font-size:13px;color:var(--sub);border-bottom:3px solid transparent}
.ide-t.on{color:#fff;background:var(--bg2);border-bottom-color:var(--acc)}.ide-t b{font-weight:800;color:var(--warn)}
.ide-ed{position:relative;flex:1;min-height:0;display:flex;background:#0b0520}
.ide-gut{flex:none;width:44px;overflow:hidden;padding:8px 6px 8px 0;text-align:right;color:#5e4d85;font:var(--fs,13px)/var(--lh,19px) Consolas,'Courier New',monospace;user-select:none;background:#0d0626;white-space:pre}
.ide-code{position:relative;flex:1;min-width:0}
.ide-code pre,.ide-code textarea{position:absolute;inset:0;margin:0;padding:8px 10px;font:var(--fs,13px)/var(--lh,19px) Consolas,'Courier New',monospace;white-space:pre;overflow:auto;tab-size:2;border:0;outline:0;letter-spacing:0}
.ide-code pre{pointer-events:none;color:#e8def8;background:none}
.ide-code textarea{color:transparent;caret-color:#fff;background:transparent;resize:none;-webkit-text-fill-color:transparent}
.ide-code textarea::selection{background:rgba(138,92,240,.45);-webkit-text-fill-color:transparent}
.t-k{color:#ff79c6}.t-s{color:#f1fa8c}.t-c{color:#6b6199;font-style:italic}.t-n{color:#ffb86c}.t-f{color:#8be9fd}.t-t{color:#ff79c6}.t-a{color:#50fa7b}.t-p{color:#8be9fd}.t-v{color:#bd93f9}.t-h{color:#ff5ad9;font-weight:700}.t-o{color:#ff9ec1}
.ide-find{display:none;gap:6px;align-items:center;padding:5px 8px;background:var(--bg3);flex:none;flex-wrap:wrap}.ide-find.on{display:flex}
.ide-right{display:grid;grid-template-rows:minmax(0,1.3fr) minmax(0,1fr);gap:8px;min-height:0;min-width:0}
.ide-prev{flex:1;border:0;background:#fff;min-height:0;width:100%}
.ide-prev-empty{flex:1;display:grid;place-items:center;color:var(--sub);text-align:center;padding:14px;line-height:1.5;background:#0b0520}
.ide-con{flex:1;overflow:auto;padding:6px 8px;font:12px/1.5 Consolas,'Courier New',monospace;white-space:pre-wrap;word-break:break-word}
.ide-con div{padding:1px 0;border-bottom:1px dashed #2a1d52}.ide-con .e{color:var(--err)}.ide-con .w{color:var(--warn)}.ide-con .i{color:var(--sub)}.ide-con .o{color:var(--ok)}
.ide-conin{display:flex;gap:6px;padding:5px;background:var(--bg3);flex:none}.ide-conin input{flex:1}
.ide-val div{padding:5px 8px;border-bottom:1px dashed #2a1d52;font-size:13px;line-height:1.35}.ide-val .e{color:var(--err)}.ide-val .w{color:var(--warn)}.ide-val .o{color:var(--ok)}
.ide-mod{position:fixed;inset:0;z-index:300;background:rgba(5,1,12,.82);display:grid;place-items:center;padding:12px}
.ide-box{background:var(--bg2);box-shadow:0 0 0 3px var(--hi),0 8px 0 3px #05010b;padding:16px;width:min(620px,96vw);max-height:90vh;overflow:auto;display:flex;flex-direction:column;gap:10px}
.ide-box h3{margin:0;font:12px var(--title,monospace);color:var(--acc);line-height:1.5}
.ide-tpls{display:grid;grid-template-columns:repeat(auto-fill,minmax(180px,1fr));gap:8px}
.ide-tpl{border:0;background:var(--bg3);padding:10px;text-align:left;box-shadow:0 0 0 2px var(--line);display:flex;flex-direction:column;gap:4px}.ide-tpl:hover{box-shadow:0 0 0 2px var(--hi)}.ide-tpl b{color:#fff}.ide-tpl span{color:var(--sub);font-size:12px;line-height:1.35}
.ide-split{cursor:col-resize}
@media (max-width:1100px){.ide{height:auto}.ide-main{grid-template-columns:170px minmax(0,1fr);grid-template-rows:minmax(320px,calc(100vh - 210px)) 340px}.ide-right{grid-column:1/-1;grid-template-rows:minmax(0,1fr) minmax(0,1fr)}}
.ide-status{flex:none;display:flex;gap:10px;padding:4px 10px;background:var(--bg3);font-size:12px;color:var(--sub);white-space:nowrap;overflow:hidden;box-shadow:inset 0 2px 0 var(--line)}
.ide-cur{position:absolute;left:0;right:0;background:rgba(138,92,240,.12);box-shadow:inset 3px 0 0 var(--acc);pointer-events:none}
.ide-pal{display:flex;flex-direction:column;max-height:50vh;overflow-y:auto;box-shadow:inset 0 0 0 2px var(--line)}
.ide-pi{border:0;background:none;text-align:left;padding:6px 10px;font-size:13px;white-space:nowrap;overflow:hidden;text-overflow:ellipsis}
.ide-pi:hover,.ide-pi.on{background:var(--hi);color:#fff} .ide-pi em{font-style:normal;color:var(--sub);margin-right:8px}
.ide-pane.drop{box-shadow:0 0 0 2px var(--acc),0 3px 0 2px #05010b}
.ide-bar{background:repeating-linear-gradient(90deg,var(--bg3) 0 8px,#1e1548 8px 10px)}
.ide-ph::before{content:'';width:6px;height:6px;background:var(--acc);box-shadow:2px 2px 0 #8a1a7a;flex:none}
.ide-logo{font:10px var(--title,monospace);color:#fff;text-shadow:2px 2px 0 var(--acc);padding:0 8px 0 2px;letter-spacing:1px}
.ide-ac{position:absolute;z-index:6;min-width:240px;max-width:440px;max-height:228px;overflow-y:auto;background:var(--bg3);box-shadow:0 0 0 2px var(--hi),0 4px 0 2px #05010b;display:flex;flex-direction:column}
.ide-ac .ide-pi{padding:4px 10px;font:var(--fs,13px) Consolas,'Courier New',monospace}
.ide-bm{position:absolute;pointer-events:none;box-shadow:inset 0 0 0 1px var(--acc);background:rgba(255,90,217,.18)}
.ide-gut .gx{color:#fff;background:var(--err)}.ide-gut .gw{color:#10061c;background:var(--warn)}
.ide-status>span:first-child{overflow:hidden;text-overflow:ellipsis}
.ide-prob{border:0;background:none;padding:0;margin-left:auto;color:var(--ok);font-size:12px;flex:none}.ide-prob.bad{color:var(--err)}
.ide-diff{font:12px/1.5 Consolas,'Courier New',monospace;white-space:pre;overflow:auto;max-height:56vh;background:#0b0520;box-shadow:inset 0 0 0 2px var(--line);padding:6px 0}
.ide-diff div{padding:0 10px}.ide-diff .a{background:rgba(91,227,125,.16);color:#c6f7d3}.ide-diff .d{background:rgba(255,107,107,.16);color:#ffcaca}.ide-diff .g{color:var(--sub)}
.ide-git{display:flex;flex-direction:column;max-height:40vh;overflow-y:auto;box-shadow:inset 0 0 0 2px var(--line)}
.ide-git .ide-pi em{display:inline-block;width:26px;color:var(--warn)}
.ide-row{display:flex;gap:6px;flex-wrap:wrap;align-items:center}.ide-row .ide-in{flex:1;min-width:160px}
`;
const EXT_COL = { html: '#ff8a5c', css: '#5cb8ff', js: '#ffd45c', json: '#5be37d', py: '#8be9fd', md: '#c070ff', txt: '#9a88c4', png: '#ff5ad9' };
const extOf = p => (p.split('.').pop() || '').toLowerCase();
const langOf = p => ({ html: 'html', htm: 'html', css: 'css', js: 'js', mjs: 'js', json: 'json', py: 'py', md: 'md' })[extOf(p)] || 'txt';
const esc = s => s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
/* ---------- syntax colouring: one pass of a regex per language, every match becomes a span ---------- */
const JS_KW = 'abstract|async|await|break|case|catch|class|const|continue|debugger|default|delete|do|else|export|extends|finally|for|from|function|if|import|in|instanceof|let|new|of|return|static|super|switch|this|throw|try|typeof|var|void|while|with|yield|null|undefined|true|false|NaN|Infinity';
const PY_KW = 'and|as|assert|async|await|break|class|continue|def|del|elif|else|except|finally|for|from|global|if|import|in|is|lambda|nonlocal|not|or|pass|raise|return|try|while|with|yield|None|True|False|self';
const RULES = {
  js: [['c', /\/\/[^\n]*|\/\*[\s\S]*?\*\//y], ['s', /`(?:\\[\s\S]|[^`\\])*`|"(?:\\.|[^"\\\n])*"|'(?:\\.|[^'\\\n])*'/y], ['n', /\b(?:0x[\da-f]+|\d+\.?\d*(?:e[+-]?\d+)?)\b/iy], ['k', new RegExp('\\b(?:' + JS_KW + ')\\b', 'y')], ['f', /[A-Za-z_$][\w$]*(?=\s*\()/y]],
  py: [['c', /#[^\n]*/y], ['s', /(?:[rbfu]|rb|br|fr|rf)?(?:"""[\s\S]*?"""|'''[\s\S]*?'''|"(?:\\.|[^"\\\n])*"|'(?:\\.|[^'\\\n])*')/iy], ['n', /\b\d+\.?\d*\b/y], ['k', new RegExp('\\b(?:' + PY_KW + ')\\b', 'y')], ['a', /@[A-Za-z_][\w.]*/y], ['f', /[A-Za-z_]\w*(?=\s*\()/y]],
  css: [['c', /\/\*[\s\S]*?\*\//y], ['s', /"(?:\\.|[^"\\\n])*"|'(?:\\.|[^'\\\n])*'/y], ['n', /#[\da-f]{3,8}\b|-?\d+\.?\d*(?:px|em|rem|%|vh|vw|s|ms|deg|fr)?/iy], ['k', /@[\w-]+/y], ['p', /[\w-]+(?=\s*:)/y], ['t', /[.#]?[A-Za-z_][\w-]*(?=[^{};]*\{)/y]],
  json: [['p', /"(?:\\.|[^"\\\n])*"(?=\s*:)/y], ['s', /"(?:\\.|[^"\\\n])*"/y], ['n', /-?\d+\.?\d*(?:e[+-]?\d+)?/iy], ['k', /\b(?:true|false|null)\b/y]],
  md: [['h', /^#{1,6}[^\n]*/my], ['s', /`[^`\n]+`|```[\s\S]*?```/y], ['k', /\*\*[^*\n]+\*\*|__[^_\n]+__/y], ['t', /\[[^\]\n]*\]\([^)\n]*\)/y], ['o', /^\s*(?:[-*+]|\d+\.)\s/my]],
};
const hlRules = (lang, text) => {
  const rules = RULES[lang]; if (!rules) return esc(text);
  let out = '', i = 0, plain = 0; const flush = () => { if (plain < i) out += esc(text.slice(plain, i)); };
  while (i < text.length) {
    let hit = null;
    for (const [cls, re] of rules) { re.lastIndex = i; const m = re.exec(text); if (m && m[0]) { hit = [cls, m[0]]; break; } }
    if (hit) { flush(); out += '<span class="t-' + hit[0] + '">' + esc(hit[1]) + '</span>'; i += hit[1].length; plain = i; }
    else { const ch = text[i]; i += /[A-Za-z0-9_$]/.test(ch) ? (/[A-Za-z_$]/.test(ch) ? (text.slice(i).match(/^[\w$]+/)[0].length) : (text.slice(i).match(/^\d[\w.]*/)?.[0].length || 1)) : 1; }
  }
  flush(); out += ''; return out;
};
// tags are escaped by a second pass: the pieces above are already safe text except for the angle brackets of the tag itself
const highlight = (lang, text) => lang === 'html' ? htmlSafe(text) : hlRules(lang, text);
function htmlSafe(text) {
  // simple and safe: tokenise tags, comments and the content of script / style by hand
  let out = '', i = 0; const n = text.length;
  while (i < n) {
    if (text.startsWith('<!--', i)) { const e = text.indexOf('-->', i + 4); const j = e < 0 ? n : e + 3; out += '<span class="t-c">' + esc(text.slice(i, j)) + '</span>'; i = j; continue; }
    if (text[i] === '<' && /[A-Za-z\/!]/.test(text[i + 1] || '')) {
      let j = i + 1, q = ''; while (j < n) { const ch = text[j]; if (q) { if (ch === q) q = ''; } else if (ch === '"' || ch === "'") q = ch; else if (ch === '>') break; j++; }
      const tag = text.slice(i, j + 1), m = /^(<\/?)([A-Za-z][\w:-]*|!doctype)?([\s\S]*?)(\/?>?)$/i.exec(tag);
      if (m) {
        let attrs = esc(m[3]).replace(/([\w:@.-]+)(=)?(&quot;[^&]*&quot;|"[^"]*"|'[^']*')?/g, (all, a, eq, v) => '<span class="t-a">' + a + '</span>' + (eq || '') + (v ? '<span class="t-s">' + v + '</span>' : ''));
        out += esc(m[1]) + (m[2] ? '<span class="t-t">' + esc(m[2]) + '</span>' : '') + attrs + esc(m[4]);
        i = j + 1;
        const sc = /^<(script|style)\b/i.exec(tag);
        if (sc && !tag.endsWith('/>') && m[1] === '<') { const re = new RegExp('</' + sc[1] + '\\s*>', 'ig'); re.lastIndex = i; const c = re.exec(text), end = c ? c.index : n; const body = text.slice(i, end); out += sc[1].toLowerCase() === 'style' ? hlRules('css', body) : hlRules('js', body); i = end; }
        continue;
      }
    }
    const j = text.indexOf('<', i + 1); const e = j < 0 ? n : j; out += esc(text.slice(i, e)); i = e;
  }
  return out;
}
/* ---------- ZIP (store, no compression) and small PNG icon, for exporting a plugin ---------- */
const CRC = (() => { const t = new Uint32Array(256); for (let n = 0; n < 256; n++) { let c = n; for (let k = 0; k < 8; k++) c = c & 1 ? 0xEDB88320 ^ (c >>> 1) : c >>> 1; t[n] = c >>> 0; } return b => { let c = 0xFFFFFFFF; for (let i = 0; i < b.length; i++) c = t[(c ^ b[i]) & 255] ^ (c >>> 8); return (c ^ 0xFFFFFFFF) >>> 0; }; })();
const zip = files => {   // files: [{name, data: Uint8Array}]
  const enc = new TextEncoder(), parts = [], cen = []; let off = 0;
  const u16 = n => [n & 255, (n >> 8) & 255], u32 = n => [n & 255, (n >> 8) & 255, (n >> 16) & 255, (n >>> 24) & 255];
  for (const f of files) {
    const name = enc.encode(f.name), crc = CRC(f.data), hd = new Uint8Array([0x50, 0x4b, 3, 4, 20, 0, 0, 8, 0, 0, 0, 0, 33, 0, ...u32(crc), ...u32(f.data.length), ...u32(f.data.length), ...u16(name.length), 0, 0]);
    parts.push(hd, name, f.data); cen.push({ name, crc, size: f.data.length, off }); off += hd.length + name.length + f.data.length;
  }
  const cstart = off; for (const c of cen) { const h = new Uint8Array([0x50, 0x4b, 1, 2, 20, 0, 20, 0, 0, 8, 0, 0, 0, 0, 33, 0, ...u32(c.crc), ...u32(c.size), ...u32(c.size), ...u16(c.name.length), 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, ...u32(c.off)]); parts.push(h, c.name); off += h.length + c.name.length; }
  parts.push(new Uint8Array([0x50, 0x4b, 5, 6, 0, 0, 0, 0, ...u16(cen.length), ...u16(cen.length), ...u32(off - cstart), ...u32(cstart), 0, 0]));
  return new Blob(parts, { type: 'application/zip' });
};
const identicon = seed => {   // a 64 x 64 pixel-art icon drawn from the plugin id
  let h = 0; for (const ch of seed) h = (Math.imul(h, 31) + ch.charCodeAt(0)) >>> 0; const rnd = () => { h = (Math.imul(h, 1103515245) + 12345) >>> 0; return h / 4294967296; };
  const cv = document.createElement('canvas'); cv.width = cv.height = 64; const g = cv.getContext('2d'), hue = Math.floor(rnd() * 360);
  g.fillStyle = `hsl(${hue},40%,16%)`; g.fillRect(0, 0, 64, 64); g.fillStyle = `hsl(${hue},70%,62%)`; for (let y = 0; y < 8; y++) for (let x = 0; x < 4; x++) if (rnd() < .5) { g.fillRect(8 + x * 6, 8 + y * 6, 6, 6); g.fillRect(8 + (7 - x) * 6, 8 + y * 6, 6, 6); }
  g.fillStyle = `hsl(${(hue + 40) % 360},80%,75%)`; g.fillRect(8, 56, 48, 2); return cv.toDataURL('image/png');
};
const b64bytes = url => { const s = atob(url.split(',')[1]), u = new Uint8Array(s.length); for (let i = 0; i < s.length; i++) u[i] = s.charCodeAt(i); return u; };
/* ---------- templates ---------- */
const PJ = (id, name, extra = {}) => JSON.stringify({ id, name, version: '1.0.0', author: 'MonPseudo', description: 'Décris ici ce que fait ton plugin en une phrase.', icon: 'icon.png', entry: 'index.js', view: id.split('.').pop(), neobase: '>=4.1.0', type: 'app', category: 'Outils', mobile: false, system: false, dependencies: {}, permissions: ['storage'], ...extra }, null, 2) + '\n';
const TEMPLATES = [
  { id: 'web', name: 'Page web', d: 'HTML, CSS et JavaScript avec aperçu instantané.', files: {
    'index.html': '<!doctype html>\n<html lang="fr">\n<head>\n  <meta charset="utf-8">\n  <title>Ma page</title>\n  <link rel="stylesheet" href="style.css">\n</head>\n<body>\n  <h1>Bonjour !</h1>\n  <p>Clique sur le bouton :</p>\n  <button id="b">Compter</button>\n  <p id="n">0</p>\n  <script src="app.js"></script>\n</body>\n</html>\n',
    'style.css': 'body {\n  font-family: system-ui, sans-serif;\n  background: #1b1238;\n  color: #f3eaff;\n  text-align: center;\n  padding: 40px;\n}\nbutton {\n  font-size: 20px;\n  padding: 10px 24px;\n  background: #ff5ad9;\n  border: 0;\n  cursor: pointer;\n}\n',
    'app.js': 'let n = 0;\ndocument.getElementById("b").onclick = () => {\n  n++;\n  document.getElementById("n").textContent = n;\n  console.log("clic n°" + n);\n};\n' } },
  { id: 'js', name: 'Script JavaScript', d: 'Un script exécuté dans un bac à sable, avec la console.', files: { 'main.js': '// Exécuté dans un bac à sable : pas d\'accès à NeoDex ni à tes fichiers.\nconst carres = [1, 2, 3, 4, 5].map(n => n * n);\nconsole.log("Carrés :", carres);\n\nasync function attendre(ms) { return new Promise(r => setTimeout(r, ms)); }\nawait attendre(300);\nconsole.log("Terminé !");\n' } },
  { id: 'py', name: 'Script Python', d: 'Exécuté avec le Python installé sur ton PC.', files: { 'main.py': '# Nécessite Python 3 installé sur le PC.\nimport math\n\ndef cercle(r):\n    return math.pi * r ** 2\n\nfor r in (1, 2, 3):\n    print(f"rayon {r} -> aire {cercle(r):.2f}")\n' } },
  { id: 'plug', name: 'Plugin : bonjour', d: 'Le plus petit plugin NeoDex, prêt à tester.', files: {
    'plugin.json': PJ('moi.bonjour', 'Bonjour', { permissions: [] }),
    'index.js': "export default async function (ctx) {\n  const box = ctx.el('div', 'hello');\n  box.style.cssText = 'padding:24px;font-size:22px';\n  box.textContent = 'Bonjour depuis ' + ctx.id + ' !';\n  ctx.view.append(box);\n}\n",
    'README.md': '# Bonjour\n\nUn plugin d\'exemple.\n' } },
  { id: 'plug2', name: 'Plugin : compteur', d: 'Un plugin qui sauvegarde ses données dans son dossier.', files: {
    'plugin.json': PJ('moi.compteur', 'Compteur'),
    'index.js': "export default async function (ctx) {\n  const saved = (await ctx.folder.read('compteur')) || { n: 0 };\n  const box = ctx.el('div');\n  box.style.cssText = 'padding:24px;display:flex;gap:14px;align-items:center;font-size:22px';\n  const txt = ctx.el('span', '', 'Compteur : ' + saved.n);\n  const btn = ctx.el('button', 'btn', '+1');\n  btn.onclick = async () => { saved.n++; txt.textContent = 'Compteur : ' + saved.n; await ctx.folder.write('compteur', saved); };\n  box.append(txt, btn); ctx.view.append(box);\n}\n",
    'README.md': '# Compteur\n\nSauvegarde son compteur avec `ctx.folder`.\n' } },
  { id: 'plug3', name: 'Plugin : jeu canvas', d: 'Une boucle de jeu 2D qui s\'arrête quand on ferme l\'onglet.', files: {
    'plugin.json': PJ('moi.rebond', 'Rebond', { category: 'Jeux', permissions: ['storage'] }),
    'index.js': "export default async function (ctx) {\n  const cv = document.createElement('canvas'); cv.width = 480; cv.height = 300; cv.style.cssText = 'image-rendering:pixelated;background:#0a0418;box-shadow:0 0 0 3px #3a2a6e';\n  ctx.view.append(cv); const g = cv.getContext('2d');\n  const ball = { x: 240, y: 150, vx: 140, vy: 90 }; let last = performance.now(), raf = 0, score = 0;\n  cv.onclick = () => { ball.vx *= -1.05; score++; };\n  const frame = t => {\n    const dt = Math.min(.05, (t - last) / 1000); last = t;\n    ball.x += ball.vx * dt; ball.y += ball.vy * dt;\n    if (ball.x < 8 || ball.x > 472) ball.vx *= -1; if (ball.y < 8 || ball.y > 292) ball.vy *= -1;\n    g.fillStyle = '#0a0418'; g.fillRect(0, 0, 480, 300); g.fillStyle = '#ff5ad9'; g.fillRect(ball.x - 8, ball.y - 8, 16, 16);\n    g.fillStyle = '#fff'; g.font = '14px monospace'; g.fillText('Clics : ' + score, 10, 20);\n    raf = requestAnimationFrame(frame);\n  };\n  raf = requestAnimationFrame(frame);\n  ctx.onClose(() => cancelAnimationFrame(raf));\n}\n",
    'README.md': '# Rebond\n\nUne balle qui rebondit. Clique dessus pour la relancer.\n' } },
  { id: 'plug4', name: 'Plugin : widget d\'accueil', d: 'Une carte sur l\'accueil de NeoDex, mise à jour toutes les 15 min.', files: {
    'plugin.json': PJ('moi.widget', 'Mon widget', { permissions: ['storage', 'background'], widget: true }),
    'index.js': "export default async function (ctx) {\n  // la carte sur l'accueil : un titre et quelques lignes\n  const maj = () => ctx.widget.set({ title: 'Mon widget', lines: ['Il est ' + new Date().toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' }), 'Modifie index.js pour afficher autre chose'] });\n  maj();\n  ctx.background.every(15, maj);\n  const box = ctx.el('div'); box.style.cssText = 'padding:24px'; box.textContent = 'Regarde l\\'accueil : ta carte y est.';\n  ctx.view.replaceChildren(box);\n}\n",
    'README.md': '# Mon widget\n\nUne carte sur l\'accueil (`ctx.widget`), mise à jour en arrière-plan (`ctx.background`).\n' } },
  { id: 'plug5', name: 'Plugin : notifications', d: 'Envoie des notifications avec une image ; leurs types sont décrits dans plugin.json.', files: {
    'plugin.json': PJ('moi.rappel', 'Rappel', { permissions: ['storage', 'notifications'], notifications: [{ type: 'rappel', name: 'Rappel', description: 'Le rappel que tu programmes dans le plugin.' }] }),
    'index.js': "export default async function (ctx) {\n  const b = ctx.el('button', 'btn main px', 'M\\'ENVOYER UNE NOTIFICATION');\n  b.onclick = () => ctx.notifications.send({ type: 'rappel', title: 'Coucou !', body: 'Une notification de test, avec son type.', open: 'plugin:' + ctx.id });\n  const box = ctx.el('div'); box.style.cssText = 'padding:24px'; box.append(b);\n  ctx.view.replaceChildren(box);\n}\n",
    'README.md': '# Rappel\n\nEnvoie une notification (`ctx.notifications.send`). Ses types sont décrits dans `plugin.json` (`notifications`) : on peut les couper dans l\'appli Notifications.\n' } },
  { id: 'vide', name: 'Projet vide', d: 'Un seul fichier texte.', files: { 'notes.md': '# Notes\n\n' } },
];
const KNOWN_PERMS = ['storage', 'files', 'network', 'clipboard', 'notifications', 'background', 'agenda', 'full'];
const CATEGORIES = ['Jeux', 'Outils', 'Système', 'Bureautique', 'Communication', 'Voyage', 'Musique', 'Sport', 'Compagnon', 'Anime', 'Finance', 'NeoDle'];
const ID_RE = /^[a-z0-9]+(\.[a-z0-9]+)+$/;   // la même règle que le chargeur de NeoDex
const SEMVER = /^\d+\.\d+\.\d+$/;
function validatePlugin(files) {
  const out = [], add = (lvl, msg) => out.push({ lvl, msg });
  if (!files['plugin.json']) { add('e', 'plugin.json manquant : ce projet n\'est pas un plugin.'); return out; }
  let m; try { m = JSON.parse(files['plugin.json']); } catch (e) { add('e', 'plugin.json n\'est pas du JSON valide : ' + e.message); return out; }
  const need = (k, f, msg) => { if (!f(m[k])) add('e', msg); else return true; };
  need('id', v => typeof v === 'string' && ID_RE.test(v), 'id : minuscules et chiffres, de la forme auteur.nom (ex. moi.compteur), sans tiret.') && add('o', 'id « ' + m.id + ' » valide');
  need('name', v => typeof v === 'string' && v.trim() && v.length <= 40, 'name : obligatoire, 40 caractères au plus.');
  need('version', v => SEMVER.test(v || ''), 'version : au format MAJEUR.MINEUR.CORRECTIF (ex. 1.0.0).') && add('o', 'version ' + m.version);
  need('author', v => typeof v === 'string' && v.trim(), 'author : obligatoire.');
  if (!(typeof m.description === 'string' && m.description.length >= 10)) add('w', 'description : une phrase de 10 caractères au moins.'); else if (m.description.length > 200) add('w', 'description : 200 caractères au plus.');
  need('entry', v => typeof v === 'string' && v in files, 'entry : le fichier « ' + (m.entry || 'index.js') + ' » est absent du projet.');
  need('view', v => typeof v === 'string' && /^[a-z0-9-]+$/.test(v), 'view : identifiant en minuscules, chiffres et tirets.');
  if (!['app', 'mod'].includes(m.type)) add('e', 'type : « app » ou « mod ».');
  if (typeof m.neobase !== 'string' || !/^[<>=^~\d.\sx*|-]+$/.test(m.neobase)) add('e', 'neobase : une plage de versions comme >=4.1.0.');
  if (m.category && !CATEGORIES.includes(m.category)) add('w', 'category « ' + m.category + ' » : inconnue de NeoStore (' + CATEGORIES.slice(0, 5).join(', ') + '…).');
  const perms = Array.isArray(m.permissions) ? m.permissions : (add('e', 'permissions : une liste (peut être vide).'), []);
  for (const p of perms) if (!KNOWN_PERMS.includes(p) && !/^network:[\w.-]+$/.test(p)) add('e', 'permission inconnue : « ' + p + ' ».');
  if (m.notifications != null) { if (!Array.isArray(m.notifications)) add('e', 'notifications : une liste de { type, name, description }.'); else for (const t of m.notifications) if (!/^[a-z0-9-]{1,40}$/.test(t?.type || '')) add('e', 'notifications : chaque type a un « type » en minuscules (lettres, chiffres, tirets).'); if (!perms.includes('notifications')) add('w', 'des types de notification sans la permission « notifications ».'); }
  if (perms.includes('full')) add('w', '« full » (accès complet) : réservé aux plugins signés par NeoDex, demandé avec un avertissement.');
  if (m.dependencies && (typeof m.dependencies !== 'object' || Object.entries(m.dependencies).some(([k, v]) => !ID_RE.test(k) || typeof v !== 'string'))) add('e', 'dependencies : { "id.plugin": ">=1.0.0" }.');
  if (m.main && !(m.main in files)) add('e', 'main : le fichier « ' + m.main + ' » est absent.');
  if (!(m.icon in files) && !files['icon.png']) add('w', 'icône absente : l\'export en génère une automatiquement (remplace-la par la tienne : icon.png).');
  if (!files['README.md']) add('w', 'README.md absent : conseillé pour NeoStore.');
  const src = files[m.entry || 'index.js']; m.entry = m.entry || 'index.js';
  if (typeof src === 'string') {
    if (!/export\s+default\s+(async\s+)?function/.test(src)) add('e', m.entry + ' : il faut « export default async function (ctx) { … } ».');
    try { new Function('return async function __p(){' + src.replace(/export\s+default\s+(async\s+)?function\s*\w*/, 'return (async function') .replace(/\}\s*$/, '})') + '}'); add('o', m.entry + ' : syntaxe correcte'); } catch (e) {
      try { new Function(src.replace(/export\s+default\s+(async\s+)?function\s*\w*/, 'async function __main')); add('o', m.entry + ' : syntaxe correcte'); } catch (e2) { add('e', m.entry + ' : erreur de syntaxe — ' + e2.message); }
    }
    if (/\beval\s*\(|new\s+Function\s*\(/.test(src)) add('w', m.entry + ' : eval / new Function — refusé à l\'examen.');
    if (/document\.cookie|localStorage|sessionStorage|indexedDB/.test(src)) add('w', m.entry + ' : n\'utilise pas le stockage du navigateur ; utilise ctx.folder (sauvegardé et synchronisé).');
    if (/ctx\.folder|ctx\.storage/.test(src) && !perms.includes('storage') && !perms.includes('full')) add('e', 'ctx.folder utilisé sans la permission « storage ».');
    if (/\bfetch\s*\(|XMLHttpRequest|WebSocket/.test(src) && !perms.includes('network') && !perms.includes('full')) add('w', 'accès réseau sans la permission « network » : utilise ctx.net.');
    if (/ctx\.host/.test(src) && !perms.includes('full')) add('e', 'ctx.host utilisé sans la permission « full ».');
    if (src.length > 1.5e6) add('w', m.entry + ' : plus de 1,5 Mo.');
  }
  if (!out.some(o => o.lvl === 'e')) add('o', 'Aucune erreur : ce plugin est prêt à être publié (puis approuvé).');
  return out;
}
/* ---------- problèmes, plan du fichier, autocomplétion, aperçu Markdown, comparaison : des fonctions pures (test-neodex.js les essaie) ---------- */
const lineAt = (t, i) => { let n = 1; for (let k = t.indexOf('\n'); k >= 0 && k < i; k = t.indexOf('\n', k + 1)) n++; return n; };
// parenthèses, crochets, accolades, chaînes et commentaires qui ne se ferment pas (JS, CSS, Python, JSON)
function brackets(lang, t) {
  const out = [], st = [], O = '([{', C = ')]}'; let prev = '';
  for (let i = 0; i < t.length; i++) {
    const c = t[i], d = t[i + 1];
    if (lang === 'py' ? c === '#' : c === '/' && d === '/' && lang !== 'css') { const e = t.indexOf('\n', i); if (e < 0) break; i = e; continue; }
    if (lang !== 'py' && c === '/' && d === '*') { const e = t.indexOf('*/', i + 2); if (e < 0) { out.push({ line: lineAt(t, i), ch: '/*', msg: 'jamais fermé' }); break; } i = e + 1; continue; }
    if (lang === 'js' && c === '/' && /^$|[(,=:[!&|?{};+\-*%<>~^]$/.test(prev)) {  // une expression régulière /…/ : on la saute
      let j = i + 1, cls = false; for (; j < t.length && t[j] !== '\n'; j++) { if (t[j] === '\\') { j++; continue; } if (t[j] === '[') cls = true; else if (t[j] === ']') cls = false; else if (t[j] === '/' && !cls) break; }
      if (t[j] === '/') { i = j; prev = '/'; continue; }
    }
    if (c === '"' || c === "'" || (c === '`' && lang === 'js')) {
      if (lang === 'py' && t.startsWith(c + c + c, i)) { const e = t.indexOf(c + c + c, i + 3); if (e < 0) { out.push({ line: lineAt(t, i), ch: c + c + c, msg: 'jamais fermé' }); break; } i = e + 2; prev = c; continue; }
      let j = i + 1; while (j < t.length && t[j] !== c && (c === '`' || t[j] !== '\n')) { if (t[j] === '\\') j++; j++; }
      if (t[j] !== c) out.push({ line: lineAt(t, i), ch: c, msg: 'jamais fermé' });
      i = j; prev = c; continue;
    }
    if (O.includes(c)) st.push([c, i]);
    else if (C.includes(c)) {
      const top = st.pop();
      if (!top) out.push({ line: lineAt(t, i), ch: c, msg: 'en trop' });
      else if (top[0] !== O[C.indexOf(c)]) {  // ce qui reste ouvert au-dessus de la bonne ouverture n'a jamais été fermé ; sans bonne ouverture, ce signe est en trop
        st.push(top); const k = st.map(x => x[0]).lastIndexOf(O[C.indexOf(c)]);
        if (k < 0) out.push({ line: lineAt(t, i), ch: c, msg: 'en trop' }); else for (const [o, j] of st.splice(k).slice(1)) out.push({ line: lineAt(t, j), ch: o, msg: 'jamais fermé' });
      }
    }
    if (!/\s/.test(c)) prev = c;
  }
  for (const [c, i] of st) out.push({ line: lineAt(t, i), ch: c, msg: 'jamais fermé' });
  return out;
}
const VOID = /^(area|base|br|col|embed|hr|img|input|link|meta|param|source|track|wbr|!doctype)$/i, OPTIONAL = /^(li|p|td|th|tr|thead|tbody|tfoot|option|dt|dd|html|head|body|colgroup)$/i;
function htmlTags(t) {
  const out = [], st = [], src = t.replace(/<!--[\s\S]*?-->/g, m => m.replace(/[^\n]/g, ' ')).replace(/(<(script|style)\b[^>]*>)([\s\S]*?)(<\/\2\s*>)/gi, (m, a, _, b, c) => a + b.replace(/[^\n]/g, ' ') + c);
  for (const m of src.matchAll(/<(\/?)([A-Za-z][\w:-]*)\b(?:"[^"]*"|'[^']*'|[^'">])*?(\/?)>/g)) {
    const close = m[1] === '/', name = m[2].toLowerCase(), line = lineAt(src, m.index);
    if (VOID.test(name) || m[3]) continue;
    if (!close) { st.push([name, line]); continue; }
    const k = st.map(x => x[0]).lastIndexOf(name);
    if (k < 0) { out.push({ line, ch: '</' + name + '>', msg: 'sans balise ouvrante' }); continue; }
    for (const [n, l] of st.splice(k).slice(1)) if (!OPTIONAL.test(n)) out.push({ line: l, ch: '<' + n + '>', msg: 'jamais fermé' });
  }
  for (const [n, l] of st) if (!OPTIONAL.test(n)) out.push({ line: l, ch: '<' + n + '>', msg: 'jamais fermé' });
  return out;
}
function pyLines(t) {
  const out = [], L = t.split('\n'); let depth = 0;
  L.forEach((l, k) => {
    const code = l.replace(/#.*$/, ''), ind = /^[ \t]*/.exec(l)[0];
    if (depth === 0 && /\t/.test(ind) && / /.test(ind)) out.push({ line: k + 1, msg: 'tabulations et espaces mélangés' });
    if (depth === 0 && /^\s*(def|class|if|elif|else|for|while|try|except|finally|with)\b/.test(code) && !/:\s*$/.test(code) && !/[(\[{,\\]\s*$/.test(code)) out.push({ line: k + 1, msg: 'il manque « : » en fin de ligne' });
    if (depth === 0 && /:\s*$/.test(code) && /^\s*(def|class|if|elif|else|for|while|try|except|finally|with)\b/.test(code)) {
      const nx = L.slice(k + 1).find(x => x.trim() && !/^\s*#/.test(x));
      if (nx == null || /^[ \t]*/.exec(nx)[0].length <= ind.length) out.push({ line: k + 1, msg: 'bloc vide : la ligne suivante doit être décalée' });
    }
    for (const ch of code.replace(/(["'])(?:\\.|(?!\1).)*\1/g, '')) depth += '([{'.includes(ch) ? 1 : ')]}'.includes(ch) ? -1 : 0;
    if (depth < 0) depth = 0;
  });
  return out;
}
let evalOk = true;  // la page de NeoDex peut interdire la compilation de code (CSP) : on ne vérifie alors que les parenthèses
function diagnose(lang, t) {
  if (!t || t.startsWith('data:') || t.length > 400000) return [];
  if (lang === 'json') { if (!t.trim()) return []; try { JSON.parse(t); return []; } catch (e) { const m = /position (\d+)/.exec(e.message), l = /line (\d+)/.exec(e.message); return [{ line: l ? +l[1] : m ? lineAt(t, +m[1]) : 1, msg: 'JSON invalide', detail: e.message }]; } }
  if (lang === 'html') return htmlTags(t);
  if (lang === 'css') return brackets('css', t);
  if (lang === 'py') { const b = brackets('py', t); return b.length ? b : pyLines(t); }
  if (lang === 'js') {
    const b = brackets('js', t); if (b.length || !evalOk) return b;
    const body = t.replace(/^\s*import\s[^;\n]*;?/gm, '').replace(/^(\s*)export\s+(default\s+)?/gm, '$1');
    try { new (Object.getPrototypeOf(async function () {}).constructor)(body); } catch (e) { if (e instanceof SyntaxError) return [{ line: 0, msg: 'Erreur de syntaxe', detail: e.message }]; evalOk = false; }
    return [];
  }
  return [];
}
const matchBracket = (t, i) => {
  const O = '([{', C = ')]}', c = t[i], o = O.indexOf(c), cl = C.indexOf(c); if (o < 0 && cl < 0) return -1;
  const dir = o >= 0 ? 1 : -1, me = c, other = o >= 0 ? C[o] : O[cl]; let depth = 0;
  for (let k = i, n = 0; k >= 0 && k < t.length && n < 40000; k += dir, n++) { if (t[k] === me) depth++; else if (t[k] === other && --depth === 0) return k; }
  return -1;
};
function symbols(lang, t) {
  const out = [], L = t.split('\n'), add = (name, kind, k) => name && out.push({ name, kind, line: k + 1 });
  L.forEach((l, k) => {
    let m;
    if (lang === 'js') {
      if ((m = /^\s*(?:export\s+)?(?:default\s+)?(?:async\s+)?function\s*\*?\s*([\w$]+)/.exec(l))) add(m[1], 'fonction', k);
      else if ((m = /^\s*(?:export\s+)?class\s+([\w$]+)/.exec(l))) add(m[1], 'classe', k);
      else if ((m = /^\s*(?:export\s+)?(?:const|let|var)\s+([\w$]+)\s*=\s*(?:async\s*)?(?:\([^)]*\)|[\w$]+)\s*=>/.exec(l))) add(m[1], 'fonction', k);
      else if ((m = /^\s*(?:export\s+)?(?:const|let|var)\s+([A-Z][A-Z0-9_]{2,})\s*=/.exec(l))) add(m[1], 'constante', k);
      else if ((m = /^\s+(?:static\s+)?(?:async\s+)?([\w$]+)\s*\([^)]*\)\s*\{\s*$/.exec(l)) && !/^(if|for|while|switch|catch|function|return)$/.test(m[1])) add(m[1], 'méthode', k);
    } else if (lang === 'py') {
      if ((m = /^(\s*)(?:async\s+)?def\s+(\w+)/.exec(l))) add(m[2], m[1] ? 'méthode' : 'fonction', k);
      else if ((m = /^\s*class\s+(\w+)/.exec(l))) add(m[1], 'classe', k);
    } else if (lang === 'css') { if ((m = /^\s*([^{}\s@/][^{}]*?|@media[^{]*?)\s*\{/.exec(l))) add(m[1].trim().slice(0, 80), 'règle', k); }
    else if (lang === 'md') { if ((m = /^(#{1,6})\s+(.+)/.exec(l))) add('  '.repeat(m[1].length - 1) + m[2].trim(), 'titre', k); }
    else if (lang === 'html') { for (const x of l.matchAll(/\bid=["']([^"']+)["']/g)) add('#' + x[1], 'id', k); if ((m = /<(h[1-3])\b[^>]*>([^<]{1,80})/i.exec(l))) add(m[2].trim(), m[1].toLowerCase(), k); }
  });
  return out;
}
const SNIP = {
  js: [['for', 'for (let i = 0; i < $0; i++) {\n  \n}'], ['forof', 'for (const x of $0) {\n  \n}'], ['if', 'if ($0) {\n  \n}'], ['ifelse', 'if ($0) {\n  \n} else {\n  \n}'], ['function', 'function $0() {\n  \n}'], ['arrow', 'const $0 = () => {\n  \n};'], ['try', 'try {\n  $0\n} catch (e) {\n  console.error(e);\n}'], ['log', 'console.log($0);'], ['fetch', 'const r = await fetch($0);\nconst data = await r.json();'], ['plugin', 'export default async function (ctx) {\n  const v = ctx.view;\n  $0\n}']],
  py: [['def', 'def $0():\n    pass'], ['class', 'class $0:\n    def __init__(self):\n        pass'], ['for', 'for x in $0:\n    pass'], ['if', 'if $0:\n    pass'], ['main', 'if __name__ == "__main__":\n    $0'], ['with', 'with open($0, encoding="utf-8") as f:\n    texte = f.read()'], ['try', 'try:\n    $0\nexcept Exception as e:\n    print(e)']],
  html: [['html5', '<!doctype html>\n<html lang="fr">\n<head>\n  <meta charset="utf-8">\n  <meta name="viewport" content="width=device-width, initial-scale=1">\n  <title>$0</title>\n  <link rel="stylesheet" href="style.css">\n</head>\n<body>\n  \n  <script src="app.js"></script>\n</body>\n</html>'], ['div', '<div>$0</div>'], ['button', '<button>$0</button>'], ['link', '<link rel="stylesheet" href="$0">'], ['script', '<script src="$0"></script>'], ['ul', '<ul>\n  <li>$0</li>\n</ul>']],
  css: [['flex', 'display: flex;\ngap: $0px;\nalign-items: center;'], ['grid', 'display: grid;\ngrid-template-columns: repeat($0, 1fr);\ngap: 8px;'], ['media', '@media (max-width: $0px) {\n  \n}'], ['center', 'display: grid;\nplace-items: center;$0']],
  md: [['lien', '[$0](https://)'], ['code', '```\n$0\n```'], ['tableau', '| $0 | |\n|---|---|\n| | |']],
};
const KW = { js: JS_KW.split('|').concat(['console', 'document', 'window', 'JSON', 'Math', 'Promise', 'Array', 'Object', 'String', 'Number', 'addEventListener', 'querySelector', 'querySelectorAll', 'createElement', 'appendChild', 'textContent', 'innerHTML', 'setTimeout', 'setInterval', 'requestAnimationFrame', 'localStorage', 'length', 'push', 'map', 'filter', 'forEach', 'reduce', 'includes', 'slice', 'splice']),
  py: PY_KW.split('|').concat(['print', 'input', 'range', 'len', 'open', 'list', 'dict', 'set', 'tuple', 'str', 'int', 'float', 'enumerate', 'zip', 'sorted', 'isinstance', 'append', 'items', 'keys', 'values', 'split', 'join', 'strip', 'format']),
  css: ['display', 'position', 'absolute', 'relative', 'flex', 'grid', 'margin', 'padding', 'border', 'background', 'color', 'font-size', 'font-family', 'font-weight', 'width', 'height', 'max-width', 'min-height', 'justify-content', 'align-items', 'gap', 'transition', 'transform', 'opacity', 'cursor', 'overflow', 'z-index', 'box-shadow', 'border-radius', 'text-align', 'line-height'],
  html: ['div', 'span', 'section', 'header', 'footer', 'main', 'button', 'input', 'label', 'form', 'canvas', 'img', 'script', 'style', 'class', 'href', 'src', 'type', 'placeholder'], md: [], json: [], txt: [] };
const API = ['ctx.view', 'ctx.id', 'ctx.version', 'ctx.folder.read', 'ctx.folder.write', 'ctx.folder.remove', 'ctx.folder.list', 'ctx.storage.get', 'ctx.storage.set', 'ctx.onOpen', 'ctx.onClose', 'ctx.permission', 'ctx.notifications.send', 'ctx.widget.set', 'ctx.widget.clear', 'ctx.background.every', 'ctx.host.toast', 'ctx.host.addStyle', 'ctx.host.confirm', 'ctx.host.ask', 'ctx.host.newTab', 'ctx.el', 'console.log', 'console.error', 'console.warn', 'document.querySelector', 'document.createElement', 'JSON.parse', 'JSON.stringify', 'Math.random', 'Math.floor', 'Math.round', 'Math.max', 'Math.min'];
// ce que propose l'autocomplétion pour le mot tapé : extraits, mots-clés, API de NeoDex, puis les noms déjà écrits dans le projet
function complete(lang, prefix, words = []) {
  const p = prefix.toLowerCase(), out = [], seen = new Set(), add = (label, insert, kind) => { if (!seen.has(label) && label.toLowerCase() !== p) { seen.add(label); out.push({ label, insert, kind }); } };
  if (prefix.includes('.')) { if (lang === 'js') API.filter(a => a.toLowerCase().startsWith(p)).forEach(a => add(a, a, 'NeoDex')); return out.slice(0, 14); }
  if (p.length < 1) return [];
  (SNIP[lang] || []).filter(([k]) => k.startsWith(p)).forEach(([k, v]) => add(k, v, 'extrait'));
  (KW[lang] || []).filter(k => k.toLowerCase().startsWith(p)).sort((a, b) => a.length - b.length).forEach(k => add(k, k, 'mot-clé'));
  [...words].filter(w => w.toLowerCase().startsWith(p)).sort((a, b) => a.length - b.length).forEach(w => add(w, w, 'nom'));
  return out.slice(0, 14);
}
// Markdown -> HTML sûr (tout le texte est échappé, seuls les liens http(s) ou relatifs restent cliquables)
function md2html(t) {
  const inl = s => esc(s).replace(/`([^`]+)`/g, '<code>$1</code>').replace(/\*\*([^*]+)\*\*/g, '<b>$1</b>').replace(/(^|[^*])\*([^*\s][^*]*)\*/g, '$1<i>$2</i>')
    .replace(/!?\[([^\]]*)\]\(((?:https?:\/\/|\.?\/|#)?[^)\s"]*)\)/g, (m, txt, u) => /^(javascript|data|vbscript):/i.test(u) ? txt : '<a href="' + u + '" target="_blank" rel="noopener">' + txt + '</a>');
  const out = [], L = t.replace(/\r/g, '').split('\n'); let list = '', para = [];
  const flush = () => { if (para.length) { out.push('<p>' + para.map(inl).join('<br>') + '</p>'); para = []; } if (list) { out.push('</' + list + '>'); list = ''; } };
  for (let k = 0; k < L.length; k++) {
    const l = L[k]; let m;
    if (/^```/.test(l)) { flush(); const b = []; while (++k < L.length && !/^```/.test(L[k])) b.push(L[k]); out.push('<pre><code>' + esc(b.join('\n')) + '</code></pre>'); continue; }
    if ((m = /^(#{1,6})\s+(.*)/.exec(l))) { flush(); out.push('<h' + m[1].length + '>' + inl(m[2]) + '</h' + m[1].length + '>'); continue; }
    if (/^\s*([-*_])(\s*\1){2,}\s*$/.test(l)) { flush(); out.push('<hr>'); continue; }
    if ((m = /^\s*([-*+]|\d+\.)\s+(.*)/.exec(l))) { const tag = /\d/.test(m[1]) ? 'ol' : 'ul'; if (para.length || (list && list !== tag)) flush(); if (!list) { list = tag; out.push('<' + tag + '>'); } out.push('<li>' + inl(m[2]) + '</li>'); continue; }
    if ((m = /^>\s?(.*)/.exec(l))) { flush(); out.push('<blockquote>' + inl(m[1]) + '</blockquote>'); continue; }
    if (!l.trim()) { flush(); continue; }
    if (list) flush(); para.push(l);
  }
  flush(); return out.join('\n');
}
// comparaison ligne à ligne (plus longue sous-suite commune) : [{t: ' ' | '-' | '+', s}]
function lineDiff(a, b) {
  const A = a.split('\n'), B = b.split('\n'); let s = 0; while (s < A.length && s < B.length && A[s] === B[s]) s++;
  let ea = A.length, eb = B.length; while (ea > s && eb > s && A[ea - 1] === B[eb - 1]) { ea--; eb--; }
  const X = A.slice(s, ea), Y = B.slice(s, eb), n = X.length, m = Y.length, out = A.slice(0, s).map(x => ({ t: ' ', s: x }));
  if (n * m > 4e6) { X.forEach(x => out.push({ t: '-', s: x })); Y.forEach(y => out.push({ t: '+', s: y })); }  // shortcut: très gros fichiers, tout l'écart en bloc
  else {
    const T = Array.from({ length: n + 1 }, () => new Uint32Array(m + 1));
    for (let i = n - 1; i >= 0; i--) for (let j = m - 1; j >= 0; j--) T[i][j] = X[i] === Y[j] ? T[i + 1][j + 1] + 1 : Math.max(T[i + 1][j], T[i][j + 1]);
    let i = 0, j = 0; while (i < n && j < m) { if (X[i] === Y[j]) { out.push({ t: ' ', s: X[i] }); i++; j++; } else if (T[i + 1][j] >= T[i][j + 1]) out.push({ t: '-', s: X[i++] }); else out.push({ t: '+', s: Y[j++] }); }
    while (i < n) out.push({ t: '-', s: X[i++] }); while (j < m) out.push({ t: '+', s: Y[j++] });
  }
  A.slice(ea).forEach(x => out.push({ t: ' ', s: x })); return out;
}
const TEXT_EXT = /\.(html?|css|m?js|cjs|ts|tsx|jsx|json|py|md|txt|csv|xml|svg|ya?ml|toml|ini|cfg|bat|ps1|sh|c|h|cpp|hpp|cs|java|kt|go|rs|rb|php|lua|sql|vue|svelte|gitignore|gitattributes|env|editorconfig|lock)$|^[^.]+$|\/[^./]+$/i;
/* ---------- sandbox pages ---------- */
const CONSOLE_HOOK = `<script>(()=>{const send=(l,a)=>{try{parent.postMessage({neoIde:1,l,a:a.map(x=>{try{if(typeof x==='string')return x;if(x instanceof Error)return x.stack||String(x);if(typeof x!=='object'||!x)return String(x);const f=(k,v)=>typeof v==='function'?'[fonction]':v,c=JSON.stringify(x,f);return c.length<90?c:JSON.stringify(x,f,1)}catch{return String(x)}})},'*')}catch{}};for(const l of['log','info','warn','error','debug'])console[l]=(...a)=>send(l,a);addEventListener('error',e=>send('error',[e.message+(e.lineno?' (ligne '+e.lineno+')':'')]));addEventListener('unhandledrejection',e=>send('error',['Promesse rejetée : '+(e.reason&&e.reason.message||e.reason)]));addEventListener('message',async e=>{if(e.data&&e.data.neoEval){try{const r=await(0,eval)(e.data.neoEval);send('result',[r===undefined?'undefined':r])}catch(x){send('error',[x.message])}}})})()<\/script>`;
const inlineProject = (files, html) => {
  let out = html.replace(/<link\b[^>]*href=["']([^"']+)["'][^>]*>/gi, (all, h) => (/stylesheet/i.test(all) && files[h.replace(/^\.\//, '')] != null) ? '<style>' + files[h.replace(/^\.\//, '')] + '</style>' : all);
  out = out.replace(/<script\b([^>]*)src=["']([^"']+)["']([^>]*)>\s*<\/script>/gi, (all, a, s, b) => files[s.replace(/^\.\//, '')] != null ? '<script' + a + b + '>' + files[s.replace(/^\.\//, '')].replace(/<\/script/gi, '<\\/script') + '<\/script>' : all);
  return /<head[^>]*>/i.test(out) ? out.replace(/<head[^>]*>/i, m => m + CONSOLE_HOOK) : CONSOLE_HOOK + out;
};
const pluginPage = (files, id) => `<!doctype html><meta charset=utf-8><style>:root{--bg0:#0b031c;--line:#2a1d52;--line2:#3a2a6e;--violet:#8a5cf0;--magenta:#e01ec8;--pink:#ff5ad9;--lilac:#d9c6ff;--muted:#8f7bb8;--shell:#f3eaff;--win:#120922;--field:#0a0416;--btn:#1b1238;--btnh:#251a4a;--text:Consolas,monospace;--title:monospace}*{box-sizing:border-box}body{margin:0;background:var(--bg0);color:var(--shell);font:16px var(--text)}#v{padding:12px}.btn{border:0;background:var(--btn);color:#fff;font:600 16px var(--text);padding:8px 16px;margin:3px;box-shadow:0 0 0 3px var(--line2);cursor:pointer}.f{padding:8px;background:var(--field);border:0;color:#fff;font:16px var(--text);box-shadow:inset 0 0 0 3px var(--line)}</style>${CONSOLE_HOOK}<div id=v></div><script type="module">
const files=${JSON.stringify(files).replace(/</g, '\\u003c')};const m=JSON.parse(files['plugin.json']||'{}');const mem={};const el=(t,c,x)=>{const e=document.createElement(t);if(c)e.className=c;if(x!=null)e.textContent=x;return e};
const opens=[],closes=[];const toast=(msg,err)=>console[err?'error':'log']('[toast] '+msg);
const perms=m.permissions||[];
const folder={read:async n=>mem[n]??null,write:async(n,d)=>{mem[n]=JSON.parse(JSON.stringify(d))},remove:async n=>{delete mem[n]},list:async()=>Object.keys(mem)};
const ctx={id:m.id||${JSON.stringify(id)},version:m.version||'0.0.0',view:document.getElementById('v'),el,ui:{toast,newTab:u=>console.log('[newTab] '+u),pixIcon:()=>''},onOpen:f=>opens.push(f),onClose:f=>closes.push(f),permission:async()=>true,legacy:{},widget:{set:d=>console.log('[widget accueil] '+JSON.stringify(d)),clear:()=>console.log('[widget accueil] vidé')},background:{every:(n,f)=>console.log('[arrière-plan] toutes les '+n+' min')},notifications:{send:async n=>{console.log('[notification] '+(n&&n.title)+(n&&n.body?' · '+n.body:''));return 'test'}}};
if(perms.includes('storage')||perms.includes('full')){ctx.folder=folder;ctx.storage={get:()=>mem.storage||{},set:d=>{mem.storage=d}}}
ctx.host={el,toast,sfx(){},ask:async()=>'',newTab(){},pixIcon:()=>'',confirm:async()=>true,box:async()=>0,addStyle(c){const s=document.createElement('style');s.textContent=c;document.head.append(s)},hooks(){},settings:()=>({}),pref:()=>null,tabLabel(){},menuItem(){},closeTab(){},statCount(){}};
try{const url=URL.createObjectURL(new Blob([files[m.entry||'index.js']||''],{type:'text/javascript'}));const mod=await import(url);await mod.default(ctx);opens.forEach(f=>f());console.log('Plugin chargé : '+ctx.id+' '+ctx.version+(perms.length?' · permissions : '+perms.join(', '):''))}catch(e){console.error('Le plugin plante au chargement : '+(e.stack||e))}
<\/script>`;
const WORKER_SRC = `const send=(l,a)=>postMessage({l,a:a.map(x=>{try{if(typeof x==='string')return x;if(x instanceof Error)return x.stack||String(x);if(typeof x!=='object'||!x)return String(x);const c=JSON.stringify(x);return c.length<90?c:JSON.stringify(x,null,1)}catch{return String(x)}})});for(const l of['log','info','warn','error','debug'])console[l]=(...a)=>send(l,a);onmessage=async e=>{try{const AF=Object.getPrototypeOf(async function(){}).constructor;const r=await new AF(e.data)();if(r!==undefined)send('result',[r])}catch(x){send('error',[x&&x.stack?x.stack.split('\\n').slice(0,3).join('\\n'):String(x)])}postMessage({done:1})}`;
/* ---------- main ---------- */
export default async function (ctx) {
  const view = ctx.view;
  const sty = document.createElement('style'); sty.textContent = CSS; (ctx.host?.addStyle ? ctx.host.addStyle(CSS) : document.head.append(sty));
  const toast = (m, e) => (ctx.host?.toast || ctx.ui.toast)(m, e);
  const slug = n => n.toLowerCase().normalize('NFD').replace(/[̀-ͯ]/g, '').replace(/[^a-z0-9._-]+/g, '-').replace(/^-+|-+$/g, '').slice(0, 60) || 'projet';
  const meta = { cur: '', projects: [], open: {}, active: {}, ...(await ctx.folder.read('ide').catch(() => null) || {}) };
  const projects = {};   // name -> {name, files, created}
  for (const k of meta.projects) { const p = await ctx.folder.read('p_' + k).catch(() => null); if (p && p.files) projects[k] = p; }
  meta.projects = Object.keys(projects);
  let proj = null, openTabs = [], active = '', dirty = new Set(), saveT = 0, prevT = 0, rightMode = 'preview', prevKind = '';
  const saveMeta = () => ctx.folder.write('ide', meta).catch(() => {});
  const callMain = (n, ...a) => ctx.neo?.pluginMain ? ctx.neo.pluginMain(ctx.id, n, ...a) : Promise.reject(new Error('le volet système de l\'Atelier n\'est pas chargé'));
  // un dossier du PC s'enregistre dans ses fichiers ; un projet de l'Atelier dans les données de NeoDex
  const saveProj = (now) => { if (!proj) return; clearTimeout(saveT); const go = () => { const p = proj, paths = [...dirty]; p.updated = Date.now(); if (p.disk) Promise.all(paths.filter(f => typeof p.files[f] === 'string').map(f => callMain('ide:write', p.disk, f, p.files[f]))).catch(e => toast('Enregistrement impossible : ' + e.message, true)); else { const { bin, ...keep } = p; ctx.folder.write('p_' + p.key, keep).catch(e => toast('Sauvegarde impossible : ' + e.message, true)); } dirty.clear(); renderTabs(); paths.forEach(f => typeof snap === 'function' && snap(p, f, now)); }; if (now) go(); else saveT = setTimeout(go, 700); };
  const modal = (build) => new Promise(res => { const mod = document.createElement('div'); mod.className = 'ide ide-mod'; mod.style.cssText = 'height:auto;min-height:0'; const box = document.createElement('div'); box.className = 'ide-box'; mod.append(box); view.append(mod); const done = v => { mod.remove(); res(v); }; mod.onmousedown = e => { if (e.target === mod) done(null); }; build(box, done); });
  const askText = (title, val = '', ok = 'OK') => modal((box, done) => { box.innerHTML = '<h3></h3>'; box.firstChild.textContent = title; const i = document.createElement('input'); i.className = 'ide-in'; i.value = val; i.onkeydown = e => { if (e.key === 'Enter') done(i.value.trim() || null); if (e.key === 'Escape') done(null); }; const b = document.createElement('button'); b.className = 'ide-b acc'; b.textContent = ok; b.onclick = () => done(i.value.trim() || null); const c = document.createElement('button'); c.className = 'ide-b'; c.textContent = 'Annuler'; c.onclick = () => done(null); const r = document.createElement('div'); r.append(b, c); box.append(i, r); setTimeout(() => { i.focus(); i.select(); }, 20); });
  const askYes = (msg, ok = 'Confirmer') => modal((box, done) => { box.innerHTML = '<h3>Confirmation</h3><div></div>'; box.lastChild.textContent = msg; const b = document.createElement('button'); b.className = 'ide-b acc'; b.textContent = ok; b.onclick = () => done(true); const c = document.createElement('button'); c.className = 'ide-b'; c.textContent = 'Annuler'; c.onclick = () => done(false); const r = document.createElement('div'); r.append(b, c); box.append(r); }).then(v => !!v);
  /* ----- layout ----- */
  view.innerHTML = '';
  const root = document.createElement('div'); root.className = 'ide'; view.append(root);
  const bar = document.createElement('div'); bar.className = 'ide-bar';
  const main = document.createElement('div'); main.className = 'ide-main';
  root.append(bar, main);
  const mkB = (t, f, cls = '', title = '') => { const b = document.createElement('button'); b.className = 'ide-b ' + cls; b.textContent = t; b.title = title; b.onclick = f; return b; };
  const pane = (title) => { const p = document.createElement('div'); p.className = 'ide-pane'; const h = document.createElement('div'); h.className = 'ide-ph'; h.append(title); p.append(h); return [p, h]; };
  const [pExp, hExp] = pane('Fichiers'), [pEd] = pane('Éditeur'), right = document.createElement('div'); right.className = 'ide-right';
  pEd.firstChild.remove();
  const tree = document.createElement('div'); tree.className = 'ide-tree'; pExp.append(tree);
  const tabs = document.createElement('div'); tabs.className = 'ide-tabs';
  const findBar = document.createElement('div'); findBar.className = 'ide-find';
  const ed = document.createElement('div'); ed.className = 'ide-ed';
  const gut = document.createElement('div'); gut.className = 'ide-gut'; const codeBox = document.createElement('div'); codeBox.className = 'ide-code';
  const pre = document.createElement('pre'), ta = document.createElement('textarea'); ta.spellcheck = false; ta.wrap = 'off'; ta.autocapitalize = 'off'; ta.autocomplete = 'off';
  codeBox.append(pre, ta); ed.append(gut, codeBox); pEd.append(tabs, findBar, ed);
  const [pPrev, hPrev] = pane('Aperçu'), [pCon, hCon] = pane('Console');
  const prevHolder = document.createElement('div'); prevHolder.style.cssText = 'flex:1;display:flex;min-height:0'; pPrev.append(prevHolder);
  const con = document.createElement('div'); con.className = 'ide-con'; const conIn = document.createElement('div'); conIn.className = 'ide-conin';
  const cin = document.createElement('input'); cin.className = 'ide-in'; cin.placeholder = 'Entre une expression JavaScript (aperçu en cours) et appuie sur Entrée'; conIn.append(cin);
  pCon.append(con, conIn); right.append(pPrev, pCon); main.append(pExp, pEd, right);
  const clearCon = mkB('Effacer', () => { con.innerHTML = ''; }, 'sm'); hCon.append(clearCon);
  const log = (l, text) => { const d = document.createElement('div'); d.className = { error: 'e', warn: 'w', info: 'i', debug: 'i', result: 'o', sys: 'i' }[l] || ''; d.textContent = (l === 'result' ? '← ' : '') + text; con.append(d); con.scrollTop = con.scrollHeight; while (con.childElementCount > 400) con.firstChild.remove(); };
  /* ----- editor ----- */
  const file = () => proj && proj.files[active];
  const refreshEd = () => { const t = ta.value, lang = langOf(active || ''); pre.innerHTML = highlight(lang, t) + '\n'; const n = t.split('\n').length; if (gut._n !== n || gut._p !== probKey) { gut._n = n; gut._p = probKey; gut.innerHTML = Array.from({ length: n }, (_, i) => probLines.has(i + 1) ? '<span class="gx">' + (i + 1) + '</span>' : i + 1).join('\n'); } };
  let probs = [], probLines = new Set(), probKey = '';
  const loadFile = () => { const t = proj && proj.files[active], bin = !!proj?.bin?.has(active); ta.disabled = t == null || bin; ta.value = bin ? '' : t ?? ''; ta.placeholder = bin ? 'Fichier binaire ou trop gros : il ne s\'ouvre pas dans l\'éditeur.' : t == null ? 'Ouvre ou crée un fichier' : ''; typeof checkNow === 'function' && (checkNow(), acClose()); refreshEd(); ta.scrollTop = ta.scrollLeft = 0; syncScroll(); typeof updStatus === 'function' && updStatus(); };
  const syncScroll = () => { pre.scrollTop = ta.scrollTop; pre.scrollLeft = ta.scrollLeft; gut.scrollTop = ta.scrollTop; };
  ta.addEventListener('scroll', syncScroll);
  const onEdit = () => { if (!proj || active == null) return; proj.files[active] = ta.value; dirty.add(active); refreshEd(); renderTabs(); saveProj(false); clearTimeout(prevT); prevT = setTimeout(() => { livePreview(); checkNow(); }, 450); };
  ta.addEventListener('input', onEdit);
  const ins = txt => document.execCommand('insertText', false, txt);
  const PAIRS = { '(': ')', '[': ']', '{': '}', '"': '"', "'": "'", '`': '`' };
  ta.addEventListener('keydown', e => {
    const s = ta.selectionStart, en = ta.selectionEnd, v = ta.value, lang = langOf(active || ''), mod = e.ctrlKey || e.metaKey;
    if (mod && e.key.toLowerCase() === 's') { e.preventDefault(); saveProj(true); toast('Enregistré'); return; }
    if (mod && e.key === 'Enter') { e.preventDefault(); run(); return; }
    if (mod && e.key.toLowerCase() === 'f') { e.preventDefault(); showFind(); return; }
    if (mod && e.key === '/') { e.preventDefault(); toggleComment(); return; }
    if (mod && e.key.toLowerCase() === 'd') { e.preventDefault(); const ls = v.lastIndexOf('\n', s - 1) + 1, le = v.indexOf('\n', en); const e2 = le < 0 ? v.length : le; ta.setSelectionRange(e2, e2); ins('\n' + v.slice(ls, e2)); return; }
    if (e.altKey && (e.key === 'ArrowUp' || e.key === 'ArrowDown')) { e.preventDefault(); moveLines(e.key === 'ArrowUp' ? -1 : 1); return; }
    if (e.key === 'Tab') { e.preventDefault(); if (s !== en && v.slice(s, en).includes('\n')) { indentSel(e.shiftKey); } else if (e.shiftKey) { indentSel(true); } else ins('  '); return; }
    if (e.key === 'Enter' && !mod) {
      e.preventDefault(); const ls = v.lastIndexOf('\n', s - 1) + 1, line = v.slice(ls, s), ind = line.match(/^\s*/)[0], prev = v[s - 1], next = v[en];
      let extra = ''; if ('{[('.includes(prev) || (lang === 'py' && /:\s*$/.test(line)) || (lang === 'html' && />$/.test(line) && !/<\/|<(br|hr|img|input|meta|link)/i.test(line))) extra = '  ';
      if (PAIRS[prev] === next && '{[('.includes(prev)) { ins('\n' + ind + extra + '\n' + ind); const p = ta.selectionStart - ind.length - 1; ta.setSelectionRange(p, p); } else ins('\n' + ind + extra); return;
    }
    if (PAIRS[e.key] && !mod && !e.altKey) {
      const sel = v.slice(s, en);
      if (sel) { e.preventDefault(); ins(e.key + sel + PAIRS[e.key]); ta.setSelectionRange(s + 1, en + 1); return; }
      const nx = v[s]; if ((e.key === '"' || e.key === "'" || e.key === '`') && (nx === e.key || /\w/.test(v[s - 1] || ''))) { if (nx === e.key) { e.preventDefault(); ta.setSelectionRange(s + 1, s + 1); } return; }
      e.preventDefault(); ins(e.key + PAIRS[e.key]); ta.setSelectionRange(s + 1, s + 1); return;
    }
    if (Object.values(PAIRS).includes(e.key) && v[s] === e.key && s === en) { e.preventDefault(); ta.setSelectionRange(s + 1, s + 1); return; }
    if (e.key === 'Backspace' && s === en && PAIRS[v[s - 1]] === v[s] && s > 0) { e.preventDefault(); ta.setSelectionRange(s - 1, s + 1); ins(''); return; }
  });
  const lineRange = () => { const v = ta.value, s = ta.selectionStart, en = ta.selectionEnd, ls = v.lastIndexOf('\n', s - 1) + 1, le0 = v.indexOf('\n', en > s && v[en - 1] === '\n' ? en - 1 : en), le = le0 < 0 ? v.length : le0; return [ls, le]; };
  const indentSel = out => { const v = ta.value, [ls, le] = lineRange(), blk = v.slice(ls, le), ns = blk.split('\n').map(l => out ? l.replace(/^ {1,2}/, '') : '  ' + l).join('\n'); ta.setSelectionRange(ls, le); ins(ns); ta.setSelectionRange(ls, ls + ns.length); };
  const toggleComment = () => { const lang = langOf(active || ''), c = { js: '//', py: '#', css: '', html: '', json: '', md: '' }[lang]; const v = ta.value, [ls, le] = lineRange(), blk = v.slice(ls, le); if (lang === 'css' || lang === 'html') { const [a, b] = lang === 'css' ? ['/* ', ' */'] : ['<!-- ', ' -->']; const t = blk.trim(); const ns = t.startsWith(a.trim()) ? blk.replace(a, '').replace(b, '') : blk.replace(/^(\s*)(.*)$/s, '$1' + a + '$2' + b); ta.setSelectionRange(ls, le); ins(ns); return; } if (!c) return; const lines = blk.split('\n'), all = lines.every(l => !l.trim() || l.trimStart().startsWith(c)); const ns = lines.map(l => !l.trim() ? l : all ? l.replace(c + ' ', '').replace(c, '') : l.replace(/^(\s*)/, '$1' + c + ' ')).join('\n'); ta.setSelectionRange(ls, le); ins(ns); ta.setSelectionRange(ls, ls + ns.length); };
  const moveLines = d => { const v = ta.value, [ls, le] = lineRange(); if (d < 0 && ls === 0) return; if (d > 0 && le >= v.length) return; const blk = v.slice(ls, le); if (d < 0) { const ps = v.lastIndexOf('\n', ls - 2) + 1, prev = v.slice(ps, ls - 1); ta.setSelectionRange(ps, le); ins(blk + '\n' + prev); ta.setSelectionRange(ps, ps + blk.length); } else { const ne = v.indexOf('\n', le + 1), nx = v.slice(le + 1, ne < 0 ? v.length : ne), end = ne < 0 ? v.length : ne; ta.setSelectionRange(ls, end); ins(nx + '\n' + blk); const p = ls + nx.length + 1; ta.setSelectionRange(p, p + blk.length); } };
  /* ----- find / replace ----- */
  const fi = document.createElement('input'), ri = document.createElement('input'), fc = document.createElement('span'); fi.className = ri.className = 'ide-in'; fi.placeholder = 'Chercher'; ri.placeholder = 'Remplacer par'; fc.style.cssText = 'color:var(--sub);font-size:12px;min-width:60px';
  const findNext = (dir = 1) => { const q = fi.value; if (!q) { fc.textContent = ''; return; } const v = ta.value.toLowerCase(), qq = q.toLowerCase(); let idx = dir > 0 ? v.indexOf(qq, ta.selectionEnd) : v.lastIndexOf(qq, ta.selectionStart - 1); if (idx < 0) idx = dir > 0 ? v.indexOf(qq) : v.lastIndexOf(qq); if (idx < 0) { fc.textContent = '0 résultat'; return; } ta.focus(); ta.setSelectionRange(idx, idx + q.length); const before = v.slice(0, idx).split('\n').length; ta.scrollTop = Math.max(0, (before - 6) * 19); syncScroll(); fc.textContent = v.split(qq).length - 1 + ' résultats'; fi.focus(); };
  const replaceAll = () => { if (!fi.value || active == null) return; const re = new RegExp(fi.value.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'), 'gi'); const n = (ta.value.match(re) || []).length; ta.focus(); ta.select(); ins(ta.value.replace(re, () => ri.value)); fc.textContent = n + ' remplacé' + (n > 1 ? 's' : ''); };
  fi.onkeydown = e => { if (e.key === 'Enter') { e.preventDefault(); findNext(e.shiftKey ? -1 : 1); } if (e.key === 'Escape') { findBar.classList.remove('on'); ta.focus(); } };
  findBar.append(fi, mkB('↓', () => findNext(1), 'sm'), mkB('↑', () => findNext(-1), 'sm'), ri, mkB('Tout remplacer', replaceAll, 'sm'), fc, mkB('✕', () => findBar.classList.remove('on'), 'sm'));
  const showFind = () => { findBar.classList.add('on'); const sel = ta.value.slice(ta.selectionStart, ta.selectionEnd); if (sel && !sel.includes('\n')) fi.value = sel; fi.focus(); fi.select(); };
  /* ----- tabs and tree ----- */
  const renderTabs = () => {
    tabs.innerHTML = ''; openTabs = openTabs.filter(p => proj && p in proj.files);
    openTabs.forEach(p => { const b = document.createElement('button'); b.className = 'ide-t' + (p === active ? ' on' : ''); b.innerHTML = '<span></span>' + (dirty.has(p) ? '<b>●</b>' : '') + '<span class="x" style="opacity:.6">✕</span>'; b.firstChild.textContent = p.split('/').pop(); b.title = p; b.onclick = e => { if (e.target.classList.contains('x')) { closeTab(p); } else selectFile(p); }; tabs.append(b); });
    if (!openTabs.length) { const e = document.createElement('div'); e.style.cssText = 'padding:7px 10px;color:var(--sub);font-size:13px'; e.textContent = 'Aucun fichier ouvert'; tabs.append(e); }
    if (proj) { meta.open[proj.key] = openTabs; meta.active[proj.key] = active; saveMeta(); }
  };
  const closeTab = p => { const i = openTabs.indexOf(p); openTabs.splice(i, 1); if (active === p) { active = openTabs[Math.min(i, openTabs.length - 1)] || ''; loadFile(); } renderTabs(); };
  const selectFile = p => { if (!proj || !(p in proj.files)) return; if (proj.disk && proj.files[p] === null) { readDisk(proj, p).then(() => selectFile(p)); return; } if (!openTabs.includes(p)) openTabs.push(p); active = p; loadFile(); renderTabs(); renderTree(); livePreview(); };
  const renderTree = () => {
    tree.innerHTML = ''; if (!proj) return;
    const names = Object.keys(proj.files).sort((a, b) => { const fa = a.includes('/'), fb = b.includes('/'); return fa === fb ? a.localeCompare(b) : fa ? -1 : 1; }); let lastDir = null;
    names.forEach(p => {
      const dir = p.includes('/') ? p.slice(0, p.lastIndexOf('/')) : ''; if (dir !== lastDir) { lastDir = dir; if (dir) { const d = document.createElement('div'); d.className = 'ide-f'; d.style.color = 'var(--sub)'; d.textContent = '📁 ' + dir; tree.append(d); } }
      const r = document.createElement('div'); r.className = 'ide-f' + (p === active ? ' on' : ''); r.style.paddingLeft = (8 + (dir ? 14 : 0)) + 'px'; const e = extOf(p); r.innerHTML = '<i style="--c:' + (EXT_COL[e] || '#9a88c4') + '">' + ({ json: '{}', md: 'MD', html: '<>', py: 'PY' }[e] || (e || '·').slice(0, 2).toUpperCase()).replace('<', '&lt;').replace('>', '&gt;') + '</i><span></span><span class="x" title="Renommer">✎</span><span class="x" title="Supprimer" style="margin-left:4px">✕</span>'; r.children[1].textContent = p.split('/').pop(); r.title = p;
      r.onclick = ev => { const c = ev.target.className === 'x' ? ev.target.title : ''; if (c === 'Renommer') renameFile(p); else if (c === 'Supprimer') delFile(p); else selectFile(p); };
      tree.append(r);
    });
    if (!names.length) { const e = document.createElement('div'); e.style.cssText = 'padding:10px;color:var(--sub);font-size:13px'; e.textContent = 'Projet vide'; tree.append(e); }
  };
  const newFile = async () => { if (!proj) return; const n = await askText('Nom du nouveau fichier (ex. app.js, dossier/page.html)'); if (!n) return; const p = n.replace(/\\/g, '/').replace(/^\/+/, ''); if (!/^[\w.\- \/]+$/.test(p) || p.includes('..')) { toast('Nom de fichier invalide.', true); return; } if (p in proj.files) { toast('Ce fichier existe déjà.', true); selectFile(p); return; } if (proj.disk) { try { await callMain('ide:write', proj.disk, p, ''); } catch (e) { toast(e.message, true); return; } } proj.files[p] = ''; saveProj(true); renderTree(); selectFile(p); ta.focus(); };
  const renameFile = async p => { const n = await askText('Renommer « ' + p + ' »', p, 'Renommer'); if (!n || n === p) return; const q = n.replace(/\\/g, '/').replace(/^\/+/, ''); if (!/^[\w.\- \/]+$/.test(q) || q.includes('..') || q in proj.files) { toast('Nom invalide ou déjà pris.', true); return; } if (proj.disk) { try { await callMain('ide:mv', proj.disk, p, q); } catch (e) { toast(e.message, true); return; } } proj.files[q] = proj.files[p]; delete proj.files[p]; openTabs = openTabs.map(x => x === p ? q : x); if (active === p) active = q; saveProj(true); renderTree(); renderTabs(); };
  const delFile = async p => { if (proj.disk) { if (!(await askYes('Mettre « ' + p + ' » à la corbeille de Windows ?', 'Mettre à la corbeille'))) return; try { await callMain('ide:rm', proj.disk, p); } catch (e) { toast(e.message, true); return; } } else if (!(await askYes('Supprimer « ' + p + ' » ? Cette action est définitive.', 'Supprimer'))) return; delete proj.files[p]; closeTabIf(p); saveProj(true); renderTree(); };
  const closeTabIf = p => { if (openTabs.includes(p)) closeTab(p); };
  hExp.append(mkB('+', newFile, 'sm', 'Nouveau fichier'), mkB('↻', () => syncDisk(true), 'sm', 'Relire le dossier du PC'));
  /* ----- projects ----- */
  const projSel = document.createElement('select'); projSel.className = 'ide-sel';
  const refreshProjSel = () => { projSel.innerHTML = ''; meta.projects.forEach(k => { const o = document.createElement('option'); o.value = k; o.textContent = (projects[k].disk ? '📁 ' : '') + projects[k].name; if (proj && k === proj.key) o.selected = true; projSel.append(o); }); if (!meta.projects.length) { const o = document.createElement('option'); o.textContent = '(aucun projet)'; projSel.append(o); } };
  const openProject = k => { if (saveT) saveProj(true); proj = projects[k] || null; meta.cur = k; if (proj) { proj.key = k; openTabs = (meta.open[k] || []).filter(p => p in proj.files); active = (meta.active[k] in proj.files ? meta.active[k] : openTabs[0]) || ''; if (!openTabs.length) { const first = Object.keys(proj.files).find(p => /index\.(html|js)|main\.(js|py)|plugin\.json/.test(p)) || Object.keys(proj.files)[0]; if (first) { openTabs = [first]; active = first; } } } else { openTabs = []; active = ''; } saveMeta(); refreshProjSel(); renderTree(); renderTabs(); loadFile(); killPreview(); livePreview(); refreshButtons(); };
  projSel.onchange = () => openAny(projSel.value);
  const createProject = async (tpl) => {
    const n = await askText('Nom du projet', tpl ? tpl.name : 'Mon projet', 'Créer'); if (!n) return null;
    let key = slug(n), i = 2; while (projects[key]) key = slug(n) + '-' + i++;
    const files = JSON.parse(JSON.stringify(tpl ? tpl.files : { 'notes.md': '# Notes\n\n' }));
    if (files['plugin.json']) { const id = 'moi.' + slug(n).replace(/[^a-z0-9]/g, '').slice(0, 20); try { const pj = JSON.parse(files['plugin.json']); pj.id = id; pj.name = n.slice(0, 40); pj.view = id.split('.').pop(); files['plugin.json'] = JSON.stringify(pj, null, 2) + '\n'; } catch {} }
    projects[key] = { name: n, key, files, created: Date.now(), updated: Date.now() }; meta.projects.push(key); await ctx.folder.write('p_' + key, projects[key]); openProject(key); return key;
  };
  const showTemplates = () => modal((box, done) => { box.innerHTML = '<h3>Nouveau projet</h3><div class="ide-tpls"></div>'; const g = box.lastChild; TEMPLATES.forEach(t => { const b = document.createElement('button'); b.className = 'ide-tpl'; b.innerHTML = '<b></b><span></span>'; b.firstChild.textContent = t.name; b.lastChild.textContent = t.d; b.onclick = () => { done(1); createProject(t); }; g.append(b); }); const c = document.createElement('button'); c.className = 'ide-b'; c.textContent = 'Fermer'; c.onclick = () => done(null); box.append(c); });
  const delProject = async () => { if (!proj) return; if (proj.disk) { if (!(await askYes('Fermer le dossier « ' + proj.name + ' » dans l\'Atelier ? Ses fichiers restent sur ton PC.', 'Fermer le dossier'))) return; const k = proj.key; callMain('ide:forget', proj.disk).catch(() => {}); meta.disks = meta.disks.filter(d => d.key !== k); delete projects[k]; meta.projects = meta.projects.filter(x => x !== k); saveMeta(); openAny(meta.projects[0] || ''); return; } if (!(await askYes('Supprimer le projet « ' + proj.name + ' » et tous ses fichiers ? Cette action est définitive.', 'Supprimer le projet'))) return; const k = proj.key; delete projects[k]; meta.projects = meta.projects.filter(x => x !== k); await ctx.folder.remove('p_' + k).catch(() => {}); openAny(meta.projects[0] || ''); };
  const renameProject = async () => { if (!proj) return; const n = await askText('Nom du projet', proj.name, 'Renommer'); if (!n) return; proj.name = n; saveProj(true); refreshProjSel(); };
  /* ----- preview, console, running ----- */
  let iframe = null, worker = null, workerT = 0;
  const killPreview = () => { iframe?.remove(); iframe = null; prevHolder.innerHTML = ''; prevKind = ''; if (worker) { worker.terminate(); worker = null; clearTimeout(workerT); } };
  const emptyPrev = msg => { killPreview(); const d = document.createElement('div'); d.className = 'ide-prev-empty'; d.textContent = msg; prevHolder.append(d); };
  const mkFrame = (html) => { prevHolder.innerHTML = ''; iframe = document.createElement('iframe'); iframe.className = 'ide-prev'; iframe.setAttribute('sandbox', 'allow-scripts allow-modals allow-forms'); iframe.srcdoc = html; prevHolder.append(iframe); };
  window.addEventListener('message', e => { if (!e.data || !e.data.neoIde || !iframe || e.source !== iframe.contentWindow) return; log(e.data.l, e.data.a.join(' ')); });
  const livePreview = (force) => {
    if (!proj) return emptyPrev('Crée ou ouvre un projet.');
    const f = proj.files, ext = extOf(active || '');
    if (ext === 'md' && typeof f[active] === 'string') { killPreview(); prevKind = 'md'; hPrev.firstChild.textContent = 'Aperçu · ' + active.split('/').pop(); mkFrame('<!doctype html><meta charset=utf-8><style>body{font:15px/1.6 system-ui,sans-serif;padding:14px 22px;color:#1d1530;max-width:820px}pre,code{background:#f1ecfa}pre{padding:10px;overflow:auto}code{padding:1px 4px}blockquote{margin:0;padding-left:12px;border-left:4px solid #c9b6f5;color:#55497a}img{max-width:100%}</style>' + md2html(f[active])); return; }
    if (prevKind === 'md') prevKind = '';
    if (f['index.html'] && !f['plugin.json'] && ['html', 'css', 'js'].includes(ext) && (force || prevKind === 'web' || !prevKind)) { if (prevKind !== 'web' || force || ext !== 'js') { prevKind = 'web'; hPrev.firstChild.textContent = 'Aperçu · index.html'; mkFrame(inlineProject(f, f['index.html'])); } return; }
    if (f['plugin.json'] && prevKind === 'plugin' && force) { prevKind = 'plugin'; mkFrame(pluginPage(f, 'moi.test')); return; }
    if (!prevKind) emptyPrev(f['plugin.json'] ? 'Appuie sur ▶ pour tester ce plugin.' : ext === 'py' ? 'Appuie sur ▶ pour exécuter le script Python.' : ext === 'js' ? 'Appuie sur ▶ pour exécuter le script dans le bac à sable.' : f['index.html'] ? 'Ouvre un fichier du site : l\'aperçu se met à jour en tapant.' : 'Pas d\'aperçu pour ce fichier.');
  };
  const runJs = code => {
    log('sys', '▶ ' + active + ' (bac à sable)');
    let w; try { w = new Worker(URL.createObjectURL(new Blob([WORKER_SRC], { type: 'text/javascript' }))); } catch (e) { log('warn', 'Les workers sont bloqués ici : le script tourne dans un cadre isolé (impossible de l\'interrompre).'); prevKind = 'js'; mkFrame('<!doctype html><meta charset=utf-8>' + CONSOLE_HOOK + '<script type="module">' + code.replace(/<\/script/gi, '<\\/script') + '<\/script>'); return; }
    emptyPrev('Script JavaScript : voir la console.'); prevKind = 'js'; worker = w;   // emptyPrev arrête l'ancien worker
    w.onmessage = e => { if (e.data.done) { log('sys', '■ terminé'); w.terminate(); worker = null; clearTimeout(workerT); } else log(e.data.l, e.data.a.join(' ')); };
    w.onerror = e => { log('error', e.message || 'Erreur'); };
    workerT = setTimeout(() => { if (worker === w) { w.terminate(); worker = null; log('error', 'Interrompu : le script tourne depuis plus de 8 secondes.'); } }, 8000);
    w.postMessage(code);
  };
  const runPy = async () => {
    if (!proj) return; log('sys', '▶ ' + active + ' (Python)');
    let info = null; try { info = await ctx.neo?.pluginMain?.(ctx.id, 'ide:pyinfo'); } catch {}
    if (!info || !info.ok) { log('error', 'Python n\'est pas disponible : ' + (info?.err || 'installe Python 3 (python.org) puis relance l\'Atelier. Cette fonction demande l\'accès complet et un plugin signé.')); return; }
    const files = {}; if (!proj.disk) for (const [k, v] of Object.entries(proj.files)) if (!k.endsWith('.png')) files[k] = v;
    try { const r = await ctx.neo.pluginMain(ctx.id, 'ide:python', proj.disk ? { root: proj.disk, main: active } : { files, main: active }); if (r.out) log('log', r.out.replace(/\n$/, '')); if (r.err) log('error', r.err.replace(/\n$/, '')); log('sys', '■ code de sortie ' + r.code + (r.timeout ? ' (interrompu : plus de 10 s)' : '') + ' · ' + info.v); } catch (e) { log('error', 'Exécution impossible : ' + e.message); }
  };
  const testPlugin = () => { if (!proj || !proj.files['plugin.json']) { toast('Ce projet n\'est pas un plugin (plugin.json manquant).', true); return; } const v = validatePlugin(proj.files); if (v.some(x => x.lvl === 'e')) { showValidation(v); return; } prevKind = 'plugin'; hPrev.firstChild.textContent = 'Test du plugin'; log('sys', '▶ test du plugin (bac à sable, dossier de données en mémoire)'); mkFrame(pluginPage(proj.files, 'moi.test')); };
  const run = () => {
    if (!proj || !active) { toast('Ouvre un fichier.', true); return; } saveProj(true); const f = proj.files, ext = extOf(active);
    if (f['plugin.json']) return testPlugin();
    if (ext === 'py') return runPy();
    if (f['index.html'] && (ext === 'html' || ext === 'css' || (ext === 'js' && /<script[^>]+src=["'](\.\/)?${active}/.test(f['index.html'])) || ext === 'js' && f['index.html'].includes(active))) { prevKind = 'web'; hPrev.firstChild.textContent = 'Aperçu · index.html'; con.innerHTML = ''; mkFrame(inlineProject(f, f['index.html'])); log('sys', '▶ page rechargée'); return; }
    if (ext === 'js') return runJs(proj.files[active]);
    if (ext === 'html') { prevKind = 'web'; mkFrame(inlineProject(f, f[active])); return; }
    toast('Rien à exécuter pour ce type de fichier.');
  };
  let termMode = false;
  const termB = mkB('JavaScript', () => { termMode = !termMode && !!proj?.disk; if (!proj?.disk) toast('Le terminal s\'ouvre dans un dossier du PC : « Ouvrir un dossier ».'); setTerm(); }, 'sm', 'Ce que la ligne du bas exécute'); hCon.append(termB);
  const setTerm = () => { if (!proj?.disk) termMode = false; termB.textContent = termMode ? 'Terminal' : 'JavaScript'; cin.placeholder = termMode ? (navigator.platform.startsWith('Win') ? 'Commande PowerShell dans le dossier ouvert, puis Entrée' : 'Commande dans le dossier ouvert, puis Entrée') : 'Entre une expression JavaScript (aperçu en cours) et appuie sur Entrée'; };
  const cmdHist = []; let cmdK = 0;
  cin.addEventListener('keydown', e => { if (!termMode || !cmdHist.length || (e.key !== 'ArrowUp' && e.key !== 'ArrowDown')) return; e.preventDefault(); cmdK = Math.max(0, Math.min(cmdHist.length, cmdK + (e.key === 'ArrowUp' ? -1 : 1))); cin.value = cmdHist[cmdK] || ''; });
  const shellRun = async line => {
    const p = proj; log('sys', '$ ' + line); cmdHist.push(line); cmdK = cmdHist.length; cin.disabled = true;
    try { const r = await callMain('ide:sh', p.disk, line); if (r.out) log('log', r.out.replace(/\n$/, '')); if (r.err) log('error', r.err.replace(/\n$/, '')); log('sys', '■ code ' + r.code + (r.timeout ? ' (arrêté après 60 s)' : '')); }
    catch (e) { log('error', e.message); }
    cin.disabled = false; cin.focus(); if (p === proj) syncDisk();
  };
  cin.onkeydown = e => { if (e.key !== 'Enter' || !cin.value.trim()) return; const code = cin.value; cin.value = ''; if (termMode && proj?.disk) return shellRun(code); log('sys', '> ' + code); if (iframe) iframe.contentWindow.postMessage({ neoEval: code }, '*'); else { try { const r = (0, eval)('"use strict";' + code); log('result', String(r)); } catch (x) { log('error', x.message); } } };
  /* ----- validation / export ----- */
  const showValidation = res => modal((box, done) => { box.innerHTML = '<h3>Validation du plugin</h3><div class="ide-val"></div>'; const l = box.lastChild; res.forEach(r => { const d = document.createElement('div'); d.className = r.lvl; d.textContent = (r.lvl === 'e' ? '✕ ' : r.lvl === 'w' ? '! ' : '✓ ') + r.msg; l.append(d); }); const c = document.createElement('button'); c.className = 'ide-b acc'; c.textContent = 'Fermer'; c.onclick = () => done(1); box.append(c); });
  const validate = () => { if (!proj) return; saveProj(true); showValidation(validatePlugin(proj.files)); };
  const exportZip = () => {
    if (!proj) return; saveProj(true); const enc = new TextEncoder(); let name = proj.key, list = [];
    const isPlugin = !!proj.files['plugin.json'];
    if (isPlugin) { const v = validatePlugin(proj.files); if (v.some(x => x.lvl === 'e')) { showValidation(v); toast('Corrige les erreurs avant d\'exporter.', true); return; } const m = JSON.parse(proj.files['plugin.json']); name = m.id + '-' + m.version; }
    for (const [k, v] of Object.entries(proj.files)) if (typeof v === 'string' && !proj.bin?.has(k)) list.push({ name: k, data: enc.encode(v) });
    if (isPlugin && !proj.files['icon.png']) list.push({ name: 'icon.png', data: b64bytes(identicon(JSON.parse(proj.files['plugin.json']).id)) });
    const blob = zip(list), a = document.createElement('a'); a.href = URL.createObjectURL(blob); a.download = name + '.zip'; a.click(); setTimeout(() => URL.revokeObjectURL(a.href), 4000);
    toast('Archive créée : ' + name + '.zip (' + list.length + ' fichiers)'); log('sys', isPlugin ? 'Archive prête : à joindre à une Release GitHub (topic neodex-plugin).' : 'Projet exporté en .zip');
  };
  /* ----- toolbar ----- */
  const refreshButtons = () => { bar.innerHTML = ''; bar.append(projSel, mkB('Nouveau', showTemplates, '', 'Nouveau projet depuis un modèle'), mkB('Ouvrir un dossier', openFolder, '', 'Travailler sur un dossier de ton PC'), mkB('Renommer', renameProject, 'sm'), proj?.disk ? mkB('Fermer le dossier', delProject, 'sm', 'Les fichiers restent sur ton PC') : mkB('Supprimer', delProject, 'sm'), mkB('▶ Exécuter', run, 'run', 'Ctrl + Entrée'), mkB('Enregistrer', () => { saveProj(true); toast('Enregistré'); }, '', 'Ctrl + S')); if (proj && proj.files['plugin.json']) bar.append(mkB('Valider le plugin', validate, '', 'Vérifie plugin.json et le code')); bar.append(mkB('Exporter .zip', exportZip, 'acc'), mkB('Chercher', searchAll, 'sm', 'Chercher dans tout le projet (Ctrl+Maj+F)'), mkB('Importer', importFiles, 'sm', 'Ajouter des fichiers au projet (ou glisse-les sur la liste des fichiers)'), mkB('Commandes', palette, 'sm', 'Ctrl+P'), mkB('Aide', help, 'sm')); if (proj?.disk) bar.append(mkB('Git', gitPanel, 'sm', 'Fichiers modifiés, comparaison et commit')); bar.prepend(Object.assign(document.createElement('span'), { className: 'ide-logo', textContent: 'ATELIER' })); };
  const help = () => modal((box, done) => { box.innerHTML = '<h3>Aide de l\'Atelier</h3><div style="line-height:1.55;font-size:13px">Ctrl+P : fichiers et commandes · Ctrl+Maj+F : chercher dans tout le projet · Maj+Alt+F : formater · Ctrl+= / Ctrl+- : taille du texte<br>Ctrl+S enregistre · Ctrl+Entrée exécute · Ctrl+F cherche / remplace · Ctrl+/ commente · Ctrl+D duplique la ligne · Alt+↑/↓ déplace la ligne · Tab indente.<br>Ctrl+Espace : autocomplétion (mots-clés, extraits, API de NeoDex, noms du projet) · Ctrl+G : aller à la ligne · Ctrl+Maj+O : plan du fichier · F2 : renommer le mot partout dans le fichier · Ctrl+H : historique du fichier.<br><b>Problèmes</b> : parenthèses, balises, JSON, deux-points en Python… sont vérifiés pendant que tu tapes ; la ligne s\'allume dans la marge et la barre du bas les liste.<br><b>Dossier du PC</b> : « Ouvrir un dossier » travaille sur tes vrais fichiers (enregistrés dessus), avec <b>Git</b> (fichiers modifiés, comparaison, commit) et un <b>terminal</b> (bouton JavaScript / Terminal de la console). Supprimer un fichier le met à la corbeille.<br><br><b>Pages web</b> : crée un projet « Page web » ; l\'aperçu se met à jour en tapant (le CSS et le JS liés sont pris dans le projet).<br><b>JavaScript</b> : « ▶ » exécute le fichier dans un bac à sable (8 s au plus, <code>await</code> permis).<br><b>Python</b> : demande Python 3 installé sur le PC ; le projet entier est écrit dans un dossier temporaire.<br><b>Plugins</b> : modèles « Plugin : … », ▶ teste le plugin dans un cadre isolé avec un dossier de données temporaire, « Valider » vérifie plugin.json, « Exporter .zip » fabrique l\'archive à joindre à une Release GitHub.<br><br>Ton code ne tourne jamais dans NeoDex : il est toujours isolé (<code>sandbox</code>) et ne voit ni tes données ni tes onglets.</div>'; const c = document.createElement('button'); c.className = 'ide-b acc'; c.textContent = 'Fermer'; c.onclick = () => done(1); box.append(c); });
  /* ----- barre d'état, ligne courante, palette de commandes, recherche dans le projet, formatage, import, zoom ----- */
  const status = document.createElement('div'); status.className = 'ide-status'; pEd.append(status);
  const stText = document.createElement('span'), probBtn = document.createElement('button'); probBtn.className = 'ide-prob'; probBtn.title = 'Problèmes du fichier'; status.append(stText, probBtn);
  const curLine = document.createElement('div'); curLine.className = 'ide-cur'; codeBox.prepend(curLine);
  const LANG_NAME = { html: 'HTML', css: 'CSS', js: 'JavaScript', json: 'JSON', py: 'Python', md: 'Markdown', txt: 'Texte' };
  const LH = () => Math.round((meta.fs || 13) * 19 / 13);
  const updStatus = () => {
    const v = ta.value, s = ta.selectionStart, line = v.slice(0, s).split('\n').length, col = s - v.lastIndexOf('\n', s - 1), selN = Math.abs(ta.selectionEnd - s);
    curLine.style.top = (8 + (line - 1) * LH() - ta.scrollTop) + 'px'; curLine.style.height = LH() + 'px'; curLine.hidden = !active || ta.disabled;
    stText.textContent = active ? `Ligne ${line}, col ${col}${selN ? ' · ' + selN + ' car. sélectionné' + (selN > 1 ? 's' : '') : ''} · ${LANG_NAME[langOf(active)]} · ${v.split('\n').length} lignes · ${(new Blob([v]).size / 1024).toFixed(1)} Ko · ${dirty.has(active) ? 'modifié' : 'enregistré'} · Ctrl+P : commandes` : 'Aucun fichier ouvert · Ctrl+P : commandes';
  };
  ['input', 'keyup', 'click', 'select', 'scroll', 'focus'].forEach(ev => ta.addEventListener(ev, updStatus));
  const goLine = (p, n) => {
    selectFile(p); const v = ta.value; let pos = 0; for (let k = 0; k < n && pos >= 0; k++) pos = v.indexOf('\n', pos) + 1;
    const end = v.indexOf('\n', pos); ta.focus(); ta.setSelectionRange(pos, end < 0 ? v.length : end); ta.scrollTop = Math.max(0, (n - 6) * LH()); syncScroll(); updStatus();
  };
  const listBox = (box, input, rows, done) => {  // une liste qu'on parcourt au clavier (↑ ↓ Entrée), pour la palette et la recherche
    let sel = 0, hits = []; const list = document.createElement('div'); list.className = 'ide-pal';
    const draw = () => { hits = rows(input.value); sel = Math.min(sel, Math.max(0, hits.length - 1));
      list.replaceChildren(...(hits.length ? hits.map(([tag, label, f], k) => { const b = document.createElement('button'); b.className = 'ide-pi' + (k === sel ? ' on' : ''); const em = document.createElement('em'); em.textContent = tag; b.append(em, label); b.onclick = () => { done(1); f(); }; return b; })
        : [Object.assign(document.createElement('div'), { className: 'ide-pi', textContent: input.value ? 'Aucun résultat' : '' })]));
      list.querySelector('.on')?.scrollIntoView({ block: 'nearest' }); };
    input.oninput = () => { sel = 0; draw(); };
    input.onkeydown = e => { if (e.key === 'ArrowDown' || e.key === 'ArrowUp') { e.preventDefault(); sel = Math.max(0, Math.min(hits.length - 1, sel + (e.key === 'ArrowDown' ? 1 : -1))); draw(); }
      else if (e.key === 'Enter' && hits[sel]) { done(1); hits[sel][2](); } else if (e.key === 'Escape') done(null); };
    box.append(input, list); draw(); setTimeout(() => input.focus(), 20);
  };
  const inputOf = ph => Object.assign(document.createElement('input'), { className: 'ide-in', placeholder: ph, spellcheck: false });
  const format = () => {
    if (!active) return; const lang = langOf(active); let v = ta.value;
    try { v = lang === 'json' ? JSON.stringify(JSON.parse(v), null, 2) + '\n' : v.replace(/[ \t]+$/gm, '').replace(/\t/g, '  ').replace(/\n{3,}/g, '\n\n').replace(/\s*$/, '\n'); }
    catch (e) { toast('JSON invalide : ' + e.message, true); return; }
    if (v === ta.value) return toast('Déjà propre');
    ta.focus(); ta.select(); ins(v); toast(lang === 'json' ? 'JSON remis en forme' : 'Espaces en trop retirés');
  };
  const addFiles = async list => {
    if (!proj) return; let n = 0;
    for (const f of list) {
      if (f.size > 1.5e6) { toast(f.name + ' : trop gros (1,5 Mo au plus)', true); continue; }
      const p = f.name.replace(/[^\w.\- ]/g, '_');
      if (proj.disk) { if (/^image\//.test(f.type)) { toast(f.name + ' : copie les images directement dans le dossier', true); continue; } const t = await f.text(); try { await callMain('ide:write', proj.disk, p, t); } catch (e) { toast(e.message, true); continue; } proj.files[p] = t; n++; continue; }
      proj.files[p] = /^image\//.test(f.type) ? await new Promise(r => { const fr = new FileReader(); fr.onload = () => r(fr.result); fr.readAsDataURL(f); }) : await f.text(); n++;
    }
    if (n) { saveProj(true); renderTree(); toast(n + ' fichier' + (n > 1 ? 's importés' : ' importé')); }
  };
  const importFiles = () => { const i = document.createElement('input'); i.type = 'file'; i.multiple = true; i.onchange = () => addFiles([...i.files]); i.click(); };
  pExp.addEventListener('dragover', e => { e.preventDefault(); pExp.classList.add('drop'); });
  pExp.addEventListener('dragleave', () => pExp.classList.remove('drop'));
  pExp.addEventListener('drop', e => { e.preventDefault(); pExp.classList.remove('drop'); addFiles([...e.dataTransfer.files]); });
  const zoom = d => { meta.fs = Math.max(10, Math.min(22, (meta.fs || 13) + d)); root.style.setProperty('--fs', meta.fs + 'px'); root.style.setProperty('--lh', LH() + 'px'); saveMeta(); refreshEd(); syncScroll(); updStatus(); };
  const searchAll = () => modal((box, done) => {
    box.innerHTML = '<h3>Chercher dans tout le projet</h3>';
    listBox(box, inputOf('Texte à chercher (2 caractères au moins)'), q => {
      if (q.length < 2) return []; const out = [], ql = q.toLowerCase();
      for (const [p, t] of Object.entries(proj?.files || {})) { if (typeof t !== 'string' || t.startsWith('data:')) continue; t.split('\n').forEach((l, n) => { if (out.length < 200 && l.toLowerCase().includes(ql)) out.push([p + ':' + (n + 1), l.trim().slice(0, 120), () => goLine(p, n)]); }); }
      return out;
    }, done);
  });
  const palette = () => modal((box, done) => {
    box.innerHTML = '<h3>Aller à un fichier ou lancer une commande</h3>';
    const cmds = [['Exécuter', run], ['Enregistrer', () => { saveProj(true); toast('Enregistré'); }], ['Nouveau fichier', newFile], ['Nouveau projet', showTemplates], ['Formater le fichier', format],
      ['Chercher dans le projet', searchAll], ['Importer des fichiers', importFiles], ['Valider le plugin', validate], ['Exporter .zip', exportZip], ['Agrandir le texte', () => zoom(1)], ['Réduire le texte', () => zoom(-1)], ['Aide', help],
      ['Ouvrir un dossier du PC', openFolder], ['Aller à la ligne', goToLine], ['Plan du fichier', outline], ['Renommer le mot sous le curseur', renameWord], ['Problèmes', showProblems], ['Historique du fichier', history], ['Autocomplétion', () => acOpen(true)], ...(proj?.disk ? [['Git', gitPanel], ['Relire le dossier', () => syncDisk(true)]] : [])];
    listBox(box, inputOf('Nom de fichier ou commande'), q => { const ql = q.trim().toLowerCase();
      return [...Object.keys(proj?.files || {}).filter(p => p.toLowerCase().includes(ql)).map(p => ['fichier', p, () => selectFile(p)]), ...cmds.filter(([n]) => n.toLowerCase().includes(ql)).map(([n, f]) => ['commande', n, f])].slice(0, 40); }, done);
  });
  root.addEventListener('keydown', e => {  // en capture : avant les raccourcis de l'éditeur
    const mod = e.ctrlKey || e.metaKey, k = e.key.toLowerCase(), act = mod && k === 'p' ? palette : mod && e.shiftKey && k === 'o' ? outline : mod && !e.shiftKey && k === 'g' ? goToLine : mod && !e.shiftKey && k === 'h' ? history : e.key === 'F2' && e.target === ta ? renameWord : mod && e.shiftKey && k === 'f' ? searchAll : e.altKey && e.shiftKey && k === 'f' ? format : mod && (k === '=' || k === '+') ? () => zoom(1) : mod && k === '-' ? () => zoom(-1) : null;
    if (act) { e.preventDefault(); e.stopPropagation(); act(); }
  }, true);
  if (meta.fs) zoom(0);
  /* ----- problèmes ----- */
  const checkNow = () => {
    probs = active && proj && !proj.bin?.has(active) && typeof proj.files[active] === 'string' ? diagnose(langOf(active), ta.value) : [];
    probLines = new Set(probs.map(x => x.line).filter(Boolean)); probKey = probs.map(x => x.line + x.msg).join('|'); refreshEd();
    probBtn.classList.toggle('bad', probs.length > 0); probBtn.hidden = !active;
    probBtn.replaceChildren(...(probs.length ? [Object.assign(document.createElement('span'), { textContent: '✕ ' + probs.length + ' ' }), Object.assign(document.createElement('span'), { textContent: probs.length > 1 ? 'problèmes' : 'problème' })] : [Object.assign(document.createElement('span'), { textContent: '✓ Aucun problème' })]));
  };
  const probLabel = x => { const d = document.createElement('span'); if (x.ch) d.append(Object.assign(document.createElement('code'), { textContent: x.ch + ' ' })); d.append(Object.assign(document.createElement('span'), { textContent: x.msg })); if (x.open) d.append(' ', Object.assign(document.createElement('code'), { textContent: x.open }), ' (', Object.assign(document.createElement('span'), { textContent: 'ligne' }), ' ' + x.at + ')'); if (x.detail) d.append(' · ', Object.assign(document.createElement('span'), { textContent: x.detail, translate: false })); return d; };
  const showProblems = () => modal((box, done) => {
    box.innerHTML = '<h3>Problèmes</h3>'; if (!probs.length) box.append(Object.assign(document.createElement('div'), { textContent: 'Aucun problème dans ce fichier.' }));
    const list = document.createElement('div'); list.className = 'ide-pal';
    probs.forEach(x => { const b = document.createElement('button'); b.className = 'ide-pi'; const em = document.createElement('em'); em.textContent = x.line ? 'L' + x.line : '—'; b.append(em, probLabel(x)); b.onclick = () => { done(1); if (x.line) goLine(active, x.line - 1); }; list.append(b); });
    box.append(list, mkB('Fermer', () => done(1), 'acc'));
  });
  probBtn.onclick = showProblems;
  /* ----- aller à la ligne, plan du fichier, renommer ----- */
  const goToLine = async () => { if (!active) return; const n = parseInt(await askText('Aller à la ligne', ''), 10); if (n > 0) goLine(active, n - 1); };
  const outline = () => { if (!active) return; const syms = symbols(langOf(active), ta.value); modal((box, done) => { box.innerHTML = '<h3>Plan du fichier</h3>'; listBox(box, inputOf(syms.length ? 'Filtrer' : 'Rien à lister dans ce fichier'), q => syms.filter(x => x.name.toLowerCase().includes(q.trim().toLowerCase())).map(x => [x.kind + ' · L' + x.line, x.name, () => goLine(active, x.line - 1)]), done); }); };
  const wordAt = () => { const v = ta.value, s = ta.selectionStart; let a = s, b = s; while (a > 0 && /[\w$]/.test(v[a - 1])) a--; while (b < v.length && /[\w$]/.test(v[b])) b++; return v.slice(a, b); };
  const renameWord = async () => {
    if (!active || ta.disabled) return; const w = wordAt(); if (!w) return toast('Place le curseur sur un nom.');
    const n = await askText('Renommer « ' + w + ' » partout dans ce fichier', w, 'Renommer'); if (!n || n === w) return;
    const re = new RegExp('(?<![\\w$])' + w.replace(/\$/g, '\\$') + '(?![\\w$])', 'g'), count = (ta.value.match(re) || []).length;
    const keep = ta.selectionStart; ta.focus(); ta.select(); ins(ta.value.replace(re, () => n)); ta.setSelectionRange(keep, keep); toast(count + ' × ' + w + ' → ' + n);
  };
  /* ----- autocomplétion ----- */
  const ac = document.createElement('div'); ac.className = 'ide-ac'; ac.hidden = true; codeBox.append(ac);
  let acItems = [], acSel = 0, acPre = '';
  const charW = (() => { const c = document.createElement('canvas').getContext('2d'); return () => { c.font = (meta.fs || 13) + 'px Consolas, "Courier New", monospace'; return c.measureText('MMMMMMMMMM').width / 10; }; })();
  const caretXY = pos => { const v = ta.value, line = v.slice(0, pos).split('\n').length - 1, col = pos - (v.lastIndexOf('\n', pos - 1) + 1); return { x: 10 + col * charW() - ta.scrollLeft, y: 8 + line * LH() - ta.scrollTop }; };
  const wordsCache = { k: '', set: new Set() };
  const projectWords = lang => {
    const k = (proj?.key || '') + lang + Object.values(proj?.files || {}).reduce((n, t) => n + (typeof t === 'string' ? t.length : 0), 0);
    if (wordsCache.k === k) return wordsCache.set; const set = new Set();
    for (const [p, t] of Object.entries(proj?.files || {})) if (typeof t === 'string' && !t.startsWith('data:') && t.length < 400000 && langOf(p) === lang) for (const m of t.matchAll(/[A-Za-z_$][\w$]{2,}/g)) set.add(m[0]);
    wordsCache.k = k; wordsCache.set = set; return set;
  };
  const acClose = () => { ac.hidden = true; acItems = []; };
  const acDraw = () => {
    ac.replaceChildren(...acItems.map((it, k) => { const b = document.createElement('button'); b.className = 'ide-pi' + (k === acSel ? ' on' : ''); const em = document.createElement('em'); em.textContent = it.kind; b.append(em, Object.assign(document.createElement('span'), { textContent: it.label, translate: false })); b.onmousedown = e => { e.preventDefault(); acAccept(it); }; return b; }));
    ac.querySelector('.on')?.scrollIntoView({ block: 'nearest' });
  };
  const acOpen = force => {
    if (!active || ta.disabled || ta.selectionStart !== ta.selectionEnd) return acClose();
    const s = ta.selectionStart, lang = langOf(active); acPre = /[\w$.-]*$/.exec(ta.value.slice(Math.max(0, s - 80), s))[0];
    if (lang !== 'css') acPre = acPre.replace(/^.*-/, ''); if (lang !== 'js') acPre = acPre.replace(/^.*\./, '');
    if (!force && acPre.replace(/^.*\./, '').length < 2 && !(lang === 'js' && /^ctx\.$|\.\w*$/.test(acPre) && acPre.startsWith('ctx'))) return acClose();
    acItems = complete(lang, acPre, projectWords(lang)); acSel = 0;
    if (!acItems.length) return acClose();
    const p = caretXY(s - acPre.length); ac.hidden = false; acDraw();
    ac.style.left = Math.max(0, Math.min(p.x, codeBox.clientWidth - 260)) + 'px'; ac.style.top = (p.y + LH() + 230 > codeBox.clientHeight && p.y > 240 ? p.y - Math.min(228, ac.offsetHeight) : p.y + LH()) + 'px';
  };
  const acAccept = it => {
    const s = ta.selectionStart, from = s - acPre.length, v = ta.value, ind = /^[ \t]*/.exec(v.slice(v.lastIndexOf('\n', from - 1) + 1))[0];
    const text = it.insert.replace(/\n/g, '\n' + ind), mark = text.indexOf('$0'), clean = text.replace('$0', '');
    ta.focus(); ta.setSelectionRange(from, s); ins(clean); if (mark >= 0) ta.setSelectionRange(from + mark, from + mark);
    acClose(); onEdit();
  };
  codeBox.addEventListener('keydown', e => {
    if (!ac.hidden) {
      if (e.key === 'ArrowDown' || e.key === 'ArrowUp') { e.preventDefault(); e.stopPropagation(); acSel = (acSel + (e.key === 'ArrowDown' ? 1 : -1) + acItems.length) % acItems.length; acDraw(); return; }
      if (e.key === 'Enter' || e.key === 'Tab') { e.preventDefault(); e.stopPropagation(); acAccept(acItems[acSel]); return; }
      if (e.key === 'Escape') { e.preventDefault(); e.stopPropagation(); acClose(); return; }
    }
    if ((e.ctrlKey || e.metaKey) && e.key === ' ') { e.preventDefault(); e.stopPropagation(); acOpen(true); }
  }, true);
  ta.addEventListener('input', e => { if (e.inputType === 'insertText' && (e.data || '').length === 1 && /[\w$.-]/.test(e.data)) acOpen(false); else if (!ac.hidden && e.inputType === 'deleteContentBackward') acOpen(false); else acClose(); });
  ta.addEventListener('blur', () => setTimeout(acClose, 150)); ta.addEventListener('mousedown', acClose); ta.addEventListener('scroll', () => { if (!ac.hidden) acOpen(true); });  // la liste suit le texte qui défile
  /* ----- parenthèse correspondante ----- */
  const bm = [0, 1].map(() => { const d = document.createElement('div'); d.className = 'ide-bm'; d.hidden = true; codeBox.append(d); return d; });
  const matchBr = () => {
    bm.forEach(d => { d.hidden = true; }); if (!active || ta.disabled || ta.selectionStart !== ta.selectionEnd) return;
    const v = ta.value, s = ta.selectionStart, i = '([{}])'.includes(v[s - 1]) ? s - 1 : '([{}])'.includes(v[s]) ? s : -1; if (i < 0) return;
    const j = matchBracket(v, i); if (j < 0) return; const w = charW();
    [i, j].forEach((k, n) => { const p = caretXY(k); Object.assign(bm[n].style, { left: p.x + 'px', top: p.y + 'px', width: w + 'px', height: LH() + 'px' }); bm[n].hidden = false; });
  };
  ['keyup', 'click', 'input', 'scroll'].forEach(ev => ta.addEventListener(ev, matchBr));
  /* ----- historique local de chaque fichier ----- */
  const hist = {};
  const histOf = async k => hist[k] ??= (await ctx.folder.read('h_' + k).catch(() => null)) || {};
  // une version gardée à chaque Ctrl+S, et au plus une toutes les 2 minutes en enregistrement automatique ; 15 par fichier
  const snap = async (p, f, force) => {
    const text = p.files[f]; if (typeof text !== 'string' || text.length > 300000 || text.startsWith('data:')) return;
    const h = await histOf(p.key), list = h[f] ||= [], last = list[list.length - 1];
    if (last && last.text === text) return; if (!force && last && Date.now() - last.t < 120000) return;
    list.push({ t: Date.now(), text }); if (list.length > 15) list.splice(0, list.length - 15);
    ctx.folder.write('h_' + p.key, h).catch(() => {});
  };
  const diffView = (box, a, b) => {
    const d = lineDiff(a, b), el = document.createElement('div'); el.className = 'ide-diff'; let shown = 0;
    d.forEach((x, k) => {
      const near = x.t !== ' ' || d.slice(Math.max(0, k - 2), k + 3).some(y => y.t !== ' ');
      if (!near) { if (el.lastChild?.className !== 'g') el.append(Object.assign(document.createElement('div'), { className: 'g', textContent: '⋯' })); return; }
      el.append(Object.assign(document.createElement('div'), { className: x.t === '+' ? 'a' : x.t === '-' ? 'd' : '', textContent: x.t + ' ' + x.s, translate: false })); shown++;
    });
    if (!d.some(x => x.t !== ' ')) el.replaceChildren(Object.assign(document.createElement('div'), { className: 'g', textContent: 'Aucune différence.' }));
    box.append(el); return d;
  };
  const counts = d => '+' + d.filter(x => x.t === '+').length + ' −' + d.filter(x => x.t === '-').length;
  const history = async () => {
    if (!proj || !active || typeof proj.files[active] !== 'string') return; const p = proj, f = active, list = ((await histOf(p.key))[f] || []).slice().reverse();
    modal((box, done) => {
      box.innerHTML = '<h3>Historique du fichier</h3>';
      box.append(Object.assign(document.createElement('div'), { style: 'font-size:12px;color:var(--sub)', textContent: list.length ? 'Une version est gardée à chaque Ctrl+S (15 au plus). Clique pour comparer avec le texte actuel.' : 'Pas encore de version gardée : elles arrivent à chaque Ctrl+S.' }));
      const l = document.createElement('div'); l.className = 'ide-pal';
      list.forEach(v => { const b = document.createElement('button'); b.className = 'ide-pi'; const em = document.createElement('em'); em.textContent = new Date(v.t).toLocaleString(); b.append(em, counts(lineDiff(v.text, p.files[f]))); b.onclick = () => { done(1); compareVersion(p, f, v); }; l.append(b); });
      box.append(l, mkB('Fermer', () => done(1), 'acc'));
    });
  };
  const compareVersion = (p, f, v) => modal((box, done) => {
    box.style.width = 'min(980px,96vw)'; box.innerHTML = '<h3></h3>'; box.firstChild.textContent = f + ' · ' + new Date(v.t).toLocaleString();
    box.append(Object.assign(document.createElement('div'), { style: 'font-size:12px;color:var(--sub)', textContent: 'En rouge : la version gardée · en vert : le texte actuel' }));
    diffView(box, v.text, p.files[f]);
    const r = document.createElement('div'); r.className = 'ide-row';
    r.append(mkB('Restaurer cette version', () => { done(1); if (proj !== p) return; selectFile(f); ta.focus(); ta.select(); ins(v.text); toast('Version restaurée (Ctrl+Z pour annuler)'); }, 'acc'), mkB('Fermer', () => done(1)));
    box.append(r);
  });
  /* ----- dossiers du PC ----- */
  meta.disks ||= [];
  const addDiskProject = d => { projects[d.key] = { name: d.name, key: d.key, disk: d.root, files: {}, bin: new Set(), loaded: false }; if (!meta.projects.includes(d.key)) meta.projects.push(d.key); };
  meta.disks.forEach(addDiskProject);
  const readDisk = async (p, f) => { try { const c = await callMain('ide:read', p.disk, f); if (typeof c.text === 'string') { p.files[f] = c.text; p.bin.delete(f); } else { p.files[f] = ''; p.bin.add(f); } } catch (e) { p.files[f] = ''; p.bin.add(f); toast(f + ' : ' + e.message, true); } };
  const addEntry = (p, f, size) => { if (TEXT_EXT.test(f) && size <= 2e6) p.files[f] = null; else { p.files[f] = ''; p.bin.add(f); } };
  // la liste des fichiers, puis le contenu : tout de suite pour un petit dossier, à l'ouverture de chaque fichier pour un gros
  const loadDisk = async p => {
    const r = await callMain('ide:ls', p.disk); p.files = {}; p.bin = new Set();
    for (const f of r.files) addEntry(p, f.p, f.size);
    const todo = Object.keys(p.files).filter(f => p.files[f] === null), eager = todo.length <= 400 ? todo : todo.filter(f => !f.includes('/'));
    for (let k = 0; k < eager.length; k += 16) await Promise.all(eager.slice(k, k + 16).map(f => readDisk(p, f)));
    p.loaded = true; if (r.truncated) toast('Gros dossier : seuls les 3000 premiers fichiers sont listés.');
    if (todo.length > 400) log('sys', 'Gros dossier : le contenu de chaque fichier est lu à son ouverture (la recherche porte sur les fichiers déjà ouverts).');
  };
  const syncDisk = async (say) => {
    const p = proj; if (!p?.disk) return; let r; try { r = await callMain('ide:ls', p.disk); } catch (e) { return toast(e.message, true); }
    const now = new Set(r.files.map(f => f.p)); let add = 0, gone = 0;
    for (const f of r.files) if (!(f.p in p.files)) { addEntry(p, f.p, f.size); add++; }
    for (const f of Object.keys(p.files)) if (!now.has(f)) { delete p.files[f]; p.bin.delete(f); closeTabIf(f); gone++; }
    for (const f of Object.keys(p.files)) if (typeof p.files[f] === 'string' && !dirty.has(f) && !p.bin.has(f) && openTabs.includes(f)) { const old = p.files[f]; await readDisk(p, f); if (f === active && p.files[f] !== old && proj === p) loadFile(); }
    if (proj === p) renderTree(); if (say) toast('Dossier relu : ' + add + ' ajouté(s), ' + gone + ' retiré(s)');
  };
  const openAny = async k => {
    const p = projects[k]; if (p?.disk && !p.loaded) { emptyPrev('Lecture du dossier…'); try { await loadDisk(p); } catch (e) { toast('Dossier illisible : ' + e.message, true); } }
    openProject(k); setTerm();
  };
  const openFolder = async () => {
    let d; try { d = await callMain('ide:pickdir'); } catch (e) { toast('Ouvrir un dossier demande l\'Atelier signé avec l\'accès complet (NeoStore → Autorisations).', true); return; }
    if (!d) return; let x = meta.disks.find(y => y.root === d);
    if (!x) { x = { key: 'dir-' + slug(d.split(/[\\/]/).pop()) + '-' + Date.now().toString(36), name: d.split(/[\\/]/).pop() || d, root: d }; meta.disks.push(x); addDiskProject(x); saveMeta(); }
    await openAny(x.key);
  };
  /* ----- Git (dossier du PC) ----- */
  const gitPanel = () => { const p = proj; if (!p?.disk) return; modal(async (box, done) => {
    box.innerHTML = '<h3>Git</h3>'; const info = document.createElement('div'); info.style.cssText = 'font-size:13px;color:var(--sub)'; info.textContent = 'Lecture…'; box.append(info);
    let st; try { st = await callMain('ide:git', p.disk); } catch (e) { info.textContent = e.message; return box.append(mkB('Fermer', () => done(1), 'acc')); }
    if (!st.repo) { info.textContent = 'Ce dossier n\'est pas un dépôt git.'; return box.append(Object.assign(document.createElement('div'), { className: 'ide-row' }), mkB('Créer un dépôt (git init)', async () => { const r = await callMain('ide:sh', p.disk, 'git init'); log('sys', (r.out || r.err).trim()); done(1); gitPanel(); }, 'acc'), mkB('Fermer', () => done(1))); }
    info.replaceChildren(Object.assign(document.createElement('span'), { textContent: 'Branche : ' }), Object.assign(document.createElement('b'), { textContent: st.branch, translate: false }), ' · ' + st.files.length + ' ', Object.assign(document.createElement('span'), { textContent: st.files.length > 1 ? 'fichiers modifiés' : 'fichier modifié' }));
    const l = document.createElement('div'); l.className = 'ide-git';
    st.files.forEach(x => { const b = document.createElement('button'); b.className = 'ide-pi'; const em = document.createElement('em'); em.textContent = x.st.trim() || '?'; b.title = { M: 'modifié', A: 'ajouté', D: 'supprimé', R: 'renommé', '?': 'nouveau' }[x.st.trim()[0]] || ''; b.append(em, Object.assign(document.createElement('span'), { textContent: x.p, translate: false })); b.onclick = async () => { const head = await callMain('ide:githead', p.disk, x.p).catch(() => ({ text: '' })); if (p.files[x.p] === null) await readDisk(p, x.p); modal((b2, d2) => { b2.style.width = 'min(980px,96vw)'; b2.innerHTML = '<h3></h3>'; b2.firstChild.textContent = x.p; b2.append(Object.assign(document.createElement('div'), { style: 'font-size:12px;color:var(--sub)', textContent: 'En rouge : le dernier commit · en vert : le fichier maintenant' })); diffView(b2, head.text, p.bin.has(x.p) ? '' : p.files[x.p] ?? ''); b2.append(mkB('Fermer', () => d2(1), 'acc')); }); }; l.append(b); });
    if (!st.files.length) l.append(Object.assign(document.createElement('div'), { className: 'ide-pi', textContent: 'Rien à valider : tout est déjà dans le dernier commit.' }));
    const msg = inputOf('Message du commit'), r = document.createElement('div'); r.className = 'ide-row';
    const go = async () => { saveProj(true); const c = await callMain('ide:commit', p.disk, msg.value).catch(e => ({ code: -1, err: e.message })); log(c.code === 0 ? 'sys' : 'error', ((c.out || '') + (c.err || '')).trim()); if (c.code === 0) { toast('Commit fait'); done(1); } };
    msg.onkeydown = e => { if (e.key === 'Enter' && msg.value.trim()) go(); };
    r.append(msg, mkB('Valider (commit)', () => msg.value.trim() ? go() : toast('Écris un message de commit.', true), 'acc'));
    box.append(l, ...(st.files.length ? [r] : []), Object.assign(document.createElement('div'), { style: 'font-size:12px;color:var(--sub)', textContent: 'Pousser ou tirer : tape git push ou git pull dans le terminal de la console.' }), mkB('Fermer', () => done(1)));
    setTimeout(() => msg.focus(), 30);
  }); };
  root.__ide = { diagnose, symbols, complete, md2html, lineDiff, matchBracket, get probs() { return probs; }, get proj() { return proj; }, acOpen, get ac() { return acItems.map(x => x.label); }, acAccept: k => acAccept(acItems[k]), createProject, selectFile, snap, histOf, openAny, loadDisk, addTestDir: async d => { await callMain('ide:testroot', d); const x = { key: 'dir-test', name: 'test', root: d }; meta.disks.push(x); addDiskProject(x); await openAny(x.key); }, shellRun, gitStatus: () => callMain('ide:git', proj.disk), ta, saveProj, renameWord, wordAt, closeDisk: delProject };
  /* ----- splitter ----- */
  let rw = meta.rw || 42; main.style.setProperty('--rw', rw + '%');
  const split = document.createElement('div'); split.className = 'ide-split'; split.style.cssText = 'position:absolute;width:8px;top:0;bottom:0;cursor:col-resize;z-index:5'; split.title = 'Glisse pour redimensionner';
  /* ----- start ----- */
  refreshButtons(); refreshProjSel();
  if (!meta.projects.length) { const k = 'bienvenue'; projects[k] = { name: 'Bienvenue', key: k, files: JSON.parse(JSON.stringify(TEMPLATES[0].files)), created: Date.now(), updated: Date.now() }; meta.projects.push(k); await ctx.folder.write('p_' + k, projects[k]); }
  await openAny(meta.cur && projects[meta.cur] ? meta.cur : meta.projects[0]);
  log('sys', 'Atelier prêt. Ctrl+S enregistre, Ctrl+Entrée exécute.');
  const onBeforeClose = () => { saveProj(true); killPreview(); acClose(); };
  ctx.onClose?.(onBeforeClose);
  if (globalThis.__ideTest) globalThis.__ideTest = { get proj() { return proj; }, projects, meta, validatePlugin, zip, CRC, highlight, inlineProject, TEMPLATES, run, selectFile, createProject, openProject, log, con, ta, exportZip, identicon, b64bytes };
}
