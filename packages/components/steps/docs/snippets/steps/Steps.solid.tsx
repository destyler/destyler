/** @jsxImportSource solid-js */
import { normalizeProps, useMachine } from '@destyler/solid'
import * as steps from '@destyler/steps'
import { createMemo, createUniqueId } from 'solid-js'
import '@docs/styles/components/steps.css'

const stepsData = [
  { title: 'Step 1' },
  { title: 'Step 2' },
  { title: 'Step 3' },
]

export default function Steps({ className = '' }: { className?: string }) {
  const [state, send] = useMachine(
    steps.machine({
      id: createUniqueId(),
      count: stepsData.length,
    }),
  )

  const api = createMemo(() => steps.connect(state, send, normalizeProps))

  return (
    <div {...api().getRootProps()} class={`${className}`}>
      <div {...api().getListProps()}>
        {stepsData.map((step, index) => (
          <div {...api().getItemProps({ index })}>
            <button {...api().getTriggerProps({ index })} class="group">
              <div {...api().getIndicatorProps({ index })}>
                {index + 1}
              </div>
              <span class="text-sm font-medium text-foreground">{step.title}</span>
            </button>
            <div {...api().getSeparatorProps({ index })} />
          </div>
        ))}
      </div>

      {stepsData.map((step, index) => (
        <div {...api().getContentProps({ index })}>
          {step.title}
        </div>
      ))}

      <div {...api().getContentProps({ index: stepsData.length })}>
        Steps Complete - Thank you for filling out the form!
      </div>

      <div class="flex justify-between pt-4 mt-0!">
        <button {...api().getPrevTriggerProps()}>
          Back
        </button>
        <button {...api().getNextTriggerProps()}>
          Next
        </button>
      </div>
    </div>
  )
}
