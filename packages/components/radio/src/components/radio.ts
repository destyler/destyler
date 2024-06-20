import type { PropType } from 'vue'
import { computed, defineComponent, h, mergeProps, toRefs, withDirectives, withModifiers } from 'vue'
import { DestylerPrimitive, destylerPrimitiveProps } from '@destyler/primitive'
import type { ExtractPublicPropTypes } from '@destyler/shared'
import { useFormControl, useForwardExpose, useVModel } from '@destyler/composition'
import { BindOnceDirective } from '@destyler/directives'

export const destylerRadioProps = {
  ...destylerPrimitiveProps,
  as: {
    ...destylerPrimitiveProps.as,
    default: 'button',
  },
  id: {
    type: String as PropType<string>,
    required: false,
  },
  value: {
    type: String as PropType<string>,
    required: false,
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
  checked: {
    type: Boolean as PropType<boolean>,
    required: false,
    default: undefined,
  },
  name: {
    type: String as PropType<string>,
    required: false,
  },
} as const

export type DestylerRadioProps = ExtractPublicPropTypes<typeof destylerRadioProps>

export const DestylerRadio = defineComponent({
  name: 'DestylerRadio',
  props: destylerRadioProps,
  emits: ['update:checked'],
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
    return withDirectives(h(DestylerPrimitive, mergeProps(this.$attrs, {
      'role': 'radio',
      'ref': (el: any) => this.forwardRef(el),
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
    ]), [
      [BindOnceDirective, { id: this.$props.id }],
    ])
  },
})
