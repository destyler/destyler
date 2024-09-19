import type { PropType } from 'vue'
import { computed, defineComponent, h, withDirectives, withModifiers } from 'vue'
import type { ExtractPublicPropTypes } from '@destyler/shared'
import { useForwardExpose } from '@destyler/composition'
import { RovingFocusItem } from '@destyler/roving-focus'
import { Primitive, primitiveProps } from '@destyler/primitive'
import { BindOnceDirective } from '@destyler/directives'

import { makeContentId, makeTriggerId } from '../utils'
import { injectTabsRootContext } from './root'

export const tabsTriggerProps = {
  ...primitiveProps,
  /**
   * @default button
   */
  as: {
    ...primitiveProps.as,
    default: 'button',
  },
  /**
   * A unique value that associates the trigger with a content.
   */
  value: {
    type: String as PropType<string>,
    required: true,
  },
  /**
   * When `true`, prevents the user from interacting with the tab.
   */
  disabled: {
    type: Boolean as PropType<boolean>,
    required: false,
  },
} as const

export type TabsTriggerProps = ExtractPublicPropTypes<typeof tabsTriggerProps>

export const TabsTrigger = defineComponent({
  name: 'DestylerTabsTrigger',
  props: tabsTriggerProps,
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
    return h(RovingFocusItem, {
      asChild: true,
      focusable: !this.$props.disabled,
      active: this.isSelected,
    }, () => withDirectives(h(Primitive, {
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
    }, () => this.$slots.default?.()), [
      [BindOnceDirective, { id: this.triggerId }],
    ]))
  },
})
