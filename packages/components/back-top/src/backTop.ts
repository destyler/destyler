import type { PropType } from 'vue'
import { defineComponent, h, nextTick, onBeforeUnmount, onMounted, ref, toRef, watch, watchEffect } from 'vue'
import { useMergedState } from '@destyler/composition'
import { getScrollParent, isDocument, unwrapElement } from '@destyler/shared'
import { DestylerLazyTeleport } from '../../../../private/src/lazy-teleport/lazy-teleport'

export const backTopProps = {
  'show': {
    type: Boolean as PropType<boolean | undefined>,
    default: undefined,
  },
  'to': {
    type: [String, Object] as PropType<HTMLElement | string>,
    default: 'body',
  },
  'visibilityHeight': {
    type: Number,
    default: 180,
  },
  'listenTo': {
    type: [String, Object, Function] as PropType<string | HTMLElement | Document | (() => HTMLElement | Document)>,
  },
  'onUpdate:show': {
    type: Function,
    default: () => {},
  },
  'target': {
    type: Function as PropType<() => HTMLElement>,
  },
  'onShow': {
    type: Function as unknown as PropType<() => void>,
  },
  'onHide': {
    type: Function as unknown as PropType<() => void>,
  },
} as const

const DestylerBackTop = defineComponent({
  name: 'DestylerBackTop',
  props: backTopProps,
  setup(props) {
    const scrollTop = ref<number | null>(null)
    const uncontrolledShow = ref<boolean>(false)
    watchEffect(() => {
      if (scrollTop.value === null) {
        uncontrolledShow.value = false
        return
      }
      uncontrolledShow.value = scrollTop.value >= props.visibilityHeight
    })
    const DomInfoReady = ref<boolean>(false)
    watch(uncontrolledShow, (value) => {
      if (DomInfoReady.value)
        props['onUpdate:show']?.(value)
    })
    const controlledShow = toRef(props, 'show')
    const mergedShow = useMergedState(controlledShow, uncontrolledShow)
    const placeholder = ref<HTMLElement | null>(null)
    let scrollElement: HTMLElement | Document
    let scrollListenerRegistered: boolean
    watch(mergedShow, (value) => {
      if (DomInfoReady.value) {
        if (value)
          props.onShow?.()

        props.onHide?.()
      }
    })
    function init(): void {
      if (scrollListenerRegistered)
        return
      scrollListenerRegistered = true
      const scrollEl = props.target?.() || unwrapElement(props.listenTo) || getScrollParent(placeholder.value)
      if (!scrollEl)
        return

      scrollElement = scrollEl === document.documentElement ? document : scrollEl
      const { to } = props
      const target = typeof to === 'string' ? document.querySelector(to) : to
      if (!target)
        console.warn('back-top', 'Target is not found.')

      scrollElement.addEventListener('scroll', handleScroll)
      handleScroll()
    }
    function handleClick(): void {
      (isDocument(scrollElement)
        ? document.documentElement
        : scrollElement
      ).scrollTo({
        top: 0,
        behavior: 'smooth',
      })
    }

    function handleScroll(): void {
      scrollTop.value = (isDocument(scrollElement) ? document.documentElement : scrollElement).scrollTop
      if (!DomInfoReady.value) {
        void nextTick(() => {
          DomInfoReady.value = true
        })
      }
    }

    onMounted(() => {
      init()
    })

    onBeforeUnmount(() => {
      if (scrollElement)
        scrollElement.removeEventListener('scroll', handleScroll)
    })
    return {
      mergedShow,
      handleClick,
      placeholder,
    }
  },
  render() {
    return h('div', {
      ref: 'placeholder',
    }, h(DestylerLazyTeleport, {
      to: this.$props.to,
      show: this.mergedShow,
    }, [
      this.mergedShow
        ? h('div', {
          onClick: this.handleClick,
          destyler: 'back-top',
        }, this.$slots.default?.())
        : null,
    ]))
  },
})

export {
  DestylerBackTop,
}
