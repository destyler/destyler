import { signatureControls } from '@destyler/shared'
import * as signaturePad from '@destyler/signature'
import { normalizeProps, useMachine } from '@destyler/solid'
import { createMemo, createUniqueId } from 'solid-js'
import { StateVisualizer } from '../components/tools/state-visualizer'
import { Toolbar } from '../components/tools/toolbar'
import { useControls } from '../hooks/use-controls'

export default function SignaturePage() {
  const controls = useControls(signatureControls)
  const id = createUniqueId()

  const [state, send] = useMachine(signaturePad.machine({ id }), {
    context: controls.context,
  })

  const api = createMemo(() =>
    signaturePad.connect(state, send, normalizeProps),
  )

  return (
    <>
      <div {...api().getRootProps()} class="max-w-2xl p-6">
        <label {...api().getLabelProps()} class="block text-lg font-medium text-gray-700 mb-2">
          Signature
        </label>

        <div
          {...api().getControlProps()}
          class="w-[400px] h-[200px] relative border-2 border-gray-300 rounded-lg bg-white shadow-sm"
        >
          <svg {...api().getSegmentProps()} class="w-full h-full">
            {api().paths.map(path => (
              <path
                {...api().getSegmentPathProps({ path })}
                class="stroke-black"
              />
            ))}
            {api().currentPath && (
              <path
                {...api().getSegmentPathProps({ path: api().currentPath || '' })}
                class="stroke-black"
              />
            )}
          </svg>

          <button
            {...api().getClearTriggerProps()}
            class="absolute top-2 right-2 w-8 h-8 flex items-center justify-center rounded-full bg-gray-100 hover:bg-gray-200 transition-colors"
          >
            <span class="text-gray-600 i-carbon:close-large" />
          </button>

          <div
            {...api().getGuideProps()}
            class="absolute bottom-2 left-1/2 transform -translate-x-1/2 text-sm text-gray-400"
          />
        </div>
      </div>

      <Toolbar controls={controls.ui}>
        <StateVisualizer state={state} />
      </Toolbar>
    </>
  )
}
