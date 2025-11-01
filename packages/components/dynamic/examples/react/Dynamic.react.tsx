import { normalizeProps, useMachine } from '@destyler/react'
import { dynamicControls } from '@destyler/shared-private'
import { Layout, StateVisualizer, Toolbar, useControls } from '@destyler/shared-private/react'
import { useId } from 'react'
import * as dynamic from '../../index'
import '../style.css'

export default function Page() {
  const controls = useControls(dynamicControls)

  function toDashCase(str: string) {
    return str.replace(/\s+/g, '-').toLowerCase()
  }

  const [state, send] = useMachine(dynamic.machine({
    id: useId(),
    value: ['React', 'Vue'],
  }), {
    context: controls.context,
  })

  const api = dynamic.connect(state, send, normalizeProps)

  return (
    <Layout>
      <main>
        <input data-testid="copy-text" style={{ marginBottom: '1rem' }} />
        <div {...api.getRootProps()}>
          <div>
            {api.value.map((value, index) => (
              <span
                key={index}
                {...api.getItemProps({ index, value })}
                style={{ position: 'relative' }}
              >
                <div
                  data-testid={`${toDashCase(value)}-input`}
                  {...api.getItemPreviewProps({ index, value })}
                >
                  <span>{value}</span>
                  <button
                    {...api.getItemDeleteTriggerProps({ index, value })}
                    data-testid={`${toDashCase(value)}-delete-trigger`}
                  >
                    &#x2715;
                  </button>
                </div>
                <input
                  {...api.getItemInputProps({ index, value })}
                  data-testid={`${toDashCase(value)}-item-input`}
                />
              </span>
            ))}
          </div>
          <input
            placeholder="Add tag..."
            {...api.getInputProps()}
          />
        </div>
      </main>
      <Toolbar controls={controls.ui()}>
        <StateVisualizer state={state} />
      </Toolbar>
    </Layout>
  )
}
