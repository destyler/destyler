<script setup lang="ts">
import { Icon } from '@destyler/icon'
import { RangeCalendarCell, RangeCalendarCellTrigger, RangeCalendarGrid, RangeCalendarGridBody, RangeCalendarGridHead, RangeCalendarGridRow, RangeCalendarHeadCell, RangeCalendarHeader, RangeCalendarHeading, RangeCalendarNext, RangeCalendarPrev, RangeCalendarRoot } from '../src'
</script>

<template>
  <RangeCalendarRoot
    v-slot="{ weekDays, grid }"
    class="p-3 rounded-md border border-#E4E4E7 dark:border-#27272A shadow"
    fixed-weeks
  >
    <div class="flex flex-col sm:flex-row space-y-4 sm:space-x-4 sm:space-y-0">
      <div class="space-y-4 rdp-caption_start rdp-caption_end">
        <RangeCalendarHeader class="flex justify-center pt-1 relative items-center">
          <RangeCalendarPrev
            class="inline-flex items-center justify-center whitespace-nowrap rounded-md text-sm font-medium dark:ring-offset-#09090B ring-offset-#FFFFFF transition-colors focus-visible:outline-none focus-visible:ring-2 dark:focus-visible:ring-#D4D4D8 focus-visible:ring-#A1A1AA focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 border dark:border-#27272A border-#E4E4E7 dark:hover:bg-#27272A hover:bg-#F4F4F5 dark:hover:text-#FAFAFA hover:text-#18181B h-7 w-7 bg-transparent p-0 opacity-50 hover:opacity-100 absolute left-1"
          >
            <Icon name="radix-icons:chevron-left" class="w-4 h-4" />
          </RangeCalendarPrev>
          <RangeCalendarHeading class="text-sm font-medium" />
          <RangeCalendarNext
            class="inline-flex items-center justify-center whitespace-nowrap rounded-md text-sm font-medium dark:ring-offset-#09090B ring-offset-#FFFFFF transition-colors focus-visible:outline-none focus-visible:ring-2 dark:focus-visible:ring-#D4D4D8 focus-visible:ring-#A1A1AA focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 border dark:border-#27272A border-#E4E4E7 dark:hover:bg-#27272A hover:bg-#F4F4F5 dark:hover:text-#FAFAFA hover:text-#18181B h-7 w-7 bg-transparent p-0 opacity-50 hover:opacity-100 absolute right-1"
          >
            <Icon name="radix-icons:chevron-right" class="w-4 h-4" />
          </RangeCalendarNext>
        </RangeCalendarHeader>
        <RangeCalendarGrid v-for="month in grid" :key="month.value.toString()" class="w-full border-collapse space-y-1">
          <RangeCalendarGridHead>
            <RangeCalendarGridRow class="flex">
              <RangeCalendarHeadCell
                v-for="day in weekDays" :key="day"
                class="dark:text-#A1A1AA mx-1px text-#71717A rounded-md w-8 font-normal text-[0.8rem]"
              >
                {{ day }}
              </RangeCalendarHeadCell>
            </RangeCalendarGridRow>
          </RangeCalendarGridHead>
          <RangeCalendarGridBody>
            <RangeCalendarGridRow v-for="(weekDates, index) in month.rows" :key="`weekDate-${index}`" class="flex w-full mt-2">
              <RangeCalendarCell
                v-for="weekDate in weekDates"
                :key="weekDate.toString()"
                :date="weekDate"
                class="relative p-0 text-center text-sm focus-within:relative focus-within:z-20 "
              >
                <RangeCalendarCellTrigger
                  :day="weekDate"
                  :month="month.value"
                  class="inline-flex mx-1px items-center justify-center whitespace-nowrap rounded-md text-sm dark:ring-offset-#09090B ring-offset-#FFFFFF transition-colors focus-visible:outline-none focus-visible:ring-2 dark:focus-visible:ring-#D4D4D8 focus-visible:ring-#A1A1AA focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 dark:hover:bg-#27272A hover:bg-#F4F4F5 dark:hover:text-#FAFAFA hover:text-#18181B h-8 w-8 p-0 font-normal data-[disabled]:text-op-30 dark:text-#FFFFFF text-#09090b data-[selected]:bg-#27272A dark:data-[selected]:bg-#F4F4F5 data-[selected]:text-#FAFAFA dark:data-[selected]:text-#18181B data-[highlighted]:bg-#27272A/80 dark:data-[highlighted]:bg-#F4F4F5/80 data-[highlighted]:text-#FAFAFA dark:data-[highlighted]:text-#18181B data-[unavailable]:pointer-events-none data-[unavailable]:text-black/30 data-[unavailable]:line-through"
                />
              </RangeCalendarCell>
            </RangeCalendarGridRow>
          </RangeCalendarGridBody>
        </RangeCalendarGrid>
      </div>
    </div>
  </RangeCalendarRoot>
</template>
