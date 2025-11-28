import type { ContextFrom } from '@destyler/vanilla'
import type { MachineState, State as RadioState } from '../../src/types'
import { radioControls, radioData } from '@destyler/shared-private'
import { Controls as ControlsPanel, Layout, StateVisualizer, Toolbar, useControls } from '@destyler/shared-private/vanilla'
import { Component, normalizeProps, spreadProps } from '@destyler/vanilla'
import * as radio from '../../index'
import '../style.css'

type RadioMachineContext = ContextFrom<typeof radio.machine>

interface RadioItemElements {
  value: string
  itemEl: HTMLLabelElement | null
  controlEl: HTMLElement | null
  textEl: HTMLElement | null
  inputEl: HTMLInputElement | null
}

class RadioExample extends Component<radio.Context, radio.Api, RadioMachineContext, MachineState> {
  private readonly fieldsetEl: HTMLFieldSetElement | null
  private readonly rootNode: HTMLElement | null
  private readonly labelEl: HTMLElement | null
  private readonly indicatorEl: HTMLElement | null
  private readonly clearButton: HTMLButtonElement | null
  private readonly setValueButton: HTMLButtonElement | null
  private readonly focusButton: HTMLButtonElement | null
  private readonly items: RadioItemElements[]
  private readonly stateListeners = new Set<(state: RadioState) => void>()

  constructor(rootEl: HTMLElement, context: radio.Context, options?: any) {
    super(rootEl, context, options)
    this.fieldsetEl = rootEl.querySelector('fieldset')
    this.rootNode = rootEl.querySelector('[data-radio-root]')
    this.labelEl = rootEl.querySelector('[data-radio-label]')
    this.indicatorEl = rootEl.querySelector('[data-radio-indicator]')
    this.clearButton = rootEl.querySelector('[data-radio-clear]')
    this.setValueButton = rootEl.querySelector('[data-radio-set]')
    this.focusButton = rootEl.querySelector('[data-radio-focus]')

    this.items = radioData.map(item => ({
      value: item.id,
      itemEl: rootEl.querySelector(`[data-radio-item="${item.id}"]`),
      controlEl: rootEl.querySelector(`[data-radio-control="${item.id}"]`),
      textEl: rootEl.querySelector(`[data-radio-text="${item.id}"]`),
      inputEl: rootEl.querySelector(`[data-radio-input="${item.id}"]`),
    }))

    this.clearButton?.addEventListener('click', () => this.api?.clearValue())
    this.setValueButton?.addEventListener('click', () => this.api?.setValue('mango'))
    this.focusButton?.addEventListener('click', () => this.api?.focus())
  }

  initService(context: radio.Context) {
    return radio.machine(context) as radio.Service
  }

  initApi() {
    return radio.connect(this.service.state, this.service.send, normalizeProps)
  }

  onStateChange(listener: (state: RadioState) => void) {
    this.stateListeners.add(listener)
  }

  protected override onTransition(state: RadioState) {
    this.stateListeners.forEach(listener => listener(state))
  }

  render = () => {
    const api = this.api

    if (this.fieldsetEl)
      this.fieldsetEl.disabled = Boolean(this.service.state.context.fieldsetDisabled)

    if (this.rootNode)
      spreadProps(this.rootNode, api.getRootProps())

    if (this.labelEl)
      spreadProps(this.labelEl, api.getLabelProps())

    if (this.indicatorEl)
      spreadProps(this.indicatorEl, api.getIndicatorProps())

    this.items.forEach(({ value, itemEl, controlEl, textEl, inputEl }) => {
      if (itemEl) {
        spreadProps(itemEl, {
          ...api.getItemProps({ value }),
          'data-testid': `radio-${value}`,
        })
        itemEl.setAttribute('data-radio-item', value)
      }

      if (controlEl) {
        spreadProps(controlEl, {
          ...api.getItemControlProps({ value }),
          'data-testid': `control-${value}`,
        })
        controlEl.setAttribute('data-radio-control', value)
      }

      if (textEl) {
        spreadProps(textEl, {
          ...api.getItemTextProps({ value }),
          'data-testid': `label-${value}`,
        })
        textEl.setAttribute('data-radio-text', value)
        const labelText = radioData.find(item => item.id === value)?.label ?? ''
        textEl.textContent = labelText
      }

      if (inputEl) {
        spreadProps(inputEl, {
          ...api.getItemHiddenInputProps({ value }),
          'data-testid': `input-${value}`,
        })
        inputEl.setAttribute('data-radio-input', value)
      }
    })
  }
}

export function render(target: HTMLElement) {
  const controls = useControls(radioControls)
  const layout = Layout()
  target.innerHTML = ''
  target.appendChild(layout.root)

  const optionsMarkup = radioData.map(item => `
    <label data-radio-item="${item.id}" data-testid="radio-${item.id}">
      <div data-radio-control="${item.id}" data-testid="control-${item.id}"></div>
      <span data-radio-text="${item.id}" data-testid="label-${item.id}">${item.label}</span>
      <input data-radio-input="${item.id}" data-testid="input-${item.id}" />
    </label>
  `).join('')

  layout.main.innerHTML = `
    <div data-testid="outside">out side</div>
    <main class="radio">
      <div data-radio-example>
        <fieldset>
          <div data-radio-root>
            <h3 data-radio-label>Fruits</h3>
            <div data-radio-indicator></div>
            ${optionsMarkup}
          </div>

          <button type="reset">Reset</button>
          <button type="button" data-radio-clear>Clear</button>
          <button type="button" data-radio-set>Set to Mangoes</button>
          <button type="button" data-radio-focus>Focus</button>
        </fieldset>
      </div>
    </main>
  `

  const scope = layout.main.querySelector<HTMLElement>('[data-radio-example]')
  if (!scope)
    return

  const toolbar = Toolbar()
  toolbar.setControlsSlot(() => ControlsPanel(controls))
  layout.root.appendChild(toolbar.root)

  const instance = new RadioExample(scope, { id: 'radio:vanilla', name: 'fruits' }, {
    context: {
      get: () => controls.context as Partial<RadioMachineContext>,
      subscribe: (fn: (ctx: Partial<RadioMachineContext>) => void) => controls.subscribe(fn),
    },
  })
  instance.init()

  const updateVisualizer = (state?: RadioState) => {
    if (!state)
      return
    toolbar.setVisualizerSlot(() => StateVisualizer({ state }))
  }

  updateVisualizer(instance.state as RadioState)
  instance.onStateChange(updateVisualizer)
}
