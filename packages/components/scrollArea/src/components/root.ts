import type { PropType, Ref } from 'vue'
import { defineComponent, h, ref, toRefs } from 'vue'
import { Primitive, primitiveProps } from '@destyler/primitive'
import type { Direction, ExtractPublicPropTypes, ScrollType } from '@destyler/shared'
import { createContext } from '@destyler/shared'
import { useDirection, useForwardExpose } from '@destyler/composition'

export const scrollAreaRootProps = {
  ...primitiveProps,
  /**
   * Describes the nature of scrollbar visibility, similar to how the scrollbar preferences in MacOS control visibility of native scrollbars.
   *
   * `auto` - means that scrollbars are visible when content is overflowing on the corresponding orientation. <br>
   * `always` - means that scrollbars are always visible regardless of whether the content is overflowing.<br>
   * `scroll` - means that scrollbars are visible when the user is scrolling along its corresponding orientation.<br>
   * `hover` - when the user is scrolling along its corresponding orientation and when the user is hovering over the scroll area.
   *
   * @default hover
   */
  type: {
    type: String as PropType<ScrollType>,
    required: false,
    default: 'hover',
  },
  /**
   * The reading direction of the scroll area when applicable.
   */
  dir: {
    type: String as PropType<Direction>,
    required: false,
  },
  /**
   * If type is set to either `scroll` or `hover`,
   * this prop determines the length of time,
   * in milliseconds, <br>
   * before the scrollbars are hidden after
   * the user stops interacting with scrollbars.
   *
   * @default 600
   */
  scrollHideDelay: {
    type: Number as PropType<number>,
    required: false,
    default: 600,
  },
} as const

export type ScrollAreaRootProps = ExtractPublicPropTypes<typeof scrollAreaRootProps>

export interface ScrollAreaRootContext {
  type: Ref<ScrollType>
  dir: Ref<Direction>
  scrollHideDelay: Ref<number>
  scrollArea: Ref<HTMLElement | undefined>
  viewport: Ref<HTMLElement | undefined>
  onViewportChange: (viewport: HTMLElement | null) => void
  content: Ref<HTMLElement | undefined>
  onContentChange: (content: HTMLElement) => void
  scrollbarX: Ref<HTMLElement | undefined>
  onScrollbarXChange: (scrollbar: HTMLElement | null) => void
  scrollbarXEnabled: Ref<boolean>
  onScrollbarXEnabledChange: (rendered: boolean) => void
  scrollbarY: Ref<HTMLElement | undefined>
  onScrollbarYChange: (scrollbar: HTMLElement | null) => void
  scrollbarYEnabled: Ref<boolean>
  onScrollbarYEnabledChange: (rendered: boolean) => void
  onCornerWidthChange: (width: number) => void
  onCornerHeightChange: (height: number) => void
}

export const [injectScrollAreaRootContext, provideScrollAreaRootContext] = createContext<ScrollAreaRootContext>('DestylerScrollAreaRoot')

export const ScrollAreaRoot = defineComponent({
  name: 'DestylerScrollAreaRoot',
  props: scrollAreaRootProps,
  setup(props) {
    const { forwardRef, currentElement: scrollArea } = useForwardExpose()

    const cornerWidth = ref(0)
    const cornerHeight = ref(0)
    const viewport = ref<HTMLElement>()
    const content = ref<HTMLElement>()
    const scrollbarX = ref<HTMLElement>()
    const scrollbarY = ref<HTMLElement>()
    const scrollbarXEnabled = ref(false)
    const scrollbarYEnabled = ref(false)

    const { type, dir: propDir, scrollHideDelay } = toRefs(props)
    const dir = useDirection(propDir)
    provideScrollAreaRootContext({
      type,
      dir,
      scrollHideDelay,
      scrollArea,
      viewport,
      onViewportChange: (el) => {
        viewport.value = el || undefined
      },
      content,
      onContentChange: (el) => {
        content.value = el
      },
      scrollbarX,
      scrollbarXEnabled,
      scrollbarY,
      scrollbarYEnabled,
      onScrollbarXChange: (scrollbar) => {
        scrollbarX.value = scrollbar || undefined
      },
      onScrollbarYChange: (scrollbar) => {
        scrollbarY.value = scrollbar || undefined
      },
      onScrollbarXEnabledChange: (rendered) => {
        scrollbarXEnabled.value = rendered
      },
      onScrollbarYEnabledChange: (rendered) => {
        scrollbarYEnabled.value = rendered
      },
      onCornerWidthChange: (width) => {
        cornerWidth.value = width
      },
      onCornerHeightChange: (height) => {
        cornerHeight.value = height
      },
    })

    return {
      forwardRef,
      dir,
      cornerWidth,
      cornerHeight,
    }
  },
  render() {
    return h(Primitive, {
      as: this.$props.as,
      asChild: this.$props.asChild,
      ref: (el: any) => this.forwardRef(el),
      dir: this.dir,
      style: {
        'position': 'relative',
        '--destyler-scroll-area-corner-width': `${this.cornerWidth}px`,
        '--destyler-scroll-area-corner-height': `${this.cornerHeight}px`,
      },
    }, {
      default: () => this.$slots.default?.(),
    })
  },
})
