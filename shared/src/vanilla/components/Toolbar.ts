export type ToolbarTab = 'controls' | 'visualizer'

export interface ToolbarOptions {
  active?: ToolbarTab
  controlsSlot?: () => HTMLElement
  visualizerSlot?: () => HTMLElement
}

export interface ToolbarHandle {
  root: HTMLDivElement
  setControlsSlot(slot?: () => HTMLElement): void
  setVisualizerSlot(slot?: () => HTMLElement): void
  setActive(tab: ToolbarTab): void
}

export function Toolbar(params: ToolbarOptions = {}): ToolbarHandle {
  const root = document.createElement('div')
  root.className = 'toolbar'

  const nav = document.createElement('nav')
  const controlsButton = document.createElement('button')
  controlsButton.textContent = 'Controls'
  const visualizerButton = document.createElement('button')
  visualizerButton.textContent = 'Visualizer'
  nav.append(controlsButton, visualizerButton)

  const contentWrapper = document.createElement('div')
  const controlsContainer = document.createElement('div')
  controlsContainer.setAttribute('data-content', '')
  const visualizerContainer = document.createElement('div')
  visualizerContainer.setAttribute('data-content', '')
  contentWrapper.append(controlsContainer, visualizerContainer)

  root.append(nav, contentWrapper)

  let activeTab: ToolbarTab = params.active ?? (params.controlsSlot ? 'controls' : 'visualizer')
  let controlsSlot = params.controlsSlot
  let visualizerSlot = params.visualizerSlot

  function renderSlots() {
    controlsContainer.innerHTML = ''
    visualizerContainer.innerHTML = ''

    if (controlsSlot)
      controlsContainer.appendChild(controlsSlot())
    if (visualizerSlot)
      visualizerContainer.appendChild(visualizerSlot())

    if (controlsSlot) {
      controlsButton.style.display = ''
    }
    else {
      controlsButton.style.display = 'none'
    }

    controlsContainer.toggleAttribute('data-active', activeTab === 'controls')
    visualizerContainer.toggleAttribute('data-active', activeTab === 'visualizer')
    controlsButton.toggleAttribute('data-active', activeTab === 'controls')
    visualizerButton.toggleAttribute('data-active', activeTab === 'visualizer')
  }

  controlsButton.addEventListener('click', () => {
    activeTab = 'controls'
    renderSlots()
  })

  visualizerButton.addEventListener('click', () => {
    activeTab = 'visualizer'
    renderSlots()
  })

  renderSlots()

  return {
    root,
    setControlsSlot(slot) {
      controlsSlot = slot
      renderSlots()
    },
    setVisualizerSlot(slot) {
      visualizerSlot = slot
      renderSlots()
    },
    setActive(tab) {
      activeTab = tab
      renderSlots()
    },
  }
}
