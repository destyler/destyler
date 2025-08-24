/** @jsxImportSource solid-js */
import { normalizeProps, useMachine } from '@destyler/solid'
import * as steps from '@destyler/steps'
import { createMemo, createUniqueId } from 'solid-js'
import './index.css'

const stepsData = [
  { title: 'Step 1' },
  { title: 'Step 2' },
  { title: 'Step 3' },
]

export default function Steps() {
  const [state, send] = useMachine(
    steps.machine({
      id: createUniqueId(),
      count: stepsData.length,
    }),
  )

  const api = createMemo(() => steps.connect(state, send, normalizeProps))

  return (
    <div {...api().getRootProps()} class='steps-container'>
      <div {...api().getListProps()} class="steps-list">
        {stepsData.map((step, index) => (
          <div
            {...api().getItemProps({ index })}
            class="steps-item"
          >
            <button
              {...api().getTriggerProps({ index })}
              class="steps-trigger"
            >
              <div
                {...api().getIndicatorProps({ index })}
                class="steps-indicator"
              >
                {index + 1}
              </div>
              <span class="steps-title">{step.title}</span>
            </button>
            <div
              {...api().getSeparatorProps({ index })}
              class="steps-separator"
            />
          </div>
        ))}
      </div>

      {stepsData.map((step, index) => (
        <div
          {...api().getContentProps({ index })}
          class="steps-content"
        >
          {step.title}
        </div>
      ))}

      <div
        {...api().getContentProps({ index: stepsData.length })}
        class="steps-content-complete"
      >
        Steps Complete - Thank you for filling out the form!
      </div>

      <div class="steps-navigation">
        <button
          {...api().getPrevTriggerProps()}
          class="btn btn-secondary"
        >
          Back
        </button>
        <button
          {...api().getNextTriggerProps()}
          class="btn btn-primary"
        >
          Next
        </button>
      </div>
    </div>
  )
}
