import type { PropType } from 'vue'
import { computed, defineComponent, h, mergeProps, toRefs, withModifiers } from 'vue'
import { Primitive, primitiveProps } from '@destyler/primitive'
import type { ExtractPublicPropTypes } from '@destyler/shared'
import { useFormControl, useForwardExpose, useVModel } from '@destyler/composition'

export const radioProps = {
  ...primitiveProps,
  /**
   * @default button
   */
  as: {
    ...primitiveProps.as,
    default: 'button',
  },
  /**
   * The name of the input fields in the radio (Useful for form submission).
   */
  id: {
    type: String as PropType<string>,
    required: false,
  },
  /**
   * The value given as data when submitted with a `name`.
   */
  value: {
    type: String as PropType<string>,
    required: false,
  },
  /**
   * When `true`, prevents the user from interacting with the radio item.
   */
  disabled: {
    type: Boolean as PropType<boolean>,
    required: false,
    default: false,
  },
  /**
   * When `true`, indicates that the user must check the radio item before the owning form can be submitted.
   */
  required: {
    type: Boolean as PropType<boolean>,
    required: false,
  },
  /**
   * The controlled value of the radio item to check. Can be binded as `v-model`.
   *
   * @default undefined
   */
  checked: {
    type: Boolean as PropType<boolean>,
    required: false,
    default: undefined,
  },
  /**
   * The name of the input fields in the radio (Useful for form submission).
   */
  name: {
    type: String as PropType<string>,
    required: false,
  },
} as const

export type RadioProps = ExtractPublicPropTypes<typeof radioProps>

export const radioEmits = {
  /**
   * Event handler called when the radio item is checked.
   */
  'update:checked': (_value: boolean) => true,
}

export const Radio = defineComponent({
  name: 'DestylerRadio',
  props: radioProps,
  emits: radioEmits,
  setup(props, { emit }) {
    const checkedRef = useVModel(props, 'checked', emit, {
      passive: (props.checked === undefined) as false,
    })

    const { value } = toRefs(props)
    const { forwardRef, currentElement: triggerElement } = useForwardExpose()
    const isFormControl = useFormControl(triggerElement)

    const ariaLabel = computed(() => props.id && triggerElement.value ? (document.querySelector(`[for="${props.id}"]`) as HTMLLabelElement)?.textContent ?? props.value : undefined)

    function handleClick(event: MouseEvent) {
      checkedRef.value = true
      if (isFormControl.value)
        event.stopPropagation()
    }

    return {
      forwardRef,
      checkedRef,
      ariaLabel,
      value,
      isFormControl,
      handleClick,
    }
  },
  render() {
    return h(Primitive, mergeProps(this.$attrs, {
      'id': this.$props.id,
      'role': 'radio',
      'ref': this.forwardRef,
      'type': this.$props.as === 'button' ? 'button' : undefined,
      'as': this.$props.as,
      'aria-checked': this.checkedRef,
      'aria-label': this.ariaLabel,
      'asChild': this.$props.asChild,
      'disabled': this.disabled ? true : undefined,
      'data-state': this.checkedRef ? 'checked' : 'unchecked',
      'data-disabled': this.disabled ? '' : undefined,
      'value': this.value,
      'required': this.$props.required,
      'name': this.$props.name,
      'onClick': withModifiers((event: any) => {
        this.handleClick(event)
      }, ['stop']),
    }), () => [
      this.$slots.default?.(),
      this.isFormControl
        ? h('input', {
          'type': 'radio',
          'tabindex': -1,
          'aria-hidden': '',
          'value': this.value,
          'checked': this.checkedRef,
          'name': this.$props.name,
          'disabled': this.disabled,
          'required': this.required,
          'style': {
            transform: 'translateX(-100%)',
            position: 'absolute',
            pointerEvents: 'none',
            opacity: 0,
            margin: 0,
          },
        })
        : null,
    ])
  },
})
