import { beforeAll, beforeEach, describe, expect, it } from 'vitest'
import { defineComponent, h, nextTick } from 'vue'
import { render } from '@testing-library/vue'
import { axe } from 'vitest-axe'
import { DestylerLabel } from '../src'

describe('test label functionalities', () => {
  beforeAll(() => {
    // JSDom does not implement this and an error was being
    // thrown from jest-axe because of it.
    window.getComputedStyle = () => {}
  })
  beforeEach(() => {
    document.body.innerHTML = ''
  })

  it('should pass axe accessibility tests', async () => {
    const { container } = render(
      defineComponent({
        setup() {
          return () =>
            h('div', [
              h(DestylerLabel, { for: 'input' }, { default: () => 'Label' }),
              h('input', { id: 'input' }),
            ])
        },
      }),
    )
    expect(await axe(container)).toHaveNoViolations()
  })

  it('should render without crashing', async () => {
    const label = render(DestylerLabel)
    expect(label.html()).toBe(`<label>
  <!---->
</label>`)
  })

  it('should render with a default slot', async () => {
    const label = render(DestylerLabel, { slots: { default: 'Label' } })
    expect(label.html()).toBe('<label>Label</label>')
  })

  it('should render with a `for` attribute', async () => {
    const label = render(DestylerLabel, { props: { for: 'input' } })
    expect(label.html()).toBe(`<label for="input">
  <!---->
</label>`)
  })

  it('should render with a `for` attribute and a default slot', async () => {
    const label = render(DestylerLabel, {
      props: { for: 'input' },
      slots: { default: 'Label' },
    })
    expect(label.html()).toBe('<label for="input">Label</label>')
  })

  it('should not focus the input when click on the label without a `for` attribute', async () => {
    const { container } = render(
      defineComponent({
        setup() {
          return () => h('div', [h(DestylerLabel), h('input', { id: 'input' })])
        },
      }),
    )

    container.getElementsByTagName('label')[0].click()
    await nextTick()
    expect(container.querySelector('input')).not.toBe(document.activeElement)
  })

  it('should not focus the input when click on the label with a `for` attribute that does not match any input', async () => {
    const { container } = render(
      defineComponent({
        setup() {
          return () =>
            h('div', [h(DestylerLabel, { for: 'input' }), h('input', { id: 'input2' })])
        },
      }),
    )

    container.getElementsByTagName('label')[0].click()
    await nextTick()
    expect(container.querySelector('input')).not.toBe(document.activeElement)
  })
})
