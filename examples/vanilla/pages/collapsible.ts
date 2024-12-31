import { nanoid } from 'nanoid'
import { Collapsible } from '../src/collapsible'
import '../src/main'

document.querySelectorAll<HTMLElement>('.collapsible-root').forEach((rootEl) => {
  const collapsible = new Collapsible(rootEl, { id: nanoid() })
  collapsible.init()
})
