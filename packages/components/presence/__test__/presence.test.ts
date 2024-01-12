import { beforeEach, describe, expect, it } from 'vitest'
import { mount } from '@vue/test-utils'
import { defineComponent, onMounted, ref } from 'vue'
import { DestylerPresence } from '../src'

const CONTENT = 'Content'

describe('given a default Presence', () => {
  const wrapper = mount(defineComponent({
    components: { DestylerPresence },
    setup: () => {
      return { open: ref(false) }
    },
    template: `<div>
    <button @click="open = !open">
      toggle
    </button>
  </div>
  <DestylerPresence :present="open">
    <div>${CONTENT}</div>
  </DestylerPresence>`,
  }))

  it('should not show content', () => {
    expect(wrapper.html()).not.toContain(CONTENT)
  })

  describe('after clicking trigger', () => {
    beforeEach(async () => {
      await wrapper.find('button').trigger('click')
    })

    it('should show content', () => {
      expect(wrapper.html()).toContain(CONTENT)
    })

    describe('after clicking trigger again', () => {
      it('should not show content', () => {
        expect(wrapper.html()).not.toContain(CONTENT)
      })
    })
  })
})

const styles = `
@keyframes fadeIn {
  from { opacity: 0; }
  to { opacity: 1; }
}
@keyframes fadeOut {
  from { opacity: 1; }
  to { opacity: 0; }
}

.animate[data-state=open]{
  animation: fadeIn 2s;
}
.animate[data-state=closed]{
  animation: fadeOut 2s;
}`

describe('given a Presence with animated content', () => {
  const wrapper = mount(defineComponent({
    components: { DestylerPresence },
    setup: () => {
      const el = ref()

      onMounted(() => {
        const css = document.createElement('style')
        css.appendChild(document.createTextNode(styles))
        el.value.appendChild(css)
      })

      return { open: ref(false), el }
    },
    template: `<div ref="el">
    <button @click="open = !open">
      toggle
    </button>
    <DestylerPresence :present="open">
    <div class="animate" :data-state="open ? 'open' : 'closed'">${CONTENT}</div>
  </DestylerPresence>
  </div>`,
  }))

  it('should not show content', () => {
    expect(wrapper.html()).not.toContain(CONTENT)
  })

  describe('after clicking trigger', () => {
    beforeEach(async () => {
      await wrapper.find('button').trigger('click')
    })

    it('should show content', () => {
      expect(wrapper.html()).toContain(CONTENT)
    })

    describe('after clicking trigger again', () => {
      it('should not show content', () => {
        expect(wrapper.html()).not.toContain(CONTENT)
      })
    })
  })
})
