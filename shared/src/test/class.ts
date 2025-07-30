import { page, userEvent } from '@vitest/browser/context'
import { vi } from 'vitest'
import { part, testid } from '.'

export class TestSuite {
  root = part('root')

  label = part('label')

  control = part('control')

  content = part('content')

  trigger = part('trigger')

  item = part('item')

  input = part('input')

  indicator = part('indicator')

  prev = part('prev-trigger')

  next = part('next-trigger')

  clear = part('clear-trigger')

  close = part('close-trigger')

  autoPlay = part('autoplay-trigger')

  rootEl() {
    return page.getByArticle(this.root)
  }

  labelEl() {
    return page.getByArticle(this.label)
  }

  controlEl() {
    return page.getByArticle(this.control)
  }

  contentEl() {
    return page.getByArticle(this.content)
  }

  triggerEl() {
    return page.getByArticle(this.trigger)
  }

  async clickTrigger(opts: { delay?: number } = {}) {
    const triggerEl = this.triggerEl()
    await userEvent.click(triggerEl, {
      delay: opts.delay,
    })
  }

  itemEls() {
    return page.getByArticle(this.item)
  }

  inputEl() {
    return page.getByArticle(this.input)
  }

  async clickInput() {
    const inputEl = this.inputEl()
    await inputEl.click()
  }

  async focusInput() {
    const inputEl = this.inputEl()
    await inputEl.fill('')
  }

  async type(text: string) {
    const inputEl = this.inputEl()

    await userEvent.type(inputEl, text)
  }

  indicatorEl() {
    return page.getByArticle(this.indicator)
  }

  prevEl() {
    return page.getByArticle(this.prev)
  }

  nextEl() {
    return page.getByArticle(this.next)
  }

  clearEl() {
    return page.getByArticle(this.clear)
  }

  closeEl() {
    return page.getByArticle(this.close)
  }

  async clickClose(){
    const closeEl = this.closeEl()
    await userEvent.click(closeEl)
  }

  autoPlayEl() {
    return page.getByArticle(this.autoPlay)
  }

  getTrigger(id: string) {
    return page.getByArticle(testid(`${id}:trigger`))
  }

  async clickTriggerById(id: string, opts: {
    delay?: number
    times: number
  } = {
    delay: 0,
    times: 1,
 }) {
    const triggerEl = this.getTrigger(id)
    for (let i = 0; i < opts.times; i++) {
      await userEvent.click(triggerEl, {
        delay: opts.delay,
      })
    }
  }

  getContent(id: string) {
    return page.getByArticle(testid(`${id}:content`))
  }

  async waitFor() {
    await vi.waitFor(async () => {
      return true
    }, {
      timeout: 5000,
      interval: 50,
    })
  }

  async pressKey(key: string, count: number = 1) {
    for (let i = 0; i < count; i++) {
      await userEvent.keyboard(`{${key}}`)
      await userEvent.keyboard(`{/${key}}`)
    }
  }

  async clickOutside() {
    const pageEl = document.body
    await userEvent.click(pageEl)
  }
}
