import type { PropType, Ref } from 'vue'
import { computed, defineComponent, h, ref, toRefs } from 'vue'
import { Primitive, primitiveProps } from '@destyler/primitive'
import type { Direction, ExtractPublicPropTypes, Orientation } from '@destyler/shared'
import { createContext, refAutoReset } from '@destyler/shared'
import { useCollection, useDebounceFn, useDirection, useForwardExpose, useId, useVModel } from '@destyler/composition'

export const navigationRootProps = {
  ...primitiveProps,
  /**
   * @default nav
   */
  as: {
    ...primitiveProps.as,
    default: 'nav',
  },
  /**
   * The controlled value of the menu item to activate.
   * Can be used as `v-model`.
   *
   * @default undefined
   */
  modelValue: {
    type: String as PropType<string>,
    required: false,
    default: undefined,
  },
  /**
   * The value of the menu item that should be active when initially rendered.
   *
   * Use when you do not need to control the value state.
   */
  defaultValue: {
    type: String as PropType<string>,
    required: false,
  },
  /**
   * The reading direction of the navigation when applicable.
   */
  dir: {
    type: String as PropType<Direction>,
    required: false,
  },
  /**
   * The orientation of the menu.
   *
   * @default horizontal
   */
  orientation: {
    type: String as PropType<Orientation>,
    required: false,
    default: 'horizontal',
  },
  /**
   * The duration from when the pointer enters the trigger until the tooltip gets opened.
   *
   * @default 200
   */
  delayDuration: {
    type: Number as PropType<number>,
    required: false,
    default: 200,
  },
  /**
   * How much time a user has to enter another trigger without incurring a delay again.
   *
   * @defaultValue 300
   */
  skipDelayDuration: {
    type: Number as PropType<number>,
    required: false,
    default: 300,
  },
  /**
   * If `true`, menu cannot be open by click on trigger
   *
   * @defaultValue false
   */
  disableClickTrigger: {
    type: Boolean as PropType<boolean>,
    required: false,
    default: false,
  },
  /**
   * If `true`, menu cannot be open by hover on trigger
   *
   * @defaultValue false
   */
  disableHoverTrigger: {
    type: Boolean as PropType<boolean>,
    required: false,
    default: false,
  },
} as const

export type NavigationRootProps = ExtractPublicPropTypes<typeof navigationRootProps>

export interface NavigationContext {
  isRootMenu: boolean
  modelValue: Ref<string>
  previousValue: Ref<string>
  baseId: string
  dir: Ref<Direction>
  orientation: Orientation
  disableClickTrigger: Ref<boolean>
  disableHoverTrigger: Ref<boolean>
  rootNavigationMenu: Ref<HTMLElement | undefined>
  indicatorTrack: Ref<HTMLElement | undefined>
  onIndicatorTrackChange: (indicatorTrack: HTMLElement | undefined) => void
  viewport: Ref<HTMLElement | undefined>
  onViewportChange: (viewport: HTMLElement | undefined) => void
  onTriggerEnter: (itemValue: string) => void
  onTriggerLeave: () => void
  onContentEnter: (itemValue: string) => void
  onContentLeave: () => void
  onItemSelect: (itemValue: string) => void
  onItemDismiss: () => void
}

export const [injectNavigationContext, provideNavigationContext] = createContext<NavigationContext>(['DestylerNavigationRoot', 'DestylerNavigationSub'], 'DestylerNavigationContext')

export const navigationRootEmits = {
  /**
   * Event handler called when the value changes.
   */
  'update:modelValue': (_value: string) => true,
}

export const NavigationRoot = defineComponent({
  name: 'DestylerNavigationRoot',
  props: navigationRootProps,
  emits: navigationRootEmits,
  setup(props, { emit }) {
    const modelValue = useVModel(props, 'modelValue', emit, {
      defaultValue: props.defaultValue ?? '',
      passive: (props.modelValue === undefined) as false,
    }) as Ref<string>
    const previousValue = ref('')

    const { forwardRef, currentElement: rootNavigationMenu } = useForwardExpose()

    const indicatorTrack = ref<HTMLElement>()
    const viewport = ref<HTMLElement>()

    const { createCollection } = useCollection('nav')
    createCollection(indicatorTrack)

    const { delayDuration, skipDelayDuration, dir: propDir, disableClickTrigger, disableHoverTrigger } = toRefs(props)
    const dir = useDirection(propDir)

    const isDelaySkipped = refAutoReset(false, skipDelayDuration)
    const computedDelay = computed(() => {
      const isOpen = modelValue.value !== ''
      if (isOpen || isDelaySkipped.value)
        return 150 // 150ms for user to switch trigger or move into content view
      else return delayDuration.value
    })

    const debouncedFn = useDebounceFn((val: string) => {
      previousValue.value = modelValue.value
      modelValue.value = val
    }, computedDelay)

    provideNavigationContext({
      isRootMenu: true,
      modelValue,
      previousValue,
      baseId: useId(undefined, 'destyler-navigation'),
      disableClickTrigger,
      disableHoverTrigger,
      dir,
      orientation: props.orientation,
      rootNavigationMenu,
      indicatorTrack,
      onIndicatorTrackChange: (val) => {
        indicatorTrack.value = val
      },
      viewport,
      onViewportChange: (val) => {
        viewport.value = val
      },
      onTriggerEnter: (val) => {
        debouncedFn(val)
      },
      onTriggerLeave: () => {
        isDelaySkipped.value = true
        debouncedFn('')
      },
      onContentEnter: (val) => {
        debouncedFn(val)
      },
      onContentLeave: () => {
        debouncedFn('')
      },
      onItemSelect: (val) => {
        previousValue.value = modelValue.value
        modelValue.value = val
      },
      onItemDismiss: () => {
        previousValue.value = modelValue.value
        modelValue.value = ''
      },
    })

    return {
      dir,
      forwardRef,
    }
  },
  render() {
    return h(Primitive, {
      'ref': (el: any) => this.forwardRef(el),
      'aria-label': 'main',
      'as': this.$props.as,
      'asChild': this.$props.asChild,
      'data-orientation': this.$props.orientation,
      'dir': this.dir,
    }, () => this.$slots.default?.())
  },
})
