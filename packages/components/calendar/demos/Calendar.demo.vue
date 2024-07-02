<script setup lang="ts">
import { getLocalTimeZone, today } from '@internationalized/date'
import { ref } from 'vue'
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
  type CalendarRootProps,
} from '../src'

const date = ref(today(getLocalTimeZone()))

const isDateUnavailable: CalendarRootProps['isDateUnavailable'] = (date) => {
  return date.day === 17 || date.day === 18
}
</script>

<template>
  <CalendarRoot
    v-slot="{ weekDays, grid }"
    v-model="date"
    :is-date-unavailable="isDateUnavailable"
    class="p-3 rounded-md border border-#E4E4E7 dark:border-#27272A shadow"
    fixed-weeks
  >
    <div class="flex flex-col sm:flex-row space-y-4 sm:space-x-4 sm:space-y-0">
      <div class="space-y-4 rdp-caption_start rdp-caption_end">
        <CalendarHeader class="flex justify-center pt-1 relative items-center">
          <CalendarPrev
            class="inline-flex items-center justify-center whitespace-nowrap rounded-md text-sm font-medium dark:ring-offset-#09090B ring-offset-#FFFFFF transition-colors focus-visible:outline-none focus-visible:ring-2 dark:focus-visible:ring-#D4D4D8 focus-visible:ring-#A1A1AA focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 border dark:border-#27272A border-#E4E4E7 dark:hover:bg-#27272A hover:bg-#F4F4F5 dark:hover:text-#FAFAFA hover:text-#18181B h-7 w-7 bg-transparent p-0 opacity-50 hover:opacity-100 absolute left-1"
          >
          <svg>
          <path/>
        </svg>
          </CalendarPrev>
          <CalendarHeading class="text-sm font-medium" />
          <CalendarNext
            class="inline-flex items-center justify-center whitespace-nowrap rounded-md text-sm font-medium dark:ring-offset-#09090B ring-offset-#FFFFFF transition-colors focus-visible:outline-none focus-visible:ring-2 dark:focus-visible:ring-#D4D4D8 focus-visible:ring-#A1A1AA focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 border dark:border-#27272A border-#E4E4E7 dark:hover:bg-#27272A hover:bg-#F4F4F5 dark:hover:text-#FAFAFA hover:text-#18181B h-7 w-7 bg-transparent p-0 opacity-50 hover:opacity-100 absolute right-1"
          >
          <svg>
          <path/>
        </svg>
          </CalendarNext>
        </CalendarHeader>
        <CalendarGrid v-for="month in grid" :key="month.value.toString()" class="w-full border-collapse space-y-1">
          <CalendarGridHead>
            <CalendarGridRow class="flex">
              <CalendarHeadCell
                v-for="day in weekDays" :key="day"
                class="dark:text-#A1A1AA text-#71717A rounded-md w-8 font-normal text-[0.8rem]"
              >
                {{ day }}
              </CalendarHeadCell>
            </CalendarGridRow>
          </CalendarGridHead>
          <CalendarGridBody>
            <CalendarGridRow v-for="(weekDates, index) in month.rows" :key="`weekDate-${index}`" class="flex w-full mt-2">
              <CalendarCell
                v-for="weekDate in weekDates"
                :key="weekDate.toString()"
                :date="weekDate"
                class="relative p-0 text-center text-sm focus-within:relative focus-within:z-20 "
              >
                <CalendarCellTrigger
                  :day="weekDate"
                  :month="month.value"
                  class="inline-flex items-center justify-center whitespace-nowrap rounded-md text-sm dark:ring-offset-#09090B ring-offset-#FFFFFF transition-colors focus-visible:outline-none focus-visible:ring-2 dark:focus-visible:ring-#D4D4D8 focus-visible:ring-#A1A1AA focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 dark:hover:bg-#27272A hover:bg-#F4F4F5 dark:hover:text-#FAFAFA hover:text-#18181B h-8 w-8 p-0 font-normal data-[disabled]:text-op-30 dark:text-#FFFFFF text-#09090b data-[selected]:bg-#27272A dark:data-[selected]:bg-#F4F4F5 data-[selected]:text-#FAFAFA dark:data-[selected]:text-#18181B"
                />
              </CalendarCell>
            </CalendarGridRow>
          </CalendarGridBody>
        </CalendarGrid>
      </div>
    </div>
  </CalendarRoot>
</template>
