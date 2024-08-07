import type { PropType, Ref, SlotsType, VNode } from 'vue'
import { computed, defineComponent, h, mergeProps, toRef, withDirectives } from 'vue'
import { Primitive, primitiveProps } from '@destyler/primitive'
import { useFormControl, useForwardExpose, useVModel } from '@destyler/composition'
import type { ExtractPublicPropTypes } from '@destyler/shared'
import { createContext } from '@destyler/shared'
import { BindOnceDirective } from '@destyler/directives'

import { getState, isIndeterminate } from '../utils'
import type { CheckedState } from '../types'

export const checkboxRootProps = {
  ...primitiveProps,
  as: {
    ...primitiveProps.as,
    default: 'button',
  },
  defaultChecked: {
    type: Boolean as PropType<boolean>,
    required: false,
  },
  checked: {
    type: [Boolean, String] as PropType<boolean | 'indeterminate'>,
    required: false,
    default: undefined,
  },
  disabled: {
    type: Boolean as PropType<boolean>,
    required: false,
    default: false,
  },
  required: {
    type: Boolean as PropType<boolean>,
    required: false,
  },
  name: {
    type: String as PropType<string>,
    required: false,
  },
  value: {
    type: String as PropType<string>,
    required: false,
    default: 'on',
  },
  id: {
    type: String as PropType<string>,
    required: false,
  },
} as const

export type CheckboxRootProps = ExtractPublicPropTypes<typeof checkboxRootProps>

export const checkboxRootEmits = {
  'update:checked': (_checked: boolean) => true,
}

export interface CheckboxRootContext {
  disabled: Ref<boolean>
  state: Ref<CheckedState>
}

export const [injectCheckboxRootContext, provideCheckboxRootContext]
  = createContext<CheckboxRootContext>('DestylerCheckboxRoot')

export const CheckboxRoot = defineComponent({
  name: 'DestylerCheckboxRoot',
  props: checkboxRootProps,
  emits: checkboxRootEmits,
  slots: Object as SlotsType<{
    default: () => VNode[]
  }>,
  setup(props, { emit }) {
    const disabledRef = toRef(props.disabled)

    const checkedRef = useVModel(props, 'checked', emit, {
      defaultValue: props.defaultChecked,
      passive: (props.checked === undefined) as false,
    }) as Ref<CheckedState>

    const { forwardRef, currentElement } = useForwardExpose()
    const isFormControl = useFormControl(currentElement)

    const ariaLabel = computed(() => props.id && currentElement.value
      ? (document.querySelector(`[for="${props.id}"]`) as HTMLLabelElement)?.textContent
      : undefined)

    provideCheckboxRootContext({
      disabled: disabledRef,
      state: checkedRef,
    })

    return {
      disabled: disabledRef,
      checked: checkedRef,
      forwardRef,
      isFormControl,
      ariaLabel,
    }
  },
  render() {
    const useVShow = this.isFormControl
    return [
      withDirectives(h(Primitive, mergeProps(this.$attrs, {
        'ref': (el: any) => this.forwardRef(el),
        'role': 'checkbox',
        'asChild': this.$props.asChild,
        'as': this.$props.as,
        'type': this.$props.as === 'button' ? 'button' : undefined,
        'aria-checked': isIndeterminate(this.checked) ? 'mixed' : this.checked,
        'aria-required': false,
        'aria-label': this.$attrs['aria-label'] || this.ariaLabel,
        'data-state': getState(this.checked),
        'data-disabled': this.disabled ? '' : undefined,
        'disabled': this.disabled,
        'onClick': () => {
          this.checked = !this.checked
        },
      }), () => this.$slots.default?.()), [
        [BindOnceDirective, { id: this.$props.id }],
      ]),
      useVShow
        ? h('input', {
          'type': 'checkbox',
          'tabindex': '-1',
          'aria-hidden': '',
          'value': this.$props.value,
          'checked': this.checked,
          'name': this.$props.name,
          'disabled': this.disabled,
          'required': this.$props.required,
          'style': {
            transform: 'translateX(-100%)',
            position: 'absolute',
            pointerEvents: 'none',
            opacity: 0,
            margin: 0,
          },
        })
        : null,
    ]
  },
})
