import type { PropType, Ref } from 'vue'
import { defineComponent, h, ref } from 'vue'
import type { ExtractPublicPropTypes } from '@destyler/shared'
import { createContext } from '@destyler/shared'
import { useForwardExpose, useForwardPropsEmits } from '@destyler/composition'
import { TooltipRoot } from '@destyler/tooltip'

export const ellipsisRootProps = {
  /**
   * The open state of the dropdown menu when it is initially rendered.
   * Use when you do not need to control its open state.
   *
   * @default false
   */
  defaultOpen: {
    type: Boolean as PropType<boolean>,
    required: false,
    default: false,
  },
  /**
   * The controlled open state of the Ellipsis. Can be binded-with with `v-model:open`.
   *
   * @default undefined
   */
  open: {
    type: Boolean as PropType<boolean>,
    required: false,
    default: undefined,
  },
  delayDuration: {
    type: Number as PropType<number>,
    required: false,
    default: 400,
  },
  disableHoverableContent: {
    type: Boolean as PropType<boolean>,
    required: false,
    default: undefined,
  },
  disableClosingTrigger: {
    type: Boolean as PropType<boolean>,
    required: false,
    default: undefined,
  },
  disabled: {
    type: Boolean as PropType<boolean>,
    required: false,
    default: undefined,
  },
  ignoreNonKeyboardFocus: {
    type: Boolean as PropType<boolean>,
    required: false,
    default: undefined,
  },
} as const

export type EllipsisRootProps = ExtractPublicPropTypes<typeof ellipsisRootProps>

export const ellipsisRootEmits = {
  /**
   * Emitted when the open state of the Ellipsis changes.
   */
  'update:open': (_open: boolean) => true,
}

export interface EllipsisContext {
  text: Ref<string>
  onSetText: (text: string) => void
}

export const [injectEllipsisRootContext, provideEllipsisRootContext] = createContext<EllipsisContext>('DestylerEllipsisRoot')

export const EllipsisRoot = defineComponent({
  name: 'DestylerEllipsisRoot',
  props: ellipsisRootProps,
  emits: ellipsisRootEmits,
  setup(props, { emit }) {
    const forward = useForwardPropsEmits(props, emit)
    useForwardExpose()
    const triggerText = ref('')

    provideEllipsisRootContext({
      text: triggerText,
      onSetText(text) {
        triggerText.value = text
      },
    })
    return {
      forward,
    }
  },
  render() {
    return h(TooltipRoot, this.forward, () => this.$slots.default?.())
  },
})
