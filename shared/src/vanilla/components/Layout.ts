const layoutStyles = `
.layout{
  --toolbar-width: 400px;
  display: flex;
  height: 100vh;
  overflow: hidden;
}

.layout-root {
  flex: auto;
  display: flex;
  gap: 1px;
  position: relative;
  flex-direction: column;
  align-items: flex-start;
  padding: 4px;
  padding-right: calc(40px + var(--toolbar-width, 400px));
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
