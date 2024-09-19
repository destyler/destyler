import type { PropType, Ref } from 'vue'
import { defineComponent, h, ref, toRefs } from 'vue'
import { Primitive } from '@destyler/primitive'
import type { Direction, ExtractPublicPropTypes } from '@destyler/shared'
import { createContext } from '@destyler/shared'
import { useCollection, useDirection, useForwardExpose, useVModel } from '@destyler/composition'
import { RovingFocusGroup } from '@destyler/roving-focus'

export const menubarRootProps = {
  /**
   * The controlled value of the menu to open.
   * Can be used as `v-model`.
   *
   * @default undefined
   */
  modelValue: {
    type: String as PropType<string>,
    required: false,
    default: undefined,
  },
  /**
   * The value of the menu that should be open when initially rendered. Use when you do not need to control the value state.
   */
  defaultValue: {
    type: String as PropType<string>,
    required: false,
  },
  /**
   * The reading direction of the combobox when applicable.
   */
  dir: {
    type: String as PropType<Direction>,
    required: false,
  },
  /**
   * When `true`, keyboard navigation will loop from last item to first, and vice versa.
   *
   * @default false
   */
  loop: {
    type: Boolean as PropType<boolean>,
    required: false,
    default: false,
  },
} as const

export type MenubarRootProps = ExtractPublicPropTypes<typeof menubarRootProps>

export const menubarRootEmits = {
  /**
   * Event handler called when the value changes.
   */
  'update:modelValue': (_value: string) => true,
}

export interface MenubarRootContext {
  modelValue: Ref<string>
  dir: Ref<Direction>
  loop: Ref<boolean>
  onMenuOpen: (value: string) => void
  onMenuClose: () => void
  onMenuToggle: (value: string) => void
}

export const [injectMenubarRootContext, provideMenubarRootContext] = createContext<MenubarRootContext>('DestylerMenubarRoot')

export const MenubarRoot = defineComponent({
  name: 'DestylerMenubarRoot',
  props: menubarRootProps,
  emits: menubarRootEmits,
  setup(props, { emit }) {
    const { forwardRef, currentElement } = useForwardExpose()
    const { createCollection } = useCollection('menubar')
    createCollection(currentElement)

    const modelValue = useVModel(props, 'modelValue', emit, {
      defaultValue: props.defaultValue ?? '',
      passive: (props.modelValue === undefined) as false,
    }) as Ref<string>

    const currentTabStopId = ref<string | null>(null)

    const { dir: propDir, loop } = toRefs(props)
    const dir = useDirection(propDir)

    provideMenubarRootContext({
      modelValue,
      dir,
      loop,
      onMenuOpen: (value: string) => {
        modelValue.value = value
        currentTabStopId.value = value
      },
      onMenuClose: () => {
        modelValue.value = ''
      },
      onMenuToggle: (value) => {
        modelValue.value = modelValue.value ? '' : value
        currentTabStopId.value = value
      },
    })

    return {
      loop,
      dir,
      currentTabStopId,
      forwardRef,
    }
  },
  render() {
    return h(RovingFocusGroup, {
      'currentTabStopId': this.currentTabStopId!,
      'onUpdate:currentTabStopId': (event: any) => {
        this.currentTabStopId = event
      },
      'orientation': 'horizontal',
      'loop': this.loop,
      'dir': this.dir,
      'asChild': true,
    }, {
      default: () => {
        return h(Primitive, {
          role: 'menubar',
          ref: (el: any) => this.forwardRef(el),
        }, () => this.$slots.default?.())
      },
    })
  },
})
