import type { PropType } from 'vue'
import { defineComponent, h, ref, toValue } from 'vue'
import { Primitive, primitiveProps } from '@destyler/primitive'
import type { ExtractPublicPropTypes } from '@destyler/shared'
import { useForwardExpose } from '@destyler/composition'

export const draggableProps = {
  ...primitiveProps,
  /**
   * The x-axis position of the draggable element.
   *
   * @default 0
   */
  x: {
    type: Number as PropType<number>,
    required: false,
    default: 0,
  },
  /**
   * The y-axis position of the draggable element.
   *
   * @default 0
   */
  y: {
    type: Number as PropType<number>,
    required: false,
    default: 0,
  },
  /**
   * Whether or not the calendar is disabled
   *
   * @default false
   */
  disabled: {
    type: Boolean as PropType<boolean>,
    required: false,
    default: false,
  },
} as const

export type DraggableProps = ExtractPublicPropTypes<typeof draggableProps>

export interface Position {
  x: number
  y: number
}

export type PointerType = 'mouse' | 'touch' | 'pen'

export const Draggable = defineComponent({
  name: 'DestylerDraggable',
  props: draggableProps,
  setup(props) {
    const { forwardRef, currentElement } = useForwardExpose()

    const position = ref<Position>(toValue({ x: props.x, y: props.y }) ?? { x: 0, y: 0 })

    const pointerTypes = ref(['mouse', 'touch', 'pen'])

    const pressedDelta = ref<Position>()

    const preventDefault = ref(false)

    const stopPropagation = ref(false)

    const containerElement = ref<HTMLElement | SVGElement | null | undefined>(undefined)

    const exact = ref(false)

    const axis = ref('both')

    const filterEvent = (e: PointerEvent) => {
      if (pointerTypes)
        return pointerTypes.value.includes(e.pointerType as PointerType)
      return true
    }

    function handleEvent(e: PointerEvent) {
      if (toValue(preventDefault))
        e.preventDefault()
      if (toValue(stopPropagation))
        e.stopPropagation()
    }

    function start(e: PointerEvent) {
      if (toValue(props.disabled) || !filterEvent(e))
        return
      if (toValue(exact) && e.target !== toValue(currentElement))
        return

      const container = toValue(containerElement)
      const containerRect = container?.getBoundingClientRect?.()
      const targetRect = toValue(currentElement)!.getBoundingClientRect()
      const pos = {
        x: e.clientX - (container ? targetRect.left - containerRect!.left + container.scrollLeft : targetRect.left),
        y: e.clientY - (container ? targetRect.top - containerRect!.top + container.scrollTop : targetRect.top),
      }
      pressedDelta.value = pos
      handleEvent(e)
    }
    function move(e: PointerEvent) {
      if (toValue(props.disabled) || !filterEvent(e))
        return
      if (!pressedDelta.value)
        return

      const container = toValue(containerElement)
      const targetRect = toValue(currentElement)!.getBoundingClientRect()
      let { x, y } = position.value
      if (axis.value === 'x' || axis.value === 'both') {
        x = e.clientX - pressedDelta.value.x
        if (container)
          x = Math.min(Math.max(0, x), container.scrollWidth - targetRect!.width)
      }
      if (axis.value === 'y' || axis.value === 'both') {
        y = e.clientY - pressedDelta.value.y
        if (container)
          y = Math.min(Math.max(0, y), container.scrollHeight - targetRect!.height)
      }
      position.value = {
        x,
        y,
      }
      handleEvent(e)
    }
    function end(e: PointerEvent) {
      if (toValue(props.disabled) || !filterEvent(e))
        return
      if (!pressedDelta.value)
        return
      pressedDelta.value = undefined
      handleEvent(e)
    }

    return {
      position,
      forwardRef,
      start,
      move,
      end,
    }
  },
  render() {
    return h(Primitive, {
      as: this.$props.as,
      asChild: this.$props.asChild,
      ref: (el: any) => this.forwardRef(el),
      onPointerdown: (event: any) => {
        this.start(event)
      },
      onPointermove: (event: any) => {
        this.move(event)
      },
      onPointerup: (event: any) => {
        this.end(event)
      },
      style: {
        position: 'fixed',
        left: `${this.position.x}px`,
        top: `${this.position.y}px`,
      },
    }, () => this.$slots.default?.())
  },
})
