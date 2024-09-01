import type { ComputedRef, PropType, Ref, SlotsType, VNode } from 'vue'
import { computed, defineComponent, h, mergeProps, ref, toRefs, watch, withDirectives } from 'vue'
import { Primitive, primitiveProps } from '@destyler/primitive'
import type { Direction, ExtractPublicPropTypes } from '@destyler/shared'
import { createContext } from '@destyler/shared'
import { useDirection, useForwardExpose, useVModel } from '@destyler/composition'
import { BindOnceDirective } from '@destyler/directives'

export const otpInputRootProps = {
  ...primitiveProps,
  /**
   * The controlled checked state of the pin input.
   * Can be binded as `v-model`.
   */
  modelValue: {
    type: Array as PropType<string[]>,
    required: false,
  },
  /**
   * The default value of the pin inputs when it is initially rendered. Use when you do not need to control its checked state.
   */
  defaultValue: {
    type: Array as PropType<string[]>,
    required: false,
  },
  /**
   * The placeholder character to use for empty pin-inputs.
   */
  placeholder: {
    type: String as PropType<string>,
    required: false,
    default: '',
  },
  /**
   * When `true`, pin inputs will be treated as password.
   */
  mask: {
    type: Boolean as PropType<boolean>,
    required: false,
  },
  /**
   *  When `true`, mobile devices will autodetect the OTP from messages or clipboard, and enable the autocomplete field.
   */
  otp: {
    type: Boolean as PropType<boolean>,
    required: false,
  },
  /**
   * Input type for the inputs.
   *
   * @default text
   */
  type: {
    type: String as PropType<'text' | 'number'>,
    required: false,
    default: 'text',
  },
  /**
   * The reading direction of the combobox when applicable.
   */
  dir: {
    type: String as PropType<Direction>,
    required: false,
  },
  /**
   * The name of the pin input. Submitted with its owning form as part of a name/value pair.
   */
  name: {
    type: String as PropType<string>,
    required: false,
  },
  /**
   * When `true`, prevents the user from interacting with the pin input
   */
  disabled: {
    type: Boolean as PropType<boolean>,
    required: false,
  },
  /**
   * When `true`, indicates that the user must check the pin input before the owning form can be submitted.
   */
  required: {
    type: Boolean as PropType<boolean>,
    required: false,
  },
  /**
   * Id of the element
   */
  id: {
    type: String as PropType<string>,
    required: false,
  },
} as const

export type OtpInputRootProps = ExtractPublicPropTypes<typeof otpInputRootProps>

export interface OtpInputRootContext {
  modelValue: Ref<string[]>
  mask: Ref<boolean | undefined>
  otp: Ref<boolean | undefined>
  placeholder: Ref<string>
  type: Ref<'text' | 'number'>
  dir: Ref<Direction>
  disabled: Ref<boolean | undefined>
  isCompleted: ComputedRef<boolean>
  inputElements?: Ref<Set<HTMLInputElement>>
  onInputElementChange: (el: HTMLInputElement) => void
}

export const [injectOtpInputRootContext, provideOtpInputRootContext] = createContext<OtpInputRootContext>('DestylerOtpInputRoot')

export const otpInputRootEmits = {
  /**
   * Event handler called when the value changes.
   */
  'update:modelValue': (_value: string[]) => true,
  /**
   * Processing complete operations.
   */
  'complete': (_value: string[]) => true,
}

export const OtpInputRoot = defineComponent({
  name: 'DestylerOtpInputRoot',
  inheritAttrs: false,
  props: otpInputRootProps,
  emits: otpInputRootEmits,
  slots: Object as SlotsType<{
    default: (opts: {
      /**
       * Current input values
       */
      modelValue: string[]
    }) => VNode[]
  }>,
  setup(props, { emit }) {
    const { mask, otp, placeholder, type, disabled, dir: propDir } = toRefs(props)
    const { forwardRef } = useForwardExpose()
    const dir = useDirection(propDir)

    const modelValue = useVModel(props, 'modelValue', emit, {
      defaultValue: props.defaultValue ?? [],
      passive: (props.modelValue === undefined) as false,
    }) as Ref<string[]>

    const inputElements = ref<Set<HTMLInputElement>>(new Set())
    function onInputElementChange(el: HTMLInputElement) {
      inputElements.value.add(el)
    }

    const isCompleted = computed(() => {
      const modelValues = modelValue.value.filter(i => !!i)
      return modelValues.length === inputElements.value.size
    })

    watch(modelValue, () => {
      if (isCompleted.value)
        emit('complete', modelValue.value)
    }, { deep: true })

    provideOtpInputRootContext({
      modelValue,
      mask,
      otp,
      placeholder,
      type,
      dir,
      disabled,
      isCompleted,
      inputElements,
      onInputElementChange,
    })

    return {
      forwardRef,
      modelValue,
      dir,
      disabled,
      isCompleted,
      inputElements,
    }
  },
  render() {
    return [
      h(Primitive, mergeProps(this.$attrs, {
        'ref': (el: any) => this.forwardRef(el),
        'dir': this.dir,
        'data-complete': this.isCompleted ? '' : undefined,
        'data-disabled': this.disabled ? '' : undefined,
        'as': this.$props.as,
        'asChild': this.$props.asChild,
      }), () => this.$slots.default?.({ modelValue: this.modelValue })),
      withDirectives(h('input', {
        'type': 'text',
        'tabindex': '-1',
        'aria-hidden': '',
        'value': this.modelValue.join(''),
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
        'onFocus': () => {
          Array.from(this.inputElements)?.[0]?.focus()
        },
      }), [
        [BindOnceDirective, { id: this.$props.id }],
      ]),
    ]
  },
})
