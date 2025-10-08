import { createWriteStream, existsSync, statSync } from 'node:fs'
import { mkdir } from 'node:fs/promises'
import { basename, join, resolve } from 'node:path'
import process from 'node:process'
import archiver from 'archiver'

/**
 * Compress a directory into a zip file placed at repository root (process.cwd())
 * @param sourceDir Absolute or relative path to the directory to compress
 * @param zipName   The output zip file name ( .zip will be appended if missing )
 * @returns The absolute path of the generated zip file
 */
export async function zipDirectory(sourceDir: string, zipName: string): Promise<string> {
  if (!sourceDir)
throw new Error('sourceDir is required')
  const fullSource = resolve(process.cwd(), sourceDir)
  if (!existsSync(fullSource) || !statSync(fullSource).isDirectory()) {
    throw new Error(`Source directory not found: ${fullSource}`)
  }

  if (!zipName)
zipName = `${basename(fullSource)}.zip`
  if (!zipName.endsWith('.zip'))
zipName = `${zipName}.zip`

  const outPath = join(process.cwd(), zipName)
  await mkdir(process.cwd(), { recursive: true })

  return new Promise<string>((resolvePromise, reject) => {
    const output = createWriteStream(outPath)
    const archive = archiver('zip', { zlib: { level: 9 } })

    output.on('close', () => resolvePromise(outPath))
    archive.on('error', reject)
    archive.pipe(output)
    archive.directory(fullSource, false)
    archive.finalize().catch(reject)
  })
}

// (Optional) If invoked directly via `tsx scripts/zip.ts <dir> <name>` run once
if (process.argv[1] && process.argv[1].endsWith('zip.ts') && process.argv.length > 2) {
  const [, , dir, name] = process.argv
  zipDirectory(dir, name || '').then((p) => {

    console.log(`Created: ${p}`)
  }).catch((err) => {

    console.error(err)
    process.exit(1)
  })
}
