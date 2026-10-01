import { normalizeProps, spreadProps } from '@destyler/vanilla'
import { collection } from '../src/collection'
import { connect } from '../src/connect'
import { machine } from '../src/machine'

export function renderGroupedCombobox(composite: boolean) {
  const groups = [
    { id: 'land', label: 'Land', items: ['Cat', 'Dog'] },
    { id: 'water', label: 'Water', items: ['Dolphin', 'Eel'] },
  ]
  const root = document.createElement('div')
  const label = document.createElement('label')
  label.textContent = 'Animal'
  const control = document.createElement('div')
  const input = document.createElement('input')
  const trigger = document.createElement('button')
  trigger.textContent = 'Open'
  const positioner = document.createElement('div')
  const content = document.createElement('div')
  const list = document.createElement('div')
  const groupElements = groups.map((group) => {
    const container = document.createElement('div')
    const heading = document.createElement('div')
    heading.textContent = group.label
    const options = group.items.map((item) => {
      const option = document.createElement('div')
      option.textContent = item
      return option
    })
    container.append(heading, ...options)
    return { container, heading, options }
  })

  const containers = groupElements.map(group => group.container)
  if (!composite)
    list.append(...containers)
  control.append(...(composite ? [input, trigger] : [trigger]))
  content.append(...(composite ? containers : [input, list]))
  positioner.append(content)
  root.append(label, control)
  // Keep the popup outside the root, as with a framework portal.
  document.body.append(root, positioner)

  const service = machine({
    id: 'grouped-combobox',
    composite,
    collection: collection({ items: groups.flatMap(group => group.items) }),
  })
  service.start()
  const api = () => connect(service.getState(), service.send, normalizeProps)
  const render = () => {
    const current = api()
    spreadProps(root, current.getRootProps())
    spreadProps(label, current.getLabelProps())
    spreadProps(control, current.getControlProps())
    spreadProps(input, current.getInputProps())
    spreadProps(trigger, current.getTriggerProps({ focusable: !composite }))
    spreadProps(positioner, current.getPositionerProps())
    spreadProps(content, current.getContentProps())
    if (!composite)
      spreadProps(list, current.getListProps())
    groups.forEach((group, index) => {
      const elements = groupElements[index]
      spreadProps(elements.container, current.getItemGroupProps({ id: group.id }))
      spreadProps(elements.heading, current.getItemGroupLabelProps({ htmlFor: group.id }))
      group.items.forEach((item, itemIndex) => {
        spreadProps(elements.options[itemIndex], current.getItemProps({ item }))
      })
    })
  }
  render()
  const unsubscribe = service.subscribe(render)

  return {
    api,
    input,
    content,
    listbox: composite ? content : list,
    groupElements,
    cleanup() {
      unsubscribe()
      service.stop()
      root.remove()
      positioner.remove()
    },
  }
}
