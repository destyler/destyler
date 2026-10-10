// @vitest-environment happy-dom
import type { StepDetails } from '../src/types'
import { useService } from '@destyler/vanilla'
import { afterEach, vi } from 'vitest'
import { connect } from '../src/connect'
import { machine } from '../src/machine'

const normalize = new Proxy({}, { get: () => (props: unknown) => props }) as any
const services: ReturnType<typeof machine>[] = []
export const step = (id: string): StepDetails => ({ id, type: 'dialog', title: id, description: id })
export async function flush() {
  for (let i = 0; i < 8; i++)
    await Promise.resolve()
}
export function setup(context: Record<string, unknown> = {}, keep: string[] = []) {
  const service = machine({ id: 'audit', steps: [step('a'), step('b'), step('c')], ...context } as any)
  service.setOptions({ activities: Object.fromEntries(['trackBoundarySize', 'trapFocus', 'trackPlacement', 'trackDismissableBranch', 'trackInteractOutside', 'trackEscapeKeydown'].filter(key => !keep.includes(key)).map(key => [key, () => {}])) })
  services.push(service)
  useService({}, service)
  const api = () => connect(service.state, service.send, normalize)
  return { service, api }
}
afterEach(() => {
  for (const service of services.splice(0)) service.stop()
  document.body.replaceChildren()
  vi.restoreAllMocks()
})
