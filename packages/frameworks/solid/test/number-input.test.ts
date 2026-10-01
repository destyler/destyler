import { renderToString, ssrElement } from 'solid-js/web'
import { describe, expect, it } from 'vitest'
import { connect } from '../../../components/number-input/src/connect'
import { machine } from '../../../components/number-input/src/machine'
import { normalizeProps } from '../src/utils/normalize-props'

describe('solid NumberInput server rendering', () => {
  it.each(['defaultValue', 'value'] as const)('renders formatted %s before the machine is started', (key) => {
    const service = machine({ id: 'ssr-number-input', [key]: '12.5', formatOptions: { minimumFractionDigits: 2 } })
    const html = renderToString(() => {
      const api = connect(service.getState(), service.send, normalizeProps)
      return ssrElement('input', api.getInputProps(), undefined, false)
    })
    expect(html).toContain('value="12.50"')
    expect(html).toContain('role="spinbutton"')
  })
})
