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
</script>

<template>
  <RangeCalendarRoot
    v-slot="{ weekDays, grid }"
    p="3"
    rounded="md"
    border="~"
    shadow="~"
    bg="dark:#09090B #FFFFFF"
    text="dark dark:light"
  >
    <RangeCalendarHeader
      relative="~"
      flex="~"
      w="full"
      items="center"
      justify="between"
      p="t-1"
    >
      <RangeCalendarPrev
        inline="flex"
        items="center"
        justify="center"
        whitespace="nowrap"
        rounded="md"
        text="sm hover:accent-foreground"
        font="medium"
        transition="colors"
        focus-visible="outline-none ring-1 ring-ring"
        pointer-events="disabled:none"
        op="disabled:50 50 hover:100"
        border="~ input"
        shadow="sm"
        bg="hover:accent transparent"
        h="7"
        w="7"
        p="0"
      >
        <Icon
          name="carbon:chevron-left"
          w="4"
          h="4"
        />
      </RangeCalendarPrev>
      <RangeCalendarHeading
        text="sm"
        font="medium"
      />
      <RangeCalendarNext
        inline="flex"
        items="center"
        justify="center"
        whitespace="nowrap"
        rounded="md"
        text="sm hover:accent-foreground"
        font="medium"
        transition="colors"
        focus-visible="outline-none ring-1 ring-ring"
        pointer-events="disabled:none"
        op="disabled:50 50 hover:100"
        border="~ input"
        shadow="sm"
        bg="hover:accent transparent"
        h="7"
        w="7"
        p="0"
      >
        <Icon
          name="carbon:chevron-right"
          w="4"
          h="4"
        />
      </RangeCalendarNext>
    </RangeCalendarHeader>
    <div
      flex="~ col sm:row"
      gap="y-4 sm:x-4 sm:y-0"
      m="t-4"
    >
      <RangeCalendarGrid
        v-for="month in grid"
        :key="month.value.toString()"
        w="full"
        border="collapse"
        space="y-1"
      >
        <RangeCalendarGridHead>
          <RangeCalendarGridRow flex="~">
            <RangeCalendarHeadCell
              v-for="day in weekDays"
              :key="day"
              w="8"
              rounded="md"
              text="0.8rem muted-foreground"
              font="normal"
            >
              {{ day }}
            </RangeCalendarHeadCell>
          </RangeCalendarGridRow>
        </RangeCalendarGridHead>
        <RangeCalendarGridBody>
          <RangeCalendarGridRow
            v-for="(weekDates, index) in month.rows"
            :key="`weekDate-${index}`"
            flex="~"
            m="t-2"
            w="full"
          >
            <RangeCalendarCell
              v-for="weekDate in weekDates"
              :key="weekDate.toString()"
              :date="weekDate"
              relative="~"
              p="0"
              text="center text-sm"
              focus-within="relative z-20"
              bg="[&:has([data-selected])]:accent [&:has([data-selected][data-outside-view])]:accent/50"
              rounded="first:[&:has([data-selected])]:l-md last:[&:has([data-selected])]:r-md [&:has([data-selected][data-selection-end])]:r-md [&:has([data-selected][data-selection-start])]:l-md"
            >
              <RangeCalendarCellTrigger
                :day="weekDate"
                :month="month.value"
                inline="flex"
                items="center"
                justify="center"
                whitespace="nowrap"
                rounded="md"
                text="
                sm hover:accent-foreground
                [&[data-today]:not([data-selected])]:accent-foreground
                data-[selection-start]:primary-foreground
                data-[selection-start]:hover:primary-foreground
                data-[selection-start]:focus:primary-foreground
                data-[selection-end]:primary-foreground
                data-[selection-end]:hover:primary-foreground
                data-[selection-end]:focus:primary-foreground
                data-[outside-view]:muted-foreground
                [&[data-outside-view][data-selected]]:muted-foreground
                data-[disabled]:muted-foreground
                data-[unavailable]:destructive-foreground
                "
                transition="colors"
                focus-visible="outline-none ring-1 ring-ring"
                pointer-events="disabled:none"
                op="disabled:50 data-[selected]:100 data-[outside-view]:50 [&[data-outside-view][data-selected]]:30 data-[disabled]:50"
                bg="
                hover:accent
                [&[data-today]:not([data-selected])]:accent
                data-[selection-start]:primary
                data-[selection-start]:hover:primary
                data-[selection-start]:focus:primary
                data-[selection-end]:primary
                data-[selection-end]:hover:primary
                data-[selection-end]:focus:primary
                "
                w="8"
                h="8"
                p="0"
                font="normal"
                line="data-[unavailable]:through"
              />
            </RangeCalendarCell>
          </RangeCalendarGridRow>
        </RangeCalendarGridBody>
      </RangeCalendarGrid>
    </div>
  </RangeCalendarRoot>
</template>
