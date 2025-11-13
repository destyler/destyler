import { hydrateSpreadProps, normalizeProps, spreadProps, useMachine } from '@destyler/vanilla'
import * as aspectRatio from '../../index'
import '../style.css'

const classNames = (...values: Array<string | null | undefined | false>) => values.filter(Boolean).join(' ')

export function render(target: HTMLElement, ratio = 16 / 9) {
  const machine = useMachine(
    aspectRatio.machine({
      id: '1',
      ratio,
    }),
  )

  const api = aspectRatio.connect(machine.state, machine.send, normalizeProps)
  const rootProps = api.getRootProps()
  const contentProps = api.getContentProps()

  target.innerHTML = `
    <div class="aspect-ratio-root">
      <div class="aspect-ratio-node" ${spreadProps({
        ...rootProps,
        class: classNames('aspect-ratio-node', rootProps.class),
      })}>
        <div class="aspect-ratio-content" ${spreadProps({
          ...contentProps,
          class: classNames('aspect-ratio-content', contentProps.class),
        })}>
          <img
            class="aspect-ratio-img"
            src="https://elonehoo.me/gallery/20_sun.jpg"
          >
        </div>
      </div>
    </div>
  `
  hydrateSpreadProps(target)
}
