import type { PropType, VNodeChild } from 'vue'
import { computed, defineComponent, h, ref } from 'vue'
import type { ExtractPublicPropTypes, MaybeArray } from '@destyler/shared'
import { BaseIconSwitchTransition, FadeInExpandTransition, call, isSafari, resolveWrappedSlot } from '@destyler/shared'

export const destylerButtonProps = {
  tag: {
    type: String as PropType<keyof HTMLElementTagNameMap>,
    default: 'button',
  },
  attrType: {
    type: String as PropType<'button' | 'submit' | 'reset'>,
    default: 'button',
  },
  iconPlacement: {
    type: String as PropType<'left' | 'right'>,
    default: 'left',
  },
  renderIcon: Function as PropType<() => VNodeChild>,
  focusable: {
    type: Boolean as PropType<boolean>,
    default: false,
  },
  keyboard: {
    type: Boolean as PropType<boolean>,
    default: true,
  },
  disabled: {
    type: Boolean as PropType<boolean>,
    default: false,
  },
  loading: {
    type: Boolean as PropType<boolean>,
    default: false,
  },
  onClick: [Function, Array] as PropType<MaybeArray<(e: MouseEvent) => void>>,
  nativeFocusBehavior: {
    type: Boolean,
    default: !isSafari,
  },
}

export type DestylerButtonProps = ExtractPublicPropTypes<typeof destylerButtonProps>

const DestylerButton: any = defineComponent({
  name: 'DestylerButton',
  props: destylerButtonProps,
  setup(props) {
    const selfElRef = ref<HTMLElement | null>(null)

    function handleClick(e: MouseEvent): void {
      if (!props.disabled && !props.loading) {
        const { onClick } = props
        if (onClick)
          call(onClick, e)
      }
    }

    const mergedFocusableRef = computed(() => {
      return props.focusable && !props.disabled
    })

    function handleMousedown(e: MouseEvent): void {
      if (!mergedFocusableRef.value)
        e.preventDefault()

      if (props.nativeFocusBehavior)
        return

      e.preventDefault()
      // normally this won't be called if disabled (when tag is button)
      // if not, we try to make it behave like a button
      if (props.disabled)
        return

      if (mergedFocusableRef.value)
        selfElRef.value?.focus({ preventScroll: true })
    }

    const enterPressedRef = ref<boolean>(false)

    const handleKeyup = (e: KeyboardEvent): void => {
      switch (e.key) {
        case 'Enter':
          if (!props.keyboard)
            return

          enterPressedRef.value = false
      }
    }

    function handleKeydown(e: KeyboardEvent): void {
      switch (e.key) {
        case 'Enter':
          if (!props.keyboard || props.loading) {
            e.preventDefault()
            return
          }
          enterPressedRef.value = true
      }
    }

    return {
      selfElRef,
      mergedFocusableRef,
      enterPressedRef,
      handleClick,
      handleMousedown,
      handleKeyup,
      handleKeydown,
    }
  },
  render() {
    const children = resolveWrappedSlot(
      this.$slots.default,
      children =>
        children && (
          h('span', {
            destyler: 'button-content',
          }, children)
        ),
    )
    return h(this.$props.tag, {
      ref: 'selfElRef',
      tabindex: this.mergedFocusableRef ? 0 : -1,
      destyler: 'button',
      type: this.$props.attrType,
      disabled: this.$props.disabled,
      autofocus: this.$props.focusable,
      onClick: this.handleClick,
      onMousedown: this.handleMousedown,
      onKeyup: this.handleKeyup,
      onKeydown: this.handleKeydown,
    }, [
      this.$props.iconPlacement === 'right' && children,
      h(FadeInExpandTransition, {
        width: true,
      }, {
        default: () => {
          return resolveWrappedSlot(
            this.$slots.icon,
            children =>
              (this.$props.loading || this.$props.renderIcon || children) && (
                h('span', {
                  destyler: 'button-icon',
                }, h(BaseIconSwitchTransition, null, h('div', {
                  destyler: 'button-icon-slot',
                }, [
                  this.$props.loading
                    ? h('svg', {
                      width: '1em',
                      height: '1em',
                      viewBox: '0 0 24 24',
                    }, h('path', {
                      fill: 'none',
                      stroke: 'currentColor',
                      strokeDasharray: '15',
                      strokeDashoffset: '15',
                      strokeLinecap: 'round',
                      strokeWidth: '2',
                      d: 'M12 3C16.9706 3 21 7.02944 21 12',
                    }, [
                      h('animate', {
                        fill: 'freeze',
                        attributeName: 'stroke-dashoffset',
                        dur: '0.3s',
                        values: '15;0',
                      }),
                      h('animateTransform', {
                        attributeName: 'transform',
                        dur: '1.5s',
                        repeatCount: 'indefinite',
                        type: 'rotate',
                        values: '0 12 12;360 12 12',
                      }),
                    ]))
                    : this.$props.renderIcon ? this.$props.renderIcon() : children,
                ])))
              ),
          )
        },
      }),
      this.$props.iconPlacement === 'left' && children,
    ])
  },
})

export {
  DestylerButton,
}
