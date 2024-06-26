import type { PropType, Ref } from 'vue'
import { defineComponent, h, ref, toRefs } from 'vue'
import type { Direction, ExtractPublicPropTypes } from '@destyler/shared'
import { createContext } from '@destyler/shared'
import { useDirection, useForwardExpose, useId, useVModel } from '@destyler/composition'
import { DestylerMenuRoot, destylerMenuRootProps } from '@destyler/menu'

export const destylerDropdownRootProps = {
  ...destylerMenuRootProps,
  defaultOpen: {
    type: Boolean as PropType<boolean>,
    required: false,
  },
} as const

export type DestylerDropdownRootProps = ExtractPublicPropTypes<typeof destylerDropdownRootProps>

export interface DropdownMenuRootContext {
  open: Readonly<Ref<boolean>>
  onOpenChange: (open: boolean) => void
  onOpenToggle: () => void
  triggerId: string
  triggerElement: Ref<HTMLElement | undefined>
  contentId: string
  modal: Ref<boolean>
  dir: Ref<Direction>
}

export const [injectDropdownMenuRootContext, provideDropdownMenuRootContext] = createContext<DropdownMenuRootContext>('DestylerDropdownMenuRoot')

export const DestylerDropdownRoot = defineComponent({
  name: 'DestylerDropdownRoot',
  props: destylerDropdownRootProps,
  emits: ['update:open'],
  setup(props, { emit }) {
    useForwardExpose()
    const open = useVModel(props, 'open', emit, {
      defaultValue: props.defaultOpen,
      passive: (props.open === undefined) as false,
    }) as Ref<boolean>

    const triggerElement = ref<HTMLElement>()

    const { modal, dir: propDir } = toRefs(props)
    const dir = useDirection(propDir)
    provideDropdownMenuRootContext({
      open,
      onOpenChange: (value) => {
        open.value = value
      },
      onOpenToggle: () => {
        open.value = !open.value
      },
      triggerId: useId(),
      triggerElement,
      contentId: useId(),
      modal,
      dir,
    })

    return {
      modal,
      open,
      dir,
    }
  },
  render() {
    return h(DestylerMenuRoot, {
      'modal': this.modal,
      'dir': this.dir,
      'open': this.open,
      'onUpdate:open': (value: any) => {
        this.open = value
      },
    }, () => this.$slots.default?.())
  },
})
