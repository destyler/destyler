export function Toolbar(params: {
  viz?: boolean
  controlsSlot?: () => HTMLElement
  visualizerSlot?: () => HTMLElement
}): HTMLDivElement {
  const root = document.createElement('div')
  root.className = 'toolbar z-10 fixed right-0 top-0 bottom-0 w-80'

  function render() {
    root.innerHTML = ''

    if (params.controlsSlot) {
      const controlsDiv = document.createElement('div')
      controlsDiv.setAttribute('data-content', '')
      controlsDiv.appendChild(params.controlsSlot())
      root.appendChild(controlsDiv)
    }

    if (params.visualizerSlot) {
      const vizDiv = document.createElement('div')
      vizDiv.setAttribute('data-content', '')
      vizDiv.appendChild(params.visualizerSlot())
      root.appendChild(vizDiv)
    }
  }

  render()
  return root
}

