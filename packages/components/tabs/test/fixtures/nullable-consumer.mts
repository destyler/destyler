import type { Context, Service, ValueChangeDetails } from '@destyler/tabs'
import { connect, machine } from '@destyler/tabs'
import { createNormalizer } from '@destyler/types'

export const selected: ValueChangeDetails = { value: 'a' }
export const cleared: ValueChangeDetails = { value: null }

export function createConsumer() {
  const branches: string[] = []
  let service: Service
  const onValueChange: NonNullable<Context['onValueChange']> = ({ value }: { value: string | null }) => {
    if (value === null) {
      branches.push('cleared')
    }
    else {
      branches.push(value.toUpperCase())
    }
    service.setContext({ value })
  }
  const context: Context = { id: 'public-nullable-consumer', value: null, onValueChange }
  service = machine(context)
  const normalize = createNormalizer(props => props)
  return {
    service,
    branches,
    api: () => connect(service.getState(), service.send, normalize),
  }
}
