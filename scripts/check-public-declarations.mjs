import { existsSync, readdirSync, readFileSync, statSync } from 'node:fs'
import path from 'node:path'
import process from 'node:process'
import { fileURLToPath } from 'node:url'
import ts from 'typescript'

const repositoryRoot = fileURLToPath(new URL('..', import.meta.url))
const exactExports = new Set(['anatomy', 'machine', 'props', 'splitProps', 'connect'])

export function isContractExport(name) {
  return exactExports.has(name) || name.endsWith('Props') || /^split[A-Z]/.test(name)
}

function isAnyType(node) {
  if (!node)
    return false
  if (node.kind === ts.SyntaxKind.ParenthesizedType)
    return isAnyType(node.type)
  return node.kind === ts.SyntaxKind.AnyKeyword
}

function hasExportModifier(node) {
  return node.modifiers?.some(modifier => modifier.kind === ts.SyntaxKind.ExportKeyword) ?? false
}

export function degradedContractExports(sourceText, fileName = 'index.d.ts') {
  const source = ts.createSourceFile(fileName, sourceText, ts.ScriptTarget.Latest, true, ts.ScriptKind.TS)
  const declarations = new Map()

  function record(name, degraded, exported) {
    if (!name || !isContractExport(name))
      return
    const current = declarations.get(name) ?? { degraded: false, exported: false }
    declarations.set(name, {
      degraded: current.degraded || degraded,
      exported: current.exported || exported,
    })
  }

  for (const statement of source.statements) {
    if (ts.isFunctionDeclaration(statement) && statement.name) {
      record(statement.name.text, isAnyType(statement.type), hasExportModifier(statement))
      continue
    }
    if (ts.isVariableStatement(statement)) {
      const exported = hasExportModifier(statement)
      for (const declaration of statement.declarationList.declarations) {
        if (ts.isIdentifier(declaration.name))
          record(declaration.name.text, isAnyType(declaration.type), exported)
      }
      continue
    }
    if (!ts.isExportDeclaration(statement) || !statement.exportClause || !ts.isNamedExports(statement.exportClause) || statement.moduleSpecifier)
      continue
    for (const element of statement.exportClause.elements) {
      const local = element.propertyName?.text ?? element.name.text
      const exported = element.name.text
      const declaration = declarations.get(local)
      if (!declaration)
        continue
      if (exported === local) {
        declaration.exported = true
        continue
      }
      record(exported, declaration.degraded, true)
    }
  }

  return [...declarations.entries()]
    .filter(([, declaration]) => declaration.exported && declaration.degraded)
    .map(([name]) => name)
    .sort()
}

function walkDeclarations(directory, files) {
  for (const entry of readdirSync(directory, { withFileTypes: true })) {
    const filename = path.join(directory, entry.name)
    if (entry.isDirectory()) {
      walkDeclarations(filename, files)
      continue
    }
    if (/\.d\.[cm]?ts$/.test(entry.name))
      files.push(filename)
  }
}

export function publicDeclarationProblems(packageDirectory) {
  const manifest = JSON.parse(readFileSync(path.join(packageDirectory, 'package.json'), 'utf8'))
  const problems = []
  if (typeof manifest.types !== 'string') {
    problems.push({ file: 'package.json', names: ['missing types entry'] })
    return problems
  }
  const entry = path.resolve(packageDirectory, manifest.types)
  if (!existsSync(entry))
    problems.push({ file: path.relative(packageDirectory, entry), names: ['missing declaration file'] })

  const dist = path.join(packageDirectory, 'dist')
  const files = []
  if (existsSync(dist) && statSync(dist).isDirectory())
    walkDeclarations(dist, files)
  if (existsSync(entry) && !files.includes(entry))
    files.push(entry)

  for (const file of files) {
    const names = degradedContractExports(readFileSync(file, 'utf8'), file)
    if (names.length > 0)
      problems.push({ file: path.relative(packageDirectory, file), names })
  }
  return problems
}

export function checkPublicDeclarations(root = repositoryRoot) {
  const targets = JSON.parse(readFileSync(path.join(root, 'scripts/publish-targets.json'), 'utf8'))
  const failures = []
  for (const [directory, name] of Object.entries(targets)) {
    const packageDirectory = path.join(root, directory)
    const problems = publicDeclarationProblems(packageDirectory)
    for (const problem of problems)
      failures.push({ name, directory, ...problem })
  }
  return failures
}

function isDirectRun() {
  const entry = process.argv[1]
  return Boolean(entry) && path.resolve(entry) === fileURLToPath(import.meta.url)
}

if (isDirectRun()) {
  const failures = checkPublicDeclarations()
  if (failures.length > 0) {
    console.error('Public package declarations collapsed:')
    for (const failure of failures)
      console.error(`  ${failure.name} ${failure.file}: ${failure.names.join(', ')}`)
    process.exit(1)
  }
  const count = Object.keys(JSON.parse(readFileSync(path.join(repositoryRoot, 'scripts/publish-targets.json'), 'utf8'))).length
  console.log(`Checked ${count} public packages for degraded declarations`)
}
