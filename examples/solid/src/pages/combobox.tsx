/** @jsxImportSource solid-js */
import * as combobox from '@destyler/combobox'
import { comboboxControls } from '@destyler/shared-private'
import { StateVisualizer, Toolbar, useControls } from '@destyler/shared-private/solid'
import { normalizeProps, useMachine } from '@destyler/solid'
import { matchSorter } from 'match-sorter'
import { createMemo, createSignal, createUniqueId, Index, Show } from 'solid-js'
import '@destyler/shared-private/styles/combobox.css'

export default function ComboboxDemo() {
  const controls = useControls(comboboxControls)

  const comboboxData = [
    { label: 'Zambia', code: 'ZA' },
    { label: 'Benin', code: 'BN' },
    { label: 'Canada', code: 'CA' },
    { label: 'United States', code: 'US' },
    { label: 'Japan', code: 'JP' },
    { label: 'Nigeria', code: 'NG' },
    { label: 'Albania', code: 'AL' },
    { label: 'Algeria', code: 'DZ' },
    { label: 'American Samoa', code: 'AS' },
    { label: 'Andorra', code: 'AD' },
    { label: 'Angola', code: 'AO' },
    { label: 'Anguilla', code: 'AI' },
    { label: 'Antarctica', code: 'AQ' },
    { label: 'Australia', code: 'AU' },
    { label: 'Austria', code: 'AT' },
    { label: 'Azerbaijan', code: 'AZ' },
    { label: 'Bahamas', code: 'BS' },
    { label: 'Bahrain', code: 'BH' },
    { label: 'Madagascar', code: 'MG' },
    { label: 'Malawi', code: 'MW' },
    { label: 'Malaysia', code: 'MY' },
    { label: 'Maldives', code: 'MV' },
    { label: 'Mali', code: 'ML' },
    { label: 'Malta', code: 'MT' },
    { label: 'Togo', code: 'TG' },
    { label: 'Tokelau', code: 'TK' },
    { label: 'Tonga', code: 'TO' },
    { label: 'Trinidad and Tobago', code: 'TT' },
    { label: 'Tunisia', code: 'TN' },
  ]

  const [options, setOptions] = createSignal(comboboxData)

  const collection = createMemo(() =>
    combobox.collection({
      items: options(),
      itemToValue: item => item.code,
      itemToString: item => item.label,
    }),
  )

  const [state, send] = useMachine(
    combobox.machine({
      id: createUniqueId(),
      collection: collection(),
      onOpenChange() {
        setOptions(comboboxData)
      },
      onInputValueChange({ inputValue }) {
        const filtered = matchSorter(comboboxData, inputValue, { keys: ['label'] })
        setOptions(filtered.length > 0 ? filtered : comboboxData)
      },
    }),
    {
      context: createMemo(() => ({
        ...controls.context(),
        collection: collection(),
      })),
    },
  )

  const api = createMemo(() => combobox.connect(state, send, normalizeProps))

  return (
    <>
      <div {...api().getRootProps()} class="combobox-root">
        <label {...api().getLabelProps()} class="combobox-label">
          Select country
        </label>

        <div {...api().getControlProps()} class="combobox-control">
          <input
            {...api().getInputProps()}
            class="combobox-input"
          />
          <button
            {...api().getTriggerProps()}
            class="group combobox-trigger"
          >
            <div class="combobox-trigger-icon">
              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 32 32"><path fill="currentColor" d="M16 22L6 12l1.4-1.4l8.6 8.6l8.6-8.6L26 12z" /></svg>
            </div>
          </button>
          <button
            {...api().getClearTriggerProps()}
            class="combobox-clear-trigger"
          >
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 32 32"><path fill="currentColor" d="M17.414 16L24 9.414L22.586 8L16 14.586L9.414 8L8 9.414L14.586 16L8 22.586L9.414 24L16 17.414L22.586 24L24 22.586z" /></svg>
          </button>
        </div>
      </div>
      <div
        {...api().getPositionerProps()}
        class="combobox-positioner"
      >
        <Show when={options().length > 0}>
          <ul
            {...api().getContentProps()}
            class="combobox-content"
          >
            <Index each={options()}>
              {item => (
                <li
                  {...api().getItemProps({ item: item() })}
                  class="combobox-item"
                >
                  {item().label}
                </li>
              )}
            </Index>
          </ul>
        </Show>
      </div>
      <Toolbar controls={controls.ui}>
        <StateVisualizer state={state} omit={['collection']} />
      </Toolbar>
    </>
  )
}
