export function actionOptionsConfig() {
  const calls: string[] = []
  const requests: number[] = []
  const defaultActions = Object.freeze({
    created: (ctx: { value: number }) => calls.push(`default created:${ctx.value}`),
    entry: (ctx: { value: number }) => calls.push(`default entry:${ctx.value}`),
    hydrated: (ctx: { value: number }) => calls.push(`default hydrated:${ctx.value}`),
    report: () => calls.push('default report'),
    request: () => calls.push('default request'),
  })
  const config = {
    initial: 'idle',
    context: { value: 0, onChange: (value: number) => requests.push(value) },
    created: 'created',
    entry: 'entry',
    on: { REPORT: { actions: 'report' }, REQUEST: { actions: 'request' } },
    states: { idle: {}, hydrated: { entry: 'hydrated' } },
  }
  const actions = Object.freeze({
    created: (ctx: { value: number }) => calls.push(`created:${ctx.value}`),
    entry: (ctx: { value: number }) => calls.push(`entry:${ctx.value}`),
    hydrated: (ctx: { value: number }) => calls.push(`hydrated:${ctx.value}`),
    report: () => calls.push('report'),
    request: (ctx: { value: number, onChange: (value: number) => void }) => ctx.onChange(ctx.value + 1),
  })
  return { config, calls, requests, defaultActions, actions }
}
