import type { ComputedRef, PropType, Ref, VNode } from 'vue'
import { cloneVNode, computed, defineComponent, h, provide, ref, toRef, watchEffect, withDirectives } from 'vue'
import type { ExtractPublicPropTypes, MaybeArray } from '@destyler/shared'
import { call, getFirstSlotVNode, keep } from '@destyler/shared'
import { zindexable } from '@destyler/directives'
import { useIsMounted, useMemo, useMergedState } from '@destyler/composition'
import { DestylerBinder, DestylerTarget } from '../../../../private/src/binder'
import type { ExposedBinderInstance } from '../../../../private/src/binder'
import type { InternalRenderBody, PopoverTrigger } from './interface'
import { DestylerPopoverBody, popoverBodyProps } from './popoverBody'

const bodyPropKeys = Object.keys(popoverBodyProps) as Array<keyof typeof popoverBodyProps>

const triggerEventMap = {
  focus: ['onFocus', 'onBlur'],
  click: ['onClick'],
  hover: ['onMouseenter', 'onMouseleave'],
  manual: [],
  nested: ['onFocus', 'onBlur', 'onMouseenter', 'onMouseleave', 'onClick'],
} as const

function appendEvents(
  vNode: VNode,
  trigger: PopoverTrigger | 'nested',
  events: TriggerEventHandlers,
): void {
  triggerEventMap[trigger].forEach((eventName) => {
    if (!vNode.props)
      vNode.props = {}
    else
      vNode.props = Object.assign({}, vNode.props)

    const originalHandler = vNode.props[eventName]
    const handler = events[eventName]
    if (!originalHandler) {
      vNode.props[eventName] = handler
    }
    else {
      vNode.props[eventName] = (...args: unknown[]) => {
        originalHandler(...args)

        ;(handler as any)(...args)
      }
    }
  })
}

export interface TriggerEventHandlers {
  onClick: (e: MouseEvent) => void
  onMouseenter: (e: MouseEvent) => void
  onMouseleave: (e: MouseEvent) => void
  onFocus: (e: FocusEvent) => void
  onBlur: (e: FocusEvent) => void
}

export interface PopoverInjection {
  getTriggerElement: () => HTMLElement
  handleMouseEnter: (e: MouseEvent) => void
  handleMouseLeave: (e: MouseEvent) => void
  handleClickOutside: (e: MouseEvent) => void
  handleMouseMoveOutside: (e: MouseEvent) => void
  setBodyInstance: (value: BodyInstance | null) => void
  positionManually: ComputedRef<boolean>
  isMounted: Ref<boolean>
  zIndex: Ref<number | undefined>
  internalRenderBody: Ref<InternalRenderBody | undefined>
}

export const destylerPopoverProps = {
  'show': {
    type: Boolean as PropType<boolean | undefined>,
    default: undefined,
  },
  'defaultShow': {
    type: Boolean as PropType<boolean>,
  },
  'trigger': {
    type: String as PropType<PopoverTrigger>,
    default: 'hover',
  },
  'delay': {
    type: Number,
    default: 100,
  },
  'duration': {
    type: Number,
    default: 100,
  },
  'x': {
    type: Number as PropType<number>,
  },
  'y': {
    type: Number as PropType<number>,
  },
  'disabled': {
    type: Boolean as PropType<boolean>,
  },
  'getDisabled': {
    type: Function as PropType<() => boolean>,
  },
  'displayDirective': {
    type: String as PropType<'if' | 'show'>,
    default: 'if',
  },
  'zIndex': {
    type: Number as PropType<number>,
  },
  'internalSyncTargetWithParent': {
    type: Boolean as PropType<boolean>,
  },
  'internalInheritedEventHandlers': {
    type: Array as PropType<TriggerEventHandlers[]>,
    default: () => [],
  },
  'internalTrapFocus': {
    type: Boolean as PropType<boolean>,
  },
  'onClickoutside': {
    type: Function as PropType<(e: MouseEvent) => void>,
  },
  'onUpdate:show': {
    type: [Function, Array] as PropType<MaybeArray<(value: boolean) => void>>,
  },
  'onUpdateShow': {
    type: [Function, Array] as PropType<MaybeArray<(value: boolean) => void>>,
  },
  'onShow': {
    type: [Function, Array] as PropType<MaybeArray<(value: boolean) => void> | undefined>,
  },
  'onHide': {
    type: [Function, Array] as PropType<MaybeArray<(value: boolean) => void> | undefined>,
  },
  'internalRenderBody': {
    type: Function as PropType<InternalRenderBody>,
  },
}

export type PopoverProps = ExtractPublicPropTypes<typeof destylerPopoverProps>

interface BodyInstance {
  syncPosition: () => void
  [key: string]: unknown
}

const DestylerPopover = defineComponent({
  name: 'DestylerPopover',
  inheritAttrs: false,
  props: destylerPopoverProps,
  __popover__: true,
  setup(props) {
    const isMounted = useIsMounted()
    const binderInst = ref<ExposedBinderInstance | null>(null)
    // setup show
    const controlledShow = computed(() => props.show)
    const uncontrolledShow = ref(props.defaultShow)
    const mergedShowWithoutDisabled = useMergedState(
      controlledShow,
      uncontrolledShow,
    )
    const mergedShowConsideringDisabledProp = useMemo(() => {
      if (props.disabled)
        return false
      return mergedShowWithoutDisabled.value
    })
    const getMergedDisabled = (): boolean => {
      if (props.disabled)
        return true
      const { getDisabled } = props
      if (getDisabled?.())
        return true
      return false
    }
    const getMergedShow = (): boolean => {
      if (getMergedDisabled())
        return false
      return mergedShowWithoutDisabled.value!
    }
    // @ts-expect-error bodyInstance
    let bodyInstance: BodyInstance | null = null
    const showTimerId = ref<number | null>(null)
    const hideTimerId = ref<number | null>(null)
    const positionManually = useMemo(() => {
      return props.x !== undefined && props.y !== undefined
    })
    // methods
    function doUpdateShow(value: boolean): void {
      const {
        'onUpdate:show': _onUpdateShow,
        onUpdateShow,
        onShow,
        onHide,
      } = props
      uncontrolledShow.value = value
      if (_onUpdateShow)
        call(_onUpdateShow, value)
      if (onUpdateShow)
        call(onUpdateShow, value)
      if (value && onShow)
        call(onShow, true)
      if (value && onHide)
        call(onHide, false)
    }
    function clearShowTimer(): void {
      if (showTimerId.value) {
        window.clearTimeout(showTimerId.value)
        showTimerId.value = null
      }
    }
    function clearHideTimer(): void {
      if (hideTimerId.value) {
        window.clearTimeout(hideTimerId.value)
        hideTimerId.value = null
      }
    }
    function handleFocus(): void {
      const mergedDisabled = getMergedDisabled()
      if (props.trigger === 'focus' && !mergedDisabled) {
        if (getMergedShow())
          return
        doUpdateShow(true)
      }
    }
    function handleBlur(): void {
      const mergedDisabled = getMergedDisabled()
      if (props.trigger === 'focus' && !mergedDisabled) {
        if (!getMergedShow())
          return
        doUpdateShow(false)
      }
    }
    function handleMouseEnter(): void {
      const mergedDisabled = getMergedDisabled()
      if (props.trigger === 'hover' && !mergedDisabled) {
        clearHideTimer()
        if (showTimerId.value !== null)
          return
        if (getMergedShow())
          return
        const delayCallback = (): void => {
          doUpdateShow(true)
          showTimerId.value = null
        }
        const { delay } = props
        if (delay === 0)
          delayCallback()
        else
          showTimerId.value = window.setTimeout(delayCallback, delay)
      }
    }
    function handleMouseLeave(): void {
      const mergedDisabled = getMergedDisabled()
      if (props.trigger === 'hover' && !mergedDisabled) {
        clearShowTimer()
        if (hideTimerId.value !== null)
          return
        if (!getMergedShow())
          return
        const delayedCallback = (): void => {
          doUpdateShow(false)
          hideTimerId.value = null
        }
        const { duration } = props
        if (duration === 0)
          delayedCallback()
        else
          hideTimerId.value = window.setTimeout(delayedCallback, duration)
      }
    }
    function handleMouseMoveOutside(): void {
      handleMouseLeave()
    }
    function handleClickOutside(e: MouseEvent): void {
      if (!getMergedShow())
        return
      if (props.trigger === 'click') {
        clearShowTimer()
        clearHideTimer()
        doUpdateShow(false)
      }
      props.onClickoutside?.(e)
    }
    function handleClick(): void {
      if (props.trigger === 'click' && !getMergedDisabled()) {
        clearShowTimer()
        clearHideTimer()
        const nextShow = !getMergedShow()
        doUpdateShow(nextShow)
      }
    }
    function getTriggerElement(): HTMLElement {
      return binderInst.value?.targetRef as HTMLElement
    }
    function setBodyInstance(value: BodyInstance | null): void {
      bodyInstance = value
    }
    provide<PopoverInjection>('DestylerPopover', {
      getTriggerElement,
      handleMouseEnter,
      handleMouseLeave,
      handleClickOutside,
      handleMouseMoveOutside,
      setBodyInstance,
      positionManually,
      isMounted,
      zIndex: toRef(props, 'zIndex'),
      internalRenderBody: toRef(props, 'internalRenderBody'),
    })

    watchEffect(() => {
      if (mergedShowWithoutDisabled.value && getMergedDisabled())
        doUpdateShow(false)
    })

    function setShow(value: boolean): void {
      uncontrolledShow.value = value
    }

    return {
      binderInst,
      positionManually,
      mergedShowConsideringDisabledProp,
      // if to show popover body
      uncontrolledShow,
      setShow,
      getMergedShow,
      handleClick,
      handleMouseEnter,
      handleMouseLeave,
      handleFocus,
      handleBlur,
    }
  },
  render() {
    let triggerVNode: VNode | null
    let popoverInside = false
    if (!this.positionManually) {
      if (this.$slots.activator)
        triggerVNode = getFirstSlotVNode(this.$slots, 'activator')
      else
        triggerVNode = getFirstSlotVNode(this.$slots, 'trigger')

      if (triggerVNode) {
        triggerVNode = cloneVNode(triggerVNode)
        triggerVNode = triggerVNode.type === Text ? h('span', [triggerVNode]) : triggerVNode
        const handlers = {
          onClick: this.handleClick,
          onMouseenter: this.handleMouseEnter,
          onMouseleave: this.handleMouseLeave,
          onFocus: this.handleFocus,
          onBlur: this.handleBlur,
        }
        if ((triggerVNode.type as any)?.__popover__) {
          popoverInside = true
          // We assume that there's no DOM event handlers on popover element
          if (!triggerVNode.props) {
            triggerVNode.props = {
              internalSyncTargetWithParent: true,
              internalInheritedEventHandlers: [],
            }
          }
          triggerVNode.props.internalSyncTargetWithParent = true
          if (!triggerVNode.props.internalInheritedEventHandlers) {
            triggerVNode.props.internalInheritedEventHandlers = [handlers]
          }
          else {
            triggerVNode.props.internalInheritedEventHandlers = [
              handlers,
              ...triggerVNode.props.internalInheritedEventHandlers,
            ]
          }
        }
        else {
          const { internalInheritedEventHandlers } = this.$props
          const ascendantAndCurrentHandlers: TriggerEventHandlers[] = [
            handlers,
            ...internalInheritedEventHandlers,
          ]
          const mergedHandlers: TriggerEventHandlers = {
            onBlur: (e: FocusEvent) => {
              ascendantAndCurrentHandlers.forEach((_handlers) => {
                _handlers.onBlur(e)
              })
            },
            onFocus: (e: FocusEvent) => {
              ascendantAndCurrentHandlers.forEach((_handlers) => {
                _handlers.onFocus(e)
              })
            },
            onClick: (e: MouseEvent) => {
              ascendantAndCurrentHandlers.forEach((_handlers) => {
                _handlers.onClick(e)
              })
            },
            onMouseenter: (e: MouseEvent) => {
              ascendantAndCurrentHandlers.forEach((_handlers) => {
                _handlers.onMouseenter(e)
              })
            },
            onMouseleave: (e: MouseEvent) => {
              ascendantAndCurrentHandlers.forEach((_handlers) => {
                _handlers.onMouseleave(e)
              })
            },
          }
          appendEvents(
            triggerVNode,
            internalInheritedEventHandlers
              ? 'nested'
              : this.positionManually
                ? 'manual'
                : this.$props.trigger,
            mergedHandlers,
          )
        }
      }
    }
    return h(DestylerBinder, {
      ref: 'binderInst',
      syncTarget: !popoverInside,
      syncTargetWithParent: this.$props.internalSyncTargetWithParent,
    }, () => {
      return [
        this.$props.internalTrapFocus && this.getMergedShow()
          ? withDirectives(h('div'), [[zindexable, { enabled: this.getMergedShow(), zIndex: this.$props.zIndex }]])
          : null,
        this.positionManually
          ? null
          : h(DestylerTarget, null, {

            default: () => triggerVNode,
          }),
        h(DestylerPopoverBody, keep(this.$props, bodyPropKeys, {
          ...this.$attrs,
          show: this.getMergedShow(),
        }), {
          default: () => this.$slots.default?.(),
          header: () => this.$slots.header?.(),
          footer: () => this.$slots.footer?.(),
        }),
      ]
    })
  },

})

export {
  DestylerPopover,
}
