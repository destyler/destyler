import type { ContextFrom } from '@destyler/vanilla'
import { Component, normalizeProps, spreadProps } from '@destyler/vanilla'
import * as aspectRatio from '../../index'
import '../style.css'

const classNames = (...values: Array<string | null | undefined | false>) => values.filter(Boolean).join(' ')

type AspectRatioMachineContext = ContextFrom<typeof aspectRatio.machine>

class AspectRatioExample extends Component<
  aspectRatio.Context,
  aspectRatio.Api,
  AspectRatioMachineContext,
  aspectRatio.MachineState
> {
  initService(context: aspectRatio.Context) {
    return aspectRatio.machine(context) as aspectRatio.Service
  }

  initApi() {
    return aspectRatio.connect(this.service.state, this.service.send, normalizeProps)
  }

  render = () => {
    if (!this.rootEl)
      return
    const rootEl = this.rootEl.querySelector<HTMLElement>('[data-aspect-root]')
    const contentEl = this.rootEl.querySelector<HTMLElement>('[data-aspect-content]')

    if (rootEl) {
      const props = this.api.getRootProps()
      spreadProps(rootEl, { ...props, class: classNames('aspect-ratio-node', props.class) })
    }

    if (contentEl) {
      const props = this.api.getContentProps()
      spreadProps(contentEl, { ...props, class: classNames('aspect-ratio-content', props.class) })
    }
  }
}

export function render(target: HTMLElement, ratio = 16 / 9) {
  target.innerHTML = `
    <div class="aspect-ratio-root" data-aspect-scope>
      <div class="aspect-ratio-node" data-aspect-root>
        <div class="aspect-ratio-content" data-aspect-content>
          <img
            class="aspect-ratio-img"
            src="https://elonehoo.me/gallery/20_sun.jpg"
          >
        </div>
      </div>
    </div>
  `

  const scopeEl = target.querySelector<HTMLElement>('[data-aspect-scope]')
  if (!scopeEl)
    return

  const instance = new AspectRatioExample(scopeEl, { id: 'aspect-ratio:vanilla', ratio })
  instance.init()
}
