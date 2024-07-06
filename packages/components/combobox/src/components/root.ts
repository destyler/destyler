import type { PropType, Ref } from 'vue'
import { computed, defineComponent, h, mergeProps, nextTick, ref, toRefs, watch } from 'vue'
import { Primitive, primitiveProps } from '@destyler/primitive'
import type { Direction, ExtractPublicPropTypes } from '@destyler/shared'
import { computedWithControl, createContext } from '@destyler/shared'
import isEqual from 'fast-deep-equal'
import { useDirection, useFormControl, useForwardExpose, useId, useVModel } from '@destyler/composition'
import { PopperRoot } from '@destyler/popper'
import { VisuallyhiddenInput } from '@destyler/visually-hidden/dist/component'
import { createCollection } from '@destyler/collection/dist/composition'

type ArrayOrWrapped<T> = T extends any[] ? T : Array<T>

export const comboboxRootProps = {
  ...primitiveProps,
  modelValue: {
    type: [String, Number, Boolean, Object] as PropType<string | number | boolean | Record<string, any>>,
    required: false,
  },
  defaultValue: {
    type: [String, Number, Boolean, Object] as PropType<string | number | boolean | Record<string, any>>,
    required: false,
  },
  open: {
    type: Boolean as PropType<boolean>,
    required: false,
    default: undefined,
  },
  defaultOpen: {
    type: Boolean as PropType<boolean>,
    required: false,
  },
  searchTerm: {
    type: String as PropType<string>,
    required: false,
  },
  multiple: {
    type: Boolean as PropType<boolean>,
    required: false,
  },
  disabled: {
    type: Boolean as PropType<boolean>,
    required: false,
  },
  name: {
    type: String as PropType<string>,
    required: false,
  },
  dir: {
    type: String as PropType<Direction>,
    required: false,
  },
  filterFunction: {
    type: Function as PropType<(val: ArrayOrWrapped<string | number | boolean | Record<string, any>>, term: string) => ArrayOrWrapped<string | number | boolean | Record<string, any>>>,
    required: false,
  },
  displayValue: {
    type: Function as PropType<(val: string | number | boolean | Record<string, any>) => string>,
    required: false,
  },
} as const

export type ComboboxRootProps = ExtractPublicPropTypes<typeof comboboxRootProps>

export const comboboxRootEmits = {
  'update:modelValue': (_value: string | number | boolean | Record<string, any>) => true,
  'update:open': (_open: boolean) => true,
  'update:searchTerm': (_searchTerm: string) => true,
}

export interface ComboboxRootContext<T> {
  modelValue: Ref<T | Array<T>>
  onValueChange: (val: T) => void
  searchTerm: Ref<string>
  multiple: Ref<boolean | undefined>
  disabled: Ref<boolean | undefined>
  open: Ref<boolean>
  onOpenChange: (value: boolean) => void
  isUserInputted: Ref<boolean>
  filteredOptions: Ref<Array<T>>
  contentId: string
  contentElement: Ref<HTMLElement | undefined>
  onContentElementChange: (el: HTMLElement) => void
  inputElement: Ref<HTMLInputElement | undefined>
  onInputElementChange: (el: HTMLInputElement) => void
  onInputNavigation: (dir: 'up' | 'down' | 'home' | 'end') => void
  onInputEnter: () => void
  selectedValue: Ref<T | undefined>
  onSelectedValueChange: (val: T) => void
  parentElement: Ref<HTMLElement | undefined>
}

export const [injectComboboxRootContext, provideComboboxRootContext] = createContext<ComboboxRootContext<string | number | boolean | Record<string, any>>>('DestylerComboboxRoot')

export const ComboboxRoot = defineComponent({
  name: 'DestylerComboboxRoot',
  props: comboboxRootProps,
  emits: comboboxRootEmits,
  setup(props, { emit }) {
    const { multiple, disabled, dir: propDir } = toRefs(props)
    const dir = useDirection(propDir)

    const searchTerm = useVModel(props, 'searchTerm', emit, {
      defaultValue: '',
      passive: (props.searchTerm === undefined) as false,
    }) as Ref<string>

    const modelValue = useVModel(props, 'modelValue', emit, {
      defaultValue: props.defaultValue ?? multiple.value ? [] : undefined,
      passive: (props.modelValue === undefined) as false,
      deep: true,
    }) as Ref<string | number | boolean | Record<string, any>>

    const open = useVModel(props, 'open', emit, {
      defaultValue: props.defaultOpen,
      passive: (props.open === undefined) as false,
    }) as Ref<boolean>

    const selectedValue = ref<string | number | boolean | Record<string, any>>()

    const isUserInputted = ref(false)

    const inputElement = ref<HTMLInputElement>()
    const contentElement = ref<HTMLElement>()
    const { forwardRef, currentElement: parentElement } = useForwardExpose()
    const { getItems, reactiveItems, itemMapSize } = createCollection<{ value: string | number | boolean | Record<string, any> }>('data-destyler-combobox-item')

    async function onOpenChange(val: boolean) {
      open.value = val
      await nextTick()
      if (val) {
        if (modelValue.value) {
          if (Array.isArray(modelValue.value) && multiple.value)
            selectedValue.value = (getItems().find(i => (i.ref)?.dataset?.state === 'checked'))?.value
          else
            selectedValue.value = modelValue.value as string | number | boolean | Record<string, any>
        }
        inputElement.value?.focus()
        scrollSelectedValueIntoView()
      }
      else {
        isUserInputted.value = false
        resetSearchTerm()
      }
    }

    function onValueChange(val: string | number | boolean | Record<string, any>) {
      if (Array.isArray(modelValue.value) && multiple.value) {
        const index = modelValue.value.findIndex(i => isEqual(i, val))
        index === -1 ? modelValue.value.push(val) : modelValue.value.splice(index, 1)
      }
      else {
        modelValue.value = val
        onOpenChange(false)
      }
    }

    const options = computedWithControl(() => itemMapSize.value, () => {
      return getItems().map(i => i.value)
    })

    const filteredOptions = computed(() => {
      if (isUserInputted.value) {
        if (props.filterFunction)
          return props.filterFunction(options.value as ArrayOrWrapped<string | number | boolean | Record<string, any>>, searchTerm.value)

        else if (typeof options.value[0] === 'string')
          return options.value.filter(i => (i as string).toLowerCase().includes(searchTerm.value?.toLowerCase()))
      }
      return options.value
    })

    function resetSearchTerm() {
      if (!multiple.value && modelValue.value) {
        if (props.displayValue)
          searchTerm.value = props.displayValue(modelValue.value)
        else if (typeof modelValue.value !== 'object')
          searchTerm.value = modelValue.value.toString()
        else
          searchTerm.value = ''
      }
      else {
        searchTerm.value = ''
      }
    }

    const activeIndex = computed(() => filteredOptions.value.findIndex(i => isEqual(i, selectedValue.value)))
    const selectedElement = computed(() => {
      return reactiveItems.value.find(i => i.value === selectedValue.value)?.ref
    })

    watch(modelValue, async () => {
      await nextTick()
      resetSearchTerm()
    }, { immediate: true })

    watch(() => filteredOptions.value.length, async (length) => {
      await nextTick()
      await nextTick()
      if (length && activeIndex.value === -1)
        selectedValue.value = filteredOptions.value[0]
    })

    const isFormControl = useFormControl(parentElement)

    function scrollSelectedValueIntoView() {
      if (selectedElement.value instanceof Element)
        selectedElement.value.scrollIntoView({ block: 'nearest' })
    }

    provideComboboxRootContext({
      searchTerm,
      modelValue,
      onValueChange,
      isUserInputted,
      multiple,
      disabled,
      open,
      onOpenChange,
      filteredOptions,
      contentId: useId(),
      inputElement,
      onInputElementChange: val => inputElement.value = val,
      onInputNavigation: async (val) => {
        const index = activeIndex.value

        if ((index === 0 && val === 'up') || (index === (filteredOptions.value.length - 1) && val === 'down'))
          return

        if ((index === -1 && filteredOptions.value.length) || val === 'home')
          selectedValue.value = filteredOptions.value[0]

        else if (val === 'end')
          selectedValue.value = filteredOptions.value[filteredOptions.value.length - 1]

        else
          selectedValue.value = filteredOptions.value[val === 'up' ? index - 1 : index + 1]

        scrollSelectedValueIntoView()
      },
      onInputEnter: async () => {
        if (filteredOptions.value.length && selectedValue.value && selectedElement.value instanceof Element)
          selectedElement.value?.click()
      },
      selectedValue,
      onSelectedValueChange: val => selectedValue.value = val as string | number | boolean | Record<string, any>,
      parentElement,
      contentElement,
      onContentElementChange: val => contentElement.value = val,
    })

    return {
      forwardRef,
      isFormControl,
      open,
      modelValue,
      dir,
    }
  },
  render() {
    return h(PopperRoot, {}, {
      default: () => {
        return h(Primitive, mergeProps(this.$attrs, {
          ref: (el: any) => this.forwardRef(el),
          style: {
            pointerEvents: this.open ? 'auto' : undefined,
          },
          as: this.$props.as,
          asChild: this.$props.asChild,
          dir: this.dir,
        }), {
          default: () => {
            return [
              this.$slots.default?.({ open: this.open, modelValue: this.modelValue }),
              this.isFormControl && this.$props.name
                ? h(VisuallyhiddenInput, {
                  name: this.$props.name,
                  value: this.modelValue,
                })
                : null,
            ]
          },
        })
      },
    })
  },
})
