import type { PropType, Ref } from 'vue'
import { defineComponent, h, ref, toRefs, watchEffect } from 'vue'
import type { Direction, ExtractPublicPropTypes } from '@destyler/shared'
import { useDirection, useVModel } from '@destyler/composition'
import { createContext, isClient } from '@destyler/shared'
import { PopperRoot } from '@destyler/popper'

export const menuRootProps = {
  /**
   * The controlled open state of the menu.
   * Can be used as `v-model:open`.
   *
   * @default false
   */
  open: {
    type: Boolean as PropType<boolean>,
    required: false,
    default: false,
  },
  /**
   * The reading direction of the combobox when applicable.
   */
  dir: {
    type: String as PropType<Direction>,
    required: false,
  },
  /**
   * The modality of the dropdown menu.
   *
   * When set to `true`, interaction with outside elements will be disabled and only menu content will be visible to screen readers.
   *
   * @default true
   */
  modal: {
    type: Boolean as PropType<boolean>,
    required: false,
    default: true,
  },
} as const

export type MenuRootProps = ExtractPublicPropTypes<typeof menuRootProps>

export const menuRootEmits = {
  /**
   * Event handler called when the open state of the menu changes.
   */
  'update:open': (_open: boolean) => true,
}

export interface MenuContext {
  open: Ref<boolean>
  onOpenChange: (open: boolean) => void
  content: Ref<HTMLElement | undefined>
  onContentChange: (content: HTMLElement | undefined) => void
}

export interface MenuRootContext {
  onClose: () => void
  dir: Ref<Direction>
  isUsingKeyboardRef: Ref<boolean>
  modal: Ref<boolean>
}

export const [injectMenuContext, provideMenuContext] = createContext<MenuContext>(['DestylerMenuRoot', 'DestylerMenuSub'], 'DestylerMenuContext')

export const [injectMenuRootContext, provideMenuRootContext] = createContext<MenuRootContext>('DestylerMenuRoot')

export const MenuRoot = defineComponent({
  name: 'DestylerMenuRoot',
  props: menuRootProps,
  emits: menuRootEmits,
  setup(props, { emit }) {
    const { modal, dir: propDir } = toRefs(props)
    const dir = useDirection(propDir)

    const open = useVModel(props, 'open', emit)

    const content = ref<HTMLElement>()
    const isUsingKeyboardRef = ref(false)

    const handlePointer = () => isUsingKeyboardRef.value = false

    watchEffect((cleanupFn) => {
      if (!isClient)
        return
      const handleKeyDown = () => {
        isUsingKeyboardRef.value = true
        document.addEventListener('pointerdown', handlePointer, {
          capture: true,
          once: true,
        })
        document.addEventListener('pointermove', handlePointer, {
          capture: true,
          once: true,
        })
      }
      document.addEventListener('keydown', handleKeyDown, { capture: true })
      cleanupFn(() => {
        document.removeEventListener('keydown', handleKeyDown, { capture: true })
        document.removeEventListener('pointerdown', handlePointer, {
          capture: true,
        })
        document.removeEventListener('pointermove', handlePointer, {
          capture: true,
        })
      })
    })

    provideMenuContext({
      open,
      onOpenChange: (value) => {
        open.value = value
      },
      content,
      onContentChange: (element) => {
        content.value = element
      },
    })

    provideMenuRootContext({
      onClose: () => {
        open.value = false
      },
      isUsingKeyboardRef,
      dir,
      modal,
    })
  },
  render() {
    return h(PopperRoot, null, () => this.$slots.default?.())
  },
})
