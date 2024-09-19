import type { PropType, Ref, SlotsType, VNode } from 'vue'
import { computed, defineComponent, h, toRefs } from 'vue'
import { Primitive, primitiveProps } from '@destyler/primitive'
import type { ExtractPublicPropTypes } from '@destyler/shared'
import { createContext } from '@destyler/shared'
import { useForwardExpose, useVModel } from '@destyler/composition'

export const paginationRootProps = {
  ...primitiveProps,
  /**
   * @default nav
   */
  as: {
    ...primitiveProps.as,
    default: 'nav',
  },
  /**
   * The controlled value of the current page.
   * Can be binded as `v-model:page`.
   */
  page: {
    type: Number as PropType<number>,
    required: false,
  },
  /**
   * The value of the page that should be active when initially rendered.
   *
   * Use when you do not need to control the value state.
   *
   * @default 1
   */
  defaultPage: {
    type: Number as PropType<number>,
    required: false,
    default: 1,
  },
  /**
   * Number of items per page
   *
   * @default 10
   */
  itemsPerPage: {
    type: Number as PropType<number>,
    required: false,
    default: 10,
  },
  /**
   * Number of items in your list
   *
   * @default 0
   */
  total: {
    type: Number as PropType<number>,
    required: false,
    default: 0,
  },
  /**
   * Number of sibling should be shown around the current page.
   *
   * @default 2
   */
  siblingCount: {
    type: Number as PropType<number>,
    required: false,
    default: 2,
  },
  /**
   * When `true`, prevents the user from interacting with item
   */
  disabled: {
    type: Boolean as PropType<boolean>,
    required: false,
  },
  /**
   * When `true`, always show first page, last page, and ellipsis
   *
   * @default false
   */
  showEdges: {
    type: Boolean as PropType<boolean>,
    required: false,
    default: false,
  },
} as const

export type PaginationRootProps = ExtractPublicPropTypes<typeof paginationRootProps>

export const paginationRootEmits = {
  /**
   * Event handler called when the page value changes
   */
  'update:page': (_value: number) => true,
}

export interface PaginationRootContext {
  page: Ref<number>
  onPageChange: (value: number) => void
  pageCount: Ref<number>
  siblingCount: Ref<number>
  disabled: Ref<boolean | undefined>
  showEdges: Ref<boolean>
}

export const [injectPaginationRootContext, providePaginationRootContext] = createContext<PaginationRootContext>('PaginationRoot')

export const PaginationRoot = defineComponent({
  name: 'DestylerPaginationRoot',
  props: paginationRootProps,
  emits: paginationRootEmits,
  slots: Object as SlotsType<{
    default: (opts: {
      /**
       * Current page state
       */
      page: number
      /**
       * Number of pages
       */
      pageCount: number
    }) => VNode[]
  }>,
  setup(props, { emit }) {
    const { siblingCount, disabled, showEdges } = toRefs(props)

    useForwardExpose()
    const page = useVModel(props, 'page', emit, {
      defaultValue: props.defaultPage,
      passive: (props.page === undefined) as false,
    }) as Ref<number>

    const pageCount = computed(() => Math.ceil(props.total / props.itemsPerPage))

    providePaginationRootContext({
      page,
      onPageChange(value) {
        page.value = value
      },
      pageCount,
      siblingCount,
      disabled,
      showEdges,
    })

    return {
      page,
      pageCount,
    }
  },
  render() {
    return h(Primitive, {
      as: this.$props.as,
      asChild: this.$props.asChild,
    }, () => this.$slots.default?.({ page: this.page, pageCount: this.pageCount }))
  },
})
