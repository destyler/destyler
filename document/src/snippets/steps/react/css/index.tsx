import { normalizeProps, useMachine } from '@destyler/react'
import * as steps from '@destyler/steps'
import { useId } from 'react'
import './index.css'

const stepsData = [
  { title: 'Step 1' },
  { title: 'Step 2' },
  { title: 'Step 3' },
]

export default function Steps() {
  const [state, send] = useMachine(
    steps.machine({
      id: useId(),
      count: stepsData.length,
    }),
  )

  const api = steps.connect(state, send, normalizeProps)

  return (
    <div {...api.getRootProps()} className="steps-container">
      <div {...api.getListProps()} className="steps-list">
        {stepsData.map((step, index) => (
          <div
            key={index}
            {...api.getItemProps({ index })}
            className="steps-item"
          >
            <button
              {...api.getTriggerProps({ index })}
              className="steps-trigger"
            >
              <div
                {...api.getIndicatorProps({ index })}
                className="steps-indicator"
              >
                {index + 1}
              </div>
              <span className="steps-title">{step.title}</span>
            </button>
            <div
              {...api.getSeparatorProps({ index })}
              className="steps-separator"
            />
          </div>
        ))}
      </div>

      {stepsData.map((step, index) => (
        <div
          key={index}
          {...api.getContentProps({ index })}
          className="steps-content"
        >
          {step.title}
        </div>
      ))}

      <div
        {...api.getContentProps({ index: stepsData.length })}
        className="steps-content-complete"
      >
        Steps Complete - Thank you for filling out the form!
      </div>

      <div className="steps-navigation">
        <button
          {...api.getPrevTriggerProps()}
          className="btn btn-secondary"
        >
          Back
        </button>
        <button
          {...api.getNextTriggerProps()}
          className="btn btn-primary"
        >
          Next
        </button>
      </div>
    </div>
  )
}
