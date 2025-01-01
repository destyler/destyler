import * as combobox from '@destyler/combobox'
import { Component, normalizeProps, spreadProps } from '@destyler/vanilla'
import { nanoid } from 'nanoid'
import './main'

const comboboxData = [
  { label: 'Zambia', code: 'ZA' },
  { label: 'Benin', code: 'BN' },
  { label: 'Canada', code: 'CA' },
  { label: 'Japan', code: 'JA' },
  { label: 'Nigeria', code: 'NG' },
]

export class Combobox extends Component<combobox.Context, combobox.Api> {
  initService(context: combobox.Context) {
    return combobox.machine(context)
  }

  initApi() {
    return combobox.connect(this.service.state, this.service.send, normalizeProps)
  }

  render = () => {
    const rootEl = this.rootEl
    spreadProps(this.rootEl, this.api.getRootProps())
    const triggerEl = rootEl.querySelector<HTMLElement>('.trigger')
    if (triggerEl) {
      spreadProps(triggerEl, this.api.getTriggerProps())
    }
    const clearTriggerEl = rootEl.querySelector<HTMLElement>('.clearTrigger')
    if (clearTriggerEl) {
      spreadProps(clearTriggerEl, this.api.getClearTriggerProps())
    }
    const contentEl = rootEl.querySelector<HTMLElement>('.content')
    if (contentEl) {
      spreadProps(contentEl, this.api.getContentProps())
    }
    const controlEl = rootEl.querySelector<HTMLElement>('.control')
    if (controlEl) {
      spreadProps(controlEl, this.api.getControlProps())
    }
    const inputEl = rootEl.querySelector<HTMLElement>('.input')
    if (inputEl) {
      spreadProps(inputEl, this.api.getInputProps())
    }
    const labelEl = rootEl.querySelector<HTMLElement>('.label')
    if (labelEl) {
      spreadProps(labelEl, this.api.getLabelProps())
    }
    const listEl = rootEl.querySelector<HTMLElement>('.list')
    if (listEl) {
      spreadProps(listEl, this.api.getListProps())
    }
    const positionerEl = rootEl.querySelector<HTMLElement>('.positioner')
    if (positionerEl) {
      spreadProps(positionerEl, this.api.getPositionerProps())
    }

    this.getItems.forEach((itemEl) => {
      this.renderItem(itemEl)
    })
  }

  private get getItems() {
    return Array.from(this.rootEl!.querySelectorAll<HTMLElement>('.item'))
  }

  private renderItem = (itemEl: HTMLElement) => {
    const value = itemEl.dataset.value
    if (!value)
      throw new Error('Expected value to be defined')
    spreadProps(itemEl, this.api.getItemProps({ item: comboboxData.filter(item => item.code === value)[0] }))
  }
}

const collection = combobox.collection({
  items: comboboxData,
  itemToValue: item => item.code,
  itemToString: item => item.label,
})

document.querySelectorAll<HTMLElement>('.combobox-root').forEach((rootEl) => {
  const combobox = new Combobox(rootEl, {
    id: nanoid(),
    collection,
  })
  combobox.init()
})
