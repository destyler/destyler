import {
  defineComponent,
  getCurrentInstance,
  h,
  ref,
  toRefs,
} from 'vue'
import type {
  PropType,
  Ref,
  SlotsType,
  VNode,
} from 'vue'
import { usePresence } from '@destyler/composition'
import type { ExtractPublicPropTypes } from '@destyler/shared'
import { renderSlotFragments, unrefElement } from '@destyler/shared'

export const presenceProps = {
  /**
   * Conditional to mount or unmount the child element. Similar to `v-if`
   */
  present: {
    type: Boolean as PropType<boolean>,
    required: true,
  },
  /**
   * Force the first child element to render all the time.
   * Useful for programmatically render grandchild component together with the exposed `present`
   */
  forceMount: {
    type: Boolean as PropType<boolean>,
    required: false,
  },
} as const

export type PresenceProps = ExtractPublicPropTypes<typeof presenceProps>

export const Presence = defineComponent({
  name: 'DestylerPresence',
  props: presenceProps,
  slots: {} as SlotsType<{
    default: (opts: {
      present: Ref<boolean>
    }) => VNode[]
  }>,
  setup(props, { expose }) {
    const { present, forceMount } = toRefs(props)

    const node = ref<HTMLElement>()
    // Mount composables once to prevent duplicated eventListener
    const { isPresent } = usePresence(present, node)
    expose({ present: isPresent })

    return {
      forceMount,
      present,
      isPresent,
      node,
    }
  },
  render() {
    let children = this.$slots.default ? this.$slots.default({ present: ref(this.isPresent) }) : []
    children = renderSlotFragments(children || [])
    const instance = getCurrentInstance()

    if (children && children?.length > 1) {
      const componentName = instance?.parent?.type.name
        ? `<${instance.parent.type.name} />`
        : 'component'

      throw new Error(
        [
          `Detected an invalid children for \`${componentName}\` for  \`Presence\` component.`,
          '',
          'Note: Presence works similarly to `v-if` directly, but it waits for animation/transition to finished before unmounting. So it expect only one direct child of valid VNode type.',
          'You can apply a few solutions:',
          [
            'Provide a single child element so that `presence` directive attach correctly.',
            'Ensure the first child is an actual element instead of a raw text node or comment node.',
          ]
            .map(line => `  - ${line}`)
            .join('\n'),
        ].join('\n'),
      )
    }
    if (this.forceMount || this.present || this.isPresent) {
      return h(this.$slots.default?.({ present: ref(this.isPresent) })[0], {
        ref: (v) => {
          const el = unrefElement(v as HTMLElement)
          if (typeof el?.hasAttribute === 'undefined')
            return el

          // special case to handle animation for PopperContent
          if (el?.hasAttribute('data-destyler-popper-content-wrapper'))
            this.node = el.firstElementChild as HTMLElement
          else
            this.node = el

          return el
        },
      })
    }
  },
})
