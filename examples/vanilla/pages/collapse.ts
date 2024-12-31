import { nanoid } from 'nanoid'
import { Collapse } from '../src/collapse'
import '../src/main'

document.querySelectorAll<HTMLElement>('.collapse').forEach((rootEl) => {
  const collapse = new Collapse(rootEl, { id: nanoid() })
  collapse.init()
})
