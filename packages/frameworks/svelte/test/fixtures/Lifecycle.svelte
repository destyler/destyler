<script>
  import { useActor } from './hooks/use-actor.svelte.js'
  import { useMachine } from './hooks/use-machine.svelte.js'

  let { machine, initialOptions = {}, actor = false, expose } = $props()
  let options = $state(initialOptions)
  const result = actor ? useActor(machine) : useMachine(machine, {
    get context() { return options.context },
    get actions() { return options.actions },
    get state() { return options.state },
  })
  const [snapshot, send] = result
  const service = actor ? machine : result[2]

  expose({
    state: snapshot,
    send,
    service,
    setContext(context) { options.context = context },
    setActions(actions) { options.actions = actions },
  })
</script>

<output>{snapshot.value}:{snapshot.context.value}</output>
