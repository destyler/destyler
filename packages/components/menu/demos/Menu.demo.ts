import { defineComponent, h, ref } from 'vue'
import {
  MenuAnchor,
  MenuContent,
  MenuPortal,
  MenuRoot,
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
      h(MenuRoot, {
        open: this.open,
        modal: false,
      }, [
        h(MenuAnchor, {
          asChild: true,
        }, () => h('button', {
          onPointerdown: () => {
            this.handleToggle(!this.open)
          },
        }, this.open)),
        h(MenuPortal, {

        }, h(MenuContent, {
          align: 'start',
          alignOffset: -4,
          sideOffset: 8,
        }, 'hello')),
      ]),
    ]
  },
})
