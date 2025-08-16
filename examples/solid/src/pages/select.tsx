/** @jsxImportSource solid-js */
import * as select from '@destyler/select'
import { listData, selectControls } from '@destyler/shared-private'
import { StateVisualizer, Toolbar, useControls } from '@destyler/shared-private/solid'
import { normalizeProps, useMachine } from '@destyler/solid'
import { createMemo, createUniqueId, Index } from 'solid-js'
import '@destyler/shared-private/styles/select.css'

export default function Select() {
  const controls = useControls(selectControls)

  const selectData = listData.map(item => ({
    label: item.label,
    value: item.code,
  }))

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
    <>
      <div class="select-root" {...api().getRootProps()}>
        <div {...api().getControlProps()}>
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

          <button {...api().getClearTriggerProps()}>
            X
          </button>
        </div>
        <form>
          <select {...api().getHiddenSelectProps()}>
            <Index each={selectData}>
              {option => (
                <option
                  value={option().value}
                >
                  {option().label}
                </option>
              )}
            </Index>
          </select>
        </form>

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
                data-testid={`item-${item.value}`}
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
      </div>
      <Toolbar controls={controls.ui}>
        <StateVisualizer state={state} />
      </Toolbar>
    </>
  )
}
