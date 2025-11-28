import type { ContextFrom } from '@destyler/vanilla'
import type { State as ClipboardState, MachineState } from '../../src/types'
import { clipboardControls } from '@destyler/shared-private'
import { Controls as ControlsPanel, Layout, StateVisualizer, Toolbar, useControls } from '@destyler/shared-private/vanilla'
import { Component, normalizeProps, spreadProps } from '@destyler/vanilla'
import * as clipboard from '../../index'
import '../style.css'

type ClipboardMachineContext = ContextFrom<typeof clipboard.machine>

class ClipboardExample extends Component<
  clipboard.Context,
  clipboard.Api,
  ClipboardMachineContext,
  MachineState
> {
  private readonly labelEl: HTMLLabelElement | null
  private readonly controlEl: HTMLElement | null
  private readonly inputEl: HTMLInputElement | null
  private readonly triggerEl: HTMLButtonElement | null
  private readonly copiedIndicatorEl: HTMLElement | null
  private readonly idleIndicatorEl: HTMLElement | null
  private readonly stateListeners = new Set<(state: ClipboardState) => void>()

  constructor(rootEl: HTMLElement, context: clipboard.Context, options?: any) {
    super(rootEl, context, options)
    this.labelEl = rootEl.querySelector('[data-clipboard-label]')
    this.controlEl = rootEl.querySelector('[data-clipboard-control]')
    this.inputEl = rootEl.querySelector('[data-clipboard-input]')
    this.triggerEl = rootEl.querySelector('[data-clipboard-trigger]')
    this.copiedIndicatorEl = rootEl.querySelector('[data-clipboard-indicator][data-copied="true"]')
    this.idleIndicatorEl = rootEl.querySelector('[data-clipboard-indicator][data-copied="false"]')
  }

  initService(context: clipboard.Context) {
    return clipboard.machine(context) as clipboard.Service
  }

  initApi() {
    return clipboard.connect(this.service.state, this.service.send, normalizeProps)
  }

  onStateChange(listener: (state: ClipboardState) => void) {
    this.stateListeners.add(listener)
  }

  protected override onTransition(state: ClipboardState) {
    this.stateListeners.forEach(listener => listener(state))
  }

  render = () => {
    const api = this.api

    spreadProps(this.rootEl, api.getRootProps())

    if (this.labelEl) {
      spreadProps(this.labelEl, api.getLabelProps())
    }

    if (this.controlEl) {
      spreadProps(this.controlEl, api.getControlProps())
    }

    if (this.inputEl) {
      spreadProps(this.inputEl, api.getInputProps())
      this.inputEl.style.width = '100%'
    }

    if (this.triggerEl) {
      spreadProps(this.triggerEl, {
        ...api.getTriggerProps(),
        textContent: api.copied ? 'Copied' : 'Copy',
      })
    }

    if (this.copiedIndicatorEl) {
      spreadProps(this.copiedIndicatorEl, {
        ...api.getIndicatorProps({ copied: true }),
        textContent: 'Copied!',
      })
    }

    if (this.idleIndicatorEl) {
      spreadProps(this.idleIndicatorEl, {
        ...api.getIndicatorProps({ copied: false }),
        textContent: 'Copy',
      })
    }
  }
}

export function render(target: HTMLElement) {
  const controls = useControls(clipboardControls)
  const layout = Layout()

  target.innerHTML = ''
  target.appendChild(layout.root)

  layout.main.innerHTML = `
    <div data-clipboard-root>
      <label data-clipboard-label>Copy this link</label>
      <div data-clipboard-control>
        <input data-clipboard-input value="https://destyler.org" />
        <button data-clipboard-trigger type="button">Copy</button>
      </div>
      <div data-clipboard-indicator data-copied="true">Copied!</div>
      <div data-clipboard-indicator data-copied="false">Copy</div>
    </div>
  `

  const rootEl = layout.main.querySelector<HTMLElement>('[data-clipboard-root]')
  if (!rootEl)
    return

  const toolbar = Toolbar()
  toolbar.setControlsSlot(() => ControlsPanel(controls))
  layout.root.appendChild(toolbar.root)

  const instance = new ClipboardExample(rootEl, {
    id: 'clipboard:vanilla',
    value: 'https://destyler.org',
  }, {
    context: {
      get: () => controls.context as Partial<ClipboardMachineContext>,
      subscribe: (fn: any) => controls.subscribe(fn),
    },
  })

  instance.init()

  const updateVisualizer = (state?: ClipboardState) => {
    if (!state)
      return
    toolbar.setVisualizerSlot(() => StateVisualizer({ state }))
  }

  updateVisualizer(instance.state as ClipboardState)
  instance.onStateChange(updateVisualizer)
}
