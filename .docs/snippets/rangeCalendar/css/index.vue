<script setup lang="ts">
import {
  RangeCalendarCell,
  RangeCalendarCellTrigger,
  RangeCalendarGrid,
  RangeCalendarGridBody,
  RangeCalendarGridHead,
  RangeCalendarGridRow,
  RangeCalendarHeadCell,
  RangeCalendarHeader,
  RangeCalendarHeading,
  RangeCalendarNext,
  RangeCalendarPrev,
  RangeCalendarRoot,
} from '@destyler/range-calendar'
import { Icon } from '@destyler/icon'
import './style.css'
</script>

<template>
  <RangeCalendarRoot
    v-slot="{ weekDays, grid }"
    class="calendar-root"
  >
    <RangeCalendarHeader class="calendar-header">
      <RangeCalendarPrev
        class="calendar-button"
      >
        <Icon
          name="carbon:chevron-left"
          class="icon"
        />
      </RangeCalendarPrev>
      <RangeCalendarHeading class="calendar-heading" />
      <RangeCalendarNext
        class="calendar-button"
      >
        <Icon
          name="carbon:chevron-right"
          class="icon"
        />
      </RangeCalendarNext>
    </RangeCalendarHeader>
    <div class="box">
      <RangeCalendarGrid
        v-for="month in grid"
        :key="month.value.toString()"
        class="calendar-grid"
      >
        <RangeCalendarGridHead>
          <RangeCalendarGridRow class="row">
            <RangeCalendarHeadCell
              v-for="day in weekDays"
              :key="day"
              class="calendar-head-cell"
            >
              {{ day }}
            </RangeCalendarHeadCell>
          </RangeCalendarGridRow>
        </RangeCalendarGridHead>
        <RangeCalendarGridBody>
          <RangeCalendarGridRow
            v-for="(weekDates, index) in month.rows"
            :key="`weekDate-${index}`"
            class="grid-row"
          >
            <RangeCalendarCell
              v-for="weekDate in weekDates"
              :key="weekDate.toString()"
              :date="weekDate"
              class="calendar-cell"
            >
              <RangeCalendarCellTrigger
                :day="weekDate"
                :month="month.value"
                class="calendar-cell-trigger"
              />
            </RangeCalendarCell>
          </RangeCalendarGridRow>
        </RangeCalendarGridBody>
      </RangeCalendarGrid>
    </div>
  </RangeCalendarRoot>
</template>
