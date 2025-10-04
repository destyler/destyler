import * as combobox from '@destyler/combobox'
import { normalizeProps, useMachine } from '@destyler/react'
import * as React from 'react'
import { createPortal } from 'react-dom'
import './style.css'

const comboboxData = [
  { label: 'Vue', code: 'vue' },
  { label: 'React', code: 'react' },
  { label: 'Svelte', code: 'svelte' },
  { label: 'Solid', code: 'solid' },
  { label: 'Nuxt', code: 'nuxt' },
  { label: 'Next', code: 'next' },
  { label: 'Svelte Kit', code: 'svelte-kit' },
]

export default function Combobox() {
  const [options, setOptions] = React.useState(comboboxData)
  const id = React.useId()

  const collection = React.useMemo(
    () => combobox.collection({
      items: options,
      itemToValue: item => item.code,
      itemToString: item => item.label,
    }),
    [options],
  )

  const [state, send] = useMachine(
    combobox.machine({
      id,
      collection,
      onOpenChange: () => {
        setOptions(comboboxData)
      },
      onInputValueChange: ({ inputValue }) => {
        const filtered = comboboxData.filter(item =>
          item.label.toLowerCase().includes(inputValue.toLowerCase()),
        )
        setOptions(filtered.length > 0 ? filtered : comboboxData)
      },
      placeholder: 'Select a framework',
    }),
  )

  const api = combobox.connect(state, send, normalizeProps)

  return (
    <div {...api.getRootProps()}>
      <div {...api.getControlProps()}>
        <input {...api.getInputProps()} />
        <button {...api.getTriggerProps()}>
          <div />
        </button>
      </div>
      {api.open && createPortal(
        <div data-layout="sinppets" {...api.getPositionerProps()}>
          {options.length > 0 && (
            <ul {...api.getContentProps()}>
              {options.map(item => (
                <li key={item.code} {...api.getItemProps({ item })}>
                  {item.label}
                </li>
              ))}
            </ul>
          )}
        </div>,
        document.body,
      )}
    </div>
  )
}
