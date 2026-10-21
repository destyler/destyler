import assert from 'node:assert/strict'
import { execFileSync, spawnSync } from 'node:child_process'
import { mkdtempSync, readFileSync, rmSync, symlinkSync, writeFileSync } from 'node:fs'
import { tmpdir } from 'node:os'
import { join } from 'node:path'
// eslint-disable-next-line test/no-import-node-test -- Exercise release checks without publishing or browser dependencies.
import { test } from 'node:test'
import { fileURLToPath } from 'node:url'
import { changelogConfig, checkCompatibility, headings, isBreaking, readBreakingNotes, releaseRange, validateMigrationLink } from '../release-compatibility.mjs'

const script = fileURLToPath(new URL('../release-compatibility.mjs', import.meta.url))
function git(root, ...args) {
  return execFileSync('git', args, { cwd: root, encoding: 'utf8', stdio: ['ignore', 'pipe', 'pipe'] }).trim()
}
function commit(root, message) {
  git(root, 'add', '.')
  git(root, '-c', 'user.name=Test', '-c', 'user.email=test@example.invalid', 'commit', '--allow-empty', '-m', message)
}
function notes(version = 'Unreleased', link = './migration.md#nullable-callbacks') {
  return `# Release notes\n\n## ${version}: BREAKING nullable callbacks\n\nHandle null in callback details. [Migration guide](${link}).\n`
}
function fixture(t, { annotated = false } = {}) {
  const root = mkdtempSync(join(tmpdir(), 'release-compatibility-'))
  t.after(() => rmSync(root, { recursive: true, force: true }))
  git(root, 'init', '--quiet')
  writeFileSync(join(root, 'package.json'), '{"version":"0.2.13"}')
  writeFileSync(join(root, 'RELEASE-NOTES.md'), '# Release notes\n')
  writeFileSync(join(root, 'migration.md'), '# Migration\n\n## Nullable callbacks\nHandle null.\n')
  commit(root, 'feat!: historical break already released')
  if (annotated)
    git(root, '-c', 'user.name=Test', '-c', 'user.email=test@example.invalid', 'tag', '-a', 'v0.2.13', '-m', 'release')
  else
    git(root, 'tag', 'v0.2.13')
  return root
}
function release(root, version = '0.2.14') {
  writeFileSync(join(root, 'package.json'), JSON.stringify({ version }))
  commit(root, `chore: release ${version}`)
  git(root, 'tag', `v${version}`)
  return { root, eventName: 'push', ref: `refs/tags/v${version}` }
}

test('recognizes supported conventional breaking metadata and rejects ordinary subjects', () => {
  for (const value of ['feat!: change', 'fix(tabs)!: change', 'fix: change\n\nBREAKING CHANGE: accepts null', '🛠 fix(tabs)!: change'])
    assert.ok(isBreaking(value), value)
  for (const value of ['docs: discuss breaking changes', 'fix: ordinary', 'not conventional\nBREAKING CHANGE: detail', 'fix: detail\nBREAKING-CHANGE: detail'])
    assert.equal(isBreaking(value), false, value)
})

for (const annotated of [false, true]) {
  test(`ignores historical break at ${annotated ? 'annotated' : 'lightweight'} release tag`, (t) => {
    const root = fixture(t, { annotated })
    commit(root, 'docs: ordinary unbumped change')
    assert.equal(checkCompatibility({ root }).breaking, false)
    assert.equal(releaseRange(root).from, 'v0.2.13')
  })
}

test('declared break without migration notes fails, including a historical version section', (t) => {
  const root = fixture(t)
  writeFileSync(join(root, 'RELEASE-NOTES.md'), notes('0.2.13'))
  commit(root, 'fix(tabs)!: accept null')
  assert.throws(() => checkCompatibility({ root }), /Unreleased/)
})

test('breaking PR can use Unreleased without selecting a version or bump policy', (t) => {
  const root = fixture(t)
  writeFileSync(join(root, 'RELEASE-NOTES.md'), notes())
  commit(root, 'fix(tabs)!: accept null')
  assert.equal(checkCompatibility({ root }).breaking, true)
})

test('PR title and body are data, including shell syntax, not shell commands', (t) => {
  const root = fixture(t)
  writeFileSync(join(root, 'RELEASE-NOTES.md'), notes())
  const event = { pull_request: { title: 'fix(tabs)!: accept null', body: '$(touch INJECTED) `touch INJECTED`' } }
  assert.equal(checkCompatibility({ root, eventName: 'pull_request', event }).breaking, true)
  writeFileSync(join(root, 'event.json'), JSON.stringify(event))
  const result = spawnSync(process.execPath, [script], {
    cwd: root,
    encoding: 'utf8',
    env: { ...process.env, GITHUB_EVENT_NAME: 'pull_request', GITHUB_EVENT_PATH: join(root, 'event.json'), GITHUB_REF: 'refs/pull/1/merge' },
  })
  assert.equal(result.status, 0, result.stderr)
  assert.throws(() => readFileSync(join(root, 'INJECTED')))
})

test('PR body marker requires notes even with an ordinary title', (t) => {
  const root = fixture(t)
  const event = { pull_request: { title: 'fix: accept null', body: 'BREAKING CHANGE: callbacks accept null' } }
  assert.throws(() => checkCompatibility({ root, eventName: 'pull_request', event }), /Unreleased/)
})

test('unsupported hyphenated footer fails closed unless conventional ! preserves rendering', (t) => {
  const root = fixture(t)
  writeFileSync(join(root, 'RELEASE-NOTES.md'), notes())
  const event = { pull_request: { title: 'fix: accept null', body: 'BREAKING-CHANGE: accepts null' } }
  assert.throws(() => checkCompatibility({ root, eventName: 'pull_request', event }), /supported/)
  event.pull_request.title = 'fix!: accept null'
  assert.ok(checkCompatibility({ root, eventName: 'pull_request', event }).breaking)
})

test('release uses preceding tag and exact current tag, with pinned generated migration title', (t) => {
  const root = fixture(t, { annotated: true })
  writeFileSync(join(root, 'RELEASE-NOTES.md'), notes('0.2.14'))
  commit(root, 'fix(tabs)!: accept null')
  const options = release(root)
  git(root, 'tag', 'v0.2.14-beta.1') // Another tag on HEAD must not hide the release range.
  const result = checkCompatibility(options)
  assert.equal(result.from, 'v0.2.13')
  assert.ok(result.breaking)
  const config = changelogConfig(root, { GITHUB_EVENT_NAME: 'push', GITHUB_REF: options.ref })
  assert.equal(config.from, result.from)
  assert.equal(config.to, 'v0.2.14')
  assert.match(config.titles.breakingChanges, /^BREAKING CHANGES \(\[migration guidance\]\(https:\/\/github.com\/destyler\/destyler\/blob\/v0.2.14\/RELEASE-NOTES.md#0214-breaking-nullable-callbacks\)\)$/)
})

test('release fails if squash lost metadata while retaining versioned breaking notes', (t) => {
  const root = fixture(t)
  writeFileSync(join(root, 'RELEASE-NOTES.md'), notes('0.2.14'))
  commit(root, 'fix: accept null')
  assert.throws(() => checkCompatibility(release(root)), /Preserve breaking metadata/)
})

test('release does not silently ignore Unreleased notes even if metadata was lost', (t) => {
  const root = fixture(t)
  writeFileSync(join(root, 'RELEASE-NOTES.md'), notes())
  assert.throws(() => checkCompatibility(release(root)), /Assign Unreleased/)
})

test('release requires current-version notes, not historical notes', (t) => {
  const root = fixture(t)
  writeFileSync(join(root, 'RELEASE-NOTES.md'), notes('0.2.12'))
  commit(root, 'fix!: accept null')
  assert.throws(() => checkCompatibility(release(root)), /0.2.14: BREAKING/)
})

test('tag version mismatch and tag pointing elsewhere fail', (t) => {
  const root = fixture(t)
  const options = release(root)
  writeFileSync(join(root, 'package.json'), '{"version":"0.2.15"}')
  assert.throws(() => checkCompatibility(options), /must agree/)
  writeFileSync(join(root, 'package.json'), '{"version":"0.2.14"}')
  commit(root, 'docs: later checkout')
  assert.throws(() => checkCompatibility(options), /identify this checkout/)
})

test('no-break release needs no invented migration section or version policy', (t) => {
  const root = fixture(t)
  const result = checkCompatibility(release(root, '0.2.14'))
  assert.equal(result.breaking, false)
})

test('missing preceding tags and shallow history fail closed', (t) => {
  const root = fixture(t)
  git(root, 'tag', '-d', 'v0.2.13')
  assert.throws(() => releaseRange(root), /No preceding version tag/)
  writeFileSync(join(root, '.git/shallow'), `${git(root, 'rev-parse', 'HEAD')}\n`)
  assert.throws(() => releaseRange(root), /full history/)
})

test('local migration path and real ATX anchor are required', (t) => {
  const root = fixture(t)
  for (const link of ['./missing.md#heading', './migration.md#missing', 'https://example.com/guide#heading', './migration.md', './migration.md#nullable-callbacks?x=1']) {
    writeFileSync(join(root, 'RELEASE-NOTES.md'), notes('Unreleased', link))
    assert.throws(() => readBreakingNotes(root), undefined, link)
  }
})

test('migration links cannot escape through traversal or symlinks', (t) => {
  const root = fixture(t)
  const outside = mkdtempSync(join(tmpdir(), 'outside-migration-'))
  t.after(() => rmSync(outside, { recursive: true, force: true }))
  writeFileSync(join(outside, 'guide.md'), '# Nullable callbacks\n')
  symlinkSync(join(outside, 'guide.md'), join(root, 'escape.md'))
  assert.throws(() => validateMigrationLink(root, './escape.md#nullable-callbacks'), /escapes/)
  assert.throws(() => validateMigrationLink(root, `./../${outside.split('/').at(-1)}/guide.md#nullable-callbacks`), /escapes/)
})

test('fenced and commented headings cannot satisfy migration anchors; duplicate slugs count', (t) => {
  const root = fixture(t)
  writeFileSync(join(root, 'migration.md'), '```md\n## Fake heading\n```\n<!--\n## Hidden heading\n-->\n## Real heading\n## Real heading\n')
  for (const anchor of ['fake-heading', 'hidden-heading'])
    assert.throws(() => validateMigrationLink(root, `./migration.md#${anchor}`), /Missing/)
  validateMigrationLink(root, './migration.md#real-heading-1')
  assert.deepEqual(headings('~~~md\n## Hidden\n~~~\n## Shown').map(item => item.slug), ['shown'])
})

test('duplicate compatibility sections fail rather than choosing one', (t) => {
  const root = fixture(t)
  writeFileSync(join(root, 'RELEASE-NOTES.md'), notes() + notes())
  assert.throws(() => readBreakingNotes(root), /Duplicate/)
})

test('the changelog config is non-publishing and requires a release context', (t) => {
  const root = fixture(t)
  assert.throws(() => changelogConfig(root, {}), /verified version-tag/)
})

test('stable release includes breaks introduced before a prerelease tag', (t) => {
  const root = fixture(t)
  writeFileSync(join(root, 'RELEASE-NOTES.md'), notes('0.3.0'))
  commit(root, 'feat!: incompatible beta API')
  git(root, 'tag', 'v0.3.0-beta.1')
  const result = checkCompatibility(release(root, '0.3.0'))
  assert.equal(result.from, 'v0.2.13')
  assert.ok(result.breaking)
})

test('prerelease compares to its preceding reachable version tag', (t) => {
  const root = fixture(t)
  commit(root, 'feat: beta API')
  git(root, 'tag', 'v0.3.0-beta.1')
  const result = checkCompatibility(release(root, '0.3.0-beta.2'))
  assert.equal(result.from, 'v0.3.0-beta.1')
  assert.equal(result.breaking, false)
})

test('ordinary PR discussion and fenced examples are not declaration footers', (t) => {
  const root = fixture(t)
  const event = { pull_request: { title: 'docs: explain BREAKING CHANGE: convention', body: 'The `BREAKING CHANGE:` footer is documented.\n```text\nBREAKING CHANGE: example only\n```\n<!--\nBREAKING CHANGE: hidden example\n-->' } }
  assert.equal(checkCompatibility({ root, eventName: 'pull_request', event }).breaking, false)
})

test('hidden links and summary-free headings cannot satisfy compatibility notes', (t) => {
  const root = fixture(t)
  for (const body of ['![Guide](./migration.md#nullable-callbacks)', '`[Guide](./migration.md#nullable-callbacks)`', '<!-- [Guide](./migration.md#nullable-callbacks) -->', '```md\n[Guide](./migration.md#nullable-callbacks)\n```']) {
    writeFileSync(join(root, 'RELEASE-NOTES.md'), `## Unreleased: BREAKING nullable callbacks\n${body}\n`)
    assert.throws(() => readBreakingNotes(root), /migration guide link/)
  }
  writeFileSync(join(root, 'RELEASE-NOTES.md'), '## Unreleased: BREAKING\n[Guide](./migration.md#nullable-callbacks)\n')
  assert.throws(() => readBreakingNotes(root), /summarize/)
})

test('actual changelogithub config loads exact verified range and title without publishing', (t) => {
  const root = fixture(t)
  writeFileSync(join(root, 'RELEASE-NOTES.md'), notes('0.2.14'))
  commit(root, 'feat!: nullable callbacks')
  const options = release(root)
  const configUrl = new URL('../../changelogithub.config.mjs', import.meta.url).href
  const output = execFileSync(process.execPath, ['--input-type=module', '-e', `const {default: config} = await import(${JSON.stringify(configUrl)}); console.log(JSON.stringify(config))`], {
    cwd: root,
    encoding: 'utf8',
    env: { ...process.env, GITHUB_EVENT_NAME: 'push', GITHUB_REF: options.ref },
  })
  const config = JSON.parse(output)
  assert.equal(config.from, 'v0.2.13')
  assert.equal(config.to, 'v0.2.14')
  assert.match(config.titles.breakingChanges, /#0214-breaking-nullable-callbacks/)
})

test('inline-code headings cannot produce a false supported anchor', (t) => {
  const root = fixture(t)
  writeFileSync(join(root, 'migration.md'), '## Nullable `value` callbacks\n')
  assert.throws(() => validateMigrationLink(root, './migration.md#nullable-value-callbacks'), /Missing supported/)
  assert.throws(() => validateMigrationLink(root, './migration.md#nullable---------callbacks'), /Missing supported/)
  writeFileSync(join(root, 'RELEASE-NOTES.md'), notes().replace('BREAKING nullable callbacks', 'BREAKING `nullable` callbacks'))
  assert.throws(() => readBreakingNotes(root), /plain ASCII/)
})
