import type {
  InputProps,
  PresetTriggerProps,
  TableCellProps,
  TableProps,
  UserDefinedContext,
  ViewProps,
} from './types'
import { createProps } from '@zag-js/types'
import { createSplitProps } from '@zag-js/utils'

export const props = createProps<UserDefinedContext>()([
  'closeOnSelect',
  'dir',
  'disabled',
  'fixedWeeks',
  'focusedValue',
  'format',
  'parse',
  'placeholder',
  'getRootNode',
  'id',
  'ids',
  'isDateUnavailable',
  'isDateUnavailable',
  'locale',
  'max',
  'min',
  'name',
  'numOfMonths',
  'onFocusChange',
  'onOpenChange',
  'onValueChange',
  'onViewChange',
  'open',
  'open.controlled',
  'positioning',
  'readOnly',
  'selectionMode',
  'startOfWeek',
  'timeZone',
  'translations',
  'value',
  'view',
  'minView',
  'maxView',
])
export const splitProps = createSplitProps<Partial<UserDefinedContext>>(props)

export const inputProps = createProps<InputProps>()(['index', 'fixOnBlur'])
export const splitInputProps = createSplitProps<InputProps>(inputProps)

export const presetTriggerProps = createProps<PresetTriggerProps>()(['value'])
export const splitPresetTriggerProps = createSplitProps<PresetTriggerProps>(presetTriggerProps)

export const tableProps = createProps<TableProps>()(['columns', 'id', 'view'])
export const splitTableProps = createSplitProps<TableProps>(tableProps)

export const tableCellProps = createProps<TableCellProps>()(['disabled', 'value', 'columns'])
export const splitTableCellProps = createSplitProps<TableCellProps>(tableCellProps)

export const viewProps = createProps<ViewProps>()(['view'])
export const splitViewProps = createSplitProps<ViewProps>(viewProps)
