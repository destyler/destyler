/** @jsxImportSource solid-js */
import { toastControls } from '@destyler/shared-private'
import { Layout, StateVisualizer, Toolbar, useControls } from '@destyler/shared-private/solid'
import { normalizeProps, useMachine } from '@destyler/solid'
import { createMemo, createUniqueId, For } from 'solid-js'
import { Portal } from 'solid-js/web'
import * as toast from '../../index'
import { ToastItem } from '../../snippets/Item.solid'
import '../style.css'

export default function Page() {
  const controls = useControls(toastControls)

  const [state, send] = useMachine(
    toast.group.machine({
      id: createUniqueId(),
      ...controls.context(),
    }),
    {
      context: controls.context,
    },
  )

  const api = createMemo(() => toast.group.connect(state as any, send, normalizeProps))

  const pushBasicToast = (type: toast.Type, description?: string) => {
    api().create({
      title: type === 'success' ? 'Invoice captured' : 'Heads up',
      description: description
        ?? (type === 'error'
          ? 'We could not talk to the billing API. Try later.'
          : 'A teammate mentioned you in a comment.'),
      type,
    })
  }

  const pushPromiseToast = () => {
    const task = new Promise<string>((resolve, reject) => {
      const shouldFail = Math.random() < 0.35
      setTimeout(() => {
        if (shouldFail)
          reject(new Error('Failed to push the new deployment.'))
        else resolve('Deployment finished in 32s.')
      }, 1500)
    })

    api().promise(task, {
      loading: { title: 'Deploying preview...', type: 'loading' },
      success: value => ({ title: 'Preview ready', description: value, type: 'success' }),
      error: error => ({ title: 'Preview failed', description: error.message, type: 'error' }),
    })
  }

  return (
    <Layout>
      <main class="toast-demo">
        <section class="toast-demo__actions">
          <button onClick={() => pushBasicToast('info', 'Workflow run queued in github/actions')}>
            Info toast
          </button>
          <button class="secondary" onClick={() => pushBasicToast('success')}>
            Success toast
          </button>
          <button class="secondary" onClick={() => pushBasicToast('error')}>
            Error toast
          </button>
          <button class="ghost" onClick={() => api().dismiss()}>
            Dismiss all
          </button>
        </section>

        <section class="toast-demo__actions">
          <button onClick={pushPromiseToast}>
            Promise toast
          </button>
          <button
            class="ghost"
            onClick={() =>
              api().create({
                title: 'Queued backup',
                description: 'We will notify you when it finishes.',
                type: 'info',
                duration: 9000,
              })}
          >
            Long toast
          </button>
        </section>
      </main>

      <Toolbar controls={controls.ui}>
        <StateVisualizer state={state} />
      </Toolbar>

      <Portal>
        <For each={api().getPlacements()}>
          {placement => (
            <div data-layout="toast-examples" class="toast-demo__region" {...api().getGroupProps({ placement })}>
              <For each={api().getToastsByPlacement(placement)}>
                {actor => (
                  <ToastItem actor={actor} />
                )}
              </For>
            </div>
          )}
        </For>
      </Portal>
    </Layout>
  )
}
