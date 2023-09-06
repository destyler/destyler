import { defineComponent, h, ref } from 'vue'

export default defineComponent({
  name: 'DestylerDisclosure',
  setup(_, { slots }) {
    const action = ref<boolean>(false)
    function handleToggleAction() {
      action.value = !action.value
    }
    return () => {
      return h('div', {
        destyler: 'disclosure-root',
      }, [
        h('div', {
          destyler: 'disclosure-action',
        }, slots.action?.({ action, handleToggleAction })),
        [action.value
          ? h('div', {
            destyler: 'disclosure-content',
          }, slots.default?.())
          : null],
      ])
    }
  },
})
