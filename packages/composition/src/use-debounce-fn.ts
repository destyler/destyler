import type { DebounceFilterOptions, FunctionArgs, MaybeRefOrGetter, PromisifyFn } from '@destyler/shared'
import { createFilterWrapper, debounceFilter } from '@destyler/shared'

export function useDebounceFn<T extends FunctionArgs>(
  fn: T,
  ms: MaybeRefOrGetter<number> = 200,
  options: DebounceFilterOptions = {},
): PromisifyFn<T> {
  return createFilterWrapper(
    debounceFilter(ms, options),
    fn,
  )
}
