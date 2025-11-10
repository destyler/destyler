import { normalizeProps, useMachine } from '@destyler/react'
import { stepsControls, stepsData } from '@destyler/shared-private'
import { Layout, StateVisualizer, Toolbar, useControls } from '@destyler/shared-private/react'
import { useId } from 'react'
import * as steps from '../../index'
import '../style.css'

export default function Page() {
  const controls = useControls(stepsControls)

  const [state, send] = useMachine(
    steps.machine({
      id: useId(),
      count: stepsData.length,
    }),
    {
      context: controls.context,
    },
  )

  const api = steps.connect(state, send, normalizeProps)

  return (
    <Layout>
      <main>
        <div {...api.getRootProps()}>
          <div {...api.getListProps()}>
            {stepsData.map((step, index) => (
              <div key={index} {...api.getItemProps({ index })}>
                <button {...api.getTriggerProps({ index })}>
                  <div {...api.getIndicatorProps({ index })}>{index + 1}</div>
                  <span>{step.title}</span>
                </button>
                <div {...api.getSeparatorProps({ index })} />
              </div>
            ))}
          </div>

          {stepsData.map((step, index) => (
            <div key={index} {...api.getContentProps({ index })}>
              {step.title}
              {' '}
              -
              {' '}
              {step.description}
            </div>
          ))}

          <div {...api.getContentProps({ index: stepsData.length })}>
            Steps Complete - Thank you for filling out the form!
          </div>

          <div>
            <button {...api.getPrevTriggerProps()}>Back</button>
            <button {...api.getNextTriggerProps()}>Next</button>
          </div>
        </div>
      </main>

      <Toolbar controls={controls.ui()}>
        <StateVisualizer state={state} />
      </Toolbar>
    </Layout>
  )
}
