import type { ComputedRef, PropType, Ref } from 'vue'
import { computed, defineComponent, h, mergeProps, ref, toRefs, watch, withDirectives } from 'vue'
import { DestylerPrimitive, destylerPrimitiveProps } from '@destyler/primitive'
import type { Direction, ExtractPublicPropTypes } from '@destyler/shared'
import { createContext } from '@destyler/shared'
import { useDirection, useForwardExpose, useVModel } from '@destyler/composition'
import { BindOnceDirective } from '@destyler/directives'

export const destylerOtpInputRootProps = {
  ...destylerPrimitiveProps,
  modelValue: {
    type: Array as PropType<string[]>,
    required: false,
  },
  defaultValue: {
    type: Array as PropType<string[]>,
    required: false,
  },
  placeholder: {
    type: String as PropType<string>,
    required: false,
    default: '',
  },
  mask: {
    type: Boolean as PropType<boolean>,
    required: false,
  },
  otp: {
    type: Boolean as PropType<boolean>,
    required: false,
  },
  type: {
    type: String as PropType<'text' | 'number'>,
    required: false,
    default: 'text',
  },
  dir: {
    type: String as PropType<Direction>,
    required: false,
  },
  name: {
    type: String as PropType<string>,
    required: false,
  },
  disabled: {
    type: Boolean as PropType<boolean>,
    required: false,
  },
  required: {
    type: Boolean as PropType<boolean>,
    required: false,
  },
  id: {
    type: String as PropType<string>,
    required: false,
  },
} as const

export type DestylerOtpInputRootProps = ExtractPublicPropTypes<typeof destylerOtpInputRootProps>

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

export const DestylerOtpInputRoot = defineComponent({
  name: 'DestylerOtpInputRoot',
  inheritAttrs: false,
  props: destylerOtpInputRootProps,
  emits: ['update:modelValue', 'complete'],
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
      h(DestylerPrimitive, mergeProps(this.$attrs, {
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
