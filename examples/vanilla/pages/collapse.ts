import { nanoid } from 'nanoid'
import { Collapse } from '../src/collapse'

document.querySelectorAll<HTMLElement>('.collapse').forEach((rootEl) => {
  const collapse = new Collapse(rootEl, { id: nanoid(), multiple: true })
  collapse.init()
})
