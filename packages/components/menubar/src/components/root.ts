import type { PropType, Ref } from 'vue'
import { defineComponent, h, ref, toRefs } from 'vue'
import { DestylerPrimitive } from '@destyler/primitive'
import type { Direction, ExtractPublicPropTypes } from '@destyler/shared'
import { createContext } from '@destyler/shared'
import { useCollection, useDirection, useForwardExpose, useVModel } from '@destyler/composition'
import { DestylerRovingFocusGroup } from '@destyler/roving-focus'

export const destylerMenubarRootProps = {
  modelValue: {
    type: String as PropType<string>,
    required: false,
  },
  defaultValue: {
    type: String as PropType<string>,
    required: false,
  },
  dir: {
    type: String as PropType<Direction>,
    required: false,
  },
  loop: {
    type: Boolean as PropType<boolean>,
    required: false,
    default: false,
  },
} as const

export type DestylerMenubarRootProps = ExtractPublicPropTypes<typeof destylerMenubarRootProps>

export interface MenubarRootContext {
  modelValue: Ref<string>
  dir: Ref<Direction>
  loop: Ref<boolean>
  onMenuOpen: (value: string) => void
  onMenuClose: () => void
  onMenuToggle: (value: string) => void
}

export const [injectMenubarRootContext, provideMenubarRootContext] = createContext<MenubarRootContext>('DestylerMenubarRoot')

export const DestylerMenubarRoot = defineComponent({
  name: 'DestylerMenubarRoot',
  props: destylerMenubarRootProps,
  emits: ['update:modelValue'],
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
    return h(DestylerRovingFocusGroup, {
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
        return h(DestylerPrimitive, {
          role: 'menubar',
          ref: (el: any) => this.forwardRef(el),
        }, () => this.$slots.default?.())
      },
    })
  },
})
