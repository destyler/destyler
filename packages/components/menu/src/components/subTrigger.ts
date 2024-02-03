import { defineComponent, h, mergeProps, nextTick, onUnmounted, ref, withDirectives } from 'vue'
import type { ExtractPublicPropTypes, Side } from '@destyler/shared'
import { getOpenState, isMouseEvent } from '@destyler/shared'
import { BindOnceDirective } from '@destyler/directives'

import { SUB_OPEN_KEYS } from '../utils'
import { DestylerMenuItemImpl, destylerMenuItemImplProps } from './itemImpl'
import { injectMenuContext, injectMenuRootContext } from './root'
import { injectMenuSubContext } from './sub'
import { injectMenuContentContext } from './contentImpl'
import { DestylerMenuAnchor } from './anchor'

export const destylerMenuSubTriggerProps = {
  ...destylerMenuItemImplProps,
} as const

export type DestylerMenuSubTriggerProps = ExtractPublicPropTypes<typeof destylerMenuSubTriggerProps>

export const DestylerMenuSubTrigger = defineComponent({
  name: 'DestylerMenuSubTrigger',
  props: destylerMenuSubTriggerProps,
  setup(props) {
    const menuContext = injectMenuContext()
    const rootContext = injectMenuRootContext()
    const subContext = injectMenuSubContext()
    const contentContext = injectMenuContentContext()

    const openTimerRef = ref<number | null>(null)

    function clearOpenTimer() {
      if (openTimerRef.value)
        window.clearTimeout(openTimerRef.value)
      openTimerRef.value = null
    }

    onUnmounted(() => {
      clearOpenTimer()
    })

    function handlePointerMove(event: PointerEvent) {
      if (!isMouseEvent(event))
        return
      const defaultPrevented = contentContext.onItemEnter(event)
      if (defaultPrevented)
        return

      if (!props.disabled && !menuContext.open.value && !openTimerRef.value) {
        contentContext.onPointerGraceIntentChange(null)
        openTimerRef.value = window.setTimeout(() => {
          menuContext.onOpenChange(true)
          clearOpenTimer()
        }, 100)
      }
    }

    async function handlePointerLeave(event: PointerEvent) {
      if (!isMouseEvent(event))
        return
      clearOpenTimer()

      const contentRect = menuContext.content.value?.getBoundingClientRect()
      if (contentRect?.width) {
        const side = menuContext.content.value?.dataset.side as Side

        const rightSide = side === 'right'
        const bleed = rightSide ? -5 : +5
        const contentNearEdge = contentRect[rightSide ? 'left' : 'right']
        const contentFarEdge = contentRect[rightSide ? 'right' : 'left']

        contentContext.onPointerGraceIntentChange({
          area: [
            { x: event.clientX + bleed, y: event.clientY },
            { x: contentNearEdge, y: contentRect.top },
            { x: contentFarEdge, y: contentRect.top },
            { x: contentFarEdge, y: contentRect.bottom },
            { x: contentNearEdge, y: contentRect.bottom },
          ],
          side,
        })

        window.clearTimeout(contentContext.pointerGraceTimerRef.value)
        contentContext.pointerGraceTimerRef.value = window.setTimeout(
          () => contentContext.onPointerGraceIntentChange(null),
          300,
        )
      }
      else {
        const defaultPrevented = contentContext.onTriggerLeave(event)
        if (defaultPrevented)
          return

        contentContext.onPointerGraceIntentChange(null)
      }
    }

    async function handleKeyDown(event: KeyboardEvent) {
      const isTypingAhead = contentContext.searchRef.value !== ''
      if (props.disabled || (isTypingAhead && event.key === ' '))
        return
      if (SUB_OPEN_KEYS[rootContext.dir.value].includes(event.key)) {
        menuContext.onOpenChange(true)

        await nextTick()
        menuContext.content.value?.focus()
        event.preventDefault()
      }
    }
    return {
      subContext,
      menuContext,
      handlePointerMove,
      handlePointerLeave,
      handleKeyDown,
    }
  },
  render() {
    return h(DestylerMenuAnchor, {
      asChild: true,
    }, withDirectives(h(DestylerMenuItemImpl, mergeProps(this.$props, {
      'ref': (vnode: any) => {
        this.subContext?.onTriggerChange(vnode?.$el)
        return undefined
      },
      'aria-haspopup': 'menu',
      'aria-expanded': this.menuContext.open.value,
      'aria-controls': this.subContext.contentId,
      'data-state': getOpenState(this.menuContext.open.value),
      'onClick': async (event: any) => {
        if (this.$props.disabled || event.defaultPrevented)
          return
        event.currentTarget.focus()
        if (!this.menuContext.open.value)
          this.menuContext.onOpenChange(true)
      },
      'onPointermove': (event: any) => {
        this.handlePointerMove(event)
      },
      'onPointerleave': (event: any) => {
        this.handlePointerLeave(event)
      },
      'onKeydown': (event: any) => {
        this.handleKeyDown(event)
      },
    }), this.$slots.default?.()), [
      [BindOnceDirective, { id: this.subContext.contentId }],
    ]))
  },
})
