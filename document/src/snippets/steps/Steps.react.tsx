import { normalizeProps, useMachine } from '@destyler/react'
import * as steps from '@destyler/steps'
import { useId } from 'react'

const stepsData = [
  { title: 'Step 1' },
  { title: 'Step 2' },
  { title: 'Step 3' },
]

export default function Steps({ className = '' }: { className?: string }) {
  const [state, send] = useMachine(
    steps.machine({
      id: useId(),
      count: stepsData.length,
    }),
  )

  const api = steps.connect(state, send, normalizeProps)

  return (
    <div {...api.getRootProps()} className={`w-[70%] ${className}`}>
      <div {...api.getListProps()} className="relative flex items-center justify-between">
        {stepsData.map((step, index) => (
          <div
            key={index}
            {...api.getItemProps({ index })}
            className="relative flex-1 mt-0!"
          >
            <button
              {...api.getTriggerProps({ index })}
              className="flex w-full items-center gap-2 group"
            >
              <div
                {...api.getIndicatorProps({ index })}
                className="flex h-8 w-8 items-center justify-center rounded-full border-2
                bg-background text-foreground
                border-border transition-colors
                data-[current]:bg-primary data-[current]:text-primary-foreground
                data-[state=active]:bg-primary data-[state=active]:text-primary-foreground
                data-[state=complete]:bg-primary data-[state=complete]:text-primary-foreground
                group-hover:border-primary/50
                group-focus-visible:outline-none group-focus-visible:ring-2
                group-focus-visible:ring-ring group-focus-visible:ring-offset-2"
              >
                {index + 1}
              </div>
              <span className="text-sm font-medium text-foreground">{step.title}</span>
            </button>
            <div
              {...api.getSeparatorProps({ index })}
              className="absolute left-0 top-4 -z-10 w-full border-t-2 border-border mt-0!"
            />
          </div>
        ))}
      </div>

      {stepsData.map((step, index) => (
        <div
          key={index}
          {...api.getContentProps({ index })}
          className="rounded-lg border border-border bg-card p-6 text-card-foreground mt-2! shadow-sm"
        >
          {step.title}
        </div>
      ))}

      <div
        {...api.getContentProps({ index: stepsData.length })}
        className="rounded-lg border border-border bg-card p-6 text-center text-card-foreground shadow-sm"
      >
        Steps Complete - Thank you for filling out the form!
      </div>

      <div className="flex justify-between pt-4 mt-0!">
        <button
          {...api.getPrevTriggerProps()}
          className="btn bg-secondary text-secondary-foreground hover:bg-secondary/90"
        >
          Back
        </button>
        <button
          {...api.getNextTriggerProps()}
          className="btn mt-0!"
        >
          Next
        </button>
      </div>
    </div>
  )
}
