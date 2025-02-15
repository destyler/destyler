import { normalizeProps, useMachine } from '@destyler/react'
import * as tour from '@destyler/tour'
import { useId } from 'react'
import { createPortal } from 'react-dom'

function Tour() {
  const steps: tour.StepDetails[] = [
    {
      type: 'dialog',
      id: 'start',
      title: 'Ready to go for a ride',
      description: 'Let\'s take the tour component for a ride and have some fun!',
      actions: [{ label: 'Let\'s go!', action: 'next' }],
    },
    {
      type: 'dialog',
      id: 'logic',
      title: 'Statechart',
      description: `As an engineer, you'll learn about the internal statechart that powers the tour.`,
      actions: [
        { label: 'Prev', action: 'prev' },
        { label: 'Next', action: 'next' },
      ],
    },
    {
      type: 'dialog',
      id: 'end',
      title: 'Amazing! You got to the end',
      description: 'Like what you see? Now go ahead and use it in your project.',
      actions: [{ label: 'Finish', action: 'dismiss' }],
    },
  ]

  const [state, send] = useMachine(tour.machine({ id: useId(), steps }))
  const api = tour.connect(state, send, normalizeProps)
  const open = api.open && api.step

  return (
    <>
      <div>
        <button onClick={() => api.start()}>Start Tour</button>
        <div id="step-1">Step 1</div>
      </div>

      {open && createPortal(
        <>
          {api.step?.backdrop && <div {...api.getBackdropProps()} />}
          <div {...api.getSpotlightProps()} />
          <div {...api.getPositionerProps()} className="fixed">
            <div {...api.getContentProps()}>
              {api.step?.arrow && (
                <div {...api.getArrowProps()}>
                  <div {...api.getArrowTipProps()} />
                </div>
              )}

              <p {...api.getTitleProps()}>{api.step?.title}</p>
              <div {...api.getDescriptionProps()}>{api.step?.description}</div>
              <div {...api.getProgressTextProps()}>
                {api.getProgressText()}
              </div>

              {api.step?.actions && (
                <div className="tour button__group">
                  {api.step.actions.map(action => (
                    <button
                      key={action.label}
                      {...api.getActionTriggerProps({ action })}
                    >
                      {action.label}
                    </button>
                  ))}
                </div>
              )}

              <button {...api.getCloseTriggerProps()}>X</button>
            </div>
          </div>
        </>,
        document.body,
      )}
    </>
  )
}

export default Tour
