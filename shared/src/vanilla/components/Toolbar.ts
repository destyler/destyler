import { dataAttr } from '@destyler/dom'

export function Toolbar(params: {
  viz?: boolean
  controlsSlot?: () => HTMLElement
  visualizerSlot?: () => HTMLElement
}): HTMLDivElement {
  const root = document.createElement('div')
  root.className = 'toolbar z-10 fixed right-0 top-0 bottom-0 w-80'

  const nav = document.createElement('nav')
  const controls = !!params.controlsSlot
  let activeState = params.viz ? 1 : !controls ? 1 : 0

  function render() {
    nav.innerHTML = ''
    root.querySelectorAll('[data-content]').forEach(el => el.remove())

    if (controls) {
      const btnControls = document.createElement('button')
      btnControls.setAttribute('data-active', dataAttr((activeState === 0)))
      btnControls.textContent = 'Controls'
      btnControls.onclick = () => {
        activeState = 0
        render()
      }
      nav.appendChild(btnControls)
    }

    const btnViz = document.createElement('button')
    btnViz.setAttribute('data-active', dataAttr(activeState === 1))
    btnViz.textContent = 'Visualizer'
    btnViz.onclick = () => {
      activeState = 1
      render()
    }
    nav.appendChild(btnViz)

    const controlsDiv = document.createElement('div')
    controlsDiv.setAttribute('data-content', '')
    controlsDiv.setAttribute('data-active', dataAttr(activeState === 0))
    if (controls && activeState === 0 && params.controlsSlot) {
      controlsDiv.appendChild(params.controlsSlot())
    }
    root.appendChild(controlsDiv)

    const vizDiv = document.createElement('div')
    vizDiv.setAttribute('data-content', '')
    vizDiv.setAttribute('data-active', dataAttr(activeState === 1))
    if (activeState === 1 && params.visualizerSlot) {
      vizDiv.appendChild(params.visualizerSlot())
    }
    root.appendChild(vizDiv)
  }

  root.appendChild(nav)
  render()
  return root
}
