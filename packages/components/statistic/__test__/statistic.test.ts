import { describe, expect, it } from 'vitest'
import { mount } from '@vue/test-utils'
import { DestylerStatistic } from '../src'

describe('destylerStatistic', () => {
  it('should work with import on demand', () => {
    mount(DestylerStatistic)
  })

  it('should work with `label` prop', async () => {
    const wrapper = mount(DestylerStatistic, { props: { label: 'test' } })

    expect(wrapper.find('div[destyler="statistic-label"]').exists()).toBe(true)
    expect(wrapper.find('div[destyler="statistic-label"]').text()).toBe('test')
    wrapper.unmount()
  })

  it('should work with `value` prop', async () => {
    const wrapper = mount(DestylerStatistic, { props: { value: 'test' } })

    expect(wrapper.find('span[destyler="statistic-value-content"]').exists()).toBe(true)
    expect(wrapper.find('span[destyler="statistic-value-content"]').text()).toBe('test')
    wrapper.unmount()
  })

  it('should work with `default` slot', async () => {
    const wrapper = mount(DestylerStatistic, { slots: { default: () => 'test' } })

    expect(wrapper.find('span[destyler="statistic-value-content"]').exists()).toBe(true)
    expect(wrapper.find('span[destyler="statistic-value-content"]').text()).toBe('test')
    wrapper.unmount()
  })

  it('should work with `label` slot', async () => {
    const wrapper = mount(DestylerStatistic, { slots: { label: () => 'test' } })

    expect(wrapper.find('div[destyler="statistic-label"]').exists()).toBe(true)
    expect(wrapper.find('div[destyler="statistic-label"]').text()).toBe('test')
    wrapper.unmount()
  })

  it('should work with `prefix` slot', async () => {
    const wrapper = mount(DestylerStatistic, { slots: { prefix: () => 'test' } })

    expect(wrapper.find('span[destyler="statistic-value-prefix"]').exists()).toBe(true)
    expect(wrapper.find('span[destyler="statistic-value-prefix"]').text()).toBe('test')
    wrapper.unmount()
  })

  it('should work with `suffix` slot', async () => {
    const wrapper = mount(DestylerStatistic, { slots: { suffix: () => 'test' } })

    expect(wrapper.find('span[destyler="statistic-value-suffix"]').exists()).toBe(true)
    expect(wrapper.find('span[destyler="statistic-value-suffix"]').text()).toBe('test')
    wrapper.unmount()
  })
})
