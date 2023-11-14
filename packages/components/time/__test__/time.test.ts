import { describe, expect, it, vi } from 'vitest'
import { mount } from '@vue/test-utils'
import { DestylerTime } from '../src'

describe('DestylerTime', () => {
  const date = new Date('1970-01-01 00:00:00 UTC').getTime()

  const mockedNow = new Date('2020-01-01 00:00:01 UTC').getTime()

  const cachedDateNow = Date.now
  it('should work with import on demand', () => {
    mount(DestylerTime)
  })

  it('should work with `format` prop with timezone', async () => {
    const wrapper = mount(DestylerTime, {
      props: {
        time: 1654452568216,
        format: 'yyyy/MM/dd',
        timeZone: 'Asia/Shanghai',
      },
    })
    expect(wrapper.find('time').text()).toContain('2022/06/06')
    await wrapper.setProps({
      timeZone: 'America/New_York',
    })
    expect(wrapper.find('time').text()).toContain('2022/06/05')
  })

  it('should work with `type` `to` prop', async () => {
    Date.now = () => mockedNow

    const wrapper = mount(DestylerTime, {
      props: { time: date, type: 'date', timeZone: 'Asia/Shanghai' },
    })
    expect(wrapper.find('time').text()).toContain('1970-01-01')
    await wrapper.setProps({ time: date, type: 'datetime' })
    expect(wrapper.find('time').text().length).toBe(19)
    await wrapper.setProps({ time: date, type: 'relative' })
    expect(wrapper.find('time').text()).toContain('50 years ago')
    Date.now = () => new Date('1972-01-01 00:00:00 UTC').getTime()
    const wrapper2 = mount(DestylerTime, {
      props: { to: 0, type: 'relative', unix: true },
    })
    expect(wrapper2.find('time').text()).toContain('in 2 years')

    Date.now = cachedDateNow
  })
  it('should work with `text` prop', () => {
    const wrapper = mount(DestylerTime, { props: { time: date, text: true } })
    expect(wrapper.find('time').exists()).toEqual(false)
  })
})
