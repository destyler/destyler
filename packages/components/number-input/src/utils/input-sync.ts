import { raf } from '@destyler/dom'

const composing = new WeakSet<HTMLInputElement>()
const pending = new WeakMap<HTMLInputElement, VoidFunction>()

export function scheduleInputSync(input: HTMLInputElement, sync: VoidFunction) {
  pending.set(input, sync)
  raf(() => {
    if (composing.has(input) || pending.get(input) !== sync)
      return
    pending.delete(input)
    sync()
  })
}

export function setInputComposing(input: HTMLInputElement, value: boolean) {
  if (value) {
    composing.add(input)
    return
  }
  composing.delete(input)
  const sync = pending.get(input)
  if (sync)
    scheduleInputSync(input, sync)
}
