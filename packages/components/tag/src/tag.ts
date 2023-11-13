import type { PropType } from 'vue'
import { defineComponent, h, ref } from 'vue'
import type { MaybeArray } from '@destyler/shared'
import { call, resolveWrappedSlot } from '@destyler/shared'

const destylerTagProps = {
  'closable': {
    type: Boolean as PropType<boolean>,
  },
  'disabled': {
    type: Boolean as PropType<boolean | undefined>,
    default: undefined,
  },
  'triggerClickOnClose': {
    type: Boolean,
  },
  'checked': {
    type: Boolean as PropType<boolean>,
  },
  'checkable': {
    type: Boolean as PropType<boolean>,
  },
  'onClose': {
    type: [Array, Function] as PropType<MaybeArray<(e: MouseEvent) => void>>,
  },
  'onUpdateChecked': {
    type: Function as PropType<(checked: boolean) => void>,
  },
  'onUpdate:checked': {
    type: Function as PropType<(checked: boolean) => void>,
  },
  'onCheckedChange': {
    type: Function as PropType<(checked: boolean) => void>,
  },
  'onMouseenter': {
    type: Function as PropType<(e: MouseEvent) => void>,
  },
  'onMouseleave': {
    type: Function as PropType<(e: MouseEvent) => void>,
  },
  // private
  'internalCloseFocusable': {
    type: Boolean,
    default: true,
  },
}

const DestylerTag = defineComponent({
  name: 'DestylerTag',
  props: destylerTagProps,
  setup(props) {
    const content = ref<HTMLElement | null>(null)

    function handleClick(e: MouseEvent): void {
      if (!props.disabled) {
        if (props.checkable) {
          const {
            checked,
            onCheckedChange,
            onUpdateChecked,
            'onUpdate:checked': _onUpdateChecked,
          } = props
          if (onUpdateChecked)
            onUpdateChecked(!checked)
          if (_onUpdateChecked)
            _onUpdateChecked(!checked)
          if (onCheckedChange)
            onCheckedChange(!checked)
        }
      }
    }
    function handleCloseClick(e: MouseEvent): void {
      if (!props.triggerClickOnClose)
        e.stopPropagation()

      if (!props.disabled) {
        const { onClose } = props
        if (onClose)
          call(onClose, e)
      }
    }

    return {
      content,
      handleClick,
      handleCloseClick,
    }
  },
  render() {
    const avatarNode = resolveWrappedSlot(
      this.$slots.avatar,
      children =>
        children && (
          h('div', {
            destyler: 'tag-avatar',
          }, children)
        ),
    )
    const iconNode = resolveWrappedSlot(
      this.$slots.icon,
      children =>
        children && (
          h('div', {
            destyler: 'tag-icon',
          }, children)
        ),
    )
    const closeNode = resolveWrappedSlot(
      this.$slots.close,
      children =>
        children && (
          h('div', {
            destyler: 'tag-close',
            onClick: this.handleCloseClick,
            focusable: this.$props.internalCloseFocusable,
          }, children)
        ),
    )
    return h('div', {
      'destyler': 'tag',
      'data-checked': this.checked,
      'onClick': this.handleClick,
      'onMouseenter': this.$props.onMouseenter,
      'onMouseleave': this.$props.onMouseleave,
    }, [
      (iconNode || avatarNode),
      h('span', {
        destyler: 'tag-content',
        ref: 'content',
      }, this.$slots.default?.()),
      !this.$props.checkable && this.$props.closable
        ? closeNode
        : null,
    ])
  },
})

export {
  DestylerTag,
}
