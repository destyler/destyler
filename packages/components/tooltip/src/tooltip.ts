import type { PropType, Ref, VNode } from 'vue'
import { defineComponent, h, ref } from 'vue'
import type { MaybeArray } from '@destyler/shared'
import type { PopoverInst } from '@destyler/popover'
import { DestylerPopover } from '@destyler/popover'

export type TooltipInst = PopoverInst

export interface TriggerEventHandlers {
  onClick: (e: MouseEvent) => void
  onMouseenter: (e: MouseEvent) => void
  onMouseleave: (e: MouseEvent) => void
  onFocus: (e: FocusEvent) => void
  onBlur: (e: FocusEvent) => void
}

export type InternalRenderBody = (
  ref: Ref<HTMLElement | null>,
  onMouseenter: (e: MouseEvent) => void,
  onMouseleave: (e: MouseEvent) => void
) => VNode

export type PopoverTrigger = 'click' | 'hover' | 'focus' | 'manual'

export const destylerTooltipProps = {
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

const DestylerTooltip = defineComponent({
  name: 'DestylerTooltip',
  props: destylerTooltipProps,
  setup(props) {
    const popoverRef = ref<PopoverInst | null>(null)
    const tooltipExposedMethod: TooltipInst = {
      syncPosition() {
        popoverRef.value!.syncPosition()
      },
      setShow(show: boolean) {
        popoverRef.value!.setShow(show)
      },
    }
    return {
      popoverRef,
      tooltipExposedMethod,
    }
  },
  render() {
    return h(DestylerPopover, {
      name: 'tooltip',
      ...this.$props,
      ref: 'popoverRef',
    }, this.$slots)
  },
})

export {
  DestylerTooltip,
}
