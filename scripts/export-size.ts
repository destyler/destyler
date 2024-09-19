import { fileURLToPath } from 'node:url'
import path, { dirname } from 'node:path'
import fs from 'fs-extra'
import { consola } from 'consola'
import type { BuildContext } from 'unbuild'
import { filesize } from 'filesize'

export async function buildEndHook(ctx: BuildContext) {
  consola.info(`start ${ctx.pkg.name}`)
  const __filename = fileURLToPath(import.meta.url)
  const __dirname = dirname(__filename)
  const filePath = path.join(__dirname, '../.docs', 'public', 'export-size.json')

  const mdJSON = <{ path: {
    name: string
    size: string
    version: string
  } }>{}

  const componentName = ctx.options.rootDir.split('packages/').pop()!
  let size = 0
  ctx.buildEntries.forEach((entrie) => {
    size += entrie.bytes !== undefined ? entrie.bytes : 0
  })

  if (fs.existsSync(filePath)) {
    try {
      const data = fs.readFileSync(filePath, 'utf8')
      const jsonData = JSON.parse(data)
      jsonData[componentName] = {
        name: ctx.pkg.name,
        size: filesize(size),
        version: ctx.pkg.version,
      }
      await fs.writeJSON(filePath, jsonData, { spaces: 2 })
    }
    catch (err) {
      consola.error(`error reading file: ${err}`)
    }
  }
  else {
    mdJSON[componentName] = {
      name: ctx.pkg.name,
      size: filesize(size),
      version: ctx.pkg.version,
    }
    await fs.writeJSON(filePath, mdJSON, { spaces: 2 })
    consola.success('not found file, create export-size.json file')
  }
}
