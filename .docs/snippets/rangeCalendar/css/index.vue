<script setup lang="ts">
import {
  CalendarCell,
  CalendarCellTrigger,
  CalendarGrid,
  CalendarGridBody,
  CalendarGridHead,
  CalendarGridRow,
  CalendarHeadCell,
  CalendarHeader,
  CalendarHeading,
  CalendarNext,
  CalendarPrev,
  CalendarRoot,
} from '@destyler/calendar'
import { Icon } from '@destyler/icon'
import './style.css'

function isDateUnavailable(date) {
  return date.day === 17 || date.day === 18
}
</script>

<template>
  <CalendarRoot
    v-slot="{ weekDays, grid }"
    weekday-format="short"
    :is-date-unavailable="isDateUnavailable"
    class="calendar-root"
  >
    <CalendarHeader class="calendar-header">
      <CalendarPrev
        class="calendar-button"
      >
        <Icon
          name="carbon:chevron-left"
          class="icon"
        />
      </CalendarPrev>
      <CalendarHeading class="calendar-heading" />
      <CalendarNext
        class="calendar-button"
      >
        <Icon
          name="carbon:chevron-right"
          class="icon"
        />
      </CalendarNext>
    </CalendarHeader>
    <div class="box">
      <CalendarGrid
        v-for="month in grid"
        :key="month.value.toString()"
        class="calendar-grid1"
      >
        <CalendarGridHead>
          <CalendarGridRow class="row">
            <CalendarHeadCell
              v-for="day in weekDays"
              :key="day"
              class="calendar-head-cell"
            >
              {{ day }}
            </CalendarHeadCell>
          </CalendarGridRow>
        </CalendarGridHead>
        <CalendarGridBody>
          <CalendarGridRow
            v-for="(weekDates, index) in month.rows"
            :key="`weekDate-${index}`"
            class="grid-row"
          >
            <CalendarCell
              v-for="weekDate in weekDates"
              :key="weekDate.toString()"
              :date="weekDate"
              class="calendar-cell"
            >
              <CalendarCellTrigger
                :day="weekDate"
                :month="month.value"
                class="calendar-cell-trigger"
              />
            </CalendarCell>
          </CalendarGridRow>
        </CalendarGridBody>
      </CalendarGrid>
    </div>
  </CalendarRoot>
</template>
