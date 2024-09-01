import type { PropType, Ref, SlotsType, VNode } from 'vue'
import { defineComponent, h, ref, toRefs } from 'vue'
import { Primitive, primitiveProps } from '@destyler/primitive'
import { createContext } from '@destyler/shared'
import type { Direction, ExtractPublicPropTypes } from '@destyler/shared'
import { useFocusWithin } from '@vueuse/core'
import { useArrowNavigation, useDirection, useFormControl, useForwardExpose, useVModel } from '@destyler/composition'
import { CollectionSlot } from '@destyler/collection'
import { createCollection } from '@destyler/collection/composition'
import { VisuallyHiddenInput } from '@destyler/visually-hidden/component'

export const dynamicRootProps = {
  ...primitiveProps,
  /**
   * The controlled value of the tags input. Can be bind as `v-model`.
   *
   * @default () => []
   */
  modelValue: {
    type: Array as PropType<Array<string>>,
    required: false,
    default: () => [],
  },
  /**
   * The value of the tags that should be added.
   * Use when you do not need to control the state of the tags input
   */
  defaultValue: {
    type: Array as PropType<Array<string>>,
    required: false,
  },
  /**
   * When `true`, allow adding tags on paste.
   * Work in conjunction with delimiter prop.
   *
   * @default false
   */
  addOnPaste: {
    type: Boolean as PropType<boolean>,
    required: false,
    default: false,
  },
  /**
   * When `true` allow adding tags on tab keydown
   *
   * @default false
   */
  addOnTab: {
    type: Boolean as PropType<boolean>,
    required: false,
    default: false,
  },
  /**
   * When `true` allow adding tags blur input
   *
   * @default false
   */
  addOnBlur: {
    type: Boolean as PropType<boolean>,
    required: false,
    default: false,
  },
  /**
   * When `true`, allow duplicated tags.
   *
   * @default false
   */
  duplicate: {
    type: Boolean as PropType<boolean>,
    required: false,
    default: false,
  },
  /**
   * When `true`, prevents the user from interacting with the tags input.
   *
   * @default false
   */
  disabled: {
    type: Boolean as PropType<boolean>,
    required: false,
    default: false,
  },
  /**
   * The character to trigger the addition of a new tag.
   * Also used to split tags for `@paste` event
   *
   * @default ,
   */
  delimiter: {
    type: String as PropType<string>,
    required: false,
    default: ',',
  },
  /**
   s* The reading direction of the combobox when applicable.
   */
  dir: {
    type: String as PropType<Direction>,
    required: false,
  },
  /**
   * Maximum number of tags.
   *
   * @default 0
   */
  max: {
    type: Number as PropType<number>,
    required: false,
    default: 0,
  },
  /**
   * When `true`, indicates that the user must add the
   * tags input before the owning form can be submitted.
   *
   * @default false
   */
  required: {
    type: Boolean as PropType<boolean>,
    required: false,
    default: false,
  },
  /**
   * The name of the tags input submitted with its
   * owning form as part of a name/value pair.
   */
  name: {
    type: String as PropType<string>,
    required: false,
  },
  /**
   * The unique identifier of the machine.
   */
  id: {
    type: String as PropType<string>,
    required: false,
  },
} as const

export type DynamicRootProps = ExtractPublicPropTypes<typeof dynamicRootProps>

export const dynamicRootEmits = {
  /**
   * Event handler called when the value is invalid
   */
  'invalid': (_payload: string) => true,
  /**
   * Event handler called when the value changes
   */
  'update:modelValue': (_value: Array<string>) => true,
}

export interface DynamicRootContext {
  modelValue: Ref<Array<string>>
  onAddValue: (payload: string) => boolean
  onRemoveValue: (index: number) => void
  onInputKeydown: (event: KeyboardEvent) => void
  selectedElement: Ref<HTMLElement | undefined>
  isInvalidInput: Ref<boolean>
  addOnPaste: Ref<boolean>
  addOnTab: Ref<boolean>
  addOnBlur: Ref<boolean>
  disabled: Ref<boolean>
  delimiter: Ref<string>
  dir: Ref<Direction>
  max: Ref<number>
  id: Ref<string | undefined> | undefined
}

export const [injectDynamicRootContext, provideDynamicRootContext]
  = createContext<DynamicRootContext>('DestylerDynamicRoot')

export const DynamicRoot = defineComponent({
  name: 'DestylerDynamicRoot',
  props: dynamicRootProps,
  emits: dynamicRootEmits,
  slots: Object as SlotsType<{
    default: (opts: {
      /**
       * Current input values
       */
      modelValue: string[]
    }) => VNode[]
  }>,
  setup(props, { emit }) {
    const { addOnPaste, disabled, delimiter, max, id, dir: propDir, addOnBlur, addOnTab } = toRefs(props)
    const dir = useDirection(propDir)

    const modelValue = useVModel(props, 'modelValue', emit, {
      defaultValue: props.defaultValue,
      passive: true,
      deep: true,
    }) as Ref<Array<string>>

    const { forwardRef, currentElement } = useForwardExpose()
    const { focused } = useFocusWithin(currentElement)
    const isFormControl = useFormControl(currentElement)

    const { getItems } = createCollection()

    const selectedElement = ref<HTMLElement>()
    const isInvalidInput = ref(false)

    provideDynamicRootContext({
      modelValue,
      onAddValue: (payload) => {
        if ((modelValue.value.length >= max.value) && !!max.value) {
          emit('invalid', payload)
          return false
        }

        if (props.duplicate) {
          modelValue.value.push(payload)
          return true
        }
        else {
          const exist = modelValue.value.includes(payload)
          if (!exist) {
            modelValue.value.push(payload)
            return true
          }
          else {
            isInvalidInput.value = true
          }
        }
        emit('invalid', payload)
        return false
      },
      onRemoveValue: (index) => {
        if (index !== -1)
          modelValue.value.splice(index, 1)
      },
      onInputKeydown: (event) => {
        const target = event.target as HTMLInputElement
        const collection = getItems().map(i => i.ref).filter(i => i.dataset.disabled !== '')
        if (!collection.length)
          return
        const lastTag = collection.at(-1)
        switch (event.key) {
          case 'Delete':
          case 'Backspace': {
            if (target.selectionStart !== 0 || target.selectionEnd !== 0)
              break

            if (selectedElement.value) {
              const index = collection.findIndex(i => i === selectedElement.value)
              modelValue.value.splice(index, 1)
              selectedElement.value = selectedElement.value === lastTag ? collection.at(index - 1) : collection.at(index + 1)
              event.preventDefault()
            }
            else if (event.key === 'Backspace') {
              selectedElement.value = lastTag
              event.preventDefault()
            }
            break
          }
          case 'Home':
          case 'End':
          case 'ArrowRight':
          case 'ArrowLeft': {
            const isArrowRight = (event.key === 'ArrowRight' && dir.value === 'ltr') || (event.key === 'ArrowLeft' && dir.value === 'rtl')
            const isArrowLeft = !isArrowRight
            // only focus on tags when cursor is at the first position
            if (target.selectionStart !== 0 || target.selectionEnd !== 0)
              break

            // if you press ArrowLeft, then we last tag
            if (isArrowLeft && !selectedElement.value) {
              selectedElement.value = lastTag
              event.preventDefault()
            }
            // if you press ArrowRight on last tag, you deselect
            else if (isArrowRight && lastTag && selectedElement.value === lastTag) {
              selectedElement.value = undefined
              event.preventDefault()
            }
            else if (selectedElement.value) {
              const el = useArrowNavigation(event, selectedElement.value, undefined, {
                itemsArray: collection,
                loop: false,
                dir: dir.value,
              })
              if (el)
                selectedElement.value = el
              event.preventDefault()
            }
            break
          }
          case 'ArrowUp':
          case 'ArrowDown': {
            if (selectedElement.value)
              event.preventDefault()
            break
          }
          default: {
            selectedElement.value = undefined
          }
        }
      },
      selectedElement,
      isInvalidInput,
      addOnPaste,
      addOnBlur,
      addOnTab,
      dir,
      disabled,
      delimiter,
      max,
      id,
    })

    return {
      forwardRef,
      dir,
      isInvalidInput,
      disabled,
      focused,
      modelValue,
      isFormControl,
    }
  },
  render() {
    return h(CollectionSlot, {}, () => h(Primitive, {
      'ref': (el: any) => this.forwardRef(el),
      'dir': this.dir,
      'as': this.$props.as,
      'asChild': this.$props.asChild,
      'data-invalid': this.isInvalidInput ? '' : undefined,
      'data-disabled': this.disabled ? '' : undefined,
      'data-focused': this.focused ? '' : undefined,
    }, () => [
      this.$slots.default?.({ modelValue: this.modelValue }),
      this.isFormControl && this.$props.name
        ? h(VisuallyHiddenInput, {
          name: this.$props.name,
          value: this.modelValue,
          required: this.required,
          disabled: this.disabled,
        })
        : null,
    ]))
  },
})
