import { defineComponent, h, mergeProps, ref, watchEffect } from 'vue'
import { useCustomElement } from '@destyler/composition'

import type { Polygon } from '@destyler/shared'
import { isPointInPolygon } from '@destyler/shared'
import { injectTooltipRootContext } from './tooltipRoot'
import { injectTooltipProviderContext } from './tooltipProvider'
import { DestylerTooltipContentImpl, destylerTooltipContentImplProps } from './tooltipContentImpl'
import { getExitSideFromRect, getHull, getPaddedExitPoints, getPointsFromRect } from './utils'

export const DestylerTooltipContentHoverable = defineComponent({
  name: 'DestylerTooltipContentHoverable',
  props: destylerTooltipContentImplProps,
  setup() {
    const { customElement, currentElement } = useCustomElement()

    const { trigger, onClose } = injectTooltipRootContext()
    const providerContext = injectTooltipProviderContext()

    const pointerGraceArea = ref<Polygon | null>(null)

    function handleRemoveGraceArea() {
      pointerGraceArea.value = null
      providerContext.onPointerInTransitChange(false)
    }
    function handleCreateGraceArea(event: PointerEvent, hoverTarget: HTMLElement) {
      const currentTarget = event.currentTarget as HTMLElement
      const exitPoint = { x: event.clientX, y: event.clientY }
      const exitSide = getExitSideFromRect(exitPoint, currentTarget.getBoundingClientRect())
      const paddedExitPoints = getPaddedExitPoints(exitPoint, exitSide)
      const hoverTargetPoints = getPointsFromRect(hoverTarget.getBoundingClientRect())
      const graceArea = getHull([...paddedExitPoints, ...hoverTargetPoints])
      pointerGraceArea.value = graceArea
      providerContext.onPointerInTransitChange(true)
    }

    watchEffect((cleanupFn) => {
      if (trigger.value && currentElement.value) {
        const handleTriggerLeave = (event: PointerEvent) => handleCreateGraceArea(event, currentElement.value!)
        const handleContentLeave = (event: PointerEvent) => handleCreateGraceArea(event, trigger.value!)

        trigger.value.addEventListener('pointerleave', handleTriggerLeave)
        currentElement.value.addEventListener('pointerleave', handleContentLeave)

        cleanupFn(() => {
          trigger.value?.removeEventListener('pointerleave', handleTriggerLeave)
          currentElement.value?.removeEventListener('pointerleave', handleContentLeave)
        })
      }
    })

    watchEffect((cleanupFn) => {
      if (pointerGraceArea.value) {
        const handleTrackPointerGrace = (event: PointerEvent) => {
          if (!pointerGraceArea.value)
            return
          const target = event.target as HTMLElement
          const pointerPosition = { x: event.clientX, y: event.clientY }
          const hasEnteredTarget = trigger.value?.contains(target) || currentElement.value?.contains(target)
          const isPointerOutsideGraceArea = !isPointInPolygon(pointerPosition, pointerGraceArea.value)

          if (hasEnteredTarget) {
            handleRemoveGraceArea()
          }
          else if (isPointerOutsideGraceArea) {
            handleRemoveGraceArea()
            onClose()
          }
        }
        document.addEventListener('pointermove', handleTrackPointerGrace)

        cleanupFn(() => document.removeEventListener('pointermove', handleTrackPointerGrace))
      }
    })

    return {
      customElement,
    }
  },
  render() {
    return h(DestylerTooltipContentImpl, {
      ref: 'customElement',
      ...mergeProps(this.$props),
    }, this.$slots.default?.())
  },
})
