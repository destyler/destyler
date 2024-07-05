import type { ComponentResolver } from 'unplugin-vue-components'
import { name } from '../package.json'

const packageName = name

export const componentName = [
  'CalendarCell',
  'CalendarCellTrigger',
  'CalendarGrid',
  'CalendarGridBody',
  'CalendarGridHead',
  'CalendarGridRow',
  'CalendarHeadCell',
  'CalendarHeader',
  'CalendarHeading',
  'CalendarNext',
  'CalendarPrev',
  'CalendarRoot',
]

export function DestylerTemplateResolver(): ComponentResolver {
  return {
    type: 'component',
    resolve: (name: string) => {
      if (componentName.includes(name))
        return { name, from: packageName }
    },
  }
}
