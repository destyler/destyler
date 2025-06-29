import * as combobox from '@destyler/combobox'
import { normalizeProps, useMachine } from '@destyler/react'
import { comboboxControls } from '@destyler/shared-private'
import { StateVisualizer, Toolbar, useControls } from '@destyler/shared-private/react'
import * as React from 'react'

import { useId } from 'react'

export default function ComboboxDemo() {
  const controls = useControls(comboboxControls)
  const id = useId()

  const comboboxData = [
    { label: 'Zambia', code: 'ZA' },
    { label: 'Benin', code: 'BN' },
    { label: 'Canada', code: 'CA' },
    { label: 'Japan', code: 'JA' },
    { label: 'Nigeria', code: 'NG' },
  ]

  const [options, setOptions] = React.useState(comboboxData)

  const collectionRef = React.useMemo(
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
      collection: collectionRef,
      onOpenChange: () => {
        setOptions(comboboxData)
      },
      onInputValueChange: ({ inputValue }) => {
        const filtered = comboboxData.filter(item =>
          item.label.toLowerCase().includes(inputValue.toLowerCase()),
        )
        setOptions(filtered.length > 0 ? filtered : comboboxData)
      },
    }),
    {
      context: {
        ...controls.context,
        collection: collectionRef,
      },
    },
  )

  const api = combobox.connect(state, send, normalizeProps)

  return (
    <>
      <div {...api.getRootProps()} className="w-full max-w-xs mt-8 px-4">
        <label {...api.getLabelProps()} className="block text-sm font-medium text-gray-700 mb-2">
          Select country
        </label>

        <div {...api.getControlProps()} className="relative mt-1">
          <input
            {...api.getInputProps()}
            className="w-full rounded-md border border-gray-300 bg-white py-2 pl-3 pr-10 shadow-sm focus:border-dark focus:outline-none focus:ring-1 focus:ring-dark"
          />
          <button
            {...api.getTriggerProps()}
            className="group absolute inset-y-0 right-0 flex items-center px-2 focus:outline-none"
          >
            <div className="text-gray-400 i-carbon:chevron-down group-data-[state=open]:rotate--180 transition-transform duration-300" />
          </button>
        </div>
      </div>
      <div
        {...api.getPositionerProps()}
        className="w-full max-w-md mt-1 bg-white"
      >
        {options.length > 0 && (
          <ul
            {...api.getContentProps()}
            className="max-h-60 overflow-auto py-1 px-2 rounded-md shadow-lg border border-gray-200"
          >
            {options.map(item => (
              <li
                key={item.code}
                {...api.getItemProps({ item })}
                className="px-3 py-2 rounded-md data-[highlighted]:bg-dark-100 cursor-pointer text-gray-900 data-[highlighted]:text-light-100"
              >
                {item.label}
              </li>
            ))}
          </ul>
        )}
      </div>
      <Toolbar controls={controls.ui()}>
        <StateVisualizer state={state} />
      </Toolbar>
    </>
  )
}
