// Atelier (IDE) : le côté système du plugin, chargé par NeoDex une fois le plugin signé et l'accès complet accordé.
// Il exécute du Python avec l'interpréteur installé sur le PC (projet copié dans un dossier temporaire neuf, ou lancé dans le dossier ouvert),
// et donne accès aux dossiers du PC que la personne a choisis elle-même dans la fenêtre de Windows : lire, écrire, git, terminal. Jamais en dehors.
const { spawn, execFile } = require('child_process');
const fs = require('fs'), path = require('path'), os = require('os'), crypto = require('crypto');

const LIMIT_MS = 10000, LIMIT_OUT = 200000, LIMIT_FILES = 300, LIMIT_BYTES = 8e6;
let found = null;
const candidates = () => process.platform === 'win32' ? [['py', ['-3']], ['python', []], ['python3', []]] : [['python3', []], ['python', []]];
const probe = (cmd, pre) => new Promise(ok => execFile(cmd, [...pre, '--version'], { windowsHide: true, timeout: 4000 }, (e, so, se) => {
  const v = String(so || se || '').trim();   // Python 2 écrivait sur stderr; Microsoft Store répond sans version quand Python n'est pas installé
  ok(!e && /^Python 3\.\d+/.test(v) ? { cmd, pre, v } : null);
}));
async function detect() {
  if (found) return found;
  for (const [c, p] of candidates()) { const r = await probe(c, p); if (r) return (found = r); }
  return null;
}
const safeRel = p => { const n = path.posix.normalize(String(p).replace(/\\/g, '/')); return /^[\w.\- \/]+$/.test(n) && !n.startsWith('/') && !n.startsWith('..') && !n.includes('/../') ? n : null; };

async function pyinfo() {
  const d = await detect();
  return d ? { ok: true, v: d.v } : { ok: false, err: 'aucun Python 3 trouvé sur ce PC. Installe-le depuis python.org (coche « Add to PATH »), puis rouvre l\'Atelier.' };
}
async function python(data) {
  const d = await detect(); if (!d) throw new Error('Python 3 introuvable');
  if (data && data.root) { const root = allowed(data.root), main = safeRel(data.main); if (!main || !main.endsWith('.py')) throw new Error('fichier à exécuter invalide'); return runIn(d.cmd, [...d.pre, '-u', '-X', 'utf8', main], root, LIMIT_MS); }
  const files = data && data.files || {}, names = Object.keys(files);
  if (!names.length || names.length > LIMIT_FILES) throw new Error('projet vide ou trop gros');
  const main = safeRel(data.main); if (!main || !(main in files) || !main.endsWith('.py')) throw new Error('fichier à exécuter invalide');
  let total = 0; for (const n of names) total += String(files[n]).length; if (total > LIMIT_BYTES) throw new Error('projet trop gros');
  const dir = fs.mkdtempSync(path.join(os.tmpdir(), 'neoatelier-' + crypto.randomBytes(3).toString('hex') + '-'));
  try {
    for (const n of names) { const rel = safeRel(n); if (!rel) continue; const full = path.join(dir, rel); if (!full.startsWith(dir + path.sep)) continue; fs.mkdirSync(path.dirname(full), { recursive: true }); fs.writeFileSync(full, String(files[n]), 'utf8'); }
    return await new Promise(ok => {
      let out = '', err = '', timeout = false, done = false;
      const ch = spawn(d.cmd, [...d.pre, '-u', '-X', 'utf8', main], { cwd: dir, windowsHide: true, env: { ...process.env, PYTHONIOENCODING: 'utf-8', PYTHONDONTWRITEBYTECODE: '1' }, stdio: ['ignore', 'pipe', 'pipe'] });
      const add = (s, c) => { const t = c.toString('utf8'); if (s === 'o') out = (out + t).slice(0, LIMIT_OUT); else err = (err + t).slice(0, LIMIT_OUT); };
      ch.stdout.on('data', c => add('o', c)); ch.stderr.on('data', c => add('e', c));
      const timer = setTimeout(() => { timeout = true; try { if (process.platform === 'win32') execFile('taskkill', ['/pid', String(ch.pid), '/T', '/F'], { windowsHide: true }, () => {}); else ch.kill('SIGKILL'); } catch {} }, LIMIT_MS);
      const end = code => { if (done) return; done = true; clearTimeout(timer); ok({ out, err, code: code == null ? -1 : code, timeout }); };
      ch.on('error', e => { err += e.message; end(-1); });
      ch.on('close', end);
    });
  } finally { try { fs.rmSync(dir, { recursive: true, force: true }); } catch {} }
}

// les dossiers ouverts : seulement ceux choisis dans la fenêtre de Windows, gardés pour les prochaines fois
let ROOTS_FILE = null, roots = [];
const saveRoots = () => { try { if (ROOTS_FILE) { fs.mkdirSync(path.dirname(ROOTS_FILE), { recursive: true }); fs.writeFileSync(ROOTS_FILE, JSON.stringify(roots)); } } catch {} };
function allowed(root) { const r = path.resolve(String(root || '')); if (!roots.includes(r)) throw new Error('dossier non autorisé : rouvre-le avec « Ouvrir un dossier »'); return r; }
function inRoot(root, rel) {
  const r = allowed(root), p = path.resolve(r, String(rel || '').replace(/\\/g, '/'));
  if (p !== r && !p.startsWith(r + path.sep)) throw new Error('chemin en dehors du dossier');
  return p;
}
const SKIP = new Set(['.git', 'node_modules', '__pycache__', '.venv', 'venv', 'dist', '.next', '.cache']);
const MAX_LS = 3000;
function ls(root) {
  const r = allowed(root), out = [];
  const walk = (dir, rel) => {
    let ents = []; try { ents = fs.readdirSync(dir, { withFileTypes: true }); } catch { return; }
    for (const e of ents) {
      if (out.length >= MAX_LS) return;
      const rp = rel ? rel + '/' + e.name : e.name;
      if (e.isDirectory()) { if (!SKIP.has(e.name)) walk(path.join(dir, e.name), rp); }
      else if (e.isFile()) { let size = 0; try { size = fs.statSync(path.join(dir, e.name)).size; } catch {} out.push({ p: rp, size }); }
    }
  };
  walk(r, ''); return { files: out, truncated: out.length >= MAX_LS };
}
function read(root, rel) {
  const p = inRoot(root, rel), st = fs.statSync(p);
  if (st.size > 2e6) return { big: true, size: st.size };
  const b = fs.readFileSync(p); if (b.subarray(0, 8000).includes(0)) return { binary: true, size: st.size };
  return { text: b.toString('utf8') };
}
function write(root, rel, text) { const p = inRoot(root, rel); if (p === allowed(root)) throw new Error('nom de fichier vide'); fs.mkdirSync(path.dirname(p), { recursive: true }); fs.writeFileSync(p, String(text), 'utf8'); return true; }
async function remove(E, root, rel) { const p = inRoot(root, rel); if (p === allowed(root)) throw new Error('le dossier lui-même ne se supprime pas ici'); await E.shell.trashItem(p); return true; }  // à la corbeille, jamais effacé pour de bon
function rename(root, a, b) { const pa = inRoot(root, a), pb = inRoot(root, b); if (fs.existsSync(pb)) throw new Error('ce nom existe déjà'); fs.mkdirSync(path.dirname(pb), { recursive: true }); fs.renameSync(pa, pb); return true; }
// une commande dans un dossier, sans fenêtre, avec une durée et une sortie limitées
function runIn(cmd, args, cwd, ms) {
  return new Promise(ok => {
    let out = '', err = '', timeout = false, done = false;
    const ch = spawn(cmd, args, { cwd, windowsHide: true, env: { ...process.env, PYTHONIOENCODING: 'utf-8', GIT_TERMINAL_PROMPT: '0' }, stdio: ['ignore', 'pipe', 'pipe'] });
    const add = (s, c) => { const t = c.toString('utf8'); if (s === 'o') out = (out + t).slice(-LIMIT_OUT); else err = (err + t).slice(-LIMIT_OUT); };
    ch.stdout.on('data', c => add('o', c)); ch.stderr.on('data', c => add('e', c));
    const timer = setTimeout(() => { timeout = true; try { if (process.platform === 'win32') execFile('taskkill', ['/pid', String(ch.pid), '/T', '/F'], { windowsHide: true }, () => {}); else ch.kill('SIGKILL'); } catch {} }, ms);
    const end = code => { if (done) return; done = true; clearTimeout(timer); ok({ out, err, code: code == null ? -1 : code, timeout }); };
    ch.on('error', e => { err += e.message; end(-1); });
    ch.on('close', end);
  });
}
const shell = (root, line) => process.platform === 'win32'
  ? runIn('powershell.exe', ['-NoProfile', '-NonInteractive', '-Command', '[Console]::OutputEncoding=[Text.Encoding]::UTF8; ' + String(line)], allowed(root), 60000)
  : runIn('/bin/sh', ['-c', String(line)], allowed(root), 60000);
const git = (root, args, ms = 20000) => runIn('git', ['-c', 'core.quotepath=off', ...args], allowed(root), ms);
async function gitStatus(root) {
  const r = await git(root, ['status', '--porcelain=v1', '-b', '-uall']);
  if (r.code !== 0) return { repo: false, err: (r.err || r.out).trim() };
  const lines = r.out.split('\n').filter(Boolean), head = lines.shift() || '';
  return { repo: true, branch: head.replace(/^## /, ''), files: lines.map(l => ({ st: l.slice(0, 2), p: l.slice(3).replace(/^.* -> /, '').replace(/^"|"$/g, '') })) };
}
async function gitHead(root, rel) { const r = await git(root, ['show', 'HEAD:' + String(rel).replace(/\\/g, '/')]); return { text: r.code === 0 ? r.out : '' }; }
async function gitCommit(root, msg) {
  if (!String(msg || '').trim()) throw new Error('message vide');
  const a = await git(root, ['add', '-A']); if (a.code !== 0) return a;
  return git(root, ['commit', '-m', String(msg)]);
}

module.exports = api => {
  const E = api.electron || require('electron');
  ROOTS_FILE = api.dataDir ? path.join(api.dataDir, 'dossiers.json') : null;
  try { roots = JSON.parse(fs.readFileSync(ROOTS_FILE, 'utf8')).filter(r => typeof r === 'string'); } catch { roots = []; }
  api.ipcMain.handle('ide:pickdir', async () => {
    const r = await E.dialog.showOpenDialog(api.getWin?.(), { title: 'Ouvrir un dossier dans l\'Atelier', properties: ['openDirectory'] });
    if (r.canceled || !r.filePaths[0]) return null;
    const d = path.resolve(r.filePaths[0]); if (!roots.includes(d)) { roots.push(d); saveRoots(); }
    return d;
  });
  if (process.env.NEO_SELFTEST) api.ipcMain.handle('ide:testroot', (_, d) => { roots.push(path.resolve(d)); return true; });  // seulement dans l'autotest de NeoDex, sans la fenêtre de Windows
  api.ipcMain.handle('ide:forget', (_, root) => { roots = roots.filter(r => r !== path.resolve(String(root))); saveRoots(); return true; });
  api.ipcMain.handle('ide:ls', (_, root) => ls(root));
  api.ipcMain.handle('ide:read', (_, root, rel) => read(root, rel));
  api.ipcMain.handle('ide:write', (_, root, rel, text) => write(root, rel, text));
  api.ipcMain.handle('ide:rm', (_, root, rel) => remove(E, root, rel));
  api.ipcMain.handle('ide:mv', (_, root, a, b) => rename(root, a, b));
  api.ipcMain.handle('ide:sh', (_, root, line) => shell(root, line));
  api.ipcMain.handle('ide:git', (_, root) => gitStatus(root));
  api.ipcMain.handle('ide:githead', (_, root, rel) => gitHead(root, rel));
  api.ipcMain.handle('ide:commit', (_, root, msg) => gitCommit(root, msg));
  api.ipcMain.handle('ide:pyinfo', () => pyinfo());
  api.ipcMain.handle('ide:python', (_, data) => python(data));
  return () => {};
};
module.exports._test = { pyinfo, python, safeRel, ls, read, write, rename, inRoot, gitStatus, gitHead, gitCommit, shell, setRoots: r => { roots = r.map(x => path.resolve(x)); } };
