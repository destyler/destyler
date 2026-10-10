// @vitest-environment happy-dom
import { useService } from '@destyler/vanilla'
import { afterEach, vi } from 'vitest'
import { connect } from '../src/connect'
import { machine } from '../src/machine'

const normalize = new Proxy({}, { get: () => (props: unknown) => props }) as any
const services: ReturnType<typeof machine>[] = []
export const panels = [{ id: 'a', size: 50 }, { id: 'b', size: 50 }]
export async function flush() {
  for (let i = 0; i < 6; i++)
    await Promise.resolve()
}
export function setup(context: Record<string, unknown> = {}) {
  const service = machine({ id: 'audit', ...('size' in context ? {} : { defaultSize: panels }), ...context } as any)
  services.push(service)
  useService({}, service)
  const root = document.createElement('div')
  root.id = 'splitter:audit'
  Object.defineProperty(root, 'offsetWidth', { value: 1000 })
  Object.defineProperty(root, 'offsetHeight', { value: 1000 })
  document.body.append(root)
  const api = () => connect(service.state, service.send, normalize)
  return { service, api, root }
}
afterEach(() => {
  for (const service of services.splice(0)) service.stop()
  document.body.replaceChildren()
  document.head.querySelectorAll('style').forEach(el => el.remove())
  vi.restoreAllMocks()
})
