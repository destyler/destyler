import type { PropType, Ref } from 'vue'
import { defineComponent, h, mergeProps } from 'vue'
import { DestylerPrimitive, destylerPrimitiveProps } from '@destyler/primitive'
import type { ExtractPublicPropTypes } from '@destyler/shared'
import { createContext } from '@destyler/shared'
import { useVModel } from '@destyler/composition'

export interface InfoRootContext {
  open: Readonly<Ref<boolean>>
  onToggle: () => void
}

export const [injectInfoRootContext, provideInfoRootContext] = createContext<InfoRootContext>('DestylerInfoRoot')

export const destylerInfoRootProps = {
  ...destylerPrimitiveProps,
  defaultOpen: {
    type: Boolean as PropType<boolean>,
    required: false,
    default: true,
  },
  open: {
    type: Boolean as PropType<boolean>,
    required: false,
    default: undefined,
  },
} as const

export type DestylerInfoRootProps = ExtractPublicPropTypes<typeof destylerInfoRootProps>

export const DestylerInfoRoot = defineComponent({
  name: 'DestylerInfoRoot',
  inheritAttrs: false,
  props: destylerInfoRootProps,
  emits: ['update:open'],
  setup(props, { emit }) {
    const openRef = useVModel(props, 'open', emit, {
      defaultValue: props.defaultOpen,
      passive: (props.open === undefined) as false,
    }) as unknown as Ref<boolean>

    provideInfoRootContext({
      open: openRef,
      onToggle: () => {
        openRef.value = !openRef.value
      },
    })

    return {
      openRef,
    }
  },
  render() {
    const useVShow = this.openRef
    return useVShow
      ? h(DestylerPrimitive, mergeProps(this.$attrs, {
        as: this.$props.as,
        asChild: this.$props.asChild,
      }), () => this.$slots.default?.())
      : null
  },
})
