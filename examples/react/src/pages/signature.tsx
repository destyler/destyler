import { normalizeProps, useMachine } from '@destyler/react'
import { signatureControls } from '@destyler/shared-private'
import { StateVisualizer, Toolbar, useControls } from '@destyler/shared-private/react'
import * as signaturePad from '@destyler/signature'
import { useId, useMemo } from 'react'

export default function SignaturePage() {
  const controls = useControls(signatureControls)

  const [state, send] = useMachine(signaturePad.machine({ id: useId() }), {
    context: controls.context,
  })

  const api = useMemo(
    () => signaturePad.connect(state, send, normalizeProps),
    [state, send],
  )

  return (
    <>
      <div {...api.getRootProps()} className="max-w-2xl p-6">
        <label {...api.getLabelProps()} className="block text-lg font-medium text-gray-700 mb-2">
          Signature
        </label>

        <div
          {...api.getControlProps()}
          className="w-[400px] h-[200px] relative border-2 border-gray-300 rounded-lg bg-white shadow-sm"
        >
          <svg {...api.getSegmentProps()} className="w-full h-full">
            {api.paths.map((path, i) => (
              <path
                key={i}
                {...api.getSegmentPathProps({ path })}
                className="stroke-black"
              />
            ))}
            {api.currentPath && (
              <path
                {...api.getSegmentPathProps({ path: api.currentPath })}
                className="stroke-black"
              />
            )}
          </svg>

          <button
            {...api.getClearTriggerProps()}
            className="absolute top-2 right-2 w-8 h-8 flex items-center justify-center rounded-full bg-gray-100 hover:bg-gray-200 transition-colors"
          >
            <span className="text-gray-600 i-carbon:close-large" />
          </button>

          <div
            {...api.getGuideProps()}
            className="absolute bottom-2 left-1/2 transform -translate-x-1/2 text-sm text-gray-400"
          />
        </div>
      </div>

      <Toolbar controls={controls.ui()}>
        <StateVisualizer state={state} />
      </Toolbar>
    </>
  )
}
