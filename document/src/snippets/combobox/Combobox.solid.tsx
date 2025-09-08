/** @jsxImportSource solid-js */
import * as combobox from '@destyler/combobox'
import { normalizeProps, useMachine } from '@destyler/solid'
import { createMemo, createSignal, createUniqueId } from 'solid-js'
import { Portal } from 'solid-js/web'
import '../../styles/components/combobox.css'

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
  const [options, setOptions] = createSignal(comboboxData)
  const id = createUniqueId()

  const collection = createMemo(() => combobox.collection({
    items: options(),
    itemToValue: item => item.code,
    itemToString: item => item.label,
  }))

  const [state, send] = useMachine(
    combobox.machine({
      id,
      collection: collection(),
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

  const api = createMemo(() => combobox.connect(state, send, normalizeProps))

  return (
    <div {...api().getRootProps()}>
      <div {...api().getControlProps()}>
        <input {...api().getInputProps()} />
        <button {...api().getTriggerProps()}>
          <div />
        </button>
      </div>
      {api().open && (
        <Portal mount={document.body}>
          <div
            data-layout="sinppets"
            {...api().getPositionerProps()}
          >
            {options().length > 0 && (
              <ul {...api().getContentProps()}>
                {options().map(item => (
                  <li {...api().getItemProps({ item })}>
                    {item.label}
                  </li>
                ))}
              </ul>
            )}
          </div>
        </Portal>
      )}
    </div>
  )
}
