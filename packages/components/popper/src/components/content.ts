import type { PropType, Ref } from 'vue'
import { computed, defineComponent, h, mergeProps, ref, watchEffect } from 'vue'
import type { Middleware, Placement } from '@floating-ui/vue'
import { autoUpdate, flip, arrow as floatingUIarrow, hide, limitShift, offset, shift, size, useFloating } from '@floating-ui/vue'
import type { ExtractPublicPropTypes } from '@destyler/shared'
import { computedEager, createContext } from '@destyler/shared'
import { DestylerPrimitive, destylerPrimitiveProps } from '@destyler/primitive'
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

export const destylerPopperContentProps = {
  ...destylerPrimitiveProps,
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
} as const

export type DestylerPopperContentProps = ExtractPublicPropTypes<typeof destylerPopperContentProps>

export const DestylerPopperContent = defineComponent({
  name: 'DestylerPopperContent',
  inheritAttrs: false,
  props: destylerPopperContentProps,
  setup(props, { attrs }) {
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
              '--destyler_popper_available_width',
              `${availableWidth}px`,
            )
            contentStyle.setProperty(
              '--destyler_popper_available_height',
              `${availableHeight}px`,
            )
            contentStyle.setProperty(
              '--destyler_popper_anchor_width',
              `${anchorWidth}px`,
            )
            contentStyle.setProperty(
              '--destyler_popper_anchor_height',
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
        props.onPlaced?.()
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
        ['--destyler_popper_transform_origin' as any]: [
          this.middlewareData.transformOrigin?.x,
          this.middlewareData.transformOrigin?.y,
        ].join(' '),
      },
    }, h(DestylerPrimitive, mergeProps(this.$attrs, {
      'ref': (el: any) => this.forwardRef(el),
      'as': this.$props.as,
      'asChild': this.$props.asChild,
      'data-side': this.placedSide,
      'data-align': this.placedAlign,
      'style': {
        animation: !this.isPositioned ? 'none' : undefined,
        opacity: this.middlewareData.hide?.referenceHidden ? 0 : undefined,
      },
    }), {
      default: () => this.$slots.default?.(),
    }))
  },
})
