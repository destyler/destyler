import { createHash } from 'node:crypto'
import dns from 'node:dns'
import { createReadStream, existsSync, statSync } from 'node:fs'
import process from 'node:process'
import { Readable } from 'node:stream'
import { setTimeout as delay } from 'node:timers/promises'

/**
 * Calculate file SHA256 (Base64 encoded)
 */
export async function calculateSHA256(filePath: string): Promise<string> {
  return new Promise((resolve, reject) => {
    const hash = createHash('sha256')
    const stream = createReadStream(filePath)
    stream.on('data', chunk => hash.update(chunk))
    stream.on('end', () => resolve(hash.digest('base64')))
    stream.on('error', reject)
  })
}

/**
 * Generic retry wrapper with exponential backoff
 */
export async function withRetry<T>(fn: () => Promise<T>, retries = 3, ms = 2000): Promise<T> {
  try {
    return await fn()
  }
  catch (err) {
    if (retries <= 0)
      throw err
    console.log(`Request failed. Retry in ${ms / 1000}s (remaining retries: ${retries})`)
    await delay(ms)
    return withRetry(fn, retries - 1, Math.round(ms * 1.5))
  }
}

/** fetch with timeout (auto add duplex for Node readable streams) */
async function timeoutFetch(input: RequestInfo | URL, init: (RequestInit & { timeout?: number, duplex?: 'half' }) = {}) {
  const { timeout = 30000, ...rest } = init
  // If body is a Node Readable stream, ensure duplex is set (Node/undici requirement)
  if (rest.body && rest instanceof Object) {
    const body: any = (rest as any).body
    if (body instanceof Readable && (rest as any).duplex === undefined) {
      ;(rest as any).duplex = 'half'
    }
  }
  const controller = new AbortController()
  const id = setTimeout(() => controller.abort(), timeout)
  try {
    const res = await fetch(input, { ...(rest as any), signal: controller.signal })
    return res
  }
  finally {
    clearTimeout(id)
  }
}

interface UploadInitResponse {
  presign_url: string
  presign_header: Record<string, string>
  upload_id: string
}

interface PrepareResponse { url: string }

/**
 * Deploy a zip archive to Zeabur
 * @param zipPath Zip file path
 * @param token Zeabur token
 * @param environment Environment ID
 * @param service Service ID
 */
export async function deployToZeabur(zipPath: string, token: string, environment: string, service: string): Promise<void> {
  if (!zipPath)
    throw new Error('zipPath is required')
  if (!token)
    throw new Error('token is required')
  if (!environment)
    throw new Error('environment is required')
  if (!service)
    throw new Error('service is required')

  if (!existsSync(zipPath))
    throw new Error(`Zip file not found: ${zipPath}`)

  console.log(`\nStarting deployment: ${zipPath}`)

  // DNS check (non-fatal)
  console.log('Resolving api.zeabur.com ...')
  try {
    const addresses = await dns.promises.resolve4('api.zeabur.com')
    console.log(`DNS resolved: ${addresses.join(', ')}`)
  }
  catch (e: any) {
    console.warn(`DNS resolve failed: ${e?.message || e}`)
  }

  const stats = statSync(zipPath)
  const contentLength = stats.size

  console.log('Computing file hash ...')
  const contentHash = await calculateSHA256(zipPath)

  console.log('Creating upload session ...')
  const initResp = await withRetry(async () => {
    const res = await timeoutFetch('https://api.zeabur.com/v2/upload', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`,
      },
      body: JSON.stringify({
        content_hash: contentHash,
        content_hash_algorithm: 'sha256',
        content_length: contentLength,
      }),
      timeout: 30000,
    })
    if (!res.ok)
      throw new Error(`Failed to create upload session: ${res.status} ${res.statusText}`)
    return res.json() as Promise<UploadInitResponse>
  })

  const { presign_url, presign_header, upload_id } = initResp
  console.log(`Upload ID: ${upload_id}`)

  console.log('Uploading file ...')
  await withRetry(async () => {
    const stream = createReadStream(zipPath)
    const res = await timeoutFetch(presign_url, {
      method: 'PUT',
      headers: {
        ...presign_header,
        'Content-Length': String(contentLength),
      },
      body: stream as any,
      // explicit duplex for clarity (redundant with auto logic but harmless)
      duplex: 'half',
      timeout: 60000,
    })
    if (!res.ok && res.status !== 200) {
      const text = await res.text().catch(() => '')
      throw new Error(`Upload failed: ${res.status} ${res.statusText}${text ? ` - ${text.slice(0, 200)}` : ''}`)
    }
    return true
  })

  console.log('Preparing deployment ...')
  const prepare = await withRetry(async () => {
    const res = await timeoutFetch(`https://api.zeabur.com/v2/upload/${upload_id}/prepare`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`,
      },
      body: JSON.stringify({
        upload_type: 'existing_service',
        service_id: service,
        environment_id: environment,
      }),
      timeout: 30000,
    })
    if (!res.ok)
      throw new Error(`Prepare failed: ${res.status} ${res.statusText}`)
    return res.json() as Promise<PrepareResponse>
  })

  console.log('\nDeployment request submitted. Track status at:')
  console.log(prepare.url)
}

// CLI entry: tsx scripts/deploy.ts <token> <environment> <service> <zipPath>
if (process.argv[1]?.endsWith('deploy.ts') && process.argv.length > 2) {
  const [, , token, environment, service, zipPath] = process.argv
  if (!token || !environment || !service || !zipPath) {
    console.error('Usage: tsx scripts/deploy.ts <token> <environment> <service> <zipPath>')
    process.exit(1)
  }
  deployToZeabur(zipPath, token, environment, service).catch((err) => {
    console.error('Deployment failed:', err)
    process.exit(1)
  })
}
