import { hideOthers } from './src/aria-hidden'

function raf(fn: VoidFunction) {
  const frameId = requestAnimationFrame(() => fn())
  return () => cancelAnimationFrame(frameId)
}

type MaybeElement = HTMLElement | null
type Targets = Array<MaybeElement>
type TargetsOrFn = Targets | (() => Targets)

interface Options {
  defer?: boolean
}

export function ariaHidden(targetsOrFn: TargetsOrFn, options: Options = {}) {
  const { defer = true } = options
  const func = defer ? raf : (v: any) => v()
  const cleanups: (VoidFunction | undefined)[] = []
  let disposed = false
  cleanups.push(
    func(() => {
      const targets = typeof targetsOrFn === 'function' ? targetsOrFn() : targetsOrFn
      if (disposed)
        return
      const elements = targets.filter(Boolean) as HTMLElement[]
      if (elements.length === 0)
        return
      const cleanup = hideOthers(elements)
      if (disposed)
        cleanup?.()
      else
        cleanups.push(cleanup)
    }),
  )
  return () => {
    disposed = true
    cleanups.splice(0).forEach(fn => fn?.())
  }
}
