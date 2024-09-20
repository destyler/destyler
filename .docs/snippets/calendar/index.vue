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

function isDateUnavailable(date) {
  return date.day === 17 || date.day === 18
}
</script>

<template>
  <CalendarRoot
    v-slot="{ weekDays, grid }"
    weekday-format="short"
    :is-date-unavailable="isDateUnavailable"
    class="p-3 rounded-md border shadow dark:bg-#09090b bg-#ffffff text-dark dark:text-light"
  >
    <CalendarHeader class="relative flex w-full items-center justify-between pt-1">
      <CalendarPrev
        class="inline-flex items-center justify-center whitespace-nowrap rounded-md text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50 border border-input shadow-sm hover:bg-accent hover:text-accent-foreground h-7 w-7 bg-transparent p-0 opacity-50 hover:opacity-100"
      >
        <Icon
          name="carbon:chevron-left"
          class="w-4 h-4 "
        />
      </CalendarPrev>
      <CalendarHeading class="text-sm font-medium " />
      <CalendarNext
        class="inline-flex items-center justify-center whitespace-nowrap rounded-md text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50 border border-input shadow-sm hover:bg-accent hover:text-accent-foreground h-7 w-7 bg-transparent p-0 opacity-50 hover:opacity-100"
      >
        <Icon
          name="carbon:chevron-right"
          class="w-4 h-4 "
        />
      </CalendarNext>
    </CalendarHeader>
    <div class="flex flex-col gap-y-4 mt-4 sm:flex-row sm:gap-x-4 sm:gap-y-0">
      <CalendarGrid
        v-for="month in grid"
        :key="month.value.toString()"
        class="w-full border-collapse space-y-1"
      >
        <CalendarGridHead>
          <CalendarGridRow class="flex">
            <CalendarHeadCell
              v-for="day in weekDays"
              :key="day"
              class="w-8 rounded-md text-[0.8rem] font-normal text-muted-foreground"
            >
              {{ day }}
            </CalendarHeadCell>
          </CalendarGridRow>
        </CalendarGridHead>
        <CalendarGridBody>
          <CalendarGridRow
            v-for="(weekDates, index) in month.rows"
            :key="`weekDate-${index}`"
            class="flex mt-2 w-full"
          >
            <CalendarCell
              v-for="weekDate in weekDates"
              :key="weekDate.toString()"
              :date="weekDate"
              class="relative p-0 text-center text-sm focus-within:relative focus-within:z-20 [&:has([data-selected])]:rounded-md [&:has([data-selected])]:bg-accent [&:has([data-selected][data-outside-view])]:bg-accent/50"
            >
              <CalendarCellTrigger
                :day="weekDate"
                :month="month.value"
                class="
                inline-flex items-center justify-center whitespace-nowrap
                rounded-md text-sm transition-colors focus-visible:outline-none
                focus-visible:ring-1 focus-visible:ring-ring disabled:pointer-events-none
                disabled:opacity-50 hover:bg-accent hover:text-accent-foreground
                h-8 w-8 p-0 font-normal [&[data-today]:not([data-selected])]:bg-accent
                [&[data-today]:not([data-selected])]:text-accent-foreground
                data-[selected]:bg-primary data-[selected]:text-primary-foreground
                data-[selected]:opacity-100 data-[selected]:hover:bg-primary
                data-[selected]:hover:text-primary-foreground
                data-[selected]:focus:bg-primary data-[selected]:focus:text-primary-foreground
                data-[disabled]:text-muted-foreground data-[disabled]:opacity-50
                data-[unavailable]:text-muted-foreground
                data-[unavailable]:line-through data-[outside-view]:text-muted-foreground
                data-[outside-view]:opacity-50 [&[data-outside-view][data-selected]]:bg-accent/50
                [&[data-outside-view][data-selected]]:text-muted-foreground
                [&[data-outside-view][data-selected]]:opacity-30"
              />
            </CalendarCell>
          </CalendarGridRow>
        </CalendarGridBody>
      </CalendarGrid>
    </div>
  </CalendarRoot>
</template>
