import type { PropType, Ref, VNode } from 'vue'
import { computed, defineComponent, h, mergeProps, ref, toRefs } from 'vue'
import type { DataOrientation, Direction, ExtractPublicPropTypes } from '@destyler/shared'
import { createContext } from '@destyler/shared'
import { useDirection, useFormControl, useId, useVModel } from '@destyler/composition'
import { DestylerPopperRoot } from '@destyler/popper'

import { DestylerBubbleSelect } from './bubbleSelect'

export const destylerSelectRootProps = {
  open: {
    type: Boolean as PropType<boolean>,
    required: false,
    default: undefined,
  },
  defaultOpen: {
    type: Boolean as PropType<boolean>,
    required: false,
    default: '',
  },
  modelValue: {
    type: String as PropType<string>,
    required: false,
    default: undefined,
  },
  defaultValue: {
    type: String as PropType<string>,
    required: false,
  },
  orientation: {
    type: String as PropType<DataOrientation>,
    required: false,
    default: 'vertical',
  },
  dir: {
    type: String as PropType<Direction>,
    required: false,
  },
  name: {
    type: String as PropType<string>,
    required: false,
  },
  autocomplete: {
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
}

export type DestylerSelectRootProps = ExtractPublicPropTypes<typeof destylerSelectRootProps>

export interface SelectRootContext {
  triggerElement: Ref<HTMLElement | undefined>
  onTriggerChange(node: HTMLElement | undefined): void
  valueElement: Ref<HTMLElement | undefined>
  onValueElementChange(node: HTMLElement): void
  valueElementHasChildren: Ref<boolean>
  onValueElementHasChildrenChange(hasChildren: boolean): void
  contentId: string
  modelValue?: Ref<string>
  onValueChange(value: string): void
  open: Ref<boolean>
  required?: Ref<boolean | undefined>
  onOpenChange(open: boolean): void
  dir: Ref<Direction>
  triggerPointerDownPosRef: Ref<{ x: number, y: number } | null>
  disabled?: Ref<boolean | undefined>
}

export const [injectSelectRootContext, provideSelectRootContext]
  = createContext<SelectRootContext>('DestylerSelectRoot')

export interface SelectNativeOptionsContext {
  onNativeOptionAdd(option: VNode): void
  onNativeOptionRemove(option: VNode): void
}

export const [injectSelectNativeOptionsContext, provideSelectNativeOptionsContext]
  = createContext<SelectNativeOptionsContext>('DestylerSelectRoot')

export const DestylerSelectRoot = defineComponent({
  name: 'DestylerSelectRoot',
  props: destylerSelectRootProps,
  emits: ['update:modelValue', 'update:open'],
  setup(props, { emit }) {
    const modelValue = useVModel(props, 'modelValue', emit, {
      defaultValue: props.defaultValue,
      passive: (props.modelValue === undefined) as false,
    }) as Ref<string>

    const open = useVModel(props, 'open', emit, {
      defaultValue: props.defaultOpen,
      passive: (props.open === undefined) as false,
    }) as Ref<boolean>

    const triggerElement = ref<HTMLElement>()
    const valueElement = ref<HTMLElement>()
    const triggerPointerDownPosRef = ref({
      x: 0,
      y: 0,
    })
    const valueElementHasChildren = ref(false)

    const { required, disabled, dir: propDir } = toRefs(props)
    const dir = useDirection(propDir)
    provideSelectRootContext({
      triggerElement,
      onTriggerChange: (node) => {
        triggerElement.value = node
      },
      valueElement,
      onValueElementChange: (node) => {
        valueElement.value = node
      },
      valueElementHasChildren,
      onValueElementHasChildrenChange: (hasChildren) => {
        valueElementHasChildren.value = hasChildren
      },
      contentId: useId(),
      modelValue,
      onValueChange: (value) => {
        modelValue.value = value
      },
      open,
      required,
      onOpenChange: (value) => {
        open.value = value
      },
      dir,
      triggerPointerDownPosRef,
      disabled,
    })

    const isFormControl = useFormControl(triggerElement)
    const nativeOptionsSet = ref<Set<VNode>>(new Set())

    const nativeSelectKey = computed(() => {
      return Array.from(nativeOptionsSet.value)
        .map(option => option.props?.value)
        .join(';')
    })

    provideSelectNativeOptionsContext({
      onNativeOptionAdd: (option) => {
        nativeOptionsSet.value.add(option)
      },
      onNativeOptionRemove: (option) => {
        nativeOptionsSet.value.delete(option)
      },
    })

    return {
      isFormControl,
      nativeSelectKey,
      nativeOptionsSet,
      required,
      modelValue,
    }
  },
  render() {
    return h(DestylerPopperRoot, {}, [
      this.$slots.default?.(),
      this.isFormControl
        ? h(DestylerBubbleSelect, mergeProps(this.$attrs, {
          'key': this.nativeSelectKey,
          'aria-hidden': '',
          'tabindex': '-1',
          'required': this.required,
          'name': this.$props.name,
          'autocomplete': this.$props.autocomplete,
          'value': this.modelValue,
          'onChange': (event: any) => {
            this.modelValue = event.target.value
          },
        }), [
          this.modelValue === undefined ? h('option', { value: '' }) : null,
          Array.from(this.nativeOptionsSet).map((option) => {
            return h(option, mergeProps(option.props!, {
              key: option.key ?? '',
              value: option.props?.value,
            }))
          }),
        ])
        : null,
    ])
  },
})
