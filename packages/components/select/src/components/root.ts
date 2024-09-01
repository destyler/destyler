import type { PropType, Ref, VNode } from 'vue'
import { computed, defineComponent, h, mergeProps, ref, toRefs } from 'vue'
import type { DataOrientation, Direction, ExtractPublicPropTypes } from '@destyler/shared'
import { createContext } from '@destyler/shared'
import { useDirection, useFormControl, useVModel } from '@destyler/composition'
import { PopperRoot } from '@destyler/popper'

import { BubbleSelect } from './bubbleSelect'

export const selectRootProps = {
  /**
   * The controlled open state of the Select. Can be bind as `v-model:open`.
   *
   * @default undefined
   */
  open: {
    type: Boolean as PropType<boolean>,
    required: false,
    default: undefined,
  },
  /**
   * The open state of the select when it is initially rendered. Use when you do not need to control its open state.
   */
  defaultOpen: {
    type: Boolean as PropType<boolean>,
    required: false,
  },
  /**
   * The controlled value of the Select. Can be bind as `v-model`.
   *
   * @default undefined
   */
  modelValue: {
    type: String as PropType<string>,
    required: false,
    default: undefined,
  },
  /**
   * The value of the select when initially rendered. Use when you do not need to control the state of the Select
   *
   * @default ""
   */
  defaultValue: {
    type: String as PropType<string>,
    required: false,
    default: '',
  },
  /**
   * The orientation of the accordion.
   *
   * @default vertical
   */
  orientation: {
    type: String as PropType<DataOrientation>,
    required: false,
    default: 'vertical',
  },
  /**
   * The reading direction of the select when applicable.
   */
  dir: {
    type: String as PropType<Direction>,
    required: false,
  },
  /**
   * The name of the Select. Submitted with its owning form as part of a name/value pair.
   */
  name: {
    type: String as PropType<string>,
    required: false,
  },
  /**
   * Native html input `autocomplete` attribute.
   */
  autocomplete: {
    type: String as PropType<string>,
    required: false,
  },
  /**
   * When `true`, prevents the user from interacting with Select
   */
  disabled: {
    type: Boolean as PropType<boolean>,
    required: false,
    default: false,
  },
  /**
   * When `true`, indicates that the user must select a value before the owning form can be submitted.
   *
   * @default false
   */
  required: {
    type: Boolean as PropType<boolean>,
    required: false,
    default: false,
  },
} as const

export type SelectRootProps = ExtractPublicPropTypes<typeof selectRootProps>

export const selectRootEmits = {
  /**
   * Event handler called when the value changes.
   */
  'update:modelValue': (_value: string) => true,
  /**
   * Event handler called when the open state of the context menu changes.
   */
  'update:open': (_open: boolean) => true,
}

export interface SelectRootContext {
  triggerElement: Ref<HTMLElement | undefined>
  onTriggerChange: (node: HTMLElement | undefined) => void
  valueElement: Ref<HTMLElement | undefined>
  onValueElementChange: (node: HTMLElement) => void
  valueElementHasChildren: Ref<boolean>
  onValueElementHasChildrenChange: (hasChildren: boolean) => void
  contentId: string
  modelValue?: Ref<string>
  onValueChange: (value: string) => void
  open: Ref<boolean>
  required?: Ref<boolean>
  onOpenChange: (open: boolean) => void
  dir: Ref<Direction>
  triggerPointerDownPosRef: Ref<{ x: number, y: number } | null>
  disabled?: Ref<boolean>
}

export const [injectSelectRootContext, provideSelectRootContext]
  = createContext<SelectRootContext>('DestylerSelectRoot')

export interface SelectNativeOptionsContext {
  onNativeOptionAdd: (option: VNode) => void
  onNativeOptionRemove: (option: VNode) => void
}

export const [injectSelectNativeOptionsContext, provideSelectNativeOptionsContext]
  = createContext<SelectNativeOptionsContext>('DestylerSelectRoot')

export const SelectRoot = defineComponent({
  name: 'DestylerSelectRoot',
  props: selectRootProps,
  emits: selectRootEmits,
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
      contentId: '',
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
    return h(PopperRoot, null, () => [
      this.$slots.default?.(),
      this.isFormControl
        ? h(BubbleSelect, mergeProps(this.$attrs, {
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
        }), () => [
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
