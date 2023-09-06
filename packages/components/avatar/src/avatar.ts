import type { PropType } from 'vue'
import { defineComponent, h, onMounted, ref } from 'vue'

export default defineComponent({
  name: 'DestylerAvatar',
  props: {
    src: {
      type: String as PropType<string>,
      default: '',
      required: false,
    },
    alt: {
      type: String as PropType<string>,
      default: '',
      required: false,
    },
    delayMs: {
      type: Number as PropType<number>,
      default: 600,
      required: false,
    },
    fallback: {
      type: String as PropType<string>,
      default: '',
      required: false,
    },
  },
  setup(props) {
    const canRender = ref(false)
    let timeout: ReturnType<typeof setTimeout> | undefined
    if (props.delayMs) {
      timeout = setTimeout(() => {
        canRender.value = true
        clearTimeout(timeout)
      }, props.src === '' ? 0 : props.delayMs)
    }
    else {
      canRender.value = true
    }

    onMounted(() => {
      imageInit(props.src!)
    })

    const imageLoadingStatus = ref<boolean>()
    function imageInit(src: string) {
      const image = new Image()
      image.src = src
      image.onload = () => {
        imageLoadingStatus.value = true
      }
      image.onerror = () => {
        imageLoadingStatus.value = false
      }
    }
    return () => {
      return h('div', {
        destyler: 'avatar-root',
      }, [
        imageLoadingStatus.value
          ? h('img', {
            destyler: 'avatar-img',
            src: props.src,
            alt: props.alt,
          })
          : canRender.value
            ? h('span', {
              destyler: 'avatar-fallback',
            }, props.fallback)
            : null,
      ])
    }
  },
})
