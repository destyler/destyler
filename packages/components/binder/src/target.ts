import { defineComponent, h, inject, withDirectives } from 'vue'
import { getFirstVNode } from '@destyler/shared'
import type { BinderInstance } from './instance'

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
    return h('div', {
      destyler: 'target',
    }, getFirstVNode('follower', this.$slots))
  },
})
