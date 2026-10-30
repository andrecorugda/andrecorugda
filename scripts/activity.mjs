// Rewrites the "Recently shipped" block in README.md with the latest commit
// of each recently pushed repository. Run by .github/workflows/activity.yml.
import { readFileSync, writeFileSync } from 'node:fs';

const USER = 'andrecorugda';
const LIMIT = 6;
const START = '<!-- activity:start -->';
const END = '<!-- activity:end -->';

const headers = { Accept: 'application/vnd.github+json', 'User-Agent': USER };
if (process.env.GITHUB_TOKEN) headers.Authorization = `Bearer ${process.env.GITHUB_TOKEN}`;

async function api(path) {
  const res = await fetch(`https://api.github.com${path}`, { headers });
  if (!res.ok) throw new Error(`${res.status} ${path}`);
  return res.json();
}

const repos = (await api(`/users/${USER}/repos?sort=pushed&per_page=20&type=owner`))
  .filter((r) => !r.fork && !r.private && r.name !== USER)
  .slice(0, LIMIT);

const rows = [];
for (const repo of repos) {
  const [commit] = await api(`/repos/${USER}/${repo.name}/commits?per_page=1`).catch(() => []);
  if (!commit) continue;
  let subject = commit.commit.message.split('\n')[0];
  if (subject.length > 80) subject = subject.slice(0, 80).replace(/\s+\S*$/, '') + '…';
  subject = subject.replace(/\|/g, '\\|').replace(/\[|\]/g, '');
  const date = commit.commit.committer.date.slice(0, 10);
  rows.push({ date, line: `| [**${repo.name}**](${repo.html_url}) | [${subject}](${commit.html_url}) | ${date} |` });
}
rows.sort((a, b) => b.date.localeCompare(a.date));

const block = [
  START,
  '| Repository | Latest change | Date |',
  '|---|---|---|',
  ...rows.map((r) => r.line),
  END,
].join('\n');

const readme = readFileSync('README.md', 'utf8');
const next = readme.replace(new RegExp(`${START}[\\s\\S]*?${END}`), block);
if (next !== readme) {
  writeFileSync('README.md', next);
  console.log(`updated ${rows.length} rows`);
} else {
  console.log('no change');
}
