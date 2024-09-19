import type { ComponentResolver } from 'unplugin-vue-components'
import { name } from '../package.json'

const packageName = name

export const calendarComponentName = [
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

export function CalendarResolver(): ComponentResolver {
  return {
    type: 'component',
    resolve: (name: string) => {
      if (calendarComponentName.includes(name))
        return { name, from: packageName }
    },
  }
}
