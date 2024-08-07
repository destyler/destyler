import type { PropType, SlotsType, VNode } from 'vue'
import { computed, defineComponent, h, nextTick, reactive, watchEffect, withModifiers } from 'vue'
import { onKeyStroke } from '@vueuse/core'
import { Primitive, primitiveProps } from '@destyler/primitive'
import { useForwardExpose } from '@destyler/composition'
import type { ExtractPublicPropTypes } from '@destyler/shared'

import { type FocusOutsideEvent, type PointerDownOutsideEvent, useFocusOutside, usePointerDownOutside } from '../utils'

export const dismissableLayerProps = {
  ...primitiveProps,
  disableOutsidePointerEvents: {
    type: Boolean as PropType<boolean>,
    required: false,
    default: false,
  },
  isDismissable: {
    type: Boolean as PropType<boolean>,
    required: false,
    default: true,
  },
} as const

export type DismissableLayerProps = ExtractPublicPropTypes<typeof dismissableLayerProps>

export const dismissableLayerEmits = {
  escapeKeyDown: (_event: KeyboardEvent) => true,
  pointerDownOutside: (_event: PointerDownOutsideEvent) => true,
  focusOutside: (_event: FocusOutsideEvent) => true,
  interactOutside: (_event: PointerDownOutsideEvent | FocusOutsideEvent) => true,
}

export const context = reactive({
  layersRoot: new Set<HTMLElement>(),
  layersWithOutsidePointerEventsDisabled: new Set<HTMLElement>(),
  branches: new Set<HTMLElement>(),
})

export const DismissableLayer = defineComponent({
  name: 'DestylerDismissableLayer',
  props: dismissableLayerProps,
  emits: {
    ...dismissableLayerEmits,
    dismiss: () => true,
  },
  slots: Object as SlotsType<{
    default: () => VNode[]
  }>,
  setup(props, { emit }) {
    const { forwardRef, currentElement: layerElement } = useForwardExpose()
    const ownerDocument = computed(
      () => layerElement.value?.ownerDocument ?? globalThis.document,
    )

    const layers = computed(() => context.layersRoot)

    const index = computed(() => {
      return layerElement.value
        ? Array.from(layers.value).indexOf(layerElement.value)
        : -1
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
      if (props.isDismissable)
        emit('dismiss')
      else
        if (!event.defaultPrevented)
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
      if (!event.defaultPrevented)
        emit('dismiss')
    }, layerElement)

    onKeyStroke('Escape', (event) => {
      const isHighestLayer = index.value === layers.value.size - 1
      if (!isHighestLayer)
        return
      emit('escapeKeyDown', event)
      if (!event.defaultPrevented)
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
        if (context.layersWithOutsidePointerEventsDisabled.size === 1)
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
      forwardRef,
      focusOutside,
      pointerDownOutside,
      isBodyPointerEventsDisabled,
      isPointerEventsEnabled,
    }
  },
  render() {
    return h(Primitive, {
      'ref': (el: any) => this.forwardRef(el),
      'as': this.$props.as,
      'asChild': this.$props.asChild,
      'data-dismissable-layer': '',
      'onFocus': withModifiers(() => {
        this.focusOutside.onFocusCapture()
      }, ['capture']),
      'onBlur': withModifiers(() => {
        this.focusOutside.onBlurCapture()
      }, ['capture']),
      'onPointerdown':
      withModifiers(() => {
        this.pointerDownOutside.onPointerDownCapture()
      }, ['capture']),
      'style': {
        pointerEvents: this.isBodyPointerEventsDisabled
          ? this.isPointerEventsEnabled
            ? 'auto'
            : 'none'
          : undefined,
      },
    }, () => this.$slots.default?.())
  },
})
