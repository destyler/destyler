import type { Component, PropType } from 'vue'
import { defineComponent, h, ref, toRefs, watch, watchEffect, withDirectives } from 'vue'
import { type AsTag, DestylerPrimitive } from '@destyler/primitive'
import type { ExtractPublicPropTypes } from '@destyler/shared'
import { isBrowser } from '@destyler/shared'
import { useForwardExpose } from '@destyler/composition'

import { BindOnceDirective } from '@destyler/directives'
import { useUniqueId } from '../composables/useUniqueId'
import { useWindowSplitterResizeHandlerBehavior } from '../composables/useWindowSplitterBehavior'
import { registerResizeHandle } from '../utils/registry'
import { assert } from '../utils/assert'
import type { PointerHitAreaMargins, ResizeHandlerAction } from '../utils/registry'
import type { ResizeEvent, ResizeHandler, ResizeHandlerState } from '../types'
import { injectPanelGroupContext } from './group'

export const destylerSplitterResizeHandleProps = {
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
  id: {
    type: String as PropType<string>,
    required: false,
  },
  hitAreaMargins: {
    type: Object as PropType<PointerHitAreaMargins>,
    required: false,
  },
  tabindex: {
    type: Number as PropType<number>,
    required: false,
    default: 0,
  },
  disabled: {
    type: Boolean as PropType<boolean>,
    required: false,
  },
} as const

export type DestylerSplitterResizeHandleProps = ExtractPublicPropTypes<typeof destylerSplitterResizeHandleProps>

export const DestylerSplitterResizeHandle = defineComponent({
  name: 'DestylerSplitterResizeHandle',
  props: destylerSplitterResizeHandleProps,
  emits: ['dragging'],
  setup(props, { emit }) {
    const { forwardRef, currentElement } = useForwardExpose()
    const { disabled } = toRefs(props)

    const panelGroupContext = injectPanelGroupContext()
    if (panelGroupContext === null) {
      throw new Error(
        'DestylerPanelResizeHandle components must be rendered within a PanelGroup container',
      )
    }

    const {
      direction,
      groupId,
      registerResizeHandle: registerResizeHandleWithParentGroup,
      startDragging,
      stopDragging,
      panelGroupElement,
    } = panelGroupContext

    const resizeHandleId = useUniqueId(props.id)
    const state = ref<ResizeHandlerState>('inactive')
    const isFocused = ref(false)
    const resizeHandler = ref<ResizeHandler | null>(null)

    watch(disabled, () => {
      if (!isBrowser)
        return
      if (disabled.value)
        resizeHandler.value = null
      else
        resizeHandler.value = registerResizeHandleWithParentGroup(resizeHandleId)
    }, { immediate: true })

    watchEffect((onCleanup) => {
      if (disabled.value || resizeHandler.value === null)
        return

      const element = currentElement.value
      if (!element)
        return

      assert(element)

      const setResizeHandlerState = (
        action: ResizeHandlerAction,
        isActive: boolean,
        event: ResizeEvent,
      ) => {
        if (isActive) {
          switch (action) {
            case 'down': {
              state.value = 'drag'

              startDragging(resizeHandleId, event)
              emit('dragging', true)
              break
            }
            case 'move': {
              if (state.value !== 'drag')
                state.value = 'hover'

              resizeHandler.value?.(event)
              break
            }
            case 'up': {
              state.value = 'hover'

              stopDragging()
              emit('dragging', false)
              break
            }
          }
        }
        else {
          state.value = 'inactive'
        }
      }

      onCleanup(registerResizeHandle(
        resizeHandleId,
        element,
        direction,
        {
          // Coarse inputs (e.g. finger/touch)
          coarse: props.hitAreaMargins?.coarse ?? 15,
          // Fine inputs (e.g. mouse)
          fine: props.hitAreaMargins?.fine ?? 5,
        },
        setResizeHandlerState,
      ))
    })

    useWindowSplitterResizeHandlerBehavior({
      disabled,
      resizeHandler,
      handleId: resizeHandleId,
      panelGroupElement,
    })

    return {
      resizeHandleId,
      disabled,
      state,
      direction,
      groupId,
      isFocused,
      forwardRef,
    }
  },
  render() {
    return withDirectives(h(DestylerPrimitive, {
      'ref': (el: any) => this.forwardRef(el),
      'style': {
        touchAction: 'none',
        userSelect: 'none',
      },
      'role': 'separator',
      'data-resize-handle': '',
      'tabindex': this.$props.tabindex,
      'data-state': this.state,
      'data-disabled': this.disabled ? '' : undefined,
      'data-orientation': this.direction,
      'data-panel-group-id': this.groupId,
      'data-resize-handle-active': this.state === 'drag' ? 'pointer' : this.isFocused ? 'keyboard' : undefined,
      'data-resize-handle-state': this.state,
      'data-panel-resize-handle-enabled': !this.disabled,
      'data-panel-resize-handle-id': this.resizeHandleId,
      'onBlur': () => {
        this.isFocused = false
      },
      'onFocus': () => {
        this.isFocused = false
      },
    }, () => this.$slots.default?.()), [
      [BindOnceDirective, { id: this.resizeHandleId }],
    ])
  },
})
