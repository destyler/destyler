import { defineComponent, inject, withDirectives } from 'vue'
import { getFirstVNode } from '@destyler/shared'

export interface ExposedBinderInstance {
  targetRef: HTMLElement | null
}

export interface BinderInstance extends ExposedBinderInstance {
  syncTargetWithParent: boolean
  syncTarget: boolean
  setTargetRef: (el: HTMLElement | null) => void
  addScrollListener: (listener: () => void) => void
  removeScrollListener: (listener: () => void) => void
  addResizeListener: (listener: () => void) => void
  removeResizeListener: (listener: () => void) => void
}

export default defineComponent({
  name: 'DestylerTarget',
  setup() {
    const { setTargetRef, syncTarget } = inject<BinderInstance>('DestylerBinder')!
    const setTargetDirective = {
      mounted: setTargetRef,
      updated: setTargetRef,
    }
    return {
      syncTarget,
      setTargetDirective,
    }
  },
  render() {
    const { syncTarget, setTargetDirective } = this
    if (syncTarget) {
      return withDirectives(getFirstVNode('follower', this.$slots), [
        [setTargetDirective],
      ])
    }
    return getFirstVNode('follower', this.$slots)
  },
})
