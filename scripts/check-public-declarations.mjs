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

// A type argument of `any` on these names means the public contract collapsed.
// Other generics keep default parameters that are emitted as `any`
// (`ItemProps<any>`, `MachineContext<any>`). `Record<string, unknown>` is left alone.
const collapsedGenerics = new Set(['AnatomyInstance', 'Array', 'Machine', 'ReadonlyArray'])

function referencedTypeName(node) {
  const name = ts.isTypeReferenceNode(node)
    ? node.typeName
    : ts.isImportTypeNode(node)
      ? node.qualifier
      : undefined
  if (!name)
    return undefined
  return ts.isIdentifier(name) ? name.text : ts.isQualifiedName(name) ? name.right.text : undefined
}

function tupleElementType(element) {
  if (ts.isNamedTupleMember(element) || ts.isOptionalTypeNode(element) || ts.isRestTypeNode(element))
    return element.type
  return element
}

// True when `any` replaces the exported contract: the type itself, an array
// element, a union or intersection member, a type-literal member, or a type
// argument of Machine / AnatomyInstance / Array.
export function isDegradedType(node) {
  if (!node)
    return false
  if (node.kind === ts.SyntaxKind.ParenthesizedType)
    return isDegradedType(node.type)
  if (node.kind === ts.SyntaxKind.TypeOperator && node.operator === ts.SyntaxKind.ReadonlyKeyword)
    return isDegradedType(node.type)
  if (node.kind === ts.SyntaxKind.AnyKeyword)
    return true
  if (ts.isArrayTypeNode(node))
    return isDegradedType(node.elementType)
  if (ts.isUnionTypeNode(node) || ts.isIntersectionTypeNode(node))
    return node.types.some(type => isDegradedType(type))
  if (ts.isTupleTypeNode(node))
    return node.elements.some(element => isDegradedType(tupleElementType(element)))
  if (ts.isFunctionTypeNode(node) || ts.isConstructorTypeNode(node))
    return isDegradedType(node.type)
  if (ts.isTypeLiteralNode(node)) {
    return node.members.some(member =>
      (ts.isPropertySignature(member) || ts.isIndexSignatureDeclaration(member) || ts.isMethodSignature(member))
      && isDegradedType(member.type))
  }
  if (ts.isMappedTypeNode(node))
    return isDegradedType(node.type)
  const name = referencedTypeName(node)
  if (name && collapsedGenerics.has(name))
    return node.typeArguments?.some(type => isDegradedType(type)) ?? false
  return false
}

function hasExportModifier(node) {
  return node.modifiers?.some(modifier => modifier.kind === ts.SyntaxKind.ExportKeyword) ?? false
}

export function degradedContractExports(sourceText, fileName = 'index.d.ts') {
  const source = ts.createSourceFile(fileName, sourceText, ts.ScriptTarget.Latest, true, ts.ScriptKind.TS)
  const locals = new Map()
  const exported = new Map()
  const reexports = []

  function noteLocal(name, degraded) {
    if (!name)
      return
    const current = locals.get(name) ?? false
    locals.set(name, current || degraded)
  }

  function markExported(name, degraded) {
    if (!name || !isContractExport(name))
      return
    const current = exported.get(name) ?? false
    exported.set(name, current || degraded)
  }

  for (const statement of source.statements) {
    if (ts.isFunctionDeclaration(statement) && statement.name) {
      const degraded = isDegradedType(statement.type)
      noteLocal(statement.name.text, degraded)
      if (hasExportModifier(statement))
        markExported(statement.name.text, degraded)
      continue
    }
    if (ts.isTypeAliasDeclaration(statement) && statement.name) {
      const degraded = isDegradedType(statement.type)
      noteLocal(statement.name.text, degraded)
      if (hasExportModifier(statement))
        markExported(statement.name.text, degraded)
      continue
    }
    if (ts.isVariableStatement(statement)) {
      const isExported = hasExportModifier(statement)
      for (const declaration of statement.declarationList.declarations) {
        if (!ts.isIdentifier(declaration.name))
          continue
        const degraded = isDegradedType(declaration.type)
        noteLocal(declaration.name.text, degraded)
        if (isExported)
          markExported(declaration.name.text, degraded)
      }
      continue
    }
    if (ts.isExportDeclaration(statement) && statement.exportClause && ts.isNamedExports(statement.exportClause) && !statement.moduleSpecifier)
      reexports.push(statement)
  }

  // `declare const a: any; export { a as anatomy }` — the public name is the alias.
  for (const statement of reexports) {
    for (const element of statement.exportClause.elements) {
      const local = element.propertyName?.text ?? element.name.text
      const exportedName = element.name.text
      if (!locals.has(local))
        continue
      markExported(exportedName, locals.get(local))
    }
  }

  return [...exported.entries()]
    .filter(([, degraded]) => degraded)
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
