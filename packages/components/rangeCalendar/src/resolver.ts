import type { ComponentResolver } from 'unplugin-vue-components'
import { name } from '../package.json'

const packageName = name

export const rangeCalendarComponentName = [
  'RangeCalendarCell',
  'RangeCalendarCellTrigger',
  'RangeCalendarGrid',
  'RangeCalendarGridBody',
  'RangeCalendarGridHead',
  'RangeCalendarGridRow',
  'RangeCalendarHeadCell',
  'RangeCalendarHeader',
  'RangeCalendarHeading',
  'RangeCalendarNext',
  'RangeCalendarPrev',
  'RangeCalendarRoot',
]

export function RangeCalendarResolver(): ComponentResolver {
  return {
    type: 'component',
    resolve: (name: string) => {
      if (rangeCalendarComponentName.includes(name))
        return { name, from: packageName }
    },
  }
}
