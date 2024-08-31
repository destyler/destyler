import type { PropType, Ref } from 'vue'
import { computed, defineComponent, h, mergeProps, onMounted, toRefs, withDirectives } from 'vue'
import { Primitive } from '@destyler/primitive'
import type { ExtractPublicPropTypes } from '@destyler/shared'
import { createContext } from '@destyler/shared'
import { CollectionSlot } from '@destyler/collection'
import { PopperContent, popperContentProps } from '@destyler/popper'
import { useBodyScrollLock, useForwardExpose, useForwardProps, useHideOthers } from '@destyler/composition'
import { DismissableLayer, dismissableLayerProps } from '@destyler/dismissable-layer'
import { dismissableLayerEmits } from '@destyler/dismissable-layer/component'

import { BindOnceDirective } from '@destyler/directives'
import { injectComboboxRootContext } from './root'

const SIDE_OPTIONS = ['top', 'right', 'bottom', 'left'] as const
const ALIGN_OPTIONS = ['start', 'center', 'end'] as const

export type Side = (typeof SIDE_OPTIONS)[number]
export type Align = (typeof ALIGN_OPTIONS)[number]

export const comboboxContentImplProps = {
  ...dismissableLayerProps,
  ...popperContentProps,
  /**
   * @default inline
   */
  position: {
    type: String as PropType<'inline' | 'popper'>,
    required: false,
    default: 'inline',
  },
  /**
   * @default -
   */
  bodyLock: {
    type: Boolean as PropType<boolean>,
    required: false,
  },
  /**
   * @default true
   */
  dismissable: {
    type: Boolean as PropType<boolean>,
    required: false,
    default: true,
  },
} as const

export type ComboboxContentImplProps = ExtractPublicPropTypes<typeof comboboxContentImplProps>

export const comboboxContentImplEmits = {
  ...dismissableLayerEmits,
}

export const [injectComboboxContentContext, provideComboboxContentContext] = createContext<{ position: Ref<'inline' | 'popper'> }>('DestylerComboboxContent')

export const ComboboxContentImpl = defineComponent({
  name: 'DestylerComboboxContentImpl',
  props: comboboxContentImplProps,
  emits: comboboxContentImplEmits,
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
      '--destyler-combobox-content-transform-origin': 'var(--destyler-popper-transform-origin)',
      '--destyler-combobox-content-available-width': 'var(--destyler-popper-available-width)',
      '--destyler-combobox-content-available-height': 'var(--destyler-popper-available-height)',
      '--destyler-combobox-trigger-width': 'var(--destyler-popper-anchor-width)',
      '--destyler-combobox-trigger-height': 'var(--destyler-popper-anchor-height)',
    }

    provideComboboxContentContext({ position })

    return {
      rootContext,
      popperStyle,
      forwardedProps,
      pickedProps,
      forwardRef,
      handleLeave,
    }
  },
  render() {
    return h(CollectionSlot, null, {
      default: () => {
        return [
          this.$props.dismissable
            ? h(DismissableLayer, {
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
            }, {
              default: () => {
                return withDirectives(h(this.$props.position === 'popper' ? PopperContent : Primitive, mergeProps(this.$attrs, this.forwardedProps, {
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
                }), {
                  default: () => this.$slots.default?.(),
                }), [
                  [BindOnceDirective, { id: this.rootContext.contentId }],
                ])
              },
            })
            : withDirectives(h(this.$props.position === 'popper' ? PopperContent : Primitive, mergeProps(this.$attrs, this.pickedProps, {
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
            }), {
              default: () => this.$slots.default?.(),
            }), [
              [BindOnceDirective, { id: this.rootContext.contentId }],
            ]),
        ]
      },
    })
  },
})
