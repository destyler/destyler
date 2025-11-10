/** @jsxImportSource solid-js */

import { stepsControls, stepsData } from '@destyler/shared-private'
import { Layout, StateVisualizer, Toolbar, useControls } from '@destyler/shared-private/solid'
import { normalizeProps, useMachine } from '@destyler/solid'
import { createMemo, createUniqueId, Index } from 'solid-js'
import * as steps from '../../index'
import '../style.css'

export default function Page() {
  const controls = useControls(stepsControls)

  const [state, send] = useMachine(
    steps.machine({
      id: createUniqueId(),
      count: stepsData.length,
    }),
    {
      context: controls.context,
    },
  )

  const api = createMemo(() => steps.connect(state, send, normalizeProps))

  return (
    <Layout>
      <main>
        <div {...api().getRootProps()}>
          <div {...api().getListProps()}>
            <Index each={stepsData}>
              {(step, index) => (
                <div {...api().getItemProps({ index })}>
                  <button {...api().getTriggerProps({ index })}>
                    <div {...api().getIndicatorProps({ index })}>{index + 1}</div>
                    <span>{step().title}</span>
                  </button>
                  <div {...api().getSeparatorProps({ index })} />
                </div>
              )}
            </Index>
          </div>

          <Index each={stepsData}>
            {(step, index) => (
              <div {...api().getContentProps({ index })}>
                {step().title}
                {' '}
                -
                {' '}
                {step().description}
              </div>
            )}
          </Index>

          <div {...api().getContentProps({ index: stepsData.length })}>
            Steps Complete - Thank you for filling out the form!
          </div>

          <div>
            <button {...api().getPrevTriggerProps()}>Back</button>
            <button {...api().getNextTriggerProps()}>Next</button>
          </div>
        </div>
      </main>

      <Toolbar controls={controls.ui}>
        <StateVisualizer state={state} />
      </Toolbar>
    </Layout>
  )
}
