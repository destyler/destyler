import assert from 'node:assert/strict'
import { execFileSync } from 'node:child_process'
import { readFileSync, realpathSync } from 'node:fs'
import { isAbsolute, relative, resolve } from 'node:path'
import process from 'node:process'
import { fileURLToPath } from 'node:url'

const versionPattern = /^\d+\.\d+\.\d+(?:-[0-9A-Z.-]+)?$/i
const tagPattern = /^v\d+\.\d+\.\d+(?:-[0-9A-Za-z.-]+)?$/

function git(root, ...args) {
  return execFileSync('git', args, { cwd: root, encoding: 'utf8' }).trim()
}

// Mirrors changelogen's Conventional Commit recognition used by changelogithub.
// https://github.com/unjs/changelogen/blob/main/src/git.ts
export function isBreaking(message) {
  const [subject, ...body] = message.split('\n')
  const match = subject.match(/[a-z]+(?:\(.+\))?(!)?: .+/i)
  return Boolean(match && (match[1] || /breaking change:/i.test(body.join('\n'))))
}

// Only prose ATX headings are supported, not fenced examples or HTML comments.
export function prose(markdown, stripInline = false) {
  let fence
  const result = markdown.replace(/<!--[\s\S]*?-->/g, text => text.replace(/[^\n]/g, '')).split(/\r?\n/).map((text) => {
    const delimiter = text.match(/^ {0,3}(`{3,}|~{3,})/)
    if (delimiter) {
      if (!fence)
        fence = delimiter[1]
      else if (delimiter[1][0] === fence[0] && delimiter[1].length >= fence.length)
        fence = undefined
      return ''
    }
    return fence ? '' : text
  }).join('\n')
  return stripInline ? result.replace(/(`+)([\s\S]*?)\1/g, text => text.replace(/[^\n]/g, '')) : result
}

export function headings(markdown) {
  const seen = new Set()
  const result = []
  const lines = prose(markdown).split('\n')
  for (let line = 0; line < lines.length; line++) {
    const text = lines[line]
    const match = text.match(/^(#{1,6}) +(.+?)(?: +#+)?\s*$/)
    if (!match)
      continue
    const title = match[2]
    const base = title.toLowerCase().replace(/[^\w\- ]/g, '').replace(/ /g, '-')
    let slug = base
    let count = 0
    while (seen.has(slug))
      slug = `${base}-${++count}`
    seen.add(slug)
    result.push({ level: match[1].length, title, slug, line })
  }
  return result
}

export function validateMigrationLink(root, link) {
  assert.match(link, /^\.\/[\w./-]+\.mdx?#[a-z0-9_-]+$/, `Expected a local Markdown migration path and plain ATX anchor: ${link}`)
  const [path, anchor] = link.split('#')
  const absolute = realpathSync(resolve(root, path))
  const rel = relative(realpathSync(root), absolute)
  assert.ok(!isAbsolute(rel) && rel !== '..' && !rel.startsWith('../'), `Migration escapes repository: ${link}`)
  const targets = headings(readFileSync(absolute, 'utf8'))
  assert.ok(targets.some(item => item.slug === anchor && /^[\w :-]+$/.test(item.title)), `Missing supported migration heading: ${link}`)
}

export function readBreakingNotes(root) {
  const markdown = prose(readFileSync(resolve(root, 'RELEASE-NOTES.md'), 'utf8'))
  const all = headings(markdown)
  const sections = new Map()
  for (const item of all.filter(item => item.level === 2 && /: BREAKING\b/.test(item.title))) {
    assert.match(item.title, /^[\w .:-]+$/, 'Use a plain ASCII compatibility heading without inline markup')
    assert.match(item.title, /: BREAKING +[A-Za-z0-9]/, 'BREAKING heading must summarize the compatibility change')
    const version = item.title.split(':')[0]
    assert.ok(version === 'Unreleased' || versionPattern.test(version), `Invalid compatibility version: ${version}`)
    assert.ok(!sections.has(version), `Duplicate compatibility section: ${version}`)
    const end = all.find(next => next.line > item.line && next.level <= 2)?.line
    const body = markdown.split('\n').slice(item.line + 1, end).join('\n')
    const links = [...prose(body, true).matchAll(/(?<!!)\[[^\]]+\]\((\.\/[^)]+)\)/g)].map(match => match[1])
    assert.ok(links.length > 0, `${version}: BREAKING needs a local migration guide link`)
    for (const link of links)
      validateMigrationLink(root, link)
    sections.set(version, { ...item, body })
  }
  return sections
}

export function releaseRange(root, releaseTag) {
  assert.equal(git(root, 'rev-parse', '--is-shallow-repository'), 'false', 'Compatibility checks require full history and tags')
  if (releaseTag) {
    assert.match(releaseTag, tagPattern, 'Release must use a version tag')
    assert.equal(git(root, 'rev-parse', `refs/tags/${releaseTag}^{commit}`), git(root, 'rev-parse', 'HEAD'), 'Release tag must identify this checkout')
  }
  // Both annotated and lightweight tags; exclude every tag on HEAD for a release.
  const tags = git(root, 'tag', '--merged', 'HEAD').split('\n').filter(tag => tagPattern.test(tag))
  let candidates = releaseTag ? tags.filter(tag => git(root, 'rev-parse', `refs/tags/${tag}^{commit}`) !== git(root, 'rev-parse', 'HEAD')) : tags
  if (releaseTag && /^v\d+\.\d+\.\d+$/.test(releaseTag)) {
    const stable = candidates.filter(tag => /^v\d+\.\d+\.\d+$/.test(tag))
    if (stable.length)
      candidates = stable
  }
  assert.ok(candidates.length, 'No preceding version tag found; review the initial-release boundary explicitly')
  const from = git(root, 'describe', '--tags', '--abbrev=0', ...candidates.flatMap(tag => ['--match', tag]), 'HEAD')
  const commits = git(root, 'log', '--format=%B%x00', `${from}..HEAD`).split('\0').map(text => text.trim()).filter(Boolean)
  return { from, commits }
}

export function checkCompatibility({ root = process.cwd(), eventName = '', event = {}, ref = '' } = {}) {
  const version = JSON.parse(readFileSync(resolve(root, 'package.json'), 'utf8')).version
  assert.match(version, versionPattern, 'Invalid package version')
  const releaseTag = eventName === 'push' && ref.startsWith('refs/tags/') ? ref.slice('refs/tags/'.length) : undefined
  if (releaseTag)
    assert.equal(releaseTag, `v${version}`, 'Release tag and package version must agree')
  const { from, commits } = releaseRange(root, releaseTag)
  const notes = readBreakingNotes(root)
  const proposal = eventName === 'pull_request'
    ? `${event.pull_request?.title ?? ''}\n${prose(event.pull_request?.body ?? '', true).split('\n').filter(line => /^BREAKING[ -]CHANGE:/i.test(line)).join('\n')}`
    : ''
  const messages = [...commits, proposal]
  for (const message of messages) {
    if (/^BREAKING[ -]CHANGE:/im.test(message))
      assert.ok(isBreaking(message), 'Use a conventional subject with ! or a supported BREAKING CHANGE footer; preserve it when squashing')
  }
  const breaking = messages.some(isBreaking)
  if (releaseTag) {
    assert.ok(!notes.has('Unreleased'), 'Assign Unreleased compatibility notes to the chosen version before tagging')
    if (breaking)
      assert.ok(notes.has(version), `${version}: BREAKING notes and a migration link are required`)
    if (notes.has(version))
      assert.ok(breaking, 'Preserve breaking metadata in release commits so changelogithub renders the migration heading')
  }
  else if (breaking) {
    // Normal PRs need not pick a release version or reuse an already-published note.
    assert.ok(notes.has('Unreleased') || (from !== `v${version}` && notes.has(version)), 'Declared breaking changes need Unreleased (or a new chosen version) BREAKING notes')
  }
  return { version, from, releaseTag, breaking, section: notes.get(version) }
}

export function changelogConfig(root = process.cwd(), env = process.env) {
  const result = checkCompatibility({ root, eventName: env.GITHUB_EVENT_NAME, ref: env.GITHUB_REF })
  assert.ok(result.releaseTag, 'Generate release notes only for the verified version-tag checkout')
  return {
    from: result.from,
    to: result.releaseTag,
    titles: {
      breakingChanges: `BREAKING CHANGES ([migration guidance](https://github.com/destyler/destyler/blob/${result.releaseTag}/RELEASE-NOTES.md#${result.section?.slug ?? ''}))`,
    },
  }
}

if (process.argv[1] && resolve(process.argv[1]) === fileURLToPath(import.meta.url)) {
  const event = process.env.GITHUB_EVENT_PATH ? JSON.parse(readFileSync(process.env.GITHUB_EVENT_PATH, 'utf8')) : {}
  const result = checkCompatibility({ eventName: process.env.GITHUB_EVENT_NAME, event, ref: process.env.GITHUB_REF })
  console.log(`Declared-break communication check passed (${result.from}..HEAD; breaking=${result.breaking})`)
}
