import type { Component, PropType } from 'vue'
import { computed, defineComponent, h, withDirectives, withModifiers } from 'vue'
import type { AsTag } from '@destyler/primitive'
import type { ExtractPublicPropTypes } from '@destyler/shared'
import { useForwardExpose } from '@destyler/composition'
import { DestylerRovingFocusItem } from '@destyler/roving-focus'
import { DestylerPrimitive } from '@destyler/primitive'
import { BindOnceDirective } from '@destyler/directives'

import { makeContentId, makeTriggerId } from '../utils'
import { injectTabsRootContext } from './root'

export const destylerTabsTriggerProps = {
  as: {
    type: [String, Object] as PropType<AsTag | Component>,
    required: false,
    default: 'button',
  },
  asChild: {
    type: Boolean as PropType<boolean>,
    required: false,
    default: false,
  },
  value: {
    type: String as PropType<string>,
    required: true,
  },
  disabled: {
    type: Boolean as PropType<boolean>,
    required: false,
  },
} as const

export type DestylerTabsTriggerProps = ExtractPublicPropTypes<typeof destylerTabsTriggerProps>

export const DestylerTabsTrigger = defineComponent({
  name: 'DestylerTabsTrigger',
  props: destylerTabsTriggerProps,
  setup(props) {
    const { forwardRef } = useForwardExpose()
    const rootContext = injectTabsRootContext()

    const triggerId = computed(() => makeTriggerId(rootContext.baseId, props.value))
    const contentId = computed(() => makeContentId(rootContext.baseId, props.value))

    const isSelected = computed(() => props.value === rootContext.modelValue.value)

    return {
      forwardRef,
      rootContext,
      triggerId,
      contentId,
      isSelected,
    }
  },
  render() {
    return h(DestylerRovingFocusItem, {
      asChild: true,
      focusable: !this.$props.disabled,
      active: this.isSelected,
    }, {
      default: () => {
        return withDirectives(h(DestylerPrimitive, {
          'ref': (el: any) => this.forwardRef(el),
          'role': 'tab',
          'type': this.$props.as === 'button' ? 'button' : undefined,
          'as': this.$props.as,
          'asChild': this.$props.asChild,
          'aria-selected': this.isSelected ? 'true' : 'false',
          'aria-controls': this.contentId,
          'data-state': this.isSelected ? 'active' : 'inactive',
          'disabled': this.$props.disabled,
          'data-disabled': this.$props.disabled ? '' : undefined,
          'data-orientation': this.rootContext.orientation.value,
          'onMousedown': withModifiers((event: any) => {
            if (!this.$props.disabled && event.ctrlKey === false)
              this.rootContext.changeModelValue(this.$props.value)
            else
              event.preventDefault()
          }, ['left']),
          'onKeydown': withModifiers(() => {
            this.rootContext.changeModelValue(this.$props.value)
          }, ['enter', 'space']),
          'onFocus': () => {
            const isAutomaticActivation = this.rootContext.activationMode !== 'manual'
            if (!this.isSelected && !this.$props.disabled && isAutomaticActivation)
              this.rootContext.changeModelValue(this.$props.value)
          },
        }, {
          default: () => this.$slots.default?.(),
        }), [
          [BindOnceDirective, { id: this.triggerId }],
        ])
      },
    })
  },
})
