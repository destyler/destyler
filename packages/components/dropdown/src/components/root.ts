import type { PropType, Ref } from 'vue'
import { defineComponent, h, ref, toRefs } from 'vue'
import type { Direction, ExtractPublicPropTypes } from '@destyler/shared'
import { createContext } from '@destyler/shared'
import { useDirection, useForwardExpose, useId, useVModel } from '@destyler/composition'
import { MenuRoot, menuRootProps } from '@destyler/menu'
import { menuRootEmits } from '@destyler/menu/component'

export const dropdownRootProps = {
  /**
   * The reading direction of the combobox when applicable.
   */
  dir: {
    ...menuRootProps.dir,
  },
  /**
   * The modality of the dropdown menu.
   * When set to true, interaction with
   * outside elements will be disabled and
   * only menu content will be visible to
   * screen readers.
   */
  modal: {
    ...menuRootProps.modal,
  },
  /**
   * @default undefined
   */
  open: {
    ...menuRootProps.open,
    default: undefined,
  },
  /**
   * The open state of the dropdown menu when it is initially rendered.
   * Use when you do not need to control its open state.
   *
   * @default undefined
   */
  defaultOpen: {
    type: Boolean as PropType<boolean>,
    required: false,
    default: undefined,
  },
} as const

export type DropdownRootProps = ExtractPublicPropTypes<typeof dropdownRootProps>

export const dropdownRootEmits = {
  ...menuRootEmits,
}

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

export const DropdownRoot = defineComponent({
  name: 'DestylerDropdownRoot',
  props: dropdownRootProps,
  emits: dropdownRootEmits,
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
    return h(MenuRoot, {
      'modal': this.modal,
      'dir': this.dir,
      'open': this.open,
      'onUpdate:open': (value) => {
        this.open = value
      },
    }, () => this.$slots.default?.())
  },
})
