import type { PropType } from 'vue'
import { defineComponent, h, ref } from 'vue'

export interface DestylerScrollInst {
  scrollTo: HTMLElement['scrollTo']
}

const DestylerScroll: any = defineComponent({
  name: 'DestylerScroll',
  props: {
    disabled: {
      type: Boolean as PropType<boolean>,
    },
    onScroll: {
      type: Function as PropType<(e: Event) => void>,
    },
  },
  setup() {
    const selfRef = ref<HTMLElement | null>(null)
    function handleWheel(e: WheelEvent): void {
      const preventYWheel = (e.currentTarget as HTMLElement).offsetWidth < (e.currentTarget as HTMLElement).scrollWidth
      if (!preventYWheel || e.deltaY === 0)
        return;
      (e.currentTarget as HTMLElement).scrollLeft += e.deltaY + e.deltaX
      e.preventDefault()
    }
    const exposedMethods: DestylerScrollInst = {
      scrollTo(...args: any[]) {
        selfRef.value?.scrollTo(...args)
      },
    }

    return {
      selfRef,
      handleWheel,
      ...exposedMethods,
    }
  },
  render() {
    return h('div', {
      destyler: 'scroll',
      ref: 'selfRef',
      style: 'overflow:auto;scrollbar-width:none;',
      onScroll: this.onScroll,
      onWheel: this.disabled ? undefined : this.handleWheel,
    }, this.$slots)
  },
})

export {
  DestylerScroll,
}
