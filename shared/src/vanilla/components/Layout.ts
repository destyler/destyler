const layoutStyles = `
.layout{
  display: flex;
  height: 100vh;
  overflow: hidden;
}

.layout-root {
  flex: auto;
  display: flex;
  gap: 10px;
  position: relative;
  flex-direction: column;
  align-items: flex-start;
  padding: 40px;
  overflow-y: auto;
}
`

let layoutStyleInjected = false

function ensureLayoutStyles() {
  if (layoutStyleInjected || typeof document === 'undefined')
    return
  const style = document.createElement('style')
  style.textContent = layoutStyles
  document.head.appendChild(style)
  layoutStyleInjected = true
}

export interface LayoutInstance {
  root: HTMLDivElement
  main: HTMLElement
}

export function Layout(): LayoutInstance {
  ensureLayoutStyles()
  const root = document.createElement('div')
  root.dataset.story = 'book'
  root.className = 'layout'

  const main = document.createElement('main')
  main.className = 'layout-root'
  root.appendChild(main)

  return { root, main }
}
