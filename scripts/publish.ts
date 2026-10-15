import process from 'node:process'
import { publishPackages } from './publish-packages.mjs'

const args = process.argv.slice(2)
if (args.length > 1 || (args.length === 1 && args[0] !== '--dry-run'))
  throw new Error('Usage: publish:ci [--dry-run]')

publishPackages({ dryRun: args.includes('--dry-run') })
