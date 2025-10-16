import { normalizeProps, Portal, useMachine } from '@destyler/react'
import * as tour from '@destyler/tour'
import { useId } from 'react'
import './style.css'

export default function Page() {
  const [state, send] = useMachine(
    tour.machine({
      id: useId(),
      steps: [
        {
          type: 'dialog',
          id: 'step-0',
          title: 'Starting Point',
          description: 'Click the start button to begin the tour.',
          actions: [{ label: 'Next', action: 'next' }],
        },
        {
          type: 'tooltip',
          id: 'step-1',
          title: 'Welcome',
          description: 'this is the first step of the tour.',
          target: () => document.querySelector<HTMLElement>('#_top'),
          actions: [
            { label: 'Prev', action: 'prev' },
            { label: 'Next', action: 'next' },
          ],
        },
        {
          type: 'tooltip',
          id: 'step-2',
          title: 'What is a tour?',
          description: 'A tour is a series of steps that guide users through your app.',
          target: () => document.querySelector<HTMLElement>('#what-is-a-tour'),
          actions: [
            { label: 'Prev', action: 'prev' },
            { label: 'Next', action: 'next' },
          ],
        },
        {
          type: 'dialog',
          id: 'step-5',
          title: 'Amazing! You got to the end',
          description: 'Like what you see? Now go ahead and use it in your project.',
          actions: [{ label: 'Finish', action: 'dismiss' }],
        },
      ],
    }),
  )

  const api = tour.connect(state, send, normalizeProps)

  return (
    <>
      <button className="btn" onClick={() => api.start()}>Start Tour</button>

      {api.step && api.open && (
        <Portal>
          <div data-layout="sinppets">
            {api.step.backdrop && <div {...api.getBackdropProps()} />}
            <div {...api.getSpotlightProps()} />
            <div {...api.getPositionerProps()}>
              <div {...api.getContentProps()}>
                {api.step.arrow && (
                  <div {...api.getArrowProps()}>
                    <div {...api.getArrowTipProps()} />
                  </div>
                )}

                <p {...api.getTitleProps()}>{api.step.title}</p>
                <div {...api.getDescriptionProps()}>{api.step.description}</div>
                <div {...api.getProgressTextProps()}>{api.getProgressText()}</div>

                {api.step.actions && (
                  <div className="flex justify-end gap-2">
                    {api.step.actions.map(action => (
                      <button key={action.label} {...api.getActionTriggerProps({ action })}>
                        {action.label}
                      </button>
                    ))}
                  </div>
                )}

                <button {...api.getCloseTriggerProps()}>
                  <div className="i-ph:x-bold" />
                </button>
              </div>
            </div>
          </div>
        </Portal>
      )}
    </>
  )
}
