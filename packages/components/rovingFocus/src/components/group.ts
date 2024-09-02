import type { ExtractPropTypes, PropType, Ref } from 'vue'
import { defineComponent, h, ref, toRefs } from 'vue'
import { Primitive, primitiveProps } from '@destyler/primitive'
import type { Direction, Orientation } from '@destyler/shared'
import { createContext, focusFirst } from '@destyler/shared'
import { useCollection, useDirection, useForwardExpose, useVModel } from '@destyler/composition'

import { ENTRY_FOCUS, EVENT_OPTIONS } from '../utils'

export const rovingFocusGroupProps = {
  ...primitiveProps,
  /**
   * The orientation of the group.
   * Mainly so arrow navigation is done accordingly (left & right vs. up & down)
   *
   * @default undefined
   */
  orientation: {
    type: String as PropType<Orientation>,
    required: false,
    default: undefined,
  },
  /**
   * The direction of between items.
   */
  dir: {
    type: String as PropType<Direction>,
    required: false,
  },
  /**
   * Whether keyboard should loop around
   * @default false
   */
  loop: {
    type: Boolean as PropType<boolean>,
    required: false,
    default: false,
  },
  currentTabStopId: {
    type: String as PropType<string>,
    required: false,
  },
  defaultCurrentTabStopId: {
    type: String as PropType<string>,
    required: false,
  },
} as const

export type RovingFocusGroupProps = ExtractPropTypes<typeof rovingFocusGroupProps>

export const rovingFocusGroupEmits = {
  'entryFocus': (_event: Event) => true,
  'update:currentTabStopId': (_value: string | null | undefined) => true,
}

export interface RovingContext {
  orientation: Ref<Orientation | undefined>
  dir: Ref<Direction>
  loop: Ref<boolean>
  currentTabStopId: Ref<string | null | undefined>
  onItemFocus: (tabStopId: string) => void
  onItemShiftTab: () => void
  onFocusableItemAdd: () => void
  onFocusableItemRemove: () => void
}

export const [injectRovingFocusGroupContext, provideRovingFocusGroupContext] = createContext<RovingContext>('DestylerRovingFocusGroup')

export const RovingFocusGroup = defineComponent({
  name: 'DestylerRovingFocusGroup',
  props: rovingFocusGroupProps,
  emits: rovingFocusGroupEmits,
  setup(props, { emit }) {
    const { loop, orientation, dir: propDir } = toRefs(props)
    const dir = useDirection(propDir)
    const currentTabStopId = useVModel(props, 'currentTabStopId', emit, {
      defaultValue: props.defaultCurrentTabStopId,
      passive: (props.currentTabStopId === undefined) as false,
    })
    const isTabbingBackOut = ref(false)
    const isClickFocus = ref(false)
    const focusableItemsCount = ref(0)

    const { forwardRef, currentElement } = useForwardExpose()
    const { createCollection } = useCollection('rovingFocus')
    const collections = createCollection(currentElement)

    function handleFocus(event: FocusEvent) {
      const isKeyboardFocus = !isClickFocus.value

      if (
        event.currentTarget
        && event.target === event.currentTarget
        && isKeyboardFocus
        && !isTabbingBackOut.value
      ) {
        const entryFocusEvent = new CustomEvent(ENTRY_FOCUS, EVENT_OPTIONS)
        event.currentTarget.dispatchEvent(entryFocusEvent)
        emit('entryFocus', entryFocusEvent)

        if (!entryFocusEvent.defaultPrevented) {
          const items = collections.value
          const activeItem = items.find(item => item.getAttribute('data-active') === 'true')
          const currentItem = items.find(
            item => item.id === currentTabStopId.value,
          )
          const candidateItems = [activeItem, currentItem, ...items].filter(
            Boolean,
          ) as typeof items
          focusFirst(candidateItems)
        }
      }

      isClickFocus.value = false
    }

    provideRovingFocusGroupContext({
      loop,
      dir,
      orientation,
      currentTabStopId,
      onItemFocus: (tabStopId) => {
        currentTabStopId.value = tabStopId
      },
      onItemShiftTab: () => {
        isTabbingBackOut.value = true
      },
      onFocusableItemAdd: () => {
        focusableItemsCount.value++
      },
      onFocusableItemRemove: () => {
        focusableItemsCount.value--
      },
    })

    return {
      forwardRef,
      dir,
      isClickFocus,
      isTabbingBackOut,
      focusableItemsCount,
      handleFocus,
    }
  },
  render() {
    return h(Primitive, {
      'ref': this.forwardRef,
      'tabindex': this.isTabbingBackOut || this.focusableItemsCount === 0 ? -1 : 0,
      'data-orientation': this.$props.orientation,
      'as': this.$props.as,
      'asChild': this.$props.asChild,
      'dir': this.dir,
      'style': {
        outline: 'none',
      },
      'onMousedown': () => {
        this.isClickFocus = true
      },
      'onFocus': (event: any) => {
        this.handleFocus(event)
      },
      'onBlur': () => {
        this.isTabbingBackOut = false
      },
    }, () => this.$slots.default?.())
  },
})
