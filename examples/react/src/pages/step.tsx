import { normalizeProps, useMachine } from '@destyler/react'
import { stepsControls } from '@destyler/shared-private'
import { StateVisualizer, Toolbar, useControls } from '@destyler/shared-private/react'
import * as steps from '@destyler/steps'
import { useId } from 'react'

export default function StepDemo() {
  const controls = useControls(stepsControls)

  const stepsData = [
    { title: 'Step 1' },
    { title: 'Step 2' },
    { title: 'Step 3' },
  ]

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
    <>
      <div {...api.getRootProps()} className="max-w-3xl mx-auto p-6 space-y-8">
        <div {...api.getListProps()} className="flex items-center justify-between relative">
          {stepsData.map((step, index) => (
            <div
              key={index}
              {...api.getItemProps({ index })}
              className="flex-1 relative"
            >
              <button
                {...api.getTriggerProps({ index })}
                className="flex items-center space-x-2 group w-full"
              >
                <div
                  {...api.getIndicatorProps({ index })}
                  className="w-8 h-8 rounded-full border-2 border-gray-300 flex
                  bg-gray-50 data-[current]:bg-dark
                  text-dark data-[current]:text-light
                  items-center justify-center transition-colors
                  group-hover:border-gray-600 group-focus:ring-2
                  group-focus:ring-offset-2 group-focus:ring-gray-600
                  data-[state=active]:bg-black data-[state=active]:text-white
                  data-[state=complete]:bg-black data-[state=complete]:text-white"
                >
                  {index + 1}
                </div>
                <span className="text-sm font-medium text-gray-700">{step.title}</span>
              </button>
              <div
                {...api.getSeparatorProps({ index })}
                className="absolute top-4 w-full left-0 -z-10 border-t-2 border-gray-200"
              />
            </div>
          ))}
        </div>

        {stepsData.map((step, index) => (
          <div
            key={index}
            {...api.getContentProps({ index })}
            className="bg-white p-6 rounded-lg shadow-sm border border-gray-200"
          >
            {step.title}
          </div>
        ))}

        <div
          {...api.getContentProps({ index: stepsData.length })}
          className="bg-white p-6 rounded-lg shadow-sm border border-gray-200 text-center text-gray-700"
        >
          Steps Complete - Thank you for filling out the form!
        </div>

        <div className="flex justify-between pt-4">
          <button
            {...api.getPrevTriggerProps()}
            className="px-4 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-600"
          >
            Back
          </button>
          <button
            {...api.getNextTriggerProps()}
            className="px-4 py-2 bg-black text-white rounded-md text-sm font-medium hover:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-600"
          >
            Next
          </button>
        </div>
      </div>
      <Toolbar controls={controls.ui()}>
        <StateVisualizer state={state} />
      </Toolbar>
    </>
  )
}
