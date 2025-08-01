import { normalizeProps, useMachine } from '@destyler/react'
import * as select from '@destyler/select'
import { selectControls } from '@destyler/shared-private'
import { StateVisualizer, Toolbar, useControls } from '@destyler/shared-private/react'
import { useId } from 'react'
import '@destyler/shared-private/styles/select.css'

export default function Select() {
  const controls = useControls(selectControls)

  const selectData = [
    { label: 'Nigeria', value: 'NG' },
    { label: 'Japan', value: 'JP' },
    // ...
  ]

  const [state, send] = useMachine(
    select.machine({
      id: useId(),
      collection: select.collection({
        items: selectData,
      }),
    }),
    {
      context: controls.context,
    },
  )

  const api = select.connect(state, send, normalizeProps)

  return (
    <div className="select-root">
      <label
        {...api.getLabelProps()}
        className="select-label"
      >
        Label
      </label>
      <button
        {...api.getTriggerProps()}
        className="select-trigger"
      >
        <span>{api.valueAsString || 'Select option'}</span>
        <span className="select-trigger-icon i-carbon:chevron-right" />
      </button>

      <div
        {...api.getPositionerProps()}
        className="select-positioner"
      >
        <ul
          {...api.getContentProps()}
          className="select-content"
        >
          {selectData.map(item => (
            <li
              key={item.value}
              {...api.getItemProps({ item })}
              className="select-item"
            >
              <span>{item.label}</span>
              <span
                {...api.getItemIndicatorProps({ item })}
                className="select-item-indicator"
              >
                ✓
              </span>
            </li>
          ))}
        </ul>
      </div>

      <Toolbar controls={controls.ui()}>
        <StateVisualizer state={state} />
      </Toolbar>
    </div>
  )
}
