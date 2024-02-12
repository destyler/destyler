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

export const destylerPresenceProps = {
  present: {
    type: Boolean as PropType<boolean>,
    required: true,
  },
  forceMount: {
    type: Boolean as PropType<boolean>,
    required: false,
  },
} as const

export type DestylerPresenceProps = ExtractPublicPropTypes<typeof destylerPresenceProps>

export const DestylerPresence = defineComponent({
  name: 'DestylerPresence',
  props: destylerPresenceProps,
  slots: {} as SlotsType<{
    default: (opts: { present: Ref<boolean> }) => any
  }>,
  setup(props, { slots, expose }) {
    const { present, forceMount } = toRefs(props)

    const node = ref<HTMLElement>()
    // Mount composables once to prevent duplicated eventListener
    const { isPresent } = usePresence(present, node)
    expose({ present: isPresent })

    let children = slots.default({ present: isPresent })
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

    return () => {
      if (forceMount.value || present.value || isPresent.value) {
        return h(slots.default({ present: isPresent })[0] as VNode, {
          ref: (v) => {
            const el = unrefElement(v as HTMLElement)
            if (typeof el?.hasAttribute === 'undefined')
              return el

            // special case to handle animation for PopperContent
            if (el?.hasAttribute('data-radix-popper-content-wrapper'))
              node.value = el.firstElementChild as HTMLElement
            else
              node.value = el

            return el
          },
        })
      }
      else { return null }
    }
  },
})
