import type { Ref } from 'vue'
import { defineComponent, h, ref, toRefs, watch } from 'vue'
import type { Direction, ExtractPublicPropTypes } from '@destyler/shared'
import { createContext } from '@destyler/shared'
import { useDirection, useForwardExpose } from '@destyler/composition'
import { MenuRoot, menuRootProps } from '@destyler/menu'
import { menuRootEmits } from '@destyler/menu/component'

export const contextMenuRootProps = {
  /**
   * The reading direction of the combobox when applicable.
   */
  dir: {
    ...menuRootProps.dir,
  },
  /**
   * The modality of the dropdown menu.
   *
   * When set to `true`, interaction with outside elements will be disabled and only menu content will be visible to screen readers.
   */
  modal: {
    ...menuRootProps.modal,
  },
} as const

export type ContextMenuRootProps = ExtractPublicPropTypes<typeof contextMenuRootProps>

export const contextMenuRootEmits = {
  ...menuRootEmits,
}
export interface ContextMenuRootContext {
  open: Ref<boolean>
  onOpenChange: (open: boolean) => void
  modal: Ref<boolean>
  dir: Ref<Direction>
}

export const [injectContextMenuRootContext, provideContextMenuRootContext] = createContext<ContextMenuRootContext>('DestylerContextMenuRoot')

export const ContextMenuRoot = defineComponent({
  name: 'DestylerContextMenuRoot',
  props: contextMenuRootProps,
  emits: contextMenuRootEmits,
  setup(props, { emit }) {
    const { dir: propDir, modal } = toRefs(props)
    useForwardExpose()
    const dir = useDirection(propDir)

    const open = ref(false)

    provideContextMenuRootContext({
      open,
      onOpenChange: (value: boolean) => {
        open.value = value
      },
      dir,
      modal,
    })

    watch(open, (value) => {
      emit('update:open', value)
    })

    return {
      open,
      dir,
      modal,
    }
  },
  render() {
    return h(MenuRoot, {
      'open': this.open,
      'modal': this.modal,
      'dir': this.dir,
      'onUpdate:open': (value: boolean) => {
        this.open = value
      },
    }, () => this.$slots.default?.())
  },
})
