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
    p="3"
    rounded="md"
    border="~"
    shadow="~"
    bg="dark:#09090B #FFFFFF"
    text="dark dark:light"
  >
    <CalendarHeader
      relative="~"
      flex="~"
      w="full"
      items="center"
      justify="between"
      p="t-1"
    >
      <CalendarPrev
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
      </CalendarPrev>
      <CalendarHeading
        text="sm"
        font="medium"
      />
      <CalendarNext
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
      </CalendarNext>
    </CalendarHeader>
    <div
      flex="~ col sm:row"
      gap="y-4 sm:x-4 sm:y-0"
      m="t-4"
    >
      <CalendarGrid
        v-for="month in grid"
        :key="month.value.toString()"
        w="full"
        border="collapse"
        space="y-1"
      >
        <CalendarGridHead>
          <CalendarGridRow flex="~">
            <CalendarHeadCell
              v-for="day in weekDays"
              :key="day"
              w="8"
              rounded="md"
              text="0.8rem muted-foreground"
              font="normal"
            >
              {{ day }}
            </CalendarHeadCell>
          </CalendarGridRow>
        </CalendarGridHead>
        <CalendarGridBody>
          <CalendarGridRow
            v-for="(weekDates, index) in month.rows"
            :key="`weekDate-${index}`"
            flex="~"
            m="t-2"
            w="full"
          >
            <CalendarCell
              v-for="weekDate in weekDates"
              :key="weekDate.toString()"
              :date="weekDate"
              relative="~"
              p="0"
              text="center sm"
              focus-within="relative z-20"
              rounded="[&:has([data-selected])]:md"
              bg="[&:has([data-selected])]:accent [&:has([data-selected][data-outside-view])]:accent/50"
            >
              <CalendarCellTrigger
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
                data-[selected]:primary-foreground
                data-[selected]:hover:primary-foreground
                data-[selected]:focus:primary-foreground
                data-[disabled]:muted-foreground
                data-[unavailable]:destructive-foreground
                data-[outside-view]:muted-foreground
                [&[data-outside-view][data-selected]]:muted-foreground
                "
                transition="colors"
                focus-visible="outline-none ring-1 ring-ring"
                pointer-events="disabled:none"
                op="
                disabled:50 50 hover:100
                data-[selected]:100
                data-[disabled]:50
                data-[outside-view]:50
                [&[data-outside-view][data-selected]]:30
                "
                bg="
                hover:accent
                [&[data-today]:not([data-selected])]:accent
                data-[selected]:primary
                data-[selected]:hover:primary
                data-[selected]:focus:primary
                [&[data-outside-view][data-selected]]:accent/50
                "
                h="8"
                w="8"
                p="0"
                font="normal"
                line="data-[unavailable]:through"
              />
            </CalendarCell>
          </CalendarGridRow>
        </CalendarGridBody>
      </CalendarGrid>
    </div>
  </CalendarRoot>
</template>
