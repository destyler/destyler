import type { DirectiveArguments, PropType, VNode, VNodeChild } from 'vue'
import { computed, defineComponent, h, inject, mergeProps, onBeforeUnmount, ref, toRef, vShow, watch, watchEffect, withDirectives } from 'vue'
import type { FollowerInst } from '@destyler/binder'
import { DestylerFollower } from '@destyler/binder'
import { DestylerFocusTrap } from '@destyler/focus-trap'
import { getPreciseEventTarget, isJsdom, isSlotEmpty, resolveWrappedSlot } from '@destyler/shared'
import { clickoutside, mousemoveoutside } from '@destyler/directives'
import type { PopoverTrigger } from './interface'
import type { PopoverInjection } from './popover'

export const popoverBodyProps = {
  show: {
    type: Boolean as PropType<boolean>,
    default: true,
  },
  trigger: {
    type: String as PropType<PopoverTrigger>,
  },
  delay: {
    type: Number as PropType<number>,
  },
  duration: {
    type: Number as PropType<number>,
  },
  displayDirective: {
    type: String as PropType<'if' | 'show'>,
  },
  x: {
    type: Number as PropType<number>,
  },
  y: {
    type: Number as PropType<number>,
  },
  flip: {
    type: Boolean as PropType<boolean>,
  },
  internalTrapFocus: {
    type: Boolean as PropType<boolean>,
  },
  overlap: {
    type: Boolean as PropType<boolean>,
  },
  keepAliveOnHover: {
    type: Boolean as PropType<boolean>,
  },
  scrollable: {
    type: Boolean as PropType<boolean>,
  },
  internalDeactivateImmediately: {
    type: Boolean as PropType<boolean>,
  },
  onClickoutside: {
    type: Function as PropType<(e: MouseEvent) => void>,
  },
}

export default defineComponent({
  name: 'DestylerPopoverBody',
  props: popoverBodyProps,
  setup(props, { slots, attrs }) {
    const follower = ref<FollowerInst | null>(null)
    const DestylerPopover = inject<PopoverInjection>('DestylerPopover') as PopoverInjection
    const body = ref<HTMLElement | null>(null)
    const followerEnabled = ref(props.show)
    const displayed = ref(false)

    watchEffect(() => {
      const { show } = props
      if (show && !isJsdom() && !props.internalDeactivateImmediately)
        displayed.value = true
    })

    onBeforeUnmount(() => {
      DestylerPopover.setBodyInstance(null)
    })

    watch(toRef(props, 'show'), (value) => {
      // If no animation, no transition component will be applied to the
      // component. So we need to trigger follower manaully.
      if (value)
        followerEnabled.value = true
      else
        followerEnabled.value = false
    })

    function syncPosition(): void {
      follower.value?.syncPosition()
    }

    DestylerPopover.setBodyInstance({
      syncPosition,
    })

    function handleMouseEnter(e: MouseEvent): void {
      if (props.trigger === 'hover' && props.keepAliveOnHover && props.show)
        DestylerPopover.handleMouseEnter(e)
    }

    function handleMouseLeave(e: MouseEvent): void {
      if (props.trigger === 'hover' && props.keepAliveOnHover)
        DestylerPopover.handleMouseLeave(e)
    }

    function handleMouseMoveOutside(e: MouseEvent): void {
      if (
        props.trigger === 'hover'
        && !getTriggerElement().contains(getPreciseEventTarget(e) as Node | null)
      )
        DestylerPopover.handleMouseMoveOutside(e)
    }

    function getTriggerElement(): HTMLElement {
      return DestylerPopover.getTriggerElement()
    }

    function handleClickOutside(e: MouseEvent): void {
      if (
        (props.trigger === 'click'
          && !getTriggerElement().contains(
            getPreciseEventTarget(e) as Node | null,
          ))
        || props.onClickoutside
      )
        DestylerPopover.handleClickOutside(e)
    }

    const directives = computed<DirectiveArguments>(() => {
      const { trigger, onClickoutside } = props
      const directives: DirectiveArguments = []
      const {
        positionManually: { value: positionManually },
      } = DestylerPopover
      if (!positionManually) {
        if (trigger === 'click' && !onClickoutside) {
          directives.push([
            clickoutside,
            handleClickOutside,
            undefined as unknown as string,
            { capture: true },
          ])
        }
        if (trigger === 'hover')
          directives.push([mousemoveoutside, handleMouseMoveOutside])
      }
      if (onClickoutside) {
        directives.push([
          clickoutside,
          handleClickOutside,
          undefined as unknown as string,
          { capture: true },
        ])
      }
      if (
        props.displayDirective === 'show'
        || displayed.value
      )
        directives.push([vShow, props.show])

      return directives
    })

    function renderContentNode(): VNode | null {
      const shouldRenderDom
        = props.displayDirective === 'show'
        || props.show
        || displayed.value
      if (!shouldRenderDom)
        return null
      let contentNode: VNode
      const renderBody = DestylerPopover.internalRenderBody.value
      if (!renderBody) {
        const { internalTrapFocus } = props
        const hasHeaderOrFooter = !isSlotEmpty(slots.header) || !isSlotEmpty(slots.footer)
        const renderContentInnerNode = (): VNodeChild[] => {
          const body = hasHeaderOrFooter
            ? (
                resolveWrappedSlot(slots.header, (children) => {
                  return children
                    ? h('div', null, children)
                    : null
                }),
                resolveWrappedSlot(slots.default, (children) => {
                  return children
                    ? h('div', null, children)
                    : null
                }),
                resolveWrappedSlot(slots.footer, (children) => {
                  return children
                    ? h('div', null, children)
                    : null
                })
              )
            : h('div', slots)
          return [body]
        }
        contentNode = h('dvi', mergeProps({
          ref: body,
          onMouseenter: handleMouseEnter,
          onMouseleave: handleMouseLeave,
        }, attrs),
        internalTrapFocus
          ? h(DestylerFocusTrap, {
            active: props.show,
            autoFocus: true,
          }, renderContentInnerNode)
          : renderContentInnerNode(),
        )
      }
      else {
        contentNode = renderBody(body, handleMouseEnter, handleMouseLeave)
      }
      return withDirectives(contentNode, directives.value)
    }

    return () => {
      return h(DestylerFollower, {
        ref: follower,
        zIndex: DestylerPopover.zIndex.value,
        show: props.show,
        enabled: followerEnabled.value,
        to: 'body',
        x: props.x,
        y: props.y,
        flip: props.flip,
        overlap: props.overlap,
      }, [renderContentNode()])
    }
  },
})
