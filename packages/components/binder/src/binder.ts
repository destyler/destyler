import type {
  PropType,
} from 'vue'
import {
  defineComponent,
  getCurrentInstance,
  inject,
  onBeforeUnmount,
  provide,
  ref,
} from 'vue'
import { beforeNextFrameOnce, getSlot, off, on } from '@destyler/shared'
import { getScrollParent } from './utils'

export interface ExposedBinderInstance {
  targetRef: HTMLElement | null
}

export interface BinderInstance extends ExposedBinderInstance {
  syncTargetWithParent: boolean
  syncTarget: boolean
  setTargetRef: (el: HTMLElement | null) => void
  addScrollListener: (listener: () => void) => void
  removeScrollListener: (listener: () => void) => void
  addResizeListener: (listener: () => void) => void
  removeResizeListener: (listener: () => void) => void
}

export default defineComponent({
  name: 'DestylerBinder',
  props: {
    syncTargetWithParent: {
      type: Boolean as PropType<boolean>,
    },
    syncTarget: {
      type: Boolean as PropType<boolean>,
      default: true,
    },
  },
  setup(props, { slots }) {
    provide('DestylerBinder', getCurrentInstance()?.proxy)
    const DestylerBinder = inject<BinderInstance | null>('DestylerBinder', null)
    const targetRef = ref<HTMLElement | null>(null)
    // resize related
    const followerResizeListeners = new Set<() => void>()
    const followerScrollListeners = new Set<() => void>()

    const onScrollRaf = (): void => {
      followerScrollListeners.forEach(listener => listener())
    }
    const onScroll = (): void => {
      beforeNextFrameOnce(onScrollRaf)
    }
    const onResize = (): void => {
      followerResizeListeners.forEach(listener => listener())
    }
    const setTargetRef = (el: HTMLElement | null): void => {
      targetRef.value = el

      if (DestylerBinder && props.syncTargetWithParent)
        DestylerBinder.setTargetRef(el)
    }
    // scroll related
    let scrollableNodes: Array<Element | Document> = []
    const ensureScrollListener = (): void => {
      let cursor: Element | Document | null = targetRef.value
      while (true) {
        cursor = getScrollParent(cursor)
        if (cursor === null)
          break
        scrollableNodes.push(cursor)
      }
      for (const el of scrollableNodes)
        on('scroll', el, onScroll, true)
    }
    const removeScrollListeners = (): void => {
      for (const el of scrollableNodes)
        off('scroll', el, onScroll, true)

      scrollableNodes = []
    }

    const addScrollListener = (listener: () => void): void => {
      if (followerScrollListeners.size === 0)
        ensureScrollListener()

      if (!followerScrollListeners.has(listener))
        followerScrollListeners.add(listener)
    }
    const removeScrollListener = (listener: () => void): void => {
      if (followerScrollListeners.has(listener))
        followerScrollListeners.delete(listener)

      if (followerScrollListeners.size === 0)
        removeScrollListeners()
    }

    const addResizeListener = (listener: () => void): void => {
      if (followerResizeListeners.size === 0)
        on('resize', window, onResize)

      if (!followerResizeListeners.has(listener))
        followerResizeListeners.add(listener)
    }
    const removeResizeListener = (listener: () => void): void => {
      if (followerResizeListeners.has(listener))
        followerResizeListeners.delete(listener)

      if (followerResizeListeners.size === 0)
        off('resize', window, onResize)
    }

    onBeforeUnmount(() => {
      off('resize', window, onResize)
      removeScrollListeners()
    })

    return {
      targetRef,
      setTargetRef,
      addScrollListener,
      removeScrollListener,
      addResizeListener,
      removeResizeListener,
    }
  },
  render() {
    return getSlot('binder', this.$slots)
  },
})
