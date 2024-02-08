import type { PropType, Ref } from 'vue'
import { defineComponent, ref, toRefs } from 'vue'
import type { ExtractPublicPropTypes } from '@destyler/shared'
import { createContext } from '@destyler/shared'
import { useId, useVModel } from '@destyler/composition'

export const destylerDialogRootProps = {
  open: {
    type: Boolean as PropType<boolean>,
    required: false,
    default: undefined,
  },
  defaultOpen: {
    type: Boolean as PropType<boolean>,
    required: false,
    default: false,
  },
  modal: {
    type: Boolean as PropType<boolean>,
    required: false,
    default: true,
  },
} as const

export type DestylerDialogRootProps = ExtractPublicPropTypes<typeof destylerDialogRootProps>

export interface DialogRootContext {
  open: Readonly<Ref<boolean>>
  modal: Ref<boolean | undefined>
  openModal(): void
  onOpenChange(value: boolean): void
  onOpenToggle(): void
  triggerElement: Ref<HTMLElement | undefined>
  contentElement: Ref<HTMLElement | undefined>
  contentId: string
  titleId: string
  descriptionId: string
}

export const [injectDialogRootContext, provideDialogRootContext] = createContext<DialogRootContext>('DestylerDialogRoot')

export const DestylerDialogRoot = defineComponent({
  name: 'DestylerDialogRoot',
  props: destylerDialogRootProps,
  emits: ['update:open'],
  setup(props, { emit }) {
    const open = useVModel(props, 'open', emit, {
      defaultValue: props.defaultOpen,
      passive: (props.open === undefined) as false,
    }) as Ref<boolean>

    const triggerElement = ref<HTMLElement>()
    const contentElement = ref<HTMLElement>()
    const { modal } = toRefs(props)

    provideDialogRootContext({
      open,
      modal,
      openModal: () => {
        open.value = true
      },
      onOpenChange: (value) => {
        open.value = value
      },
      onOpenToggle: () => {
        open.value = !open.value
      },
      contentId: useId(),
      titleId: useId(),
      descriptionId: useId(),
      triggerElement,
      contentElement,
    })
  },
  render() {
    return this.$slots.default?.()
  },
})
