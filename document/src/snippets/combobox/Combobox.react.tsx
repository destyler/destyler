import * as combobox from '@destyler/combobox'
import { normalizeProps, useMachine } from '@destyler/react'
import * as React from 'react'
import { createPortal } from 'react-dom'

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
    <div {...api.getRootProps()} className="w-full outline-none! mt-0!">
      <div {...api.getControlProps()} className="relative outline-none!">
        <input
          {...api.getInputProps()}
          className="flex h-10 w-full rounded-md border border-primary/20 text-primary bg-transparent px-3 py-2 text-sm placeholder:text-muted-foreground disabled:cursor-not-allowed disabled:opacity-50 outline-none!"
        />
        <button
          {...api.getTriggerProps()}
          className="absolute right-0 top-0 h-full px-3 text-muted-foreground hover:text-foreground focus:outline-none"
        >
          <div className="i-carbon:chevron-down h-4 w-4 opacity-50 group-data-[state=open]:rotate--180 transition-transform duration-300" />
        </button>
      </div>
      {api.open && createPortal(
        <div
          {...api.getPositionerProps()}
          className="relative mt-1"
        >
          {options.length > 0 && (
            <ul
              {...api.getContentProps()}
              className="absolute top-0 z-50 px-1 py-1 w-full min-w-[200px] overflow-hidden rounded-md border border-input bg-popover text-popover-foreground shadow-md data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95"
            >
              {options.map(item => (
                <li
                  key={item.code}
                  {...api.getItemProps({ item })}
                  className="relative flex cursor-default select-none items-center rounded-sm px-2 py-1.5 text-sm outline-none data-[highlighted]:bg-accent data-[highlighted]:text-accent-foreground"
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
