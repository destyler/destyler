<script setup lang="ts">
import { CalendarDate, type DateValue, PersianCalendar, toCalendar } from '@internationalized/date'
import { type Ref, ref } from 'vue'
import RangeCalendar from './components/DummyRangeCalendar.vue'

const defaultValue = { start: new CalendarDate(2024, 2, 20), end: new CalendarDate(2024, 2, 27) }
const persianCalendar = ref({ start: toCalendar(defaultValue.start, new PersianCalendar()), end: toCalendar(defaultValue.end, new PersianCalendar()) }) as Ref<{ start: DateValue, end: DateValue }>
const modelValue = ref(defaultValue) as Ref<{ start: DateValue, end: DateValue }>
const startValue = ref(new CalendarDate(2024, 2, 20)) as Ref<CalendarDate>

const placeholder = ref(new CalendarDate(2024, 4, 1)) as Ref<CalendarDate>
</script>

<template>
  <Story title="Range Calendar/Chromatic" :layout="{ type: 'grid', width: '50%', iframe: false }">
    <Variant title="Uncontrolled (modelValue)">
      <RangeCalendar :default-value="defaultValue" />
    </Variant>

    <Variant title="Controlled (modelValue)">
      <RangeCalendar v-model="modelValue" />
    </Variant>

    <Variant title="Uncontrolled (placeholder)">
      <RangeCalendar :default-value="defaultValue" :default-placeholder="placeholder" />
    </Variant>

    <Variant title="Controlled (placeholder)">
      <RangeCalendar v-model:placeholder="placeholder" />
    </Variant>

    <Variant title="Empty default">
      <RangeCalendar />
    </Variant>

    <Variant title="Default value">
      <RangeCalendar :default-value="defaultValue" />
    </Variant>

    <Variant title="Fixed weeks">
      <RangeCalendar :default-value="defaultValue" fixed-weeks />
    </Variant>

    <Variant title="Localization">
      <RangeCalendar :default-value="defaultValue" locale="de" />
    </Variant>

    <Variant title="Prevent deselection">
      <RangeCalendar :default-value="defaultValue" prevent-deselect />
    </Variant>

    <Variant title="Multiple selection">
      <RangeCalendar :default-value="defaultValue" multiple />
    </Variant>

    <Variant title="Different calendar">
      <RangeCalendar :default-value="persianCalendar" />
    </Variant>
  </Story>
</template>
