import type { PropType } from 'vue'
import { Teleport, defineComponent, h, mergeProps, onMounted, ref } from 'vue'
import { useForwardPropsEmits } from '@destyler/composition'
import { Presence } from '@destyler/presence'
import type { ExtractPublicPropTypes } from '@destyler/shared'

import { SelectContentImpl, selectContentImplProps } from './contentImpl'
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

export const SelectContent = defineComponent({
  name: 'DestylerSelectContent',
  inheritAttrs: false,
  props: selectContentProps,
  emits: ['closeAutoFocus', 'escapeKeyDown', 'pointerDownOutside'],
  setup(props, { emit }) {
    const forwarded = useForwardPropsEmits(props, emit)

    const rootContext = injectSelectRootContext()

    const fragment = ref<DocumentFragment>()
    onMounted(() => {
      fragment.value = new DocumentFragment()
    })

    const presenceRef = ref<InstanceType<typeof Presence>>()

    return {
      presenceRef,
      rootContext,
      forwarded,
      fragment,
    }
  },
  render() {
    return [
      h(Presence, {
        ref: 'presenceRef',
        present: this.$props.forceMount || this.rootContext.open.value,
      }, () => h(SelectContentImpl, mergeProps(this.forwarded, this.$attrs), () => this.$slots.default?.())),
      !this.presenceRef?.present && this.fragment
        ? h(Teleport, {
          to: this.fragment,
        }, () => h(SelectProvider, {
          context: this.rootContext,
        }, h('div', null, () => this.$slots.default?.())))
        : null,
    ]
  },
})
