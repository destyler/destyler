import type { PropType, Ref } from 'vue'
import { defineComponent, h, ref, toRefs, watchEffect } from 'vue'
import type { Direction, ExtractPublicPropTypes } from '@destyler/shared'
import { useDirection, useVModel } from '@destyler/composition'
import { createContext, isClient } from '@destyler/shared'
import { DestylerPopperRoot } from '@destyler/popper'

export const destylerMenuRootProps = {
  open: {
    type: Boolean as PropType<boolean>,
    required: false,
    default: false,
  },
  dir: {
    type: String as PropType<Direction>,
    required: false,
  },
  modal: {
    type: Boolean as PropType<boolean>,
    required: false,
    default: true,
  },
} as const

export type DestylerMenuRootProps = ExtractPublicPropTypes<typeof destylerMenuRootProps>

export interface MenuContext {
  open: Ref<boolean>
  onOpenChange(open: boolean): void
  content: Ref<HTMLElement | undefined>
  onContentChange(content: HTMLElement | undefined): void
}

export interface MenuRootContext {
  onClose(): void
  dir: Ref<Direction>
  isUsingKeyboardRef: Ref<boolean>
  modal: Ref<boolean>
}

export const [injectMenuContext, provideMenuContext] = createContext<MenuContext>(['DestylerMenuRoot', 'DestylerMenuSub'], 'DestylerMenuContext')

export const [injectMenuRootContext, provideMenuRootContext] = createContext<MenuRootContext>('DestylerMenuRoot')

export const DestylerMenuRoot = defineComponent({
  name: 'DestylerMenuRoot',
  props: destylerMenuRootProps,
  emits: ['update:open'],
  setup(props, { emit }) {
    const { modal, dir: propDir } = toRefs(props)
    const dir = useDirection(propDir)

    const open = useVModel(props, 'open', emit)

    const content = ref<HTMLElement>()
    const isUsingKeyboardRef = ref(false)

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
      const handlePointer = () => (isUsingKeyboardRef.value = false)
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
    return h(DestylerPopperRoot, null, {
      default: () => this.$slots.default?.(),
    })
  },
})
