import { readdir, readFile, writeFile } from 'node:fs/promises'
import path from 'node:path'
import process from 'node:process'
import { fileURLToPath } from 'node:url'
import { compileModule } from 'svelte/compiler'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)
const distDir = path.resolve(__dirname, '../dist')

async function collectSvelteModuleFiles(dir) {
  const entries = await readdir(dir, { withFileTypes: true })
  const files = []

  for (const entry of entries) {
    const entryPath = path.join(dir, entry.name)
    if (entry.isDirectory()) {
      files.push(...await collectSvelteModuleFiles(entryPath))
      continue
    }

    if (entry.isFile() && entry.name.endsWith('.svelte.js'))
      files.push(entryPath)
  }

  return files
}

async function compileFile(file) {
  const source = await readFile(file, 'utf8')
  const result = compileModule(source, {
    filename: path.relative(distDir, file),
    format: 'esm',
    generate: 'dom',
  })

  await writeFile(file, `${result.js.code}\n`, 'utf8')
}

async function main() {
  const files = await collectSvelteModuleFiles(distDir)

  if (!files.length) {
    console.warn('No .svelte.js files found in dist directory')
    return
  }

  await Promise.all(files.map(compileFile))
}

main().catch((error) => {
  console.error(error)
  process.exit(1)
})
