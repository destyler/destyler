import { readFileSync } from 'node:fs'
import { fileURLToPath } from 'node:url'
import ts from 'typescript'
import { describe, expect, it } from 'vitest'

const declaration = fileURLToPath(new URL('../dist/index.d.mts', import.meta.url))
const fixtures = {
  nullable: fileURLToPath(new URL('./fixtures/nullable-consumer.mts', import.meta.url)),
  stringOnly: fileURLToPath(new URL('./fixtures/string-only-consumer.mts', import.meta.url)),
}

function compile(fixture: keyof typeof fixtures, priorStringContract = false) {
  const options: ts.CompilerOptions = {
    strict: true,
    noEmit: true,
    skipLibCheck: false,
    types: [],
    target: ts.ScriptTarget.ES2022,
    module: ts.ModuleKind.NodeNext,
    moduleResolution: ts.ModuleResolutionKind.NodeNext,
  }
  const host = ts.createCompilerHost(options)
  if (priorStringContract) {
    const original = readFileSync(declaration, 'utf8')
    const oldContract = original.replace(/(interface ValueChangeDetails\s*\{\s*value:) string \| null;/, '$1 string;')
    expect(oldContract).not.toBe(original)
    const readFile = host.readFile
    host.readFile = path => path === declaration ? oldContract : readFile(path)
  }
  const program = ts.createProgram([fixtures[fixture]], options, host)
  // This gate must inspect the shipped declaration, never a source alias or a registry copy.
  expect(program.getSourceFile(declaration)).toBeDefined()
  return ts.getPreEmitDiagnostics(program).map(diagnostic => ({
    code: diagnostic.code,
    file: diagnostic.file?.fileName,
    message: ts.flattenDiagnosticMessageText(diagnostic.messageText, '\n'),
  }))
}

describe('built Tabs public nullable declarations', { timeout: 30_000 }, () => {
  it('accepts a strict nullable handler and both selected/cleared details', () => {
    expect(compile('nullable')).toEqual([])
  })

  it('rejects string-only Context and ValueChangeDetails handlers under strictFunctionTypes', () => {
    const diagnostics = compile('stringOnly')
    expect(diagnostics).toHaveLength(2)
    for (const diagnostic of diagnostics) {
      expect(diagnostic.code).toBe(2322)
      expect(diagnostic.file).toBe(fixtures.stringOnly)
      expect(diagnostic.message).toContain('null')
    }
  })

  it('detects the prior string-only declaration without changing the built artifact', () => {
    const original = readFileSync(declaration, 'utf8')
    const diagnostics = compile('nullable', true)
    expect(diagnostics).toHaveLength(1)
    expect(diagnostics[0]).toMatchObject({ code: 2322, file: fixtures.nullable })
    expect(diagnostics[0].message).toContain('null')
    expect(compile('stringOnly', true)).toEqual([])
    expect(readFileSync(declaration, 'utf8')).toBe(original)
  })
})
