import fs from 'node:fs'
import http from 'node:http'
import https from 'node:https'
import { syncBuiltinESMExports } from 'node:module'
import process from 'node:process'

const log = process.env.INSPECTOR_SMOKE_NETWORK_LOG
if (!log)
  throw new Error('Inspector smoke requires a local network-attempt log')

function block(method, input) {
  const url = input instanceof Request ? input.url : String(input)
  let expectedMetadata = false
  try {
    const target = new URL(url)
    expectedMetadata = target.protocol === 'https:' && (
      target.hostname === 'npm.antfu.dev'
      || (target.hostname === 'registry.npmjs.org' && target.pathname === '/-/npm/v1/security/advisories/bulk')
    )
  }
  catch {}
  fs.appendFileSync(log, `${JSON.stringify({ method, url, expectedMetadata })}\n`)
  // A non-network TypeError stops upstream metadata retries immediately.
  throw new TypeError('Inspector smoke intentionally blocks outbound metadata')
}

globalThis.fetch = async input => block('fetch', input)
for (const [name, client] of [['http', http], ['https', https]]) {
  for (const method of ['get', 'request'])
    client[method] = (...args) => block(`${name}.${method}`, args[0])
}
syncBuiltinESMExports()
