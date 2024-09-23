import * as fs from 'node:fs'
import archiver from 'archiver'

export function handleZIP(inPath: string, outPath: string) {
  const output = fs.createWriteStream(outPath)
  const archive = archiver('zip', {
    zlib: { level: 9 }, // 设置压缩级别
  })

  output.on('close', () => {
    console.log(`${archive.pointer()} total bytes`)
    console.log('archiver has been finalized and the output file descriptor has closed.')
  })

  archive.on('error', (err) => {
    throw err
  })

  archive.pipe(output)

  // 将inPath目录中的所有文件添加到zip中
  archive.directory(inPath, false)

  archive.finalize()
}
