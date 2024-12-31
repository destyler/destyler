import { nanoid } from 'nanoid'
import { Checkbox } from '../src/checkbox'
import '../src/main'

document.querySelectorAll<HTMLElement>('.checkbox').forEach((rootEl) => {
  const checkbox = new Checkbox(rootEl, {
    id: nanoid(),
  })

  checkbox.init()
})
