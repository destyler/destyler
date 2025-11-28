<script lang="ts">
  import * as toast from '../../index'
  import { toastControls } from '@destyler/shared-private'
  import { Layout, StateVisualizer, Toolbar, useControls } from '@destyler/shared-private/svelte'
  import { normalizeProps, portal, useMachine } from '@destyler/svelte'
  import ToastItem from '../../snippets/Item.svelte'
  import '../style.css'

  const controls = useControls(toastControls)
  const id = $props.id()

  const [state, send] = useMachine(
    toast.group.machine({
      id,
      ...controls.context,
    }),
    {
      context: controls.context,
    },
  )

  const api = $derived(toast.group.connect(state as any, send, normalizeProps))

  function pushBasic(type: toast.Type, description?: string) {
    api.create({
      title: type === 'success' ? 'All systems go' : 'Heads up',
      description: description ??
        (type === 'error'
          ? 'We could not save your preferences. Try again later.'
          : 'Product roadmap was just refreshed.'),
      type,
    })
  }

  function pushPromise() {
    const task = new Promise<string>((resolve, reject) => {
      const shouldFail = Math.random() < 0.35
      setTimeout(() => {
        if (shouldFail)
          reject(new Error('Export timed out.'))
        else resolve('Export finished successfully.')
      }, 1700)
    })

    api.promise(task, {
      loading: { title: 'Exporting data...', type: 'loading' },
      success: value => ({ title: 'Export ready', description: value, type: 'success' }),
      error: error => ({ title: 'Export failed', description: error.message, type: 'error' }),
    })
  }
</script>

<Layout>
  <main class="toast-demo">
    <section class="toast-demo__actions">
      <button on:click={() => pushBasic('info', 'A teammate assigned a task to you.')}>
        Info toast
      </button>
      <button class="secondary" on:click={() => pushBasic('success')}>
        Success toast
      </button>
      <button class="secondary" on:click={() => pushBasic('error')}>
        Error toast
      </button>
      <button class="ghost" on:click={() => api.dismiss()}>
        Dismiss all
      </button>
    </section>

    <section class="toast-demo__actions">
      <button on:click={pushPromise}>
        Promise toast
      </button>
      <button
        class="ghost"
        on:click={() => api.create({ title: 'Queued sync', description: 'We will update you soon.', type: 'info', duration: 9000 })}
      >
        Long toast
      </button>
    </section>
  </main>

  <Toolbar {controls}>
    <StateVisualizer state={state} />
  </Toolbar>

  <div use:portal>
    {#each api.getPlacements() as placement}
      <div
        data-layout="toast-examples"
        class="toast-demo__region"
        {...api.getGroupProps({ placement })}
      >
        {#each api.getToastsByPlacement(placement) as actor (actor.id)}
          <ToastItem actor={actor} />
        {/each}
      </div>
    {/each}
  </div>
</Layout>
