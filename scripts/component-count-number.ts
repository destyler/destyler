import { fileURLToPath } from 'node:url'
import { dirname, join } from 'node:path'
import { createInterface } from 'node:readline'
import fs from 'fs-extra'
import { consola } from 'consola'
import { $fetch } from 'ofetch'

async function run() {
  consola.info('Start to count the number of components...')
  const __filename = fileURLToPath(import.meta.url)
  const __dirname = dirname(__filename)
  const filePath = join(__dirname, '..', 'packages', 'destyler', 'src', 'index.ts')
  const svgFilePath = join(__dirname, '../docs', 'public', 'component-count-number.svg')
  const rl = createInterface({
    input: fs.createReadStream(filePath),
    crlfDelay: Number.POSITIVE_INFINITY,
  })

  let lineCount = 0

  rl.on('line', () => {
    lineCount++
  })

  rl.on('close', async () => {
    const url = `https://img.shields.io/badge/-${lineCount}%20components-13708a`
    const data = await $fetch(url, { responseType: 'text' })
    await fs.writeFile(svgFilePath, data, 'utf-8')
    consola.success('The number of components has been counted successfully!')
  })
}

run()
