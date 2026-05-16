import { createHash } from 'crypto'
import { createReadStream } from 'fs'

export async function getFileMD5(path: string) {
  const hash = createHash('md5')
  const stream = createReadStream(path)

  return new Promise<string>((resolve, reject) => {
    stream.on('data', (chunk) => hash.update(chunk))
    stream.on('end', () => resolve(hash.digest('hex')))
    stream.on('error', reject)
  })
}
