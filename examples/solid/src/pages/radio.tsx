/** @jsxImportSource solid-js */
import * as radio from '@destyler/radio'
import { radioControls } from '@destyler/shared-private'
import { StateVisualizer, Toolbar, useControls } from '@destyler/shared-private/solid'
import { normalizeProps, useMachine } from '@destyler/solid'
import { createMemo, createUniqueId, For } from 'solid-js'
import '@destyler/shared-private/styles/radio.css'

export default function RadioDemo() {
  const controls = useControls(radioControls)

  const items = [
    { id: 'apple', label: 'Apples' },
    { id: 'orange', label: 'Oranges' },
    { id: 'mango', label: 'Mangoes' },
    { id: 'grape', label: 'Grapes' },
  ]

  const [state, send] = useMachine(radio.machine({
    id: createUniqueId(),
    name: 'fruits',
  }), {
    context: controls.context,
  })

  const api = createMemo(() => radio.connect(state, send, normalizeProps))

  return (
    <>
      <main class="radio">
        <form>
          <div data-testid="radio-click">radio click</div>
          <fieldset>
            <div {...api().getRootProps()} class="radio-root">
              <h3 {...api().getLabelProps()} class="radio-label">Fruits</h3>
              <div {...api().getIndicatorProps()} />

              <For each={items}>
                {opt => (
                  <label
                    data-testid={`radio-${opt.id}`}
                    class="radio-item"
                    {...api().getItemProps({ value: opt.id })}
                  >
                    <div class="radio-item-control" data-testid={`control-${opt.id}`} {...api().getItemControlProps({ value: opt.id })} />
                    <span class="radio-item-label" data-testid={`label-${opt.id}`} {...api().getItemTextProps({ value: opt.id })}>
                      {opt.label}
                    </span>
                    <input data-testid={`input-${opt.id}`} {...api().getItemHiddenInputProps({ value: opt.id })} />
                  </label>
                )}
              </For>
            </div>

            <button type="reset">Reset</button>
            <button type="button" onClick={() => api().clearValue()}>Clear</button>
            <button type="button" onClick={() => api().setValue('mango')}>Set to Mangoes</button>
            <button type="button" onClick={() => api().focus()}>Focus</button>
          </fieldset>
        </form>
      </main>

      <Toolbar controls={controls.ui}>
        <StateVisualizer state={state} />
      </Toolbar>
    </>
  )
}
