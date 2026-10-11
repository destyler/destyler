import type { AnyEventObject, EventObject, HookOptions, Machine, StateSchema, XState } from '@destyler/xstate'
import { globalRef, snapshot } from '@destyler/store'
import { compact, isEqual } from '@destyler/utils'
import { createProxy as createProxyToCompare } from 'proxy-compare'

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
      proxy: undefined,
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

  // Explicit reads must expose the current version, including previously unread fields.
  if (cache.lastSnapshot === nextSnapshot)
    return cache.proxy

  const currAffected = new WeakMap()
  cache.lastSnapshot = nextSnapshot

  const proxyCache = new WeakMap() // per-hook proxyCache

  cache.proxy = createProxyToCompare(nextSnapshot, currAffected, proxyCache, targetCache)
  return cache.proxy
}
