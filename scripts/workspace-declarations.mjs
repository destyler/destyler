import { existsSync, readFileSync, realpathSync } from 'node:fs'
import path from 'node:path'

const dependencyFields = ['dependencies', 'devDependencies', 'peerDependencies', 'optionalDependencies']

function readJson(filename) {
  return JSON.parse(readFileSync(filename, 'utf8'))
}

export function workspaceRoot(start) {
  let directory = path.resolve(start)
  while (true) {
    if (existsSync(path.join(directory, 'pnpm-workspace.yaml')))
      return directory
    const parent = path.dirname(directory)
    if (parent === directory)
      return undefined
    directory = parent
  }
}

function workspaceDependencyNames(manifest) {
  const names = []
  for (const field of dependencyFields) {
    const dependencies = manifest[field]
    if (!dependencies)
      continue
    for (const [name, specifier] of Object.entries(dependencies)) {
      if (typeof specifier === 'string' && specifier.startsWith('workspace:'))
        names.push(name)
    }
  }
  return names
}

function resolvePackageJson(packageDirectory, name, root) {
  const candidates = [
    path.join(packageDirectory, 'node_modules', name, 'package.json'),
    root ? path.join(root, 'node_modules', name, 'package.json') : undefined,
  ].filter(Boolean)
  return candidates.find(candidate => existsSync(candidate))
}

function insideDirectory(parent, candidate) {
  const relative = path.relative(parent, candidate)
  return relative === '' || (!relative.startsWith('..') && !path.isAbsolute(relative))
}

export function declarationEntry(packageJsonPath) {
  const manifest = readJson(packageJsonPath)
  const packageDirectory = realpathSync(path.dirname(packageJsonPath))
  if (typeof manifest.types !== 'string' || manifest.types.length === 0)
    return undefined
  const resolved = path.resolve(packageDirectory, manifest.types)
  if (!insideDirectory(packageDirectory, resolved))
    return { file: resolved, escaped: true }
  return { file: resolved, escaped: false }
}

export function missingWorkspaceDeclarations(packageDirectory) {
  const manifest = readJson(path.join(packageDirectory, 'package.json'))
  const root = workspaceRoot(packageDirectory)
  const missing = []
  for (const name of workspaceDependencyNames(manifest)) {
    const packageJson = resolvePackageJson(packageDirectory, name, root)
    if (!packageJson) {
      missing.push({ name, reason: 'not installed' })
      continue
    }
    const entry = declarationEntry(packageJson)
    if (!entry) {
      missing.push({ name, reason: 'package has no types entry' })
      continue
    }
    if (entry.escaped) {
      missing.push({ name, reason: 'types entry escapes the package' })
      continue
    }
    if (!existsSync(entry.file)) {
      const display = root ? path.relative(root, entry.file) : entry.file
      missing.push({ name, reason: `missing ${display}` })
    }
  }
  return missing
}
