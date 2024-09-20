import { fileURLToPath } from 'node:url'
import { dirname, join } from 'node:path'
import fs from 'fs-extra'
import { handleZIP } from '../zip'

function run() {
  //
  const __filename = fileURLToPath(import.meta.url)
  const __dirname = dirname(__filename)
  const outPath = join(__dirname, '../..', '.docs', '.vitepress', 'zip', 'dist.zip')
  console.log('outPath', outPath)
  const inPath = join(__dirname, '../..', '.docs', '.vitepress', 'dist')

  fs.mkdir(join(__dirname, '../..', '.docs', '.vitepress', 'zip'), { recursive: true })

  handleZIP(inPath, outPath)
}

run()
