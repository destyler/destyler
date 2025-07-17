import * as combobox from '@destyler/combobox'
import { normalizeProps, useMachine } from '@destyler/react'
import { comboboxControls } from '@destyler/shared-private'
import { StateVisualizer, Toolbar, useControls } from '@destyler/shared-private/react'
import * as React from 'react'
import { useId } from 'react'

import '@destyler/shared-private/styles/combobox.css'

export default function ComboboxDemo() {
  const controls = useControls(comboboxControls)
  const id = useId()

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
      <div {...api.getRootProps()} className="combobox-root">
        <label {...api.getLabelProps()} className="combobox-label">
          Select country
        </label>

        <div {...api.getControlProps()} className="combobox-control">
          <input
            {...api.getInputProps()}
            className="combobox-input"
          />
          <button
            {...api.getTriggerProps()}
            className="groupcombobox-trigger"
          >
            <div className="combobox-trigger-icon">
              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 32 32"><path fill="currentColor" d="M16 22L6 12l1.4-1.4l8.6 8.6l8.6-8.6L26 12z" /></svg>
            </div>
          </button>
          <button
            {...api.getClearTriggerProps()}
            className="combobox-clear-trigger"
          >
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 32 32"><path fill="currentColor" d="M17.414 16L24 9.414L22.586 8L16 14.586L9.414 8L8 9.414L14.586 16L8 22.586L9.414 24L16 17.414L22.586 24L24 22.586z" /></svg>
          </button>
        </div>
      </div>
      <div
        {...api.getPositionerProps()}
        className="combobox-positioner"
      >
        {options.length > 0 && (
          <ul
            {...api.getContentProps()}
            className="combobox-content"
          >
            {options.map(item => (
              <li
                key={item.code}
                {...api.getItemProps({ item })}
                className="combobox-item"
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
