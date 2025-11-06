import { normalizeProps, useMachine } from '@destyler/react'
import { radioControls, radioData } from '@destyler/shared-private'
import { Layout, StateVisualizer, Toolbar, useControls } from '@destyler/shared-private/react'
import { useId } from 'react'
import * as radio from '../../index'
import '../style.css'

export default function Page() {
  const controls = useControls(radioControls)

  const [state, send] = useMachine(
    radio.machine({
      id: useId(),
      name: 'fruit',
    }),
    {
      context: controls.context,
    },
  )

  const api = radio.connect(state, send, normalizeProps)

  return (
    <Layout>
      <main>
        <fieldset disabled={false}>
          <div {...api.getRootProps()}>
            <h3 {...api.getLabelProps()}>Fruits</h3>
            <div {...api.getIndicatorProps()} />
            {radioData.map(opt => (
              <label key={opt.id} data-testid={`radio-${opt.id}`} {...api.getItemProps({ value: opt.id })}>
                <div data-testid={`control-${opt.id}`} {...api.getItemControlProps({ value: opt.id })} />
                <span data-testid={`label-${opt.id}`} {...api.getItemTextProps({ value: opt.id })}>
                  {opt.label}
                </span>
                <input data-testid={`input-${opt.id}`} {...api.getItemHiddenInputProps({ value: opt.id })} />
              </label>
            ))}
          </div>

          {/*  */}
          <button type="reset">Reset</button>
          <button type="button" onClick={() => api.clearValue()}>
              Clear
          </button>
          <button type="button" onClick={() => api.setValue('mango')}>
              Set to Mangoes
          </button>
          <button type="button" onClick={() => api.focus()}>
              Focus
          </button>
        </fieldset>
      </main>

      <Toolbar controls={controls.ui()}>
        <StateVisualizer state={state} />
      </Toolbar>
    </Layout>
  )
}
