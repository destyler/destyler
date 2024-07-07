import type { PropType, Ref, SlotsType, VNode } from 'vue'
import { computed, defineComponent, h, mergeProps, onMounted, toRefs, withDirectives } from 'vue'
import { Primitive } from '@destyler/primitive'
import type { ExtractPublicPropTypes } from '@destyler/shared'
import { createContext } from '@destyler/shared'
import { CollectionSlot } from '@destyler/collection'
import { PopperContent, popperContentProps } from '@destyler/popper'
import { useBodyScrollLock, useForwardExpose, useForwardProps, useHideOthers } from '@destyler/composition'
import { DismissableLayer, dismissableLayerProps } from '@destyler/dismissable-layer'
import { dismissableLayerEmits } from '@destyler/dismissable-layer/dist/component'

import { BindOnceDirective } from '@destyler/directives'
import { injectComboboxRootContext } from './root'

const SIDE_OPTIONS = ['top', 'right', 'bottom', 'left'] as const
const ALIGN_OPTIONS = ['start', 'center', 'end'] as const

export type Side = (typeof SIDE_OPTIONS)[number]
export type Align = (typeof ALIGN_OPTIONS)[number]

export const comboboxContentImplProps = {
  ...dismissableLayerProps,
  ...popperContentProps,
  position: {
    type: String as PropType<'inline' | 'popper'>,
    required: false,
    default: 'inline',
  },
  bodyLock: {
    type: Boolean as PropType<boolean>,
    required: false,
  },
  dismissable: {
    type: Boolean as PropType<boolean>,
    required: false,
    default: true,
  },
} as const

export type ComboboxContentImplProps = ExtractPublicPropTypes<typeof comboboxContentImplProps>

export const comboboxCOntentImplEmits = {
  ...dismissableLayerEmits,
}

export const [injectComboboxContentContext, provideComboboxContentContext] = createContext<{ position: Ref<'inline' | 'popper'> }>('DestylerComboboxContent')

export const ComboboxContentImpl = defineComponent({
  name: 'DestylerComboboxContentImpl',
  props: comboboxContentImplProps,
  emits: comboboxCOntentImplEmits,
  slots: Object as SlotsType<{
    default: () => VNode[]
  }>,
  setup(props) {
    const { position } = toRefs(props)
    const rootContext = injectComboboxRootContext()

    useBodyScrollLock(props.bodyLock)

    const { forwardRef, currentElement } = useForwardExpose()
    useHideOthers(currentElement)

    const pickedProps = computed(() => {
      if (props.position === 'popper')
        return props
      else return {}
    })

    const forwardedProps = useForwardProps(pickedProps.value)

    function handleLeave() {
      rootContext.onSelectedValueChange('')
    }

    onMounted(() => {
      rootContext.onContentElementChange(currentElement.value)
    })

    const popperStyle = {
      'boxSizing': 'border-box',
      '--destyler_combobox_content_transform_origin': 'var(--destyler_popper_transform_origin)',
      '--destyler_combobox_content_available_width': 'var(--destyler_popper_available_width)',
      '--destyler_combobox_content_available_height': 'var(--destyler_popper_available_height)',
      '--destyler_combobox_trigger_width': 'var(--destyler_popper_anchor_width)',
      '--destyler_combobox_trigger_height': 'var(--destyler_popper_anchor_height)',
    }

    provideComboboxContentContext({ position })

    return {
      rootContext,
      popperStyle,
      forwardedProps,
      forwardRef,
      handleLeave,
    }
  },
  render() {
    return h(CollectionSlot, null, {
      default: () => {
        return [
          this.$props.dismissable
            ? h(DismissableLayer, mergeProps(this.$attrs, this.forwardedProps, {
              asChild: true,
              disableOutsidePointerEvents: this.$props.disableOutsidePointerEvents,
              onDismiss: () => {
                this.rootContext.onOpenChange(false)
              },
              onFocusOutside: (event: any) => {
                if (this.rootContext.parentElement.value?.contains(event.target as Node))
                  event.preventDefault()
                this.$emit('focusOutside', event)
              },
              onInteractOutside: (event: any) => {
                this.$emit('interactOutside', event)
              },
              onEscapeKeyDown: (event: any) => {
                this.$emit('escapeKeyDown', event)
              },
              onPointerDownOutside: (event: any) => {
                if (this.rootContext.parentElement.value?.contains(event.target as Node))
                  event.preventDefault()
                this.$emit('pointerDownOutside', event)
              },
            }), {
              default: () => {
                return withDirectives(h(this.$props.position === 'popper' ? PopperContent : Primitive, {
                  'ref': (el: any) => this.forwardRef(el),
                  'role': 'listbox',
                  'data-state': this.rootContext.open.value ? 'open' : 'closed',
                  'style': {
                    display: 'flex',
                    flexDirection: 'column',
                    outline: 'none',
                    ...(this.$props.position === 'popper' ? this.popperStyle : {}),
                  },
                  'onPointerleave': () => {
                    this.handleLeave()
                  },
                }, {
                  default: () => this.$slots.default?.(),
                }), [
                  [BindOnceDirective, { id: this.rootContext.contentId }],
                ])
              },
            })
            : withDirectives(h(this.$props.position === 'popper' ? PopperContent : Primitive, {
              'ref': (el: any) => this.forwardRef(el),
              'role': 'listbox',
              'data-state': this.rootContext.open.value ? 'open' : 'closed',
              'style': {
                display: 'flex',
                flexDirection: 'column',
                outline: 'none',
                ...(this.$props.position === 'popper' ? this.popperStyle : {}),
              },
              'onPointerleave': () => {
                this.handleLeave()
              },
            }, {
              default: () => this.$slots.default?.(),
            }), [
              [BindOnceDirective, { id: this.rootContext.contentId }],
            ]),
        ]
      },
    })
  },
})
