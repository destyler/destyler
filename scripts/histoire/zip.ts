import { fileURLToPath } from 'node:url'
import { dirname, join } from 'node:path'
import fs from 'fs-extra'
import { handleZIP } from '../zip'

function run() {
  const __filename = fileURLToPath(import.meta.url)
  const __dirname = dirname(__filename)
  const outPath = join(__dirname, '../..', '.histoire', '.histoire', 'zip', 'dist.zip')
  const inPath = join(__dirname, '../..', '.histoire', '.histoire', 'dist')

  fs.mkdir(join(__dirname, '../..', '.histoire', '.histoire', 'zip'), { recursive: true })

  handleZIP(inPath, outPath)
}

run()
