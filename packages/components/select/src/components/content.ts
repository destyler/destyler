import type { PropType } from 'vue'
import { Teleport, defineComponent, h, mergeProps, onMounted, ref } from 'vue'
import { useForwardPropsEmits } from '@destyler/composition'
import { DestylerPresence } from '@destyler/presence'
import type { ExtractPublicPropTypes } from '@destyler/shared'

import { DestylerSelectContentImpl, destylerSelectContentImplProps } from './contentImpl'
import { DestylerSelectProvider } from './provider'
import { injectSelectRootContext } from './root'

export const destylerSelectContentProps = {
  ...destylerSelectContentImplProps,
  forceMount: {
    type: Boolean as PropType<boolean>,
    required: false,
  },
} as const

export type DestylerSelectContentProps = ExtractPublicPropTypes<typeof destylerSelectContentProps>

export const DestylerSelectContent = defineComponent({
  name: 'DestylerSelectContent',
  inheritAttrs: false,
  props: destylerSelectContentProps,
  emits: ['closeAutoFocus', 'escapeKeyDown', 'pointerDownOutside'],
  setup(props, { emit }) {
    const forwarded = useForwardPropsEmits(props, emit)

    const rootContext = injectSelectRootContext()

    const fragment = ref<DocumentFragment>()
    onMounted(() => {
      fragment.value = new DocumentFragment()
    })

    const presenceRef = ref<InstanceType<typeof DestylerPresence>>()

    return {
      presenceRef,
      rootContext,
      forwarded,
      fragment,
    }
  },
  render() {
    return [
      h(DestylerPresence, {
        ref: 'presenceRef',
        present: this.$props.forceMount || this.rootContext.open.value,
      }, () => h(DestylerSelectContentImpl, mergeProps(this.forwarded, this.$attrs), () => this.$slots.default?.())),
      !this.presenceRef?.present && this.fragment
        ? h(Teleport, {
          to: this.fragment,
        }, () => h(DestylerSelectProvider, {
          context: this.rootContext,
        }, h('div', null, () => this.$slots.default?.())))
        : null,
    ]
  },
})
