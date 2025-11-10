import { normalizeProps, Portal, useMachine } from '@destyler/react'
import { selectControls, selectData } from '@destyler/shared-private'
import { Layout, StateVisualizer, Toolbar, useControls } from '@destyler/shared-private/react'
import { useId } from 'react'
import * as select from '../../index'
import '../style.css'

export default function Page() {
  const controls = useControls(selectControls)

  const [state, send] = useMachine(
    select.machine({
      collection: select.collection({ items: selectData }),
      id: useId(),
      name: 'country',
      onHighlightChange(details) {
        // eslint-disable-next-line no-console
        console.log('onHighlightChange', details)
      },
      onValueChange(details) {
        // eslint-disable-next-line no-console
        console.log('onChange', details)
      },
      onOpenChange(details) {
        // eslint-disable-next-line no-console
        console.log('onOpenChange', details)
      },
    }),
    {
      context: controls.context,
    },
  )

  const api = select.connect(state, send, normalizeProps)

  return (
    <Layout>
      <main>
        <div {...api.getRootProps()}>
          <label {...api.getLabelProps()}>Label</label>
          {/* control */}
          <div {...api.getControlProps()}>
            <button {...api.getTriggerProps()}>
              <span>{api.valueAsString || 'Select option'}</span>
              <span {...api.getIndicatorProps()}>▼</span>
            </button>
            <button {...api.getClearTriggerProps()}>X</button>
          </div>

          <form>
            {/* Hidden select */}
            <select {...api.getHiddenSelectProps()}>
              {api.empty && <option value="" />}
              {selectData.map(option => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
          </form>

          {/* UI select */}
          <Portal>
            <div {...api.getPositionerProps()}>
              <ul {...api.getContentProps()}>
                {selectData.map(item => (
                  <li key={item.value} {...api.getItemProps({ item })}>
                    <span {...api.getItemTextProps({ item })}>{item.label}</span>
                    <span {...api.getItemIndicatorProps({ item })}>✓</span>
                  </li>
                ))}
              </ul>
            </div>
          </Portal>
        </div>
      </main>

      <Toolbar controls={controls.ui()}>
        <StateVisualizer state={state} omit={['collection']} />
      </Toolbar>
    </Layout>
  )
}
