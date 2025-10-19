import { normalizeProps, spread, useMachine } from '@destyler/vanilla'
import * as aspectRatio from '../../index'
import '../style.css'

export function render(target: HTMLElement, ratio = 16 / 9) {
  const machine = useMachine(
    aspectRatio.machine({
      id: '1',
      ratio,
    }),
  )

  const api = aspectRatio.connect(machine.state, machine.send, normalizeProps)

  target.innerHTML = `
    <div class="aspect-ratio-root">
      <div ${spread(api.getRootProps())}>
        <div ${spread(api.getContentProps())}>
          <img
            class="aspect-ratio-img"
            src="https://elonehoo.me/gallery/20_sun.jpg"
          >
        </div>
      </div>
    </div>
  `
}
