import * as radio from '@destyler/radio'
import { normalizeProps, useMachine } from '@destyler/react'
import { radioControls } from '@destyler/shared-private'
import { StateVisualizer, Toolbar, useControls } from '@destyler/shared-private/react'
import { useId } from 'react'
import '@destyler/shared-private/styles/radio.css'

export default function RadioDemo() {
  const controls = useControls(radioControls)

  const items = [
    { id: 'apple', label: 'Apples' },
    { id: 'orange', label: 'Oranges' },
    { id: 'mango', label: 'Mangoes' },
    { id: 'grape', label: 'Grapes' },
  ]

  const [state, send] = useMachine(
    radio.machine({
      id: useId(),
      name: 'fruits',
    }),
    {
      context: controls.context,
    },
  )

  const api = radio.connect(state, send, normalizeProps)

  return (
    <>
      <main className="radio">
        <form>
          <div data-testid="radio-click">radio click</div>
          <fieldset>
            <div {...api.getRootProps()} className="radio-root">
              <h3 {...api.getLabelProps()} className="radio-label">
                Fruits
              </h3>
              <div {...api.getIndicatorProps()} />

              {items.map(opt => (
                <label
                  key={opt.id}
                  data-testid={`radio-${opt.id}`}
                  className="radio-item"
                  {...api.getItemProps({ value: opt.id })}
                >
                  <div
                    className="radio-item-control"
                    data-testid={`control-${opt.id}`}
                    {...api.getItemControlProps({ value: opt.id })}
                  />
                  <span
                    className="radio-item-label"
                    data-testid={`label-${opt.id}`}
                    {...api.getItemTextProps({ value: opt.id })}
                  >
                    {opt.label}
                  </span>
                  <input
                    data-testid={`input-${opt.id}`}
                    {...api.getItemHiddenInputProps({ value: opt.id })}
                  />
                </label>
              ))}
            </div>

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
        </form>
      </main>

      <Toolbar controls={controls.ui()}>
        <StateVisualizer state={state} />
      </Toolbar>
    </>
  )
}
