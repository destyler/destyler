import type { PropType } from 'vue'
import { Teleport, computed, defineComponent, h, mergeProps, onMounted, ref } from 'vue'
import { useForwardPropsEmits } from '@destyler/composition'
import { Presence } from '@destyler/presence'
import type { ExtractPublicPropTypes } from '@destyler/shared'

import { SelectContentImpl, selectContentImplEmits, selectContentImplProps } from './contentImpl'
import { SelectProvider } from './provider'
import { injectSelectRootContext } from './root'

export const selectContentProps = {
  ...selectContentImplProps,
  forceMount: {
    type: Boolean as PropType<boolean>,
    required: false,
  },
} as const

export type SelectContentProps = ExtractPublicPropTypes<typeof selectContentProps>

export const selectContentEmits = {
  ...selectContentImplEmits,
}

export const SelectContent = defineComponent({
  name: 'DestylerSelectContent',
  inheritAttrs: false,
  props: selectContentProps,
  emits: selectContentEmits,

  setup(props, { emit }) {
    const forwarded = useForwardPropsEmits(props, emit)

    const rootContext = injectSelectRootContext()

    const fragment = ref<DocumentFragment>()
    onMounted(() => {
      fragment.value = new DocumentFragment()
    })

    const presenceRef = ref<InstanceType<typeof Presence>>()

    const renderPresence = computed(() => props.forceMount || rootContext.open.value)

    return {
      presenceRef,
      rootContext,
      forwarded,
      fragment,
      renderPresence,
    }
  },
  render() {
    if (this.renderPresence) {
      return h(Presence, {
        ref: 'presenceRef',
        present: true,
      }, () => h(SelectContentImpl, mergeProps(
        { ...this.forwarded, ...this.$attrs },
      ), () => this.$slots.default?.()))
    }
    else if (!this.presenceRef?.present && this.fragment) {
      return h('div', {}, h(Teleport, {
        to: this.fragment,
      }, h(SelectProvider, {
        context: this.rootContext,
      }, () => this.$slots.default?.())))
    }
  },
})
