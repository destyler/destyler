import * as combobox from '@destyler/combobox'
import { normalizeProps, useMachine } from '@destyler/react'
import * as React from 'react'
import { createPortal } from 'react-dom'
import './index.css'

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
    <div {...api.getRootProps()} className="combobox-root">
      <div {...api.getControlProps()} className="combobox-control">
        <input
          {...api.getInputProps()}
          className="combobox-input"
        />
        <button
          {...api.getTriggerProps()}
          className="combobox-trigger"
        >
          <div className="combobox-chevron" data-state={api.open ? 'open' : 'closed'}>
            <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M4 6L8 10L12 6" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </div>
        </button>
      </div>
      {api.open && createPortal(
        <div
          {...api.getPositionerProps()}
          className="combobox-positioner"
        >
          {options.length > 0 && (
            <ul
              {...api.getContentProps()}
              className="combobox-content"
              data-state={api.open ? 'open' : 'closed'}
            >
              {options.map(item => (
                <li
                  key={item.code}
                  {...api.getItemProps({ item })}
                  className="combobox-item"
                  data-highlighted={api.highlightedValue === item.code}
                >
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
