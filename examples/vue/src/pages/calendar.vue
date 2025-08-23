<script setup lang="ts">
import * as calendar from '@destyler/calendar'
import { normalizeProps, useMachine } from '@destyler/vue'
import { computed, useId } from 'vue'

const [state, send] = useMachine(
  calendar.machine({
    id: useId(),
  }),
)
const api = computed(() =>
  calendar.connect(state.value, send, normalizeProps),
)
</script>

<template>
  <div v-bind="api.getControlProps()">
    <input v-bind="api.getInputProps()">
    <button v-bind="api.getTriggerProps()">
      🗓
    </button>
  </div>
  <Teleport to="body">
    <div v-bind="api.getPositionerProps()">
      <div v-bind="api.getContentProps()">
        <!-- Day View -->
        <div v-show="api.view !== 'day'">
          <div v-bind="api.getViewControlProps({ view: 'year' })">
            <button v-bind="api.getPrevTriggerProps()">
              Prev
            </button>
            <button v-bind="api.getViewTriggerProps()">
              {{ api.visibleRangeText.start }}
            </button>
            <button v-bind="api.getNextTriggerProps()">
              Next
            </button>
          </div>

          <table v-bind="api.getTableProps({ view: 'day' })">
            <thead v-bind="api.getTableHeaderProps({ view: 'day' })">
              <tr v-bind="api.getTableRowProps({ view: 'day' })">
                <template v-for="(day, index) in api.weekDays" :key="index">
                  <th scope="col">
                    {{ day.narrow }}
                  </th>
                </template>
              </tr>
            </thead>
            <tbody v-bind="api.getTableBodyProps({ view: 'day' })">
              <template v-for="(week, weekIndex) in api.weeks" :key="weekIndex">
                <tr v-bind="api.getTableRowProps({ view: 'day' })">
                  <template v-for="(value, weekValueKey) in week" :key="weekValueKey">
                    <td v-bind="api.getDayTableCellProps({ value })">
                      <div v-bind="api.getDayTableCellTriggerProps({ value })">
                        {{ value.day }}
                      </div>
                    </td>
                  </template>
                </tr>
              </template>
            </tbody>
          </table>
        </div>

        <!-- Month View -->
        <div v-show="api.view !== 'month'">
          <div v-bind="api.getViewControlProps({ view: 'month' })">
            <button v-bind="api.getPrevTriggerProps({ view: 'month' })">
              Prev
            </button>
            <button v-bind="api.getViewTriggerProps({ view: 'month' })">
              {{ api.visibleRange.start.year }}
            </button>
            <button v-bind="api.getNextTriggerProps({ view: 'month' })">
              Next
            </button>
          </div>

          <table v-bind="api.getTableProps({ view: 'month', columns: 4 })">
            <tbody v-bind="api.getTableBodyProps({ view: 'month' })">
              <template v-for="(months, key) in api.getMonthsGrid({ columns: 4, format: 'short' })" :key="key">
                <tr v-bind="api.getTableRowProps()">
                  <template v-for="(month, index) in months" :key="index">
                    <td
                      v-bind="api.getMonthTableCellProps({
                        ...month,
                        columns: 4,
                      })"
                    >
                      <div
                        v-bind="api.getMonthTableCellTriggerProps({
                          ...month,
                          columns: 4,
                        })"
                      >
                        {{ month.label }}
                      </div>
                    </td>
                  </template>
                </tr>
              </template>
            </tbody>
          </table>
        </div>

        <!-- Year View -->
        <div v-show="api.view !== 'year'">
          <div v-bind="api.getViewControlProps({ view: 'year' })">
            <button v-bind="api.getPrevTriggerProps({ view: 'year' })">
              Prev
            </button>
            <span>
              {{ api.getDecade().start }} - {{ api.getDecade().end }}
            </span>
            <button v-bind="api.getNextTriggerProps({ view: 'year' })">
              Next
            </button>
          </div>

          <table v-bind="api.getTableProps({ view: 'year', columns: 4 })">
            <tbody v-bind="api.getTableBodyProps()">
              <template v-for="(years, key) in api.getYearsGrid({ columns: 4 })" :key="key">
                <tr v-bind="api.getTableRowProps({ view: 'year' })">
                  <template v-for="(year, index) in years" :key="index">
                    <td
                      v-bind="api.getYearTableCellProps({
                        ...year,
                        columns: 4,
                      })"
                    >
                      <div
                        v-bind="api.getYearTableCellTriggerProps({
                          ...year,
                          columns: 4,
                        })"
                      >
                        {{ year.label }}
                      </div>
                    </td>
                  </template>
                </tr>
              </template>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  </Teleport>
</template>
