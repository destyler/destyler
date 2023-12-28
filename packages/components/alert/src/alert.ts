import type { PropType } from 'vue'
import { defineComponent, h, ref } from 'vue'
import type { ExtractPublicPropTypes } from '@destyler/shared'
import { FadeInExpandTransition, resolveWrappedSlot } from '@destyler/shared'

export const destylerAlertProps = {
  title: {
    type: String as PropType<string>,
  },
  closable: {
    type: Boolean as PropType<boolean>,
  },
  onClose: {
    type: Function as PropType<() => boolean | Promise<boolean> | any>,
  },
  onAfterLeave: {
    type: Function as PropType<() => void>,
  },
}

export type DestylerAlertProps = ExtractPublicPropTypes<typeof destylerAlertProps>

const DestylerAlert = defineComponent({
  name: 'DestylerAlert',
  props: destylerAlertProps,
  inheritAttrs: false,
  setup(props) {
    const visibleRef = ref<boolean>(true)

    const doAfterLeave = (): void => {
      const {
        onAfterLeave,
      } = props
      if (onAfterLeave)
        onAfterLeave()
    }

    const handleCloseClick = (): void => {
      void Promise.resolve(props.onClose?.()).then((result) => {
        if (result === false)
          return
        visibleRef.value = false
      })
    }

    const handleAfterLeave = (): void => {
      doAfterLeave()
    }

    return {
      visible: visibleRef,
      handleCloseClick,
      handleAfterLeave,
    }
  },
  render() {
    return h(FadeInExpandTransition, {
      onAfterEnter: this.handleAfterLeave,
    }, {
      default: () => {
        const { $slots } = this
        return h('div', {
          role: 'alert',
          destyler: 'alert',
        }, {
          default: () => {
            const components = []
            if (this.closable) {
              components.push(h('div', {

                destyler: 'alert-close',
                onClick: this.handleCloseClick,
              }, $slots.close?.()))
            }
            components.push(h('div', {
              destyler: 'alert-body',
            }, {
              default: () => {
                return [
                  // @ts-expect-error $slots.header is not a valid type
                  resolveWrappedSlot($slots.header, (children) => {
                    const mergedChildren = children || this.title
                    return mergedChildren
                      ? (
                          h('div', {
                            destyler: 'alert-body-title',
                          }, {
                            default: () => {
                              return mergedChildren
                            },
                          })
                        )
                      : null
                  }),
                  $slots.default && (
                    h('div', {
                      destyler: 'alert-body-content',
                    }, $slots)
                  ),
                ]
              },
            }))
            return components
          },
        })
      },
    })
  },
})

export {
  DestylerAlert,
}
