import type { PropType, Ref } from 'vue'
import { computed, defineComponent, h, mergeProps, toRefs, withDirectives, withModifiers } from 'vue'
import { Primitive, primitiveProps } from '@destyler/primitive'
import type { ExtractPublicPropTypes } from '@destyler/shared'
import { useFormControl, useForwardExpose, useVModel } from '@destyler/composition'
import { createContext } from '@destyler/shared'
import { BindOnceDirective } from '@destyler/directives'

export const switchRootProps = {
  ...primitiveProps,
  /**
   * @default button
   */
  as: {
    ...primitiveProps.as,
    default: 'button',
  },
  /**
   * The state of the switch when it is initially rendered.
   * Use when you do not need to control its state.
   */
  defaultChecked: {
    type: Boolean as PropType<boolean>,
    required: false,
  },
  /**
   * The controlled state of the switch.
   * Can be bind as `v-model:checked`.
   */
  checked: {
    type: Boolean as PropType<boolean>,
    required: false,
    default: undefined,
  },
  /**
   * When `true`, prevents the user from interacting with the switch.
   */
  disabled: {
    type: Boolean as PropType<boolean>,
    required: false,
  },
  /**
   * When `true`, indicates that the user must check the switch before the owning form can be submitted.
   */
  required: {
    type: Boolean as PropType<boolean>,
    required: false,
  },
  /**
   * The name of the switch. Submitted with its owning form as part of a name/value pair.
   */
  name: {
    type: String as PropType<string>,
    required: false,
  },
  /**
   * Id of the element
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
    default: 'on',
  },
} as const

export type SwitchRootProps = ExtractPublicPropTypes<typeof switchRootProps>

export const switchRootEmits = {
  'update:checked': (_checked: boolean) => true,
}

export interface SwitchRootContext {
  checked?: Ref<boolean>
  toggleCheck: () => void
  disabled: Ref<boolean | undefined>
}

export const [injectSwitchRootContext, provideSwitchRootContext] = createContext<SwitchRootContext>('DestylerSwitchRoot')

export const SwitchRoot = defineComponent({
  name: 'DestylerSwitchRoot',
  props: switchRootProps,
  emits: switchRootEmits,
  setup(props, { emit }) {
    const { disabled } = toRefs(props)

    const checked = useVModel(props, 'checked', emit, {
      defaultValue: props.defaultChecked,
      passive: (props.checked === undefined) as false,
    }) as Ref<boolean>

    function toggleCheck() {
      if (disabled.value)
        return

      checked.value = !checked.value
    }

    const { forwardRef, currentElement } = useForwardExpose()
    const isFormControl = useFormControl(currentElement)
    const ariaLabel = computed(() => props.id && currentElement.value ? (document.querySelector(`[for="${props.id}"]`) as HTMLLabelElement)?.textContent : undefined)

    provideSwitchRootContext({
      checked,
      toggleCheck,
      disabled,
    })

    return {
      forwardRef,
      toggleCheck,
      isFormControl,
      ariaLabel,
      checked,
      disabled,
    }
  },
  render() {
    return [
      withDirectives(h(Primitive, mergeProps(this.$attrs, {
        'ref': (el: any) => this.forwardRef(el),
        'role': 'switch',
        'type': this.$props.as === 'button' ? 'button' : undefined,
        'value': this.value,
        'aria-label': this.$attrs['aria-label'] || this.ariaLabel,
        'aria-checked': this.checked,
        'aria-required': this.$props.required,
        'data-state': this.checked ? 'checked' : 'unchecked',
        'data-disabled': this.disabled ? '' : undefined,
        'as': this.$props.as,
        'asChild': this.$props.asChild,
        'disabled': this.disabled,
        'onClick': () => {
          this.toggleCheck()
        },
        'onKeydown': withModifiers(() => {
          this.toggleCheck()
        }, ['enter', 'prevent']),
      }), () => this.$slots.default?.()), [
        [BindOnceDirective, { id: this.$props.id }],
      ]),
      this.isFormControl
        ? h('input', {
          'type': 'checkbox',
          'name': this.$props.name,
          'tabindex': -1,
          'aria-hidden': '',
          'disabled': this.disabled,
          'required': this.$props.required,
          'value': this.value,
          'checked': !!this.checked,
          'data-state': this.checked ? 'checked' : 'unchecked',
          'data-disabled': this.disabled ? '' : undefined,
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
