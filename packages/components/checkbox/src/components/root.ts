import type { PropType, Ref } from 'vue'
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
  /**
   * @default button
   */
  as: {
    ...primitiveProps.as,
    default: 'button',
  },
  /**
   * The checked state of the checkbox when it is initially rendered.
   * Use when you do not need to control its checked state.
   *
   * @default -
   */
  defaultChecked: {
    type: Boolean as PropType<boolean>,
    required: false,
  },
  /**
   * The controlled checked state of the checkbox. Can be binded with `v-model`.
   *
   * @default undefined
   */
  checked: {
    type: [Boolean, String] as PropType<boolean | 'indeterminate'>,
    required: false,
    default: undefined,
  },
  /**
   * When `true`, prevents the user from interacting with the checkbox.
   *
   * @default false
   */
  disabled: {
    type: Boolean as PropType<boolean>,
    required: false,
    default: false,
  },
  /**
   * When `true`, indicates that the user must check the checkbox before the owning form can be submitted.
   *
   * @default -
   */
  required: {
    type: Boolean as PropType<boolean>,
    required: false,
  },
  /**
   * The name of the checkbox. Submitted with its owning form as part of a name/value pair.
   *
   * @default -
   */
  name: {
    type: String as PropType<string>,
    required: false,
  },
  /**
   * The value given as data when submitted with a `name`.
   *
   * @default on
   */
  value: {
    type: String as PropType<string>,
    required: false,
    default: 'on',
  },
  /**
   * Id of the element
   *
   * @default -
   */
  id: {
    type: String as PropType<string>,
    required: false,
  },
} as const

export type CheckboxRootProps = ExtractPublicPropTypes<typeof checkboxRootProps>

export const checkboxRootEmits = {
  /**
   * Event handler called when the checked state of the checkbox changes.
   */
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
