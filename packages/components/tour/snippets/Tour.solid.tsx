/** @jsxImportSource solid-js */
import { normalizeProps, useMachine } from '@destyler/solid'
import * as tour from '@destyler/tour'
import { createMemo, createUniqueId, For, Show } from 'solid-js'
import { Portal } from 'solid-js/web'
import './style.css'

export default function Page() {
  const [state, send] = useMachine(
    tour.machine({
      id: createUniqueId(),
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

  const api = createMemo(() => tour.connect(state, send, normalizeProps))

  return (
    <>
      <button class="btn" onClick={() => api().start()}>Start Tour</button>
      <Show when={api().open && api().step}>
        <Portal>
          <div data-layout="sinppets">
            <Show when={api().step?.backdrop}>
              <div {...api().getBackdropProps()} />
            </Show>
            <div {...api().getSpotlightProps()} />
            <div {...api().getPositionerProps()}>
              <div {...api().getContentProps()}>
                <Show when={api().step?.arrow}>
                  <div {...api().getArrowProps()}>
                    <div {...api().getArrowTipProps()} />
                  </div>
                </Show>
                <p {...api().getTitleProps()}>{api().step!.title}</p>
                <div {...api().getDescriptionProps()}>{api().step!.description}</div>

                <div class="flex justify-end gap-2">
                  <For each={api().step?.actions}>
                    {action => <button {...api().getActionTriggerProps({ action })}>{action.label}</button>}
                  </For>
                </div>
                <button {...api().getCloseTriggerProps()}>
                  <div class="i-ph:x-bold" />
                </button>
              </div>
            </div>
          </div>
        </Portal>
      </Show>
    </>
  )
}
