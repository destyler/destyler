// eslint-disable-next-line antfu/no-import-dist -- Validate the built public declaration boundary, not source internals.
import type { Api, ValueChangeDetails } from '../../components/toggle/dist/index.mjs'
import { expectTypeOf } from 'vitest'

expectTypeOf<Parameters<Api['setValue']>>().toEqualTypeOf<[values: string[]]>()
expectTypeOf<ValueChangeDetails['value']>().toEqualTypeOf<string[]>()

function consumer(api: Api) {
  api.setValue(['b'])
  api.setValue([])
  // @ts-expect-error The public setter accepts arrays, not scalar click values.
  api.setValue('b')
  // @ts-expect-error Callback and accepted selections must never contain nested arrays.
  api.setValue([['b']])
}
void consumer
