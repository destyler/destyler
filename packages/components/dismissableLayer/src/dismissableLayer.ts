import type { Component, PropType } from 'vue'
import { computed, defineComponent, h, nextTick, reactive, watchEffect } from 'vue'
import { onKeyStroke } from '@vueuse/core'
import type { AsTag } from '@destyler/primitive'
import { DestylerPrimitive } from '@destyler/primitive'
import { useCustomElement } from '@destyler/composition'
import type { ExtractPublicPropTypes } from '@destyler/shared'

import { useFocusOutside, usePointerDownOutside } from './utils'

export const destylerDismissableLayerProps = {
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
  disableOutsidePointerEvents: {
    type: Boolean as PropType<boolean>,
    required: false,
    default: false,
  },
} as const

export type DestylerDismissableLayerProps = ExtractPublicPropTypes<typeof destylerDismissableLayerProps>

export const destylerDismissableLayerEmits = ['escapeKeyDown', 'pointerDownOutside', 'focusOutside', 'interactOutside', 'dismiss']

export const context: any = reactive({
  layersRoot: new Set<HTMLElement>(),
  layersWithOutsidePointerEventsDisabled: new Set<HTMLElement>(),
  branches: new Set<HTMLElement>(),
})

export const DestylerDismissableLayer = defineComponent({
  name: 'DestylerDismissableLayer',
  props: destylerDismissableLayerProps,
  emits: ['escapeKeyDown', 'pointerDownOutside', 'focusOutside', 'interactOutside', 'dismiss'],
  setup(props, { emit }) {
    const { customElement, currentElement: layerElement } = useCustomElement()

    const ownerDocument = computed(
      () => layerElement.value?.ownerDocument ?? globalThis.document,
    )

    const layers = computed(() => context.layersRoot)

    const index = computed(() => {
      return layerElement.value ? Array.from(layers.value).indexOf(layerElement.value) : -1
    })

    const isBodyPointerEventsDisabled = computed(() => {
      return context.layersWithOutsidePointerEventsDisabled.size > 0
    })

    const isPointerEventsEnabled = computed(() => {
      const localLayers = Array.from(layers.value)
      const [highestLayerWithOutsidePointerEventsDisabled] = [...context.layersWithOutsidePointerEventsDisabled].slice(-1)
      const highestLayerWithOutsidePointerEventsDisabledIndex = localLayers.indexOf(highestLayerWithOutsidePointerEventsDisabled)

      return index.value >= highestLayerWithOutsidePointerEventsDisabledIndex
    })

    const pointerDownOutside = usePointerDownOutside(async (event) => {
      const isPointerDownOnBranch = [...context.branches].some(branch =>
        branch.contains(event.target as HTMLElement),
      )

      if (!isPointerEventsEnabled.value || isPointerDownOnBranch)
        return
      emit('pointerDownOutside', event)
      emit('interactOutside', event)
      await nextTick()
      emit('dismiss')
    }, layerElement)

    const focusOutside = useFocusOutside((event) => {
      const isFocusInBranch = [...context.branches].some(branch =>
        branch.contains(event.target as HTMLElement),
      )

      if (isFocusInBranch)
        return
      emit('focusOutside', event)
      emit('interactOutside', event)
      emit('dismiss')
    }, layerElement)

    onKeyStroke('Escape', (event) => {
      const isHighestLayer = index.value === layers.value.size - 1
      if (!isHighestLayer)
        return
      emit('escapeKeyDown', event)
      emit('dismiss')
    })

    let originalBodyPointerEvents: string
    watchEffect((cleanupFn) => {
      if (!layerElement.value)
        return
      if (props.disableOutsidePointerEvents) {
        if (context.layersWithOutsidePointerEventsDisabled.size === 0) {
          originalBodyPointerEvents = ownerDocument.value.body.style.pointerEvents
          ownerDocument.value.body.style.pointerEvents = 'none'
        }
        context.layersWithOutsidePointerEventsDisabled.add(layerElement.value)
      }
      layers.value.add(layerElement.value)

      cleanupFn(() => {
        if (
          props.disableOutsidePointerEvents
          && context.layersWithOutsidePointerEventsDisabled.size === 1
        )
          ownerDocument.value.body.style.pointerEvents = originalBodyPointerEvents
      })
    })

    watchEffect((cleanupFn) => {
      cleanupFn(() => {
        if (!layerElement.value)
          return
        layers.value.delete(layerElement.value)
        context.layersWithOutsidePointerEventsDisabled.delete(layerElement.value)
      })
    })

    return {
      customElement,
      focusOutside,
      pointerDownOutside,
      isBodyPointerEventsDisabled,
      isPointerEventsEnabled,
    }
  },
  render() {
    return h(DestylerPrimitive, {
      'ref': 'customElement',
      'as': this.$props.as,
      'asChild': this.$props.asChild,
      'data-dismissable-layer': '',
      'onFocusCapture': this.focusOutside.onFocusCapture,
      'onBlurCapture': this.focusOutside.onBlurCapture,
      'onPointerDownOutside': this.pointerDownOutside.onPointerDownCapture,
      'style': {
        pointerEvents: this.isBodyPointerEventsDisabled
          ? this.isPointerEventsEnabled
            ? 'auto'
            : 'none'
          : undefined,
      },
    }, this.$slots.default?.())
  },
})
