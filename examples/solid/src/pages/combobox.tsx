import * as combobox from '@destyler/combobox'
import { comboboxControls } from '@destyler/shared-private'
import { normalizeProps, useMachine } from '@destyler/solid'

import { createMemo, createSignal, createUniqueId } from 'solid-js'
import { StateVisualizer, Toolbar, useControls } from '@destyler/shared-private/solid'

export default function ComboboxDemo() {
  const controls = useControls(comboboxControls)
  const id = createUniqueId()

  const comboboxData = [
    { label: 'Zambia', code: 'ZA' },
    { label: 'Benin', code: 'BN' },
    { label: 'Canada', code: 'CA' },
    { label: 'Japan', code: 'JA' },
    { label: 'Nigeria', code: 'NG' },
  ]

  const [options, setOptions] = createSignal(comboboxData)

  const collectionRef = createMemo(() => combobox.collection({
    items: options(),
    itemToValue: item => item.code,
    itemToString: item => item.label,
  }))

  const [state, send] = useMachine(
    combobox.machine({
      id,
      collection: collectionRef(),
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
        collection: collectionRef(),
      },
    },
  )

  const api = createMemo(() => combobox.connect(state, send, normalizeProps))

  return (
    <>
      <div {...api().getRootProps()} class="w-full max-w-xs mt-8 px-4">
        <label {...api().getLabelProps()} class="block text-sm font-medium text-gray-700 mb-2">
          Select country
        </label>

        <div {...api().getControlProps()} class="relative mt-1">
          <input
            {...api().getInputProps()}
            class="w-full rounded-md border border-gray-300 bg-white py-2 pl-3 pr-10 shadow-sm focus:border-dark focus:outline-none focus:ring-1 focus:ring-dark"
          />
          <button
            {...api().getTriggerProps()}
            class="group absolute inset-y-0 right-0 flex items-center px-2 focus:outline-none"
          >
            <div class="text-gray-400 i-carbon:chevron-down group-data-[state=open]:rotate--180 transition-transform duration-300" />
          </button>
        </div>
      </div>
      <div
        {...api().getPositionerProps()}
        class="w-full max-w-md mt-1 bg-white"
      >
        {options().length > 0 && (
          <ul
            {...api().getContentProps()}
            class="max-h-60 overflow-auto py-1 px-2 rounded-md shadow-lg border border-gray-200"
          >
            {options().map(item => (
              <li
                {...api().getItemProps({ item })}
                class="px-3 py-2 rounded-md data-[highlighted]:bg-dark-100 cursor-pointer text-gray-900 data-[highlighted]:text-light-100"
              >
                {item.label}
              </li>
            ))}
          </ul>
        )}
      </div>
      <Toolbar controls={controls.ui}>
        <StateVisualizer state={state} />
      </Toolbar>
    </>
  )
}
