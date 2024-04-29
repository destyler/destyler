import type { Component, PropType, Ref } from 'vue'
import { defineComponent, h, ref } from 'vue'
import type { ExtractPublicPropTypes, Orientation } from '@destyler/shared'
import { type AsTag, DestylerPrimitive } from '@destyler/primitive'
import { useCollection, useForwardExpose, useVModel } from '@destyler/composition'

import { injectNavigationContext, provideNavigationContext } from './root'

export const destylerNavigationSubProps = {
  as: {
    type: [String, Object] as PropType<AsTag | Component>,
    required: false,
    default: 'div',
  },
  asChild: {
    type: Boolean as PropType<boolean>,
    required: false,
    default: false,
  },
  modelValue: {
    type: String as PropType<string>,
    required: false,
  },
  defaultValue: {
    type: String as PropType<string>,
    required: false,
  },
  orientation: {
    type: String as PropType<Orientation>,
    required: false,
    default: 'horizontal',
  },
} as const

export type DestylerNavigationSubProps = ExtractPublicPropTypes<typeof destylerNavigationSubProps>

export const DestylerNavigationSub = defineComponent({
  name: 'DestylerNavigationSub',
  props: destylerNavigationSubProps,
  emits: ['update:modelValue'],
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
    return h(DestylerPrimitive, {
      'ref': (el: any) => this.forwardRef(el),
      'data-orientation': this.$props.orientation,
      'as': this.$props.as,
      'asChild': this.$props.asChild,
    }, () => this.$slots.default?.())
  },

})
