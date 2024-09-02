import type { PropType, Ref } from 'vue'
import { computed, defineComponent, h, mergeProps, ref, watchEffect } from 'vue'
import type { Middleware, Placement } from '@floating-ui/vue'
import { autoUpdate, flip, arrow as floatingUIarrow, hide, limitShift, offset, shift, size, useFloating } from '@floating-ui/vue'
import type { ExtractPublicPropTypes } from '@destyler/shared'
import { computedEager, createContext } from '@destyler/shared'
import { Primitive, primitiveProps } from '@destyler/primitive'
import { useForwardExpose, useSize } from '@destyler/composition'

import type { Align, Side } from '../utils'
import { getSideAndAlignFromPlacement, isNotNull, transformOrigin } from '../utils'
import { injectPopperRootContext } from './root'

export interface PopperContentContext {
  placedSide: Ref<Side>
  onArrowChange: (arrow: HTMLElement | undefined) => void
  arrowX?: Ref<number>
  arrowY?: Ref<number>
  shouldHideArrow: Ref<boolean>
}

export const [injectPopperContentContext, providePopperContentContext] = createContext<PopperContentContext>('DestylerPopperContent')

export const popperContentProps = {
  ...primitiveProps,
  /**
   * The preferred side of the trigger to render against when open.
   * Will be reversed when collisions occur and avoidCollisions
   * is enabled.
   *
   * @default bottom
   */
  side: {
    type: String as PropType<Side>,
    required: false,
    default: 'bottom',
  },
  /**
   * The distance in pixels from the trigger.
   *
   * @default 0
   */
  sideOffset: {
    type: Number as PropType<number>,
    required: false,
    default: 0,
  },
  /**
   * The preferred alignment against the trigger.
   * May change when collisions occur.
   *
   * @default center
   */
  align: {
    type: String as PropType<Align>,
    required: false,
    default: 'center',
  },
  /**
   * An offset in pixels from the `start` or `end` alignment options.
   *
   * @default 0
   */
  alignOffset: {
    type: Number as PropType<number>,
    required: false,
    default: 0,
  },
  /**
   * When `true`, overrides the side andalign preferences
   * to prevent collisions with boundary edges.
   *
   * @default true
   */
  avoidCollisions: {
    type: Boolean as PropType<boolean>,
    required: false,
    default: true,
  },
  /**
   * The element used as the collision boundary. By default
   * this is the viewport, though you can provide additional
   * element(s) to be included in this check.
   *
   * @default () => []
   */
  collisionBoundary: {
    type: [Object, Array, null] as PropType<Element | null | Array<Element | null>>,
    required: false,
    default: () => [],
  },
  /**
   * The distance in pixels from the boundary edges where collision
   * detection should occur. Accepts a number (same for all sides),
   * or a partial padding object, for example: { top: 20, left: 20 }.
   *
   * @default 0
   */
  collisionPadding: {
    type: [Number, Object] as PropType<number | Partial<Record<Side, number>>>,
    required: false,
    default: 0,
  },
  /**
   * The distance in pixels from the boundary edges where collision
   * detection should occur. Accepts a number (same for all sides),
   * or a partial padding object, for example: { top: 20, left: 20 }.
   *
   * @default 0
   */
  arrowPadding: {
    type: Number as PropType<number>,
    required: false,
    default: 0,
  },
  /**
   * The sticky behavior on the align axis. `partial` will keep the
   * content in the boundary as long as the trigger is at least partially
   * in the boundary whilst "always" will keep the content in the boundary
   * regardless.
   *
   * @default partial
   */
  sticky: {
    type: String as PropType<'partial' | 'always'>,
    required: false,
    default: 'partial',
  },
  /**
   * Whether to hide the content when the trigger becomes fully occluded.
   *
   * @default false
   */
  hideWhenDetached: {
    type: Boolean as PropType<boolean>,
    required: false,
    default: false,
  },
  /**
   * Strategy to update the position of the floating element on every animation frame.
   *
   * @default optimized
   */
  updatePositionStrategy: {
    type: String as PropType<'optimized' | 'always'>,
    required: false,
    default: 'optimized',
  },

  /**
   * Force content to be position within the viewport.
   *
   * Might overlap the reference element, which may not be desired.
   *
   * @default false
   */
  prioritizePosition: {
    type: Boolean as PropType<boolean>,
    required: false,
    default: false,
  },
} as const

export type PopperContentProps = ExtractPublicPropTypes<typeof popperContentProps>

export const popperContentEmits = {
  placed: () => true,
}

export const PopperContent = defineComponent({
  name: 'DestylerPopperContent',
  inheritAttrs: false,
  props: popperContentProps,
  emits: popperContentEmits,
  setup(props, { attrs, emit }) {
    const rootContext = injectPopperRootContext()
    const { forwardRef, currentElement: contentElement } = useForwardExpose()
    const floatingRef = ref<HTMLElement>()
    const arrow = ref<HTMLElement>()
    const { width: arrowWidth, height: arrowHeight } = useSize(arrow)

    const desiredPlacement = computed(() => (props.side + (props.align !== 'center' ? `-${props.align}` : '')) as Placement)

    const collisionPadding = computed(() => {
      return typeof props.collisionPadding === 'number'
        ? props.collisionPadding
        : { top: 0, right: 0, bottom: 0, left: 0, ...props.collisionPadding }
    })

    const boundary = computed(() => {
      return Array.isArray(props.collisionBoundary)
        ? props.collisionBoundary
        : [props.collisionBoundary]
    })

    const detectOverflowOptions = computed(() => {
      return {
        padding: collisionPadding.value,
        boundary: boundary.value.filter(isNotNull),
        // with `strategy: 'fixed'`, this is the only way to get it to respect boundaries
        altBoundary: boundary.value.length > 0,
      }
    })

    const computedMiddleware = computedEager(() => {
      return [
        offset({
          mainAxis: props.sideOffset + arrowHeight.value,
          alignmentAxis: props.alignOffset,
        }),
        props.avoidCollisions
        && shift({
          mainAxis: true,
          crossAxis: !!props.prioritizePosition,
          limiter: props.sticky === 'partial' ? limitShift() : undefined,
          ...detectOverflowOptions.value,
        }),
        !props.prioritizePosition
        && props.avoidCollisions
        && flip({
          ...detectOverflowOptions.value,
        }),
        size({
          ...detectOverflowOptions.value,
          apply: ({ elements, rects, availableWidth, availableHeight }) => {
            const { width: anchorWidth, height: anchorHeight } = rects.reference
            const contentStyle = elements.floating.style
            Object.assign(elements.floating.style, {
              maxWidth: `${availableWidth}px`,
              maxHeight: `${availableHeight}px`,
            })
            contentStyle.setProperty(
              '--destyler-popper-available-width',
              `${availableWidth}px`,
            )
            contentStyle.setProperty(
              '--destyler-popper-available-height',
              `${availableHeight}px`,
            )
            contentStyle.setProperty(
              '--destyler-popper-anchor-width',
              `${anchorWidth}px`,
            )
            contentStyle.setProperty(
              '--destyler-popper-anchor-height',
              `${anchorHeight}px`,
            )
          },
        }),
        arrow.value
        && floatingUIarrow({ element: arrow.value, padding: props.arrowPadding }),
        transformOrigin({
          arrowWidth: arrowWidth.value,
          arrowHeight: arrowHeight.value,
        }),
        props.hideWhenDetached
        && hide({ strategy: 'referenceHidden', ...detectOverflowOptions.value }),
      ] as Middleware[]
    })

    const { floatingStyles, placement, isPositioned, middlewareData } = useFloating(
      rootContext.anchor,
      floatingRef,
      {
        strategy: 'fixed',
        placement: desiredPlacement,
        whileElementsMounted: (...args) => {
          const cleanup = autoUpdate(...args, {
            animationFrame: props.updatePositionStrategy === 'always',
          })
          return cleanup
        },
        middleware: computedMiddleware,
      },
    )

    const placedSide = computed(() => getSideAndAlignFromPlacement(placement.value)[0])
    const placedAlign = computed(() => getSideAndAlignFromPlacement(placement.value)[1])

    watchEffect(() => {
      if (isPositioned.value)
        emit('placed')
    })

    const cannotCenterArrow = computed(
      () => middlewareData.value.arrow?.centerOffset !== 0,
    )

    const contentZIndex = ref('')
    watchEffect(() => {
      if (contentElement.value)
        contentZIndex.value = window.getComputedStyle(contentElement.value).zIndex
    })

    const arrowX = computed(() => middlewareData.value.arrow?.x ?? 0)
    const arrowY = computed(() => middlewareData.value.arrow?.y ?? 0)

    providePopperContentContext({
      placedSide,
      onArrowChange: element => arrow.value = element,
      arrowX,
      arrowY,
      shouldHideArrow: cannotCenterArrow,
    })

    return {
      floatingRef,
      floatingStyles,
      isPositioned,
      contentZIndex,
      middlewareData,
      forwardRef,
      placedSide,
      placedAlign,
      attrStyle: attrs.style as any,
    }
  },
  render() {
    return h('div', {
      'data-destyler-popper-content-wrapper': '',
      'ref': 'floatingRef',
      'style': {
        ...this.floatingStyles,
        transform: this.isPositioned ? this.floatingStyles.transform : 'translate(0, -200%)',
        minWidth: 'max-content',
        zIndex: this.contentZIndex,
        ['--destyler-popper-transform-origin' as any]: [
          this.middlewareData.transformOrigin?.x,
          this.middlewareData.transformOrigin?.y,
        ].join(' '),
        ...(this.middlewareData.hide?.referenceHidden && {
          visibility: 'hidden',
          pointerEvents: 'none',
        }),
      },
    }, h(Primitive, mergeProps(this.$attrs, {
      'ref': (el: any) => this.forwardRef(el),
      'as': this.$props.as,
      'asChild': this.$props.asChild,
      'data-side': this.placedSide,
      'data-align': this.placedAlign,
      'style': {
        animation: !this.isPositioned ? 'none' : undefined,
      },
    }), () => this.$slots.default?.()))
  },
})
