import { normalizeProps, Portal, useMachine } from '@destyler/react'
import { toastControls } from '@destyler/shared-private'
import { Layout, StateVisualizer, Toolbar, useControls } from '@destyler/shared-private/react'
import { useId } from 'react'
import * as toast from '../../index'
import { ToastItem } from '../../snippets/Item.react'
import '../style.css'

export default function Page() {
  const controls = useControls(toastControls)

  const [state, send] = useMachine(
    toast.group.machine({
      id: useId(),
      ...controls.context,
    }),
    {
      context: controls.context,
    },
  )

  const api = toast.group.connect(state as any, send, normalizeProps)

  const pushBasicToast = (type: toast.Type, description?: string) => {
    api.create({
      title: type === 'success' ? 'Payment complete' : 'Heads up',
      description: description
        ?? (type === 'error'
          ? 'We could not process the request. Please retry.'
          : 'A new notification just arrived.'),
      type,
    })
  }

  const pushPromiseToast = () => {
    const task = new Promise<string>((resolve, reject) => {
      const shouldFail = Math.random() < 0.35
      setTimeout(() => {
        if (shouldFail)
          reject(new Error('Server rejected the update.'))
        else resolve('Customer profile is now synced.')
      }, 1600)
    })

    api.promise(task, {
      loading: {
        title: 'Syncing customer...',
        type: 'loading',
      },
      success: value => ({
        title: 'All caught up',
        description: value,
        type: 'success',
      }),
      error: error => ({
        title: 'Sync failed',
        description: error.message,
        type: 'error',
      }),
    })
  }

  return (
    <Layout>
      <main className="toast-demo">
        <section className="toast-demo__actions">
          <button onClick={() => pushBasicToast('info', 'Your workspace was moved to the new region.')}>
            Info toast
          </button>
          <button className="secondary" onClick={() => pushBasicToast('success')}>
            Success toast
          </button>
          <button className="secondary" onClick={() => pushBasicToast('error')}>
            Error toast
          </button>
          <button className="ghost" onClick={() => api.dismiss()}>
            Dismiss all
          </button>
        </section>

        <section className="toast-demo__actions">
          <button onClick={pushPromiseToast}>
            Promise toast
          </button>
          <button className="ghost" onClick={() => api.create({ title: 'Queued upload', description: 'We will notify you once it finishes.', type: 'info', duration: 8000 })}>
            Long toast
          </button>
        </section>
      </main>

      <Toolbar controls={controls.ui()}>
        <StateVisualizer state={state} />
      </Toolbar>

      <Portal>
        {api.getPlacements().map(placement => (
          <div data-layout="toast-examples" className="toast-demo__region" key={placement} {...api.getGroupProps({ placement })}>
            {api.getToastsByPlacement(placement).map(item => (
              <ToastItem key={item.id} actor={item} />
            ))}
          </div>
        ))}
      </Portal>
    </Layout>
  )
}
