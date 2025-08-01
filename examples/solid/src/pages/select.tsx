import * as select from '@destyler/select'
import { selectControls } from '@destyler/shared-private'
import { StateVisualizer, Toolbar, useControls } from '@destyler/shared-private/solid'
import { normalizeProps, useMachine } from '@destyler/solid'
import { createMemo, createUniqueId } from 'solid-js'
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
      id: createUniqueId(),
      collection: select.collection({
        items: selectData,
      }),
    }),
    {
      context: controls.context,
    },
  )

  const api = createMemo(() => select.connect(state, send, normalizeProps))

  return (
    <div class="select-root">
      <label
        {...api().getLabelProps()}
        class="select-label"
      >
        Label
      </label>
      <button
        {...api().getTriggerProps()}
        class="select-trigger"
      >
        <span>{api().valueAsString || 'Select option'}</span>
        <span class="select-trigger-icon i-carbon:chevron-right" />
      </button>

      <div
        {...api().getPositionerProps()}
        class="select-positioner"
      >
        <ul
          {...api().getContentProps()}
          class="select-content"
        >
          {selectData.map(item => (
            <li
              {...api().getItemProps({ item })}
              class="select-item"
            >
              <span>{item.label}</span>
              <span
                {...api().getItemIndicatorProps({ item })}
                class="select-item-indicator"
              >
                ✓
              </span>
            </li>
          ))}
        </ul>
      </div>

      <Toolbar controls={controls.ui}>
        <StateVisualizer state={state} />
      </Toolbar>
    </div>
  )
}
