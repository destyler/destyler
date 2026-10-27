import assert from 'node:assert/strict'
import { mkdirSync, mkdtempSync, readdirSync, readFileSync, rmSync, symlinkSync, writeFileSync } from 'node:fs'
import os from 'node:os'
import path from 'node:path'
// eslint-disable-next-line test/no-import-node-test -- Declaration guards run without the browser test runner.
import { test } from 'node:test'
import { fileURLToPath } from 'node:url'
import { degradedContractExports, isContractExport, publicDeclarationProblems } from '../check-public-declarations.mjs'
import { missingWorkspaceDeclarations } from '../workspace-declarations.mjs'

const repositoryRoot = fileURLToPath(new URL('../../', import.meta.url))

function writeJson(filename, value) {
  mkdirSync(path.dirname(filename), { recursive: true })
  writeFileSync(filename, JSON.stringify(value))
}

test('contract exports are the inferred public machine surface', () => {
  for (const name of ['anatomy', 'machine', 'props', 'splitProps', 'connect', 'inputProps', 'splitInputProps'])
    assert.equal(isContractExport(name), true)
  for (const name of ['createAnatomy', 'createMachine', 'isMachine', 'Service', 'Api'])
    assert.equal(isContractExport(name), false)
})

test('degraded any on exported machine contracts fails and explicit types pass', () => {
  const degraded = `
    export declare const anatomy: any;
    export declare function connect<T>(state: any, send: any, normalize: any): MachineApi<T>;
    export declare function machine(userContext: UserDefinedContext): any;
    export declare const props: any;
    export declare const splitProps: any;
    export declare const inputProps: (any);
    export declare function isMachine(value: any): boolean;
  `
  assert.deepEqual(degradedContractExports(degraded), ['anatomy', 'inputProps', 'machine', 'props', 'splitProps'])

  const intact = `
    export declare const anatomy: import("@destyler/anatomy").AnatomyInstance<"root" | "label">;
    export declare function connect<T extends PropTypes>(state: State, send: Send, normalize: NormalizeProps<T>): MachineApi<T>;
    export declare function machine(
      userContext: UserDefinedContext
    ): import("@destyler/xstate").Machine<MachineContext, MachineState, import("@destyler/xstate").AnyEventObject>;
    export declare const props: ("checked" | "dir" | "id")[];
    export declare const splitProps: <Props extends Partial<UserDefinedContext>>(props: Props) => [Partial<UserDefinedContext>, Omit<Props, "checked" | "dir" | "id">];
    declare const hidden: any
    export { hidden as notAContract }
  `
  assert.deepEqual(degradedContractExports(intact), [])
})

test('a local any declaration re-exported under a contract name fails', () => {
  const source = `
    declare const anatomy: any
    export { anatomy }
    declare function machine(userContext: UserDefinedContext): any
    export { machine as connect }
  `
  assert.deepEqual(degradedContractExports(source), ['anatomy', 'connect'])
})

test('missing workspace declaration files are reported and present files are accepted', (t) => {
  const root = mkdtempSync(path.join(os.tmpdir(), 'destyler-declarations-'))
  t.after(() => rmSync(root, { recursive: true, force: true }))
  writeFileSync(path.join(root, 'pnpm-workspace.yaml'), 'packages:\n  - packages/*\n')
  const leaf = path.join(root, 'packages', 'leaf')
  const anatomy = path.join(root, 'packages', 'anatomy')
  writeJson(path.join(anatomy, 'package.json'), {
    name: '@destyler/anatomy',
    types: 'dist/index.d.mts',
  })
  writeJson(path.join(leaf, 'package.json'), {
    name: '@destyler/leaf',
    types: 'dist/index.d.mts',
    dependencies: {
      '@destyler/anatomy': 'workspace:*',
      '@internationalized/date': '>=3.0.0',
    },
  })
  mkdirSync(path.join(leaf, 'node_modules', '@destyler'), { recursive: true })
  symlinkSync(anatomy, path.join(leaf, 'node_modules', '@destyler', 'anatomy'), 'dir')

  assert.deepEqual(missingWorkspaceDeclarations(leaf), [
    { name: '@destyler/anatomy', reason: 'missing packages/anatomy/dist/index.d.mts' },
  ])

  mkdirSync(path.join(anatomy, 'dist'), { recursive: true })
  writeFileSync(path.join(anatomy, 'dist', 'index.d.mts'), 'export declare function createAnatomy(): {}\n')
  assert.deepEqual(missingWorkspaceDeclarations(leaf), [])
})

test('unsafe or absent dependency types stay visible to the build', (t) => {
  const root = mkdtempSync(path.join(os.tmpdir(), 'destyler-declarations-'))
  t.after(() => rmSync(root, { recursive: true, force: true }))
  writeFileSync(path.join(root, 'pnpm-workspace.yaml'), '')
  const leaf = path.join(root, 'packages', 'leaf')
  writeJson(path.join(leaf, 'package.json'), {
    name: '@destyler/leaf',
    dependencies: { '@destyler/types': 'workspace:*' },
    devDependencies: { '@destyler/utils': 'workspace:*' },
  })
  writeJson(path.join(leaf, 'node_modules', '@destyler', 'types', 'package.json'), {
    name: '@destyler/types',
    types: '../../outside.d.ts',
  })
  writeJson(path.join(root, 'node_modules', '@destyler', 'utils', 'package.json'), {
    name: '@destyler/utils',
  })

  assert.deepEqual(missingWorkspaceDeclarations(leaf), [
    { name: '@destyler/types', reason: 'types entry escapes the package' },
    { name: '@destyler/utils', reason: 'package has no types entry' },
  ])
})

test('a built package fails the guard when its declaration file is missing or degraded', (t) => {
  const root = mkdtempSync(path.join(os.tmpdir(), 'destyler-package-'))
  t.after(() => rmSync(root, { recursive: true, force: true }))
  const packageDirectory = path.join(root, 'checkbox')
  writeJson(path.join(packageDirectory, 'package.json'), {
    name: '@destyler/checkbox',
    types: 'dist/index.d.mts',
  })
  assert.deepEqual(publicDeclarationProblems(packageDirectory), [
    { file: 'dist/index.d.mts', names: ['missing declaration file'] },
  ])
  mkdirSync(path.join(packageDirectory, 'dist'), { recursive: true })
  writeFileSync(path.join(packageDirectory, 'dist', 'index.d.mts'), 'export declare const anatomy: any\nexport declare function connect(): Api\n')
  assert.deepEqual(publicDeclarationProblems(packageDirectory), [
    { file: 'dist/index.d.mts', names: ['anatomy'] },
  ])
})

test('every package build refuses to emit declarations without workspace dependency types', () => {
  function configs(directory, prefix = 'packages') {
    const result = []
    for (const entry of readdirSync(directory, { withFileTypes: true })) {
      if (entry.name === 'node_modules' || entry.name === 'dist')
        continue
      const filename = path.join(directory, entry.name)
      if (entry.isDirectory())
        result.push(...configs(filename, `${prefix}/${entry.name}`))
      else if (entry.name === 'tsdown.config.ts')
        result.push(`${prefix}/${entry.name}`)
    }
    return result
  }
  const found = configs(path.join(repositoryRoot, 'packages'))
  assert.ok(found.length >= 76)
  for (const filename of found) {
    const source = readFileSync(path.join(repositoryRoot, filename), 'utf8')
    assert.match(source, /scripts\/tsdown-package\.config\.mjs/)
  }
  const shared = readFileSync(path.join(repositoryRoot, 'scripts/tsdown-package.config.mjs'), 'utf8')
  assert.match(shared, /missingWorkspaceDeclarations/)
  assert.match(shared, /build:prepare/)
})

test('release verification runs the declaration guard', () => {
  const scripts = JSON.parse(readFileSync(path.join(repositoryRoot, 'package.json'), 'utf8')).scripts
  assert.equal(scripts['check:declarations'], 'node scripts/check-public-declarations.mjs')
  assert.match(scripts['test:workflows'], /scripts\/test\/public-declarations\.test\.mjs/)
  const verify = readFileSync(path.join(repositoryRoot, '.github/actions/verify/action.yml'), 'utf8')
  const release = readFileSync(path.join(repositoryRoot, '.github/workflows/release.yml'), 'utf8')
  assert.match(verify, /pnpm run check:declarations/)
  assert.match(release, /pnpm run check:declarations/)
  assert.match(readFileSync(path.join(repositoryRoot, 'scripts/publish-packages.mjs'), 'utf8'), /--ignore-scripts/)
})
