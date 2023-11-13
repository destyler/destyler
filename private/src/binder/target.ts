import { defineComponent, inject, withDirectives } from 'vue'
import { getFirstVNode } from '@destyler/shared'
import type { BinderInstance } from './instance'

export default defineComponent({
  name: 'DestylerTarget',
  setup() {
    const { setTargetRef, syncTarget } = inject<BinderInstance>('DestylerBinder')!
    const setTargetDirective = {
      mounted(el: HTMLElement | null) {
        setTargetRef(el)
      },
      updated(el: HTMLElement | null) {
        setTargetRef(el)
      },
    }
    return {
      syncTarget,
      setTargetDirective,
    }
  },
  render() {
    const { syncTarget, setTargetDirective } = this
    /**
     * If you are using VBinder as a child of VBinder, the children wouldn't be
     * a valid DOM or component that can be attached to by directive.
     * So we won't sync target on those kind of situation and control the
     * target sync logic manually.
     */
    if (syncTarget) {
      return withDirectives(getFirstVNode('follower', this.$slots), [
        [setTargetDirective],
      ])
    }
    return getFirstVNode('follower', this.$slots)
  },
})
