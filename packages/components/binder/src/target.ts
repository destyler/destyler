import { defineComponent, inject, withDirectives } from 'vue'
import { getFirstVNode } from '@destyler/shared'
import type { BinderInstance } from './instance'

export default defineComponent({
  name: 'DestylerTarget',
  setup(_, { slots }) {
    const { setTargetRef, syncTarget } = inject<BinderInstance>('DestylerBinder')!
    const setTargetDirective = {
      mounted: setTargetRef,
      updated: setTargetRef,
    }
    return () => {
      if (syncTarget)
        return withDirectives(getFirstVNode('follower', slots), [[setTargetDirective]])
      return getFirstVNode('follower', slots)
    }
  },
})
