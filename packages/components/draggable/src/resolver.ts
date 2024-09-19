import type { ComponentResolver } from 'unplugin-vue-components'
import { name } from '../package.json'

const packageName = name

export const draggableComponentName = [
  'Draggable',
]

export function DraggableResolver(): ComponentResolver {
  return {
    type: 'component',
    resolve: (name: string) => {
      if (draggableComponentName.includes(name))
        return { name, from: packageName }
    },
  }
}
