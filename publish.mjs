// 配布用の公開リポジトリ shack8888/BlockModeler-app を作って、README などを push し、Release v<版> に zip を上げる
// 使い方: node C:/Users/shuic/git/BlockModeler-app/publish.mjs [--zip <zip の場所>] [--tag v1.1.0]
// 鍵は git の資格情報（git credential fill）から読む。外に公開する操作なので じぃが自分で打つ
import fs from 'node:fs';
import path from 'node:path';
import { execSync, execFileSync } from 'node:child_process';

const here = path.dirname(new URL(import.meta.url).pathname.replace(/^\/([A-Za-z]:)/, '$1'));
const arg = (n, d) => { const i = process.argv.indexOf(n); return i > 0 ? process.argv[i + 1] : d; };
const TAG = arg('--tag', 'v1.1.0');
const ZIP = arg('--zip', path.join(here, 'dist', `BlockModeler-${TAG}-windows-x64.zip`));
const OWNER = 'shack8888', REPO = 'BlockModeler-app';
if (!fs.existsSync(ZIP)) { console.error('zip が無い: ' + ZIP); process.exit(1); }
const cred = execSync('printf "protocol=https\\nhost=github.com\\n" | git credential fill', { shell: 'C:/Program Files/Git/bin/bash.exe' }).toString();
const TOK = (cred.match(/^password=(.+)$/m) || [])[1];
if (!TOK) { console.error('GitHub の鍵が読めない'); process.exit(1); }
const H = { Authorization: 'Bearer ' + TOK, Accept: 'application/vnd.github+json', 'Content-Type': 'application/json' };
const api = async (method, url, body) => { const r = await fetch(url, { method, headers: H, body: body ? JSON.stringify(body) : undefined }); const j = await r.json().catch(() => ({})); if (!r.ok && r.status !== 422) throw new Error(method + ' ' + url + ' → ' + r.status + ' ' + (j.message || '')); return j; };

// 1. リポジトリ（無ければ作る・公開）
let repo = await fetch(`https://api.github.com/repos/${OWNER}/${REPO}`, { headers: H });
if (repo.status === 404) {
  const j = await api('POST', 'https://api.github.com/user/repos', { name: REPO, description: 'BlockModeler / ブロックモデラー — a free Windows app for blocky low-poly 3D models for Roblox. Downloads and docs.', private: false, has_issues: true, has_wiki: false, has_projects: false });
  console.log('作った: ' + j.html_url);
} else console.log('ある: ' + (await repo.json()).html_url);

// 2. README・LICENSE・docs を push
const run = (c) => execSync(c, { cwd: here, stdio: 'inherit' });
if (!fs.existsSync(path.join(here, '.git'))) { run('git init -b main'); run('git config user.email 217669583+shack8888@users.noreply.github.com'); run('git config user.name shack8888'); }
fs.writeFileSync(path.join(here, '.gitignore'), 'dist/\n');
run('git add -A');
try { run(`git commit -m "ブロックモデラー ${TAG}：README・利用規約・使い方（配布用の置き場）"`); } catch { console.log('commit する変更なし'); }
try { run(`git remote add origin https://github.com/${OWNER}/${REPO}.git`); } catch {}
run('git push -u origin main');

// 3. Release（無ければ作る）と zip
let rel = await fetch(`https://api.github.com/repos/${OWNER}/${REPO}/releases/tags/${TAG}`, { headers: H });
let relJ;
if (rel.status === 404) {
  relJ = await api('POST', `https://api.github.com/repos/${OWNER}/${REPO}/releases`, { tag_name: TAG, name: `BlockModeler ${TAG}`, body: `Windows 用の無料アプリ（ベータ版）。zip を展開して BlockModeler.exe を開きます。AI 用の道具は kit フォルダの中。\n\nFree Windows app (beta). Unzip and open BlockModeler.exe. The tools for AI are in the kit folder.\n\n不具合は Issues か X の @Shack_ji へ。 / Report problems on Issues or X @Shack_ji.`, draft: false, prerelease: true });
  console.log('Release を作った: ' + relJ.html_url);
} else { relJ = await rel.json(); console.log('Release はある: ' + relJ.html_url); }
const name = path.basename(ZIP);
if ((relJ.assets || []).some((a) => a.name === name)) { console.log('zip は もう上がっている: ' + name); }
else {
  const up = relJ.upload_url.replace(/\{.*\}$/, '') + '?name=' + encodeURIComponent(name);
  console.log(`zip を上げる（${Math.round(fs.statSync(ZIP).size / 1e6)}MB・数分）…`);
  const r = await fetch(up, { method: 'POST', headers: { Authorization: 'Bearer ' + TOK, 'Content-Type': 'application/zip', 'Content-Length': String(fs.statSync(ZIP).size) }, body: fs.readFileSync(ZIP) });
  const j = await r.json();
  if (!r.ok) throw new Error('上げられない: ' + r.status + ' ' + JSON.stringify(j).slice(0, 300));
  console.log('上がった: ' + j.browser_download_url);
}
console.log('できました: https://github.com/' + OWNER + '/' + REPO + '/releases/latest');
