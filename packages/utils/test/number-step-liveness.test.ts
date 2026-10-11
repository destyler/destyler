import { spawnSync } from 'node:child_process'
import { fileURLToPath } from 'node:url'
import { describe, expect, it } from 'vitest'

const root = fileURLToPath(new URL('../../../', import.meta.url))
const numberSource = new URL('../src/number.ts', import.meta.url).href

function evaluate(body: string): unknown {
  const result = spawnSync(process.execPath, ['--import', 'tsx', '--input-type=module', '--eval', body], {
    cwd: root,
    encoding: 'utf8',
    timeout: 5_000,
  })
  expect(result.stdout, result.stderr).toContain('probe-ready')
  expect(result.error, result.stderr).toBeUndefined()
  expect(result.status, result.stderr).toBe(0)
  const lines = result.stdout.trim().split('\n')
  return JSON.parse(lines[lines.length - 1])
}

const helperPrelude = `
  import { incrementValue, decrementValue } from ${JSON.stringify(numberSource)};
  console.log('probe-ready');
  const encode = value => Object.is(value, -0) ? '-0' : String(value);
`

describe('numeric step termination', () => {
  it('has a killable subprocess sentinel for synchronous nontermination', () => {
    const result = spawnSync(process.execPath, ['--eval', 'console.log(\'probe-ready\'); while (true) {}'], {
      encoding: 'utf8',
      timeout: 1_000,
    })
    expect(result.stdout).toContain('probe-ready')
    expect(result.error).toMatchObject({ code: 'ETIMEDOUT' })
    expect(result.signal).toBe('SIGTERM')
    expect(result.status).toBeNull()
  })

  it('preserves corrected ordinary decimal results', () => {
    expect(evaluate(`${helperPrelude}
      console.log(JSON.stringify([
        incrementValue(0.1, 0.2), incrementValue(1.123, 0.004),
        incrementValue(12.01, 0.04), incrementValue(-5, 3),
        decrementValue(12.015, 0.004), decrementValue(1.5, 0.5),
      ].map(encode)));
    `)).toEqual(['0.3', '1.127', '12.05', '-2', '12.011', '1'])
  })

  it.each(['incrementValue', 'decrementValue'] as const)('%s returns native arithmetic when finite operands require an overflowing scale', (operation) => {
    const comparisons = evaluate(`${helperPrelude}
      const pairs = [
        [0, Number.MIN_VALUE], [0, -Number.MIN_VALUE],
        [Number.MIN_VALUE, 1], [-Number.MIN_VALUE, 1],
        [Number.MIN_VALUE, Number.MIN_VALUE],
        [-Number.MIN_VALUE, -Number.MIN_VALUE],
        [0, 1e-310], [0, -1e-310],
        [1.234567890123456e-308, 1e-310],
      ];
      console.log(JSON.stringify(pairs.map(([a, b]) => [
        encode(${operation}(a, b)),
        encode(${operation === 'incrementValue' ? 'a + b' : 'a - b'}),
      ])));
    `) as Array<[string, string]>
    expect(comparisons).toHaveLength(9)
    for (const [actual, expected] of comparisons)
      expect(actual).toBe(expected)
  }, 10_000)

  it('preserves NaN, infinity, zero and already-returning scientific extremes', () => {
    expect(evaluate(`${helperPrelude}
      console.log(JSON.stringify([
        incrementValue(Number.NaN, 2), decrementValue(Number.NaN, 2),
        incrementValue(2, Number.NaN), decrementValue(2, Number.NaN),
        incrementValue(Infinity, 1), decrementValue(-Infinity, 1),
        incrementValue(Infinity, -Infinity), decrementValue(Infinity, Infinity),
        incrementValue(-0, -0), decrementValue(-0, 0),
        incrementValue(1e-7, 2e-7), decrementValue(1e20, 1),
      ].map(encode)));
    `)).toEqual(['2', '-2', 'NaN', 'NaN', 'Infinity', '-Infinity', 'NaN', 'NaN', '-0', '-0', '3e-7', '100000000000000000000'])
  })
})

const component = new URL('../../components/number-input/dist/index.mjs', import.meta.url).href

describe.each(['uncontrolled', 'accept', 'veto'] as const)('number Input subnormal step with %s ownership', (ownership) => {
  it.each(['INCREMENT', 'DECREMENT'] as const)('returns from public VALUE.%s', (event) => {
    const proposal = event === 'INCREMENT' ? '5e-324' : '-5e-324'
    expect(evaluate(`
      import { Window } from 'happy-dom';
      import { machine } from ${JSON.stringify(component)};
      globalThis.document = new Window().document;
      const proposals = [];
      let service;
      service = machine({
        id: 'subnormal-step', step: Number.MIN_VALUE,
        ${ownership === 'uncontrolled' ? 'defaultValue: \'0\'' : 'value: \'0\''},
        onValueChange(details) {
          proposals.push([details.value, String(details.valueAsNumber)]);
          ${ownership === 'accept' ? 'service.setContext({ value: details.value });' : ''}
        },
      });
      service.start();
      console.log('probe-ready');
      service.send('VALUE.${event}');
      console.log(JSON.stringify({ value: service.state.context.value, proposals }));
      service.stop();
    `)).toEqual({ value: ownership === 'veto' ? '0' : proposal, proposals: [[proposal, proposal]] })
  }, 10_000)
})
