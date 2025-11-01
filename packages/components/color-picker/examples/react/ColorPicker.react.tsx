import { normalizeProps, useMachine } from '@destyler/react'
import { colorPickerControls } from '@destyler/shared-private'
import { Layout, StateVisualizer, Toolbar, useControls } from '@destyler/shared-private/react'
import { useId } from 'react'
import * as colorPicker from '../../index'
import '../style.css'

const presets = ['#f47373', '#697689']

export default function Page() {
  const controls = useControls(colorPickerControls)

  const [state, send] = useMachine(
    colorPicker.machine({
      id: useId(),
      name: 'color',
      format: 'hsla',
      value: colorPicker.parse('hsl(0, 100%, 50%)'),
    }),
    {
      context: controls.context,
    },
  )

  const api = colorPicker.connect(state, send, normalizeProps)

  return (
    <Layout>
      <main>
        <form>
          <input {...api.getHiddenInputProps()} />
          <div {...api.getRootProps()}>
            <label {...api.getLabelProps()}>
              Select Color:
              {' '}
              <span data-testid="value-text">{api.valueAsString}</span>
            </label>

            <div {...api.getControlProps()}>
              <button {...api.getTriggerProps()}>
                <div {...api.getTransparencyGridProps({ size: '10px' })} />
                <div {...api.getSwatchProps({ value: api.value })} />
              </button>
              <input {...api.getChannelInputProps({ channel: 'hex' })} />
              <input {...api.getChannelInputProps({ channel: 'alpha' })} />
            </div>

            <div {...api.getPositionerProps()}>
              <div {...api.getContentProps()}>
                <div className="content__inner">
                  <div {...api.getAreaProps()}>
                    <div {...api.getAreaBackgroundProps()} />
                    <div {...api.getAreaThumbProps()} />
                  </div>

                  <div {...api.getChannelSliderProps({ channel: 'hue' })}>
                    <div {...api.getChannelSliderTrackProps({ channel: 'hue' })} />
                    <div {...api.getChannelSliderThumbProps({ channel: 'hue' })} />
                  </div>

                  <div {...api.getChannelSliderProps({ channel: 'alpha' })}>
                    <div {...api.getTransparencyGridProps({ size: '12px' })} />
                    <div {...api.getChannelSliderTrackProps({ channel: 'alpha' })} />
                    <div {...api.getChannelSliderThumbProps({ channel: 'alpha' })} />
                  </div>

                  {api.format.startsWith('hsl') && (
                    <div style={{ display: 'flex', width: '100%' }}>
                      <span>H</span>
                      {' '}
                      <input {...api.getChannelInputProps({ channel: 'hue' })} />
                      <span>S</span>
                      {' '}
                      <input {...api.getChannelInputProps({ channel: 'saturation' })} />
                      <span>L</span>
                      {' '}
                      <input {...api.getChannelInputProps({ channel: 'lightness' })} />
                      <span>A</span>
                      {' '}
                      <input {...api.getChannelInputProps({ channel: 'alpha' })} />
                    </div>
                  )}

                  {api.format.startsWith('rgb') && (
                    <div style={{ display: 'flex', width: '100%' }}>
                      <span>R</span>
                      {' '}
                      <input {...api.getChannelInputProps({ channel: 'red' })} />
                      <span>G</span>
                      {' '}
                      <input {...api.getChannelInputProps({ channel: 'green' })} />
                      <span>B</span>
                      {' '}
                      <input {...api.getChannelInputProps({ channel: 'blue' })} />
                      <span>A</span>
                      {' '}
                      <input {...api.getChannelInputProps({ channel: 'alpha' })} />
                    </div>
                  )}

                  {api.format.startsWith('hsb') && (
                    <div style={{ display: 'flex', width: '100%' }}>
                      <span>H</span>
                      {' '}
                      <input {...api.getChannelInputProps({ channel: 'hue' })} />
                      <span>S</span>
                      {' '}
                      <input {...api.getChannelInputProps({ channel: 'saturation' })} />
                      <span>B</span>
                      {' '}
                      <input {...api.getChannelInputProps({ channel: 'brightness' })} />
                      <span>A</span>
                      {' '}
                      <input {...api.getChannelInputProps({ channel: 'alpha' })} />
                    </div>
                  )}

                  <div style={{ display: 'flex', gap: '10px', alignItems: 'center' }}>
                    <div style={{ position: 'relative' }}>
                      <div {...api.getTransparencyGridProps({ size: '4px' })} />
                      <div {...api.getSwatchProps({ value: api.value })} />
                    </div>
                    <p data-testid="value-text">{api.valueAsString}</p>
                  </div>

                  <input {...api.getChannelInputProps({ channel: 'hex' })} />

                  <div {...api.getSwatchGroupProps()} style={{ display: 'flex', gap: '10px' }}>
                    {presets.map(preset => (
                      <button key={preset} {...api.getSwatchTriggerProps({ value: preset })}>
                        <div style={{ position: 'relative' }}>
                          <div {...api.getTransparencyGridProps({ size: '4px' })} />
                          <div {...api.getSwatchProps({ value: preset })} />
                        </div>
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </form>
      </main>

      <Toolbar viz controls={controls.ui()}>
        <StateVisualizer state={state} />
      </Toolbar>
    </Layout>
  )
}
