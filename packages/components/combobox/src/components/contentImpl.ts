import type { Component, PropType, Ref } from 'vue'
import { computed, defineComponent, h, mergeProps, onMounted, toRefs, withDirectives } from 'vue'
import { type AsTag, DestylerPrimitive } from '@destyler/primitive'
import type { ExtractPublicPropTypes } from '@destyler/shared'
import { createContext } from '@destyler/shared'
import { DestylerCollectionSlot } from '@destyler/collection'
import { DestylerPopperContent } from '@destyler/popper'
import { useBodyScrollLock, useForwardExpose, useForwardProps, useHideOthers } from '@destyler/composition'
import { DestylerDismissableLayer } from '@destyler/dismissable-layer'

import { BindOnceDirective } from '@destyler/directives'
import { injectComboboxRootContext } from './root'

const SIDE_OPTIONS = ['top', 'right', 'bottom', 'left'] as const
const ALIGN_OPTIONS = ['start', 'center', 'end'] as const

export type Side = (typeof SIDE_OPTIONS)[number]
export type Align = (typeof ALIGN_OPTIONS)[number]

export const destylerComboboxContentImplProps = {
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
  side: {
    type: String as PropType<Side>,
    required: false,
    default: 'bottom',
  },
  sideOffset: {
    type: Number as PropType<number>,
    required: false,
    default: 0,
  },
  align: {
    type: String as PropType<Align>,
    required: false,
    default: 'center',
  },
  alignOffset: {
    type: Number as PropType<number>,
    required: false,
    default: 0,
  },
  avoidCollisions: {
    type: Boolean as PropType<boolean>,
    required: false,
    default: true,
  },
  collisionBoundary: {
    type: [Object, Array, null] as PropType<Element | null | Array<Element | null>>,
    required: false,
    default: () => [],
  },
  collisionPadding: {
    type: [Number, Object] as PropType<number | Partial<Record<Side, number>>>,
    required: false,
    default: 0,
  },
  arrowPadding: {
    type: Number as PropType<number>,
    required: false,
    default: 0,
  },
  sticky: {
    type: String as PropType<'partial' | 'always'>,
    required: false,
    default: 'partial',
  },
  hideWhenDetached: {
    type: Boolean as PropType<boolean>,
    required: false,
    default: false,
  },
  updatePositionStrategy: {
    type: String as PropType<'optimized' | 'always'>,
    required: false,
    default: 'optimized',
  },
  onPlaced: {
    type: Function as PropType<() => void>,
    required: false,
  },
  prioritizePosition: {
    type: Boolean as PropType<boolean>,
    required: false,
    default: false,
  },
  disableOutsidePointerEvents: {
    type: Boolean as PropType<boolean>,
    required: false,
    default: false,
  },
  isDismissable: {
    type: Boolean as PropType<boolean>,
    required: false,
    default: true,
  },
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

export type DestylerComboboxContentImplProps = ExtractPublicPropTypes<typeof destylerComboboxContentImplProps>

export const [injectComboboxContentContext, provideComboboxContentContext] = createContext<{ position: Ref<'inline' | 'popper'> }>('DestylerComboboxContent')

export const DestylerComboboxContentImpl = defineComponent({
  name: 'DestylerComboboxContentImpl',
  props: destylerComboboxContentImplProps,
  emits: ['escapeKeyDown', 'pointerDownOutside', 'focusOutside', 'interactOutside', 'dismiss'],
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
    return h(DestylerCollectionSlot, null, {
      default: () => {
        return [
          this.$props.dismissable
            ? h(DestylerDismissableLayer, mergeProps(this.$attrs, this.forwardedProps, {
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
                return withDirectives(h(this.$props.position === 'popper' ? DestylerPopperContent : DestylerPrimitive, {
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
            : withDirectives(h(this.$props.position === 'popper' ? DestylerPopperContent : DestylerPrimitive, {
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
