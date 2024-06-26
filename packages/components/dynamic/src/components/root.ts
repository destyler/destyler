import type { Component, PropType, Ref } from 'vue'
import { defineComponent, h, ref, toRefs } from 'vue'
import type { AsTag } from '@destyler/primitive'
import { DestylerPrimitive } from '@destyler/primitive'
import { createContext } from '@destyler/shared'
import type { Direction, ExtractPublicPropTypes } from '@destyler/shared'
import { useFocusWithin } from '@vueuse/core'
import { useArrowNavigation, useDirection, useFormControl, useForwardExpose, useVModel } from '@destyler/composition'
import { DestylerCollectionSlot, createCollection } from '@destyler/collection'
import { DestylerVisuallyhiddenInput } from '@destyler/visually-hidden/dist/component'

export const destylerDynamicRootProps = {
  as: {
    type: [String, Object] as PropType<AsTag | Component>,
    required: false,
    default: 'div',
  },
  asChild: {
    type: Boolean as PropType<boolean>,
    required: false,
    default: false,
  },
  modelValue: {
    type: Array as PropType<Array<string>>,
    required: false,
    default: () => [],
  },
  defaultValue: {
    type: Array as PropType<Array<string>>,
    required: false,
  },
  addOnPaste: {
    type: Boolean as PropType<boolean>,
    required: false,
  },
  duplicate: {
    type: Boolean as PropType<boolean>,
    required: false,
  },
  disabled: {
    type: Boolean as PropType<boolean>,
    required: false,
  },
  delimiter: {
    type: String as PropType<string>,
    required: false,
    default: ',',
  },
  dir: {
    type: String as PropType<Direction>,
    required: false,
  },
  max: {
    type: Number as PropType<number>,
    required: false,
    default: 0,
  },
  required: {
    type: Boolean as PropType<boolean>,
    required: false,
  },
  name: {
    type: String as PropType<string>,
    required: false,
  },
  id: {
    type: String as PropType<string>,
    required: false,
  },
} as const

export type DestylerDynamicRootProps = ExtractPublicPropTypes<typeof destylerDynamicRootProps>

export interface DynamicRootContext {
  modelValue: Ref<Array<string>>
  onAddValue: (payload: string) => boolean
  onRemoveValue: (index: number) => void
  onInputKeydown: (event: KeyboardEvent) => void
  selectedElement: Ref<HTMLElement | undefined>
  isInvalidInput: Ref<boolean>
  addOnPaste: Ref<boolean | undefined>
  disabled: Ref<boolean | undefined>
  delimiter: Ref<string>
  dir: Ref<Direction>
  max: Ref<number>
  id: Ref<string | undefined> | undefined
}

export const [injectDynamicRootContext, provideDynamicRootContext]
  = createContext<DynamicRootContext>('DestylerDynamicRoot')

export const DestylerDynamicRoot = defineComponent({
  name: 'DestylerDynamicRoot',
  props: destylerDynamicRootProps,
  emits: ['update:modelValue', 'invalid'],
  setup(props, { emit }) {
    const { addOnPaste, disabled, delimiter, max, id, dir: propDir } = toRefs(props)
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
            if (target.selectionStart !== 0 || target.selectionEnd !== 0)
              break

            if (isArrowLeft && !selectedElement.value) {
              selectedElement.value = lastTag
              event.preventDefault()
            }
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
    return h(DestylerCollectionSlot, {}, () => h(DestylerPrimitive, {
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
        ? h(DestylerVisuallyhiddenInput, {
          name: this.$props.name,
          value: this.modelValue,
          required: this.required,
          disabled: this.disabled,
        })
        : null,
    ]))
  },
})
