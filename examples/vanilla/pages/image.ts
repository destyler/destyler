import { nanoid } from 'nanoid'
import { Image } from '../src/image'
import '../src/main'

document.querySelectorAll<HTMLElement>('.image-root').forEach((rootEl) => {
  const image = new Image(rootEl, { id: nanoid() })
  image.init()
})
