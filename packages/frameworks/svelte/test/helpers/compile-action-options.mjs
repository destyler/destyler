import { mkdir, mkdtemp, readFile, rm, writeFile } from 'node:fs/promises'
import { fileURLToPath, pathToFileURL } from 'node:url'
import { compile, compileModule } from 'svelte/compiler'
import ts from 'typescript'

// Compile source hooks rather than built artifacts; generated modules stay in the
// package so that their imports resolve the same real Svelte runtime as the test.
export async function compileActionOptions(generate) {
  const root = new URL('../../', import.meta.url)
  const directory = await mkdtemp(fileURLToPath(new URL('.audit-svelte-action-options-', root)))
  const output = pathToFileURL(`${directory}/`)
  const files = [
    'hooks/use-actor.svelte.ts',
    'hooks/use-machine.svelte.ts',
    'hooks/use-service.svelte.ts',
    'hooks/use-snapshot.svelte.ts',
    'utils/reflect.ts',
  ]

  try {
    await mkdir(new URL('hooks/', output))
    await mkdir(new URL('utils/', output))
    for (const file of files) {
      const source = await readFile(new URL(`src/${file}`, root), 'utf8')
      const { outputText } = ts.transpileModule(source, {
        compilerOptions: { target: ts.ScriptTarget.ESNext, module: ts.ModuleKind.ESNext },
      })
      const code = file.endsWith('.svelte.ts')
        ? compileModule(outputText, { filename: file, generate }).js.code
        : outputText
      await writeFile(new URL(file.replace(/\.ts$/, '.js'), output), code)
    }
    const filename = new URL('../fixtures/ActionOptions.svelte', import.meta.url)
    const source = await readFile(filename, 'utf8')
    const { js } = compile(source, { filename: fileURLToPath(filename), generate })
    const component = new URL('ActionOptions.js', output)
    await writeFile(component, js.code)
    return {
      component: (await import(component.href)).default,
      cleanup: () => rm(directory, { recursive: true, force: true }),
    }
  }
  catch (error) {
    await rm(directory, { recursive: true, force: true })
    throw error
  }
}
