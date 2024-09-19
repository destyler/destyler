import type { PropType, Ref } from 'vue'
import { computed, defineComponent, h, nextTick, onMounted, ref, toRefs, withModifiers } from 'vue'
import type { ExtractPublicPropTypes } from '@destyler/shared'
import { SELECTION_KEYS, createContext } from '@destyler/shared'
import { Primitive, primitiveProps } from '@destyler/primitive'
import { useForwardExpose, useId } from '@destyler/composition'

import { injectSelectRootContext } from './root'
import { SelectContentDefaultContextValue, injectSelectContentContext } from './contentImpl'

export const selectItemProps = {
  ...primitiveProps,
  /**
   * The value given as data when submitted with a `name`.
   */
  value: {
    type: String,
    required: true,
  },
  /**
   * When `true`, prevents the user from interacting with the item.
   *
   * @default false
   */
  disabled: {
    type: Boolean as PropType<boolean>,
    required: false,
    default: false,
  },
  /**
   * Optional text used for typeahead purposes.
   *
   * By default the typeahead behavior will use the `.textContent` of the `SelectItemText` part.
   *
   * Use this when the content is complex, or you have non-textual content inside.
   */
  textValue: {
    type: String as PropType<string>,
    required: false,
  },
} as const

export type SelectItemProps = ExtractPublicPropTypes<typeof selectItemProps>

export interface SelectItemContext {
  value: string
  textId: string
  disabled: Ref<boolean>
  isSelected: Ref<boolean>
  onItemTextChange: (node: HTMLElement | undefined) => void
}

export const [injectSelectItemContext, provideSelectItemContext] = createContext<SelectItemContext>('DestylerSelectItem')

export const SelectItem = defineComponent({
  name: 'DestylerSelectItem',
  props: selectItemProps,
  setup(props) {
    const { disabled } = toRefs(props)

    const rootContext = injectSelectRootContext()
    const contentContext = injectSelectContentContext(SelectContentDefaultContextValue)
    const { forwardRef, currentElement } = useForwardExpose()

    const isSelected = computed(() => rootContext.modelValue?.value === props.value)
    const isFocused = ref(false)
    const textValue = ref(props.textValue ?? '')
    const textId = useId(undefined, 'destyler-select-item-text')

    async function handleSelect(ev?: PointerEvent) {
      await nextTick()
      if (ev?.defaultPrevented)
        return

      if (!disabled.value) {
        rootContext.onValueChange(props.value)
        rootContext.onOpenChange(false)
      }
    }

    async function handlePointerMove(event: PointerEvent) {
      await nextTick()
      if (event.defaultPrevented)
        return
      if (disabled.value) {
        contentContext.onItemLeave?.()
      }
      else {
        // even though safari doesn't support this option, it's acceptable
        // as it only means it might scroll a few pixels when using the pointer.
        (event.currentTarget as HTMLElement).focus({ preventScroll: true })
      }
    }

    async function handlePointerLeave(event: PointerEvent) {
      await nextTick()
      if (event.defaultPrevented)
        return
      if (event.currentTarget === document.activeElement)
        contentContext.onItemLeave?.()
    }

    async function handleKeyDown(event: KeyboardEvent) {
      await nextTick()
      if (event.defaultPrevented)
        return
      const isTypingAhead = contentContext.searchRef?.value !== ''
      if (isTypingAhead && event.key === ' ')
        return
      if (SELECTION_KEYS.includes(event.key)) {
        handleSelect()
      }

      // prevent page scroll if using the space key to select an item
      if (event.key === ' ')
        event.preventDefault()
    }

    if (props.value === '') {
      throw new Error(
        'A <SelectItem /> must have a value prop that is not an empty string. This is because the Select value can be set to an empty string to clear the selection and show the placeholder.',
      )
    }

    onMounted(() => {
      if (!currentElement.value)
        return
      contentContext.itemRefCallback(
        currentElement.value,
        props.value,
        props.disabled,
      )
    })

    provideSelectItemContext({
      value: props.value,
      disabled,
      textId,
      isSelected,
      onItemTextChange: (node) => {
        textValue.value = ((textValue.value || node?.textContent) ?? '').trim()
      },
    })

    return {
      forwardRef,
      textId,
      isFocused,
      isSelected,
      disabled,
      handleSelect,
      handlePointerMove,
      handlePointerLeave,
      handleKeyDown,
    }
  },
  render() {
    return h(Primitive, {
      'ref': this.forwardRef,
      'role': 'option',
      'data-destyler-collection-item': '',
      'aria-labelledby': this.textId,
      'data-highlighted': this.isFocused ? '' : undefined,
      'aria-selected': this.isSelected && this.isFocused,
      'data-state': this.isSelected ? 'checked' : 'unchecked',
      'aria-disabled': this.disabled || undefined,
      'data-disabled': this.disabled ? '' : undefined,
      'tabindex': this.disabled ? undefined : -1,
      'as': this.$props.as,
      'asChild': this.$props.asChild,
      'onFocus': () => {
        this.isFocused = true
      },
      'onBlur': () => {
        this.isFocused = false
      },
      'onPointerup': (event: any) => {
        this.handleSelect(event)
      },
      'onPointerdown': (event: any) => {
        (event.currentTarget as HTMLElement).focus({ preventScroll: true })
      },
      'onTouchend': withModifiers(() => {}, ['prevent', 'stop']),
      'onPointermove': (event: any) => {
        this.handlePointerMove(event)
      },
      'onPointerleave': (event: any) => {
        this.handlePointerLeave(event)
      },
      'onKeydown': (event: any) => {
        this.handleKeyDown(event)
      },
    }, () => this.$slots.default?.())
  },
})
