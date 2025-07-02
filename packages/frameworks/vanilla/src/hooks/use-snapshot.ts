import type { AnyEventObject, EventObject, HookOptions, Machine, StateSchema, XState } from '@destyler/xstate'
import { globalRef, snapshot } from '@destyler/store'
import { compact, isEqual } from '@destyler/utils'
import { createProxy as createProxyToCompare, isChanged } from 'proxy-compare'

const targetCache = globalRef('__destyler__targetCache', () => new WeakMap())
const snapshotCache = new WeakMap<object, any>()

export function useSnapshot<
  TContext extends Record<string, any>,
  TState extends StateSchema,
  TEvent extends EventObject = AnyEventObject,
>(
  target: object,
  service: Machine<TContext, TState, TEvent>,
  options?: HookOptions<TContext, TState, TEvent> & { sync?: boolean },
): XState<TContext, TState, TEvent> {
  const { actions, context } = options ?? {}

  // 获取或创建快照缓存
  if (!snapshotCache.has(target)) {
    snapshotCache.set(target, {
      lastSnapshot: undefined,
      lastAffected: undefined,
    })
  }

  const cache = snapshotCache.get(target)

  service.setOptions({ actions })

  // 处理 context 更新
  if (context) {
    const ctx = compact(context)
    const entries = Object.entries(ctx)
    const previousCtx = service.contextSnapshot ?? {}

    const equality = entries.map(([key, value]) => ({
      key,
      curr: value,
      prev: previousCtx[key],
      equal: isEqual(previousCtx[key], value),
    }))

    const allEqual = equality.every(({ equal }) => equal)

    if (!allEqual) {
      service.setContext(ctx)
    }
  }

  const nextSnapshot = snapshot(service.state)

  try {
    if (
      cache.lastSnapshot
      && cache.lastAffected
      && !isChanged(cache.lastSnapshot, nextSnapshot, cache.lastAffected, new WeakMap())
    ) {
      return cache.lastSnapshot
    }
  }
  catch {
    // ignore if a promise or something is thrown
  }

  const currAffected = new WeakMap()
  cache.lastSnapshot = nextSnapshot
  cache.lastAffected = currAffected

  const proxyCache = new WeakMap() // per-hook proxyCache

  return createProxyToCompare(nextSnapshot, currAffected, proxyCache, targetCache) as any
}
