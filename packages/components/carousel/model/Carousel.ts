import * as carousel from '@destyler/carousel'
import { Component, normalizeProps, spreadProps } from '@destyler/vanilla'

export class Carousel extends Component<carousel.Context, carousel.Api> {
  initService(context: carousel.Context) {
    return carousel.machine(context)
  }

  initApi() {
    return carousel.connect(this.service.state, this.service.send, normalizeProps)
  }

  render = () => {
    const rootEl = this.rootEl
    spreadProps(rootEl, this.api.getRootProps())

    const itemGroupEl = rootEl.querySelector<HTMLElement>('.carousel-item-group')
    if (itemGroupEl)
      spreadProps(itemGroupEl, this.api.getItemGroupProps())

    // 为每个 item 元素设置属性
    const itemEls = itemGroupEl?.querySelectorAll<HTMLElement>('.carousel-item')
    itemEls?.forEach((el, index) => {
      spreadProps(el, this.api.getItemProps({ index }))
    })

    // scroll to index 按钮
    const scrollToIndexBtn = rootEl.querySelector<HTMLElement>('.carousel-scroll-to-index')
    if (scrollToIndexBtn) {
      scrollToIndexBtn.click = () => {
        this.api.scrollToIndex(1)
      }
    }

    // 控制区
    const controlEl = rootEl.querySelector<HTMLElement>('.carousel-controls')
    if (controlEl)
      spreadProps(controlEl, this.api.getControlProps())

    // autoplay 按钮
    const autoplayBtn = rootEl.querySelector<HTMLElement>('.carousel-autoplay')
    if (autoplayBtn) {
      spreadProps(autoplayBtn, this.api.getAutoplayTriggerProps())
      autoplayBtn.textContent = this.api.isPlaying ? 'Stop' : 'Play'
    }

    // prev/next 按钮
    const prevBtn = rootEl.querySelector<HTMLElement>('.carousel-prev')
    if (prevBtn)
      spreadProps(prevBtn, this.api.getPrevTriggerProps())
    const nextBtn = rootEl.querySelector<HTMLElement>('.carousel-next')
    if (nextBtn)
      spreadProps(nextBtn, this.api.getNextTriggerProps())

    // 指示器组
    const indicatorGroup = rootEl.querySelector<HTMLElement>('.carousel-indicators')
    if (indicatorGroup) {
      spreadProps(indicatorGroup, this.api.getIndicatorGroupProps())
      const indicatorBtns = indicatorGroup.querySelectorAll<HTMLElement>('.carousel-indicator')
      indicatorBtns.forEach((btn, index) => {
        spreadProps(btn, this.api.getIndicatorProps({ index }))
      })
    }
  }
}

export function createCarouselElements(images: string[]): Promise<HTMLDivElement> {
  return new Promise((resolve) => {
    const root = document.createElement('div')
    root.className = 'carousel'

    const itemGroup = document.createElement('div')
    itemGroup.className = 'carousel-item-group'

    images.forEach((src, _i) => {
      const item = document.createElement('div')
      item.className = 'carousel-item'
      const img = document.createElement('img')
      img.src = src
      item.appendChild(img)
      itemGroup.appendChild(item)
    })

    root.appendChild(itemGroup)

    // scroll to index
    const scrollToIndex = document.createElement('button')
    scrollToIndex.className = 'carousel-scroll-to-index'
    scrollToIndex.textContent = 'Scroll to 1'
    root.appendChild(scrollToIndex)

    // 控制区
    const controls = document.createElement('div')
    controls.className = 'carousel-controls'

    const autoplayBtn = document.createElement('button')
    autoplayBtn.className = 'carousel-autoplay'
    autoplayBtn.textContent = 'Play'
    controls.appendChild(autoplayBtn)

    const prevBtn = document.createElement('button')
    prevBtn.className = 'carousel-prev'
    prevBtn.textContent = 'Prev'
    controls.appendChild(prevBtn)

    const nextBtn = document.createElement('button')
    nextBtn.className = 'carousel-next'
    nextBtn.textContent = 'Next'
    controls.appendChild(nextBtn)

    root.appendChild(controls)

    // 指示器
    const indicators = document.createElement('div')
    indicators.className = 'carousel-indicators'
    images.forEach((_, _i) => {
      const indicator = document.createElement('button')
      indicator.className = 'carousel-indicator'
      indicators.appendChild(indicator)
    })
    root.appendChild(indicators)

    // 模拟异步（如有需要可用 setTimeout 或 fetch/await 等）
    // 这里直接 resolve，实际可替换为异步逻辑
    resolve(root)
  })
}
