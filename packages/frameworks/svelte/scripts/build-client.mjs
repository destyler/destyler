import { cp, mkdir, readdir, readFile, rm, writeFile } from 'node:fs/promises'
import path from 'node:path'
import process from 'node:process'
import { fileURLToPath } from 'node:url'
import { compileModule } from 'svelte/compiler'

const __dirname = path.dirname(fileURLToPath(import.meta.url))
const distDir = path.resolve(__dirname, '../dist')
const clientDistDir = path.resolve(__dirname, '../dist-client')

async function ensureClientDist() {
  await rm(clientDistDir, { recursive: true, force: true })
  await mkdir(clientDistDir, { recursive: true })
  await cp(distDir, clientDistDir, { recursive: true })
}

async function collectSvelteFiles(dir) {
  const entries = await readdir(dir, { withFileTypes: true })
  const files = []

  for (const entry of entries) {
    const fullPath = path.join(dir, entry.name)

    if (entry.isDirectory()) {
      files.push(...await collectSvelteFiles(fullPath))
      continue
    }

    if (entry.isFile() && fullPath.endsWith('.svelte.js'))
      files.push(fullPath)
  }

  return files
}

async function compileClientFile(file) {
  const source = await readFile(file, 'utf8')
  const result = compileModule(source, {
    filename: path.relative(clientDistDir, file),
    format: 'esm',
    generate: 'dom',
  })

  await writeFile(file, `${result.js.code}\n`, 'utf8')
}

async function main() {
  await ensureClientDist()
  const files = await collectSvelteFiles(clientDistDir)

  if (!files.length) {
    console.warn('No .svelte.js files found for client build')
    return
  }

  await Promise.all(files.map(compileClientFile))
}

main().catch((error) => {
  console.error(error)
  process.exit(1)
})
