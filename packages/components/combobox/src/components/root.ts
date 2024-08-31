import type { PropType, Ref, SlotsType, VNode } from 'vue'
import { computed, defineComponent, h, mergeProps, nextTick, ref, toRefs, watch } from 'vue'
import { Primitive, primitiveProps } from '@destyler/primitive'
import type { Direction, ExtractPublicPropTypes } from '@destyler/shared'
import { createContext } from '@destyler/shared'
import isEqual from 'fast-deep-equal'
import { useDirection, useFormControl, useForwardExpose, useVModel } from '@destyler/composition'
import { PopperRoot } from '@destyler/popper'
import { VisuallyHiddenInput } from '@destyler/visually-hidden/component'
import { createCollection } from '@destyler/collection/composition'

export type AcceptableValue = string | number | boolean | Record<string, any>
export type ArrayOrWrapped<T> = T extends any[] ? T : Array<T>

export const comboboxRootProps = {
  ...primitiveProps,
  /**
   * The controlled value of the Combobox. Can be binded-with with `v-model`.
   *
   * @default undefined
   */
  modelValue: {
    type: [String, Number, Boolean, Object, Array] as PropType<AcceptableValue | Array<AcceptableValue>>,
    required: false,
    default: undefined,
  },
  /**
   * The value of the combobox when initially rendered.
   * Use when you do not need to control the state of the Combobox
   *
   * @default undefined
   */
  defaultValue: {
    type: [String, Number, Boolean, Object, Array] as PropType<AcceptableValue | Array<AcceptableValue>>,
    required: false,
    default: undefined,
  },
  /**
   * The controlled open state of the Combobox. Can be binded-with with `v-model:open`.
   *
   * @default undefined
   */
  open: {
    type: Boolean as PropType<boolean>,
    required: false,
    default: undefined,
  },
  /**
   * The open state of the combobox when it is initially rendered.
   * Use when you do not need to control its open state.
   */
  defaultOpen: {
    type: Boolean as PropType<boolean>,
    required: false,
  },
  /**
   * The controlled search term of the Combobox.
   * Can be binded-with with `v-model:searchTerm`.
   */
  searchTerm: {
    type: String as PropType<string>,
    required: false,
  },
  /**
   * Whether multiple options can be selected or not.
   *
   * @default false
   */
  multiple: {
    type: Boolean as PropType<boolean>,
    required: false,
    default: false,
  },
  /**
   * When `true`, prevents the user from interacting with Combobox.
   *
   * @default false
   */
  disabled: {
    type: Boolean as PropType<boolean>,
    required: false,
    default: false,
  },
  /**
   * The name of the Combobox. Submitted with its owning form as part of a name/value pair.
   */
  name: {
    type: String as PropType<string>,
    required: false,
  },
  /**
   * The reading direction of the combobox when applicable.
   */
  dir: {
    type: String as PropType<Direction>,
    required: false,
  },
  /**
   * The custom filter function for filtering `ComboboxItem`.
   */
  filterFunction: {
    type: Function as PropType<(val: ArrayOrWrapped<AcceptableValue>, term: string) => ArrayOrWrapped<AcceptableValue>>,
    required: false,
  },
  /**
   * The display value of input for selected item. Does not work with `multiple`.
   */
  displayValue: {
    type: Function as PropType<(val: AcceptableValue) => string>,
    required: false,
  },
} as const

export type ComboboxRootProps = ExtractPublicPropTypes<typeof comboboxRootProps>

export const comboboxRootEmits = {
  /**
   * Event handler called when the value changes.
   */
  'update:modelValue': (_value: AcceptableValue) => true,
  /**
   * Event handler called when the open state of the combobox changes.
   */
  'update:open': (_value: boolean) => true,
  /**
   * Event handler called when the searchTerm of the combobox changes.
   */
  'update:searchTerm': (_value: string) => true,
}

export interface ComboboxRootContext<T> {
  modelValue: Ref<T | Array<T>>
  onValueChange: (val: T) => void
  searchTerm: Ref<string>
  multiple: Ref<boolean>
  disabled: Ref<boolean>
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

export const [injectComboboxRootContext, provideComboboxRootContext] = createContext<ComboboxRootContext<AcceptableValue>>('DestylerComboboxRoot')

export const ComboboxRoot = defineComponent({
  name: 'DestylerComboboxRoot',
  props: comboboxRootProps,
  emits: comboboxRootEmits,
  slots: Object as SlotsType<{
    default: (opts: {
      /**
       * Current open state
       */
      open: boolean
      /**
       * Current active value
       */
      modelValue: AcceptableValue
    }) => VNode[]
  }>,
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
    }) as Ref<AcceptableValue | AcceptableValue[]>

    const open = useVModel(props, 'open', emit, {
      defaultValue: props.defaultOpen,
      passive: (props.open === undefined) as false,
    }) as Ref<boolean>

    const selectedValue = ref<AcceptableValue>()

    const inputElement = ref<HTMLInputElement>()
    const contentElement = ref<HTMLElement>()
    const { forwardRef, currentElement: parentElement } = useForwardExpose()
    const { getItems, reactiveItems, itemMapSize } = createCollection<{ value: AcceptableValue }>('data-destyler-combobox-item')

    const isUserInputted = ref(false)

    async function onOpenChange(val: boolean) {
      open.value = val
      await nextTick()
      if (val) {
        if (modelValue.value) {
          if (Array.isArray(modelValue.value) && multiple.value)
            selectedValue.value = (getItems().find(i => (i.ref)?.dataset?.state === 'checked'))?.value
          else
            selectedValue.value = modelValue.value as AcceptableValue
        }
        inputElement.value?.focus()
        scrollSelectedValueIntoView()
      }
      else {
        isUserInputted.value = false
        resetSearchTerm()
      }
    }

    function onValueChange(val: AcceptableValue) {
      if (Array.isArray(modelValue.value) && multiple.value) {
        const index = modelValue.value.findIndex(i => isEqual(i, val))
        index === -1 ? modelValue.value.push(val) : modelValue.value.splice(index, 1)
      }
      else {
        modelValue.value = val
        onOpenChange(false)
      }
    }

    const options = ref<AcceptableValue[]>([]) as Ref<AcceptableValue[]>

    watch(() => itemMapSize.value, () => {
      options.value = getItems().map(i => i.value)
    }, { immediate: true })

    const filteredOptions = computed(() => {
      if (isUserInputted.value) {
        if (props.filterFunction)
          return props.filterFunction(options.value as ArrayOrWrapped<AcceptableValue>, searchTerm.value) as AcceptableValue[]

        const optionsWithTypeString = options.value.filter(i => typeof i === 'string') as string[]
        if (optionsWithTypeString.length)
          return optionsWithTypeString.filter(i => i.toLowerCase().includes(searchTerm.value?.toLowerCase())) as AcceptableValue[]
      }
      return options.value
    })

    function resetSearchTerm() {
      if (!multiple.value && modelValue.value && !Array.isArray(modelValue.value)) {
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

    const stringifiedModelValue = computed(() => JSON.stringify(modelValue.value))

    watch(stringifiedModelValue, async () => {
      await nextTick()
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
      contentId: '',
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
      onSelectedValueChange: val => selectedValue.value = val as AcceptableValue,
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
    return h(PopperRoot, null, {
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
                ? h(VisuallyHiddenInput, {
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
