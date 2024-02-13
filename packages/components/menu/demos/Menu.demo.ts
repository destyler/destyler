import { defineComponent, h, ref } from 'vue'
import {
  DestylerMenuAnchor,
  DestylerMenuContent,
  DestylerMenuPortal,
  DestylerMenuRoot,
} from '../src'

export const MenuDemo = defineComponent({
  name: 'MenuDemo',
  setup() {
    const open = ref(false)

    function handleToggle(value: boolean) {
      open.value = value
    }

    return {
      open,
      handleToggle,
    }
  },
  render() {
    return [
      h(DestylerMenuRoot, {
        open: this.open,
        modal: false,
      }, [
        h(DestylerMenuAnchor, {
          asChild: true,
        }, () => h('button', {
          onPointerdown: () => {
            this.handleToggle(!this.open)
          },
        }, this.open)),
        h(DestylerMenuPortal, {

        }, h(DestylerMenuContent, {
          align: 'start',
          alignOffset: -4,
          sideOffset: 8,
        }, 'hello')),
      ]),
    ]
  },
})
