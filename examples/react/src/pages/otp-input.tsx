import * as otpInput from '@destyler/otp-input'
import { normalizeProps, useMachine } from '@destyler/react'
import { pinInputControls } from '@destyler/shared-private'
import { useId, useMemo } from 'react'
import { StateVisualizer, Toolbar, useControls } from '@destyler/shared-private/react'

export default function OtpInput() {
  const controls = useControls(pinInputControls)

  const [state, send] = useMachine(otpInput.machine({ id: useId() }), {
    context: controls.context,
  })

  const api = useMemo(() => otpInput.connect(state, send, normalizeProps), [state, send])

  return (
    <>
      <div className="flex flex-col p-4">
        <div className="w-full max-w-md space-y-8">
          <div className="text-center">
            <h2 className="mt-6 text-3xl font-bold tracking-tight text-black dark:text-white">
              Verification Code
            </h2>
            <p className="mt-2 text-sm text-gray-600 dark:text-gray-400">
              Please enter the 3-digit code you received
            </p>
          </div>

          <div
            {...api.getRootProps()}
            className="flex justify-center gap-4 mt-8"
          >
            {[0, 1, 2].map(index => (
              <input
                key={index}
                {...api.getInputProps({ index })}
                className="w-16 h-16 text-center text-2xl font-semibold bg-white dark:bg-gray-800 border-2 border-gray-300 dark:border-gray-600 rounded-lg focus:border-black dark:focus:border-white focus:ring-2 focus:ring-black dark:focus:ring-white focus:outline-none"
              />
            ))}
          </div>

          <div className="text-center mt-6">
            <button
              onClick={api.clearValue}
              className="px-4 py-2 text-sm font-medium text-white bg-black hover:bg-gray-800 dark:bg-white dark:text-black dark:hover:bg-gray-200 rounded-md focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-black dark:focus:ring-white"
            >
              Clear
            </button>
          </div>
        </div>
      </div>
      <Toolbar controls={controls.ui()}>
        <StateVisualizer state={state} />
      </Toolbar>
    </>
  )
}
