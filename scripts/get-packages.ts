import process from 'node:process'
import { findPackages } from 'find-packages'

export async function getWorkspacePackages() {
  return findPackages(process.cwd(), {
    includeRoot: false,
    patterns: ['packages/**/*', 'shared/*'],
  })
}

export async function getComponentsPackages() {
  return findPackages(process.cwd(), {
    patterns: ['packages/components/**/*'],
  })
}

export async function getExamplePackages() {
  return findPackages(process.cwd(), {
    patterns: ['examples/*'],
  })
}
