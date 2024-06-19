import fs from 'node:fs'
import path from 'node:path'
import process from 'node:process'

function run(dir: string) {
  const files = fs.readdirSync(dir)

  for (const file of files) {
    const filePath = path.join(dir, file)

    const stat = fs.statSync(filePath)

    if (stat.isDirectory()) {
      if (file === 'node_modules') {
        fs.rmdirSync(filePath, { recursive: true })
        console.log(`remove ${filePath}`)
      }
      else {
        run(filePath)
      }
    }
    else if (stat.isFile()) {
      if (file.endsWith('-lock.yaml')) {
        fs.unlinkSync(filePath)
        console.log(`remove ${filePath}`)
      }
    }
  }
}

run(path.join(process.cwd()))
