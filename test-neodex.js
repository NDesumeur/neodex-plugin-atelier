// lancé par le test « local » de NeoDex : problèmes, plan, autocomplétion, Markdown, comparaison, historique, puis un vrai dossier avec git et le terminal
const fs = require('fs'), os = require('os'), path = require('path'), { execFileSync } = require('child_process');
module.exports = async ({ pj, js, sleep }) => {
  const run = async c => { try { return await pj(c); } catch (e) { if (/pas de cadre/.test(e.message)) return js(c); throw e; } };
  const I = `document.querySelector('.ide').__ide`;
  const eq = async (code, want, what) => { const got = await run(code); if (JSON.stringify(got) !== JSON.stringify(want)) throw new Error(what + ' : ' + JSON.stringify(got)); };
  await sleep(300);
  // problèmes
  await eq(`${I}.diagnose('js', 'function f() {\\n  return [1, 2;\\n}').map(x => x.line + x.ch + x.msg)`, ['2[jamais fermé'], 'crochet jamais fermé');
  await eq(`${I}.diagnose('js', 'const r = /[(]/; const s = "a(b"; // (\\nf(1)').length`, 0, 'regex, chaîne et commentaire ignorés');
  await eq(`${I}.diagnose('json', '{\\n "a": 1,\\n}').map(x => x.line + x.msg)`, ['3JSON invalide'], 'JSON');
  await eq(`${I}.diagnose('py', 'def f()\\n    return 1\\nif x:\\nprint(2)').map(x => x.line)`, [1, 3], 'Python');
  await eq(`${I}.diagnose('html', '<div><p>a<span>b</div><ul><li>c</ul></b>').map(x => x.ch + x.msg)`, ['<span>jamais fermé', '</b>sans balise ouvrante'], 'HTML');
  await eq(`${I}.diagnose('css', 'a { color: red;\\nb { }').length`, 1, 'CSS');
  // plan, autocomplétion, Markdown, comparaison, parenthèses
  await eq(`${I}.symbols('js', 'export default async function main(ctx) {\\n  const go = () => 1;\\n}\\nclass Jeu {\\n  tick(dt) {\\n  }\\n}').map(x => x.kind + ':' + x.name)`, ['fonction:main', 'fonction:go', 'classe:Jeu', 'méthode:tick'], 'plan JS');
  await eq(`${I}.complete('js', 'ctx.fo').map(x => x.label)`, ['ctx.folder.read', 'ctx.folder.write', 'ctx.folder.remove', 'ctx.folder.list'], 'API NeoDex');
  await eq(`${I}.complete('py', 'de', ['dessiner']).map(x => x.kind + ':' + x.label)`, ['extrait:def', 'mot-clé:del', 'nom:dessiner'], 'Python complété');
  await eq(`${I}.md2html('# Titre\\n\\n- **un** [lien](javascript:x)\\n- <b>deux</b>')`, '<h1>Titre</h1>\n<ul>\n<li><b>un</b> lien</li>\n<li>&lt;b&gt;deux&lt;/b&gt;</li>\n</ul>', 'Markdown sûr');
  await eq(`${I}.lineDiff('a\\nb\\nc', 'a\\nB\\nc\\nd').map(x => x.t + x.s).join('|')`, ' a|-b|+B| c|+d', 'comparaison');
  await eq(`${I}.matchBracket('f(a[1])', 1)`, 6, 'parenthèse correspondante');
  // dans l'éditeur : un projet, une erreur signalée dans la marge, l'autocomplétion insérée, l'historique gardé
  await run(`(${I}.createProject({ name: 'Essai', files: { 'app.js': '' } }), 0)`); await sleep(300);  // il demande un nom : on répond dans la boîte
  await run(`(() => { const b = document.querySelector('.ide-mod .ide-in'); if (b) { b.value = 'Essai'; b.dispatchEvent(new KeyboardEvent('keydown', { key: 'Enter' })); } return 0; })()`); await sleep(500);
  await run(`(() => { const i = ${I}; i.selectFile('app.js'); const ta = i.ta; ta.focus(); ta.value = 'const nombre = 3;\\nconsole.log(nom'; ta.setSelectionRange(ta.value.length, ta.value.length); ta.dispatchEvent(new InputEvent('input', { inputType: 'insertText', data: 'm' })); return 0; })()`);
  await sleep(100);
  await eq(`${I}.ac[0]`, 'nombre', 'autocomplétion du nom déjà écrit');
  await run(`(${I}.acAccept(0), 0)`); await sleep(500);
  await eq(`${I}.ta.value`, 'const nombre = 3;\nconsole.log(nombre', 'nom inséré');
  await eq(`${I}.probs.map(x => x.ch + x.msg)`, ['(jamais fermé'], 'parenthèse signalée');
  if (!await run(`!!document.querySelector('.ide-gut .gx') && document.querySelector('.ide-prob').classList.contains('bad')`)) throw new Error('marge et barre du bas sans le problème');
  await run(`(async () => { const i = ${I}; i.ta.value += ')'; i.ta.dispatchEvent(new InputEvent('input', {})); i.saveProj(true); await new Promise(r => setTimeout(r, 300)); return 0; })()`); await sleep(600);
  await eq(`${I}.probs.length`, 0, 'problème corrigé');
  await eq(`(async () => { const i = ${I}; const h = await i.histOf(i.proj.key); return (h['app.js'] || []).length; })()`, 1, 'historique');
  // un vrai dossier du PC : lecture, écriture, git, terminal
  const d = fs.mkdtempSync(path.join(os.tmpdir(), 'atelier-'));
  fs.writeFileSync(path.join(d, 'main.py'), 'print("bonjour")\n'); fs.mkdirSync(path.join(d, 'src')); fs.writeFileSync(path.join(d, 'src', 'a.js'), 'let a = 1\n');
  const g = a => execFileSync('git', ['-c', 'user.name=t', '-c', 'user.email=t@t', ...a], { cwd: d, windowsHide: true });
  g(['init', '-q', '-b', 'main']); g(['add', '-A']); g(['commit', '-q', '-m', 'init']);
  try {
    await run(`(${I}.addTestDir(${JSON.stringify(d)}).then(() => 0))`); await sleep(400);
    await eq(`Object.keys(${I}.proj.files).sort()`, ['main.py', 'src/a.js'], 'fichiers du dossier');
    await run(`(() => { const i = ${I}; i.selectFile('src/a.js'); i.ta.value = 'let a = 2\\n'; i.ta.dispatchEvent(new InputEvent('input', {})); i.saveProj(true); return 0; })()`); await sleep(600);
    if (fs.readFileSync(path.join(d, 'src', 'a.js'), 'utf8') !== 'let a = 2\n') throw new Error('fichier pas enregistré sur le disque');
    await eq(`${I}.gitStatus().then(s => s.files.map(f => f.st.trim() + ' ' + f.p))`, ['M src/a.js'], 'git voit la modification');
    await run(`(${I}.shellRun('echo coucou > note.txt').then(() => 0))`); await sleep(700);
    if (!await run(`'note.txt' in ${I}.proj.files`)) throw new Error('le terminal n\'a pas créé note.txt dans la liste');
  } finally { try { fs.rmSync(d, { recursive: true, force: true, maxRetries: 5, retryDelay: 300 }); } catch {} }  // le terminal peut encore tenir le dossier un instant
  return 'problèmes (JS, JSON, Python, HTML, CSS), plan, autocomplétion, Markdown, comparaison, historique, dossier du PC avec git et terminal ok';
};
