import type { FC } from 'react'
import { normalizeProps, useMachine } from '@destyler/react'
import { switchControls } from '@destyler/shared-private'
import { StateVisualizer, Toolbar, useControls } from '@destyler/shared-private/react'
import * as switchComponent from '@destyler/switch'
import { useId } from 'react'

const Switch: FC = () => {
  const controls = useControls(switchControls)

  const [state, send] = useMachine(switchComponent.machine({
    id: useId(),
    checked: false,
  }), {
    context: controls.context,
  })

  const [disabledState, disabledSend] = useMachine(switchComponent.machine({
    id: useId(),
    checked: false,
    disabled: true,
  }))

  const api = switchComponent.connect(state, send, normalizeProps)
  const disabledApi = switchComponent.connect(disabledState, disabledSend, normalizeProps)

  return (
    <>
      <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
        {/* Regular switch */}
        <div {...api.getRootProps()}>
          <div
            {...api.getControlProps()}
            style={{
              width: '44px',
              height: '24px',
              borderRadius: '12px',
              background: api.checked ? '#007acc' : '#ccc',
              position: 'relative',
              cursor: 'pointer',
              transition: 'all 0.2s',
            }}
          >
            <div
              {...api.getThumbProps()}
              style={{
                width: '20px',
                height: '20px',
                borderRadius: '10px',
                background: 'white',
                position: 'absolute',
                top: '2px',
                left: api.checked ? '22px' : '2px',
                transition: 'all 0.2s',
              }}
            />
            <input {...api.getHiddenInputProps()} data-testid="hidden-input" />
          </div>
          <div {...api.getLabelProps()}>Switch Label</div>
        </div>

        {/* Disabled switch */}
        <div {...disabledApi.getRootProps()} data-testid="disabled-switch">
          <div
            {...disabledApi.getControlProps()}
            style={{
              width: '44px',
              height: '24px',
              borderRadius: '12px',
              background: '#e0e0e0',
              position: 'relative',
              cursor: 'not-allowed',
              opacity: 0.6,
            }}
          >
            <div
              {...disabledApi.getThumbProps()}
              style={{
                width: '20px',
                height: '20px',
                borderRadius: '10px',
                background: 'white',
                position: 'absolute',
                top: '2px',
                left: '2px',
              }}
            />
            <input {...disabledApi.getHiddenInputProps()} data-testid="disabled-input" />
          </div>
          <div {...disabledApi.getLabelProps()}>Disabled Switch</div>
        </div>
      </div>
      <Toolbar controls={controls.ui()}>
        <StateVisualizer state={state} />
      </Toolbar>
    </>
  )
}

export default Switch
