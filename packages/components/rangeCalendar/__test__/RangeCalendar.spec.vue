<script lang="ts" setup>
import type { DateValue } from '@internationalized/date'
import type { RangeCalendarRootProps } from '../src'
import { RangeCalendarCell, RangeCalendarCellTrigger, RangeCalendarGrid, RangeCalendarGridBody, RangeCalendarGridHead, RangeCalendarGridRow, RangeCalendarHeadCell, RangeCalendarHeader, RangeCalendarHeading, RangeCalendarNext, RangeCalendarPrev, RangeCalendarRoot } from '../src'

const props = defineProps<{
  calendarProps?: RangeCalendarRootProps
  emits?: { 'onUpdate:modelValue'?: (data: DateValue) => void }
}>()
</script>

<template>
  <RangeCalendarRoot
    v-slot="{ weekDays, grid }"
    v-bind="props.calendarProps"
    data-testid="calendar"
    v-on="{ 'update:modelValue': props.emits?.['onUpdate:modelValue'] }"
  >
    <RangeCalendarHeader data-testid="header">
      <RangeCalendarPrev
        data-testid="prev-button"
      />
      <RangeCalendarHeading data-testid="heading" />
      <RangeCalendarNext
        data-testid="next-button"
      />
    </RangeCalendarHeader>

    <RangeCalendarGrid
      v-for="month in grid"
      :key="month.value.toString()"
      :data-testid="`grid-${month.value.month}`"
    >
      <RangeCalendarGridHead :data-testid="`grid-head-${month.value.month}`">
        <RangeCalendarGridRow>
          <RangeCalendarHeadCell
            v-for="(day, i) in weekDays" :key="day"
            :data-testid="`weekday-${month.value.month}-${i}`"
          >
            {{ day }}
          </RangeCalendarHeadCell>
        </RangeCalendarGridRow>
      </RangeCalendarGridHead>
      <RangeCalendarGridBody :data-testid="`grid-body-${month.value.month}`">
        <RangeCalendarGridRow v-for="(weekDates, index) in month.rows" :key="`weekDate-${index}`" data-week :data-testid="`grid-row-${month.value.month}-${index}`">
          <RangeCalendarCell
            v-for="(weekDate, d) in weekDates"
            :key="weekDate.toString()"
            :data-testid="`cell-${weekDate.month}-${d}`"
            :date="weekDate"
          >
            <RangeCalendarCellTrigger
              :day="weekDate"
              :month="month.value"
              :data-testid="`date-${weekDate.month}-${weekDate.day}`"
            />
          </RangeCalendarCell>
        </RangeCalendarGridRow>
      </RangeCalendarGridBody>
    </RangeCalendarGrid>
  </RangeCalendarRoot>
</template>
