import type { PropType, Ref } from 'vue'
import { defineComponent, h, ref } from 'vue'
import type { ExtractPublicPropTypes, Orientation } from '@destyler/shared'
import { Primitive, primitiveProps } from '@destyler/primitive'
import { useCollection, useForwardExpose, useVModel } from '@destyler/composition'

import { injectNavigationContext, provideNavigationContext } from './root'

export const navigationSubProps = {
  ...primitiveProps,
  /**
   * The controlled value of the sub menu item to activate.
   * Can be used as `v-model`.
   */
  modelValue: {
    type: String as PropType<string>,
    required: false,
  },
  /**
   * The value of the menu item that should be active when initially rendered.
   *
   * Use when you do not need to control the value state.
   */
  defaultValue: {
    type: String as PropType<string>,
    required: false,
  },
  /**
   * The orientation of the menu.
   *
   * @default horizontal
   */
  orientation: {
    type: String as PropType<Orientation>,
    required: false,
    default: 'horizontal',
  },
} as const

export type NavigationSubProps = ExtractPublicPropTypes<typeof navigationSubProps>

export const navigationSubEmits = {
  /**
   * Event handler called when the value changes.
   */
  'update:modelValue': (_value: string) => true,
}

export const NavigationSub = defineComponent({
  name: 'DestylerNavigationSub',
  props: navigationSubProps,
  emits: navigationSubEmits,
  setup(props, { emit }) {
    const modelValue = useVModel(props, 'modelValue', emit, {
      defaultValue: props.defaultValue ?? '',
      passive: (props.modelValue === undefined) as false,
    }) as Ref<string>
    const previousValue = ref('')

    const menuContext = injectNavigationContext()
    const { forwardRef, currentElement } = useForwardExpose()

    const indicatorTrack = ref<HTMLElement>()
    const viewport = ref<HTMLElement>()

    const { createCollection } = useCollection('nav')
    createCollection(indicatorTrack)

    provideNavigationContext({
      ...menuContext,
      isRootMenu: false,
      modelValue,
      previousValue,
      orientation: props.orientation,
      rootNavigationMenu: currentElement,
      indicatorTrack,
      onIndicatorTrackChange: (val) => {
        indicatorTrack.value = val
      },
      viewport,
      onViewportChange: (val) => {
        viewport.value = val
      },

      onTriggerEnter: (val) => {
        modelValue.value = val
      },
      onTriggerLeave: () => {
        // do nothing for submenu
      },
      onContentEnter: () => {
        // do nothing for submenu
      },
      onContentLeave: () => {
        // do nothing for submenu
      },
      onItemSelect: (val) => {
        modelValue.value = val
      },
      onItemDismiss: () => {
        modelValue.value = ''
      },
    })

    return {
      forwardRef,
    }
  },
  render() {
    return h(Primitive, {
      'ref': (el: any) => this.forwardRef(el),
      'data-orientation': this.$props.orientation,
      'as': this.$props.as,
      'asChild': this.$props.asChild,
    }, () => this.$slots.default?.())
  },

})
