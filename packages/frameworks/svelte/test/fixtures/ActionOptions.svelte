<script>
  import { useActor } from './hooks/use-actor.svelte.js'
  import { useMachine } from './hooks/use-machine.svelte.js'

  let { machine, initialOptions = {}, actor = false, expose } = $props()
  let context = $state(initialOptions.context)
  let actions = $state(initialOptions.actions)
  const result = actor ? useActor(machine) : useMachine(machine, {
    get context() { return context },
    get actions() { return actions },
    get state() { return initialOptions.state },
  })
  const [snapshot, send] = result

  expose({
    state: snapshot,
    send,
    service: actor ? machine : result[2],
    setContext(value) { context = value },
    setActions(value) { actions = value },
  })
</script>

<output>{snapshot.value}:{snapshot.context.value}</output>
