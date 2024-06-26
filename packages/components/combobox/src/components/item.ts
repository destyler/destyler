import type { PropType, Ref } from 'vue'
import { computed, defineComponent, h, nextTick, ref, toRefs } from 'vue'
import { DestylerPrimitive, destylerPrimitiveProps } from '@destyler/primitive'
import type { ExtractPublicPropTypes } from '@destyler/shared'
import { createContext, handleAndDispatchCustomEvent } from '@destyler/shared'
import { useForwardExpose, useId } from '@destyler/composition'
import { DestylerCollectionItem } from '@destyler/collection'
import isEqual from 'fast-deep-equal'

import { injectComboboxRootContext } from './root'
import { injectComboboxGroupContext } from './group'

const COMBOBOX_SELECT = 'combobox.select'

export type SelectEvent = CustomEvent<{ originalEvent: PointerEvent, value?: string | number | boolean | Record<string, any> }>

export const destylerComboboxItemProps = {
  ...destylerPrimitiveProps,
  value: {
    type: [String, Number, Boolean, Object] as PropType<string | number | boolean | Record<string, any>>,
    required: true,
  },
  disabled: {
    type: Boolean as PropType<boolean>,
    required: false,
  },
} as const

export type DestylerComboboxItemProps = ExtractPublicPropTypes<typeof destylerComboboxItemProps>

export interface ComboboxItemContext {
  isSelected: Ref<boolean>
}

export const [injectComboboxItemContext, provideComboboxItemContext] = createContext<ComboboxItemContext>('DestylerComboboxItem')

export const DestylerComboboxItem = defineComponent({
  name: 'DestylerComboboxItem',
  props: destylerComboboxItemProps,
  emits: ['select'],
  setup(props, { emit }) {
    const { disabled } = toRefs(props)

    const rootContext = injectComboboxRootContext()
    injectComboboxGroupContext({ id: '', options: ref([]) })
    const { forwardRef } = useForwardExpose()

    const isSelected = computed(() =>
      rootContext.multiple.value && Array.isArray(rootContext.modelValue.value)
        ? rootContext.modelValue.value?.includes(props.value as never)
        : isEqual(rootContext.modelValue?.value, props.value),
    )

    const isFocused = computed(() => isEqual(rootContext.selectedValue.value, props.value))
    const textId = useId()

    const isInOption = computed(() =>
      rootContext.isUserInputted.value
        ? rootContext.searchTerm.value === ''
        || !!rootContext.filteredOptions.value.find(i => isEqual(i, props.value))
        : true)

    async function handleSelect(ev: SelectEvent) {
      emit('select', ev)
      if (ev?.defaultPrevented)
        return

      if (!disabled.value && ev)
        rootContext!.onValueChange(props.value)
    }

    function handleSelectCustomEvent(ev?: PointerEvent) {
      if (!ev)
        return
      const eventDetail = { originalEvent: ev, value: props.value }
      handleAndDispatchCustomEvent(COMBOBOX_SELECT, handleSelect, eventDetail)
    }

    async function handlePointerMove(event: PointerEvent) {
      await nextTick()
      if (event.defaultPrevented)
        return

      rootContext.onSelectedValueChange(props.value)
    }

    if (props.value === '') {
      throw new Error(
        'A <DestylerSelectItem /> must have a value prop that is not an empty string. This is because the Select value can be set to an empty string to clear the selection and show the placeholder.',
      )
    }

    provideComboboxItemContext({
      isSelected,
    })

    return {
      forwardRef,
      textId,
      isFocused,
      isSelected,
      isInOption,
      handleSelectCustomEvent,
      handlePointerMove,
    }
  },
  render() {
    return h(DestylerCollectionItem, null, {
      default: () => {
        return h(DestylerPrimitive, {
          'ref': (el: any) => this.forwardRef(el),
          'role': 'option',
          'tabindex': '-1',
          'aria-labelledby': this.textId,
          'data-highlighted': this.isFocused ? '' : undefined,
          'aria-selected': this.isSelected,
          'data-state': this.isSelected ? 'checked' : 'unchecked',
          'aria-disabled': this.$props.disabled || undefined,
          'data-disabled': this.$props.disabled ? '' : undefined,
          'as': this.$props.as,
          'asChild': this.$props.asChild,
          'data-hidden': !this.isInOption ? true : undefined,
          'onClick': (event: any) => {
            this.handleSelectCustomEvent(event)
          },
          'onPointermove': (event: any) => {
            this.handlePointerMove(event)
          },
          ...this.isInOption ? {} : { style: { display: 'none' } },
        }, {
          default: () => this.$slots.default ? this.$slots.default?.() : this.$props.value,
        })
      },
    })
  },
})
