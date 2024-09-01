import type { PropType, Ref } from 'vue'
import { defineComponent, h, mergeProps } from 'vue'
import { Primitive, primitiveProps } from '@destyler/primitive'
import type { ExtractPublicPropTypes } from '@destyler/shared'
import { createContext } from '@destyler/shared'
import { useVModel } from '@destyler/composition'

export interface InfoRootContext {
  open: Readonly<Ref<boolean>>
  onToggle: () => void
}

export const [injectInfoRootContext, provideInfoRootContext] = createContext<InfoRootContext>('DestylerInfoRoot')

export const infoRootProps = {
  ...primitiveProps,
  /**
   * The open state of the collapsible when it is initially rendered.
   * Use when you do not need to control its open state.
   *
   * @default true
   */
  defaultOpen: {
    type: Boolean as PropType<boolean>,
    required: false,
    default: true,
  },
  /**
   * The controlled open state of the info.
   * Can be binded with `v-model`.
   *
   * @default undefined
   */
  open: {
    type: Boolean as PropType<boolean>,
    required: false,
    default: undefined,
  },
} as const

export type InfoRootProps = ExtractPublicPropTypes<typeof infoRootProps>

export const infoRootEmits = {
  /**
   * Event handler called when the
   * open state of the info changes.
   */
  'update:open': (_value: boolean) => true,
}

export const InfoRoot = defineComponent({
  name: 'DestylerInfoRoot',
  inheritAttrs: false,
  props: infoRootProps,
  emits: infoRootEmits,
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
    if (this.openRef) {
      return h(Primitive, mergeProps(this.$attrs, {
        'as': this.$props.as,
        'asChild': this.$props.asChild,
        'role': 'info',
        'aria-label': 'Info',
        'aria-expanded': this.openRef,
      }), () => this.$slots.default?.())
    }
  },
})
