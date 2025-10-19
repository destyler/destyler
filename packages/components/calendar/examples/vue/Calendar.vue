<script setup lang="ts">
import { Layout, StateVisualizer, Toolbar } from '@destyler/shared-private/vue'
import { normalizeProps, useMachine } from '@destyler/vue'
import { computed, onMounted, ref, useId } from 'vue'
import * as calendar from '../../index'
import '../style.css'

const [state, send] = useMachine(
  calendar.machine({
    id: useId(),
    locale: 'en',
    selectionMode: 'single',
  }),
)
const api = computed(() =>
  calendar.connect(state.value, send, normalizeProps),
)

const show = ref(false)

onMounted(() => {
  show.value = true
})
</script>

<template>
  <Layout v-if="show">
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
          <div v-show="api.view === 'day'">
            <div v-bind="api.getViewControlProps({ view: 'year' })">
              <button v-bind="api.getPrevTriggerProps()">
                ←
              </button>
              <button v-bind="api.getViewTriggerProps()">
                {{ api.visibleRangeText.start }}
              </button>
              <button v-bind="api.getNextTriggerProps()">
                →
              </button>
            </div>

            <table v-bind="api.getTableProps({ view: 'day' })">
              <thead v-bind="api.getTableHeaderProps({ view: 'day' })">
                <tr v-bind="api.getTableRowProps({ view: 'day' })">
                  <th v-for="(day, dayIndex) in api.weekDays" :key="dayIndex" scope="col" class="text-center text-xs font-medium text-muted-foreground p-1">
                    {{ day.narrow }}
                  </th>
                </tr>
              </thead>
              <tbody v-bind="api.getTableBodyProps({ view: 'day' })">
                <tr
                  v-for="(week, weekIndex) in api.weeks"
                  v-bind="api.getTableRowProps({ view: 'day' })"
                  :key="weekIndex"
                >
                  <td
                    v-for="(value, valueIndex) in week"
                    :key="valueIndex"
                    v-bind="api.getDayTableCellProps({ value })"
                  >
                    <div v-bind="api.getDayTableCellTriggerProps({ value })">
                      {{ value.day }}
                    </div>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>

          <!-- Month View -->
          <div v-show="api.view === 'month'">
            <div v-bind="api.getViewControlProps({ view: 'month' })">
              <button v-bind="api.getPrevTriggerProps({ view: 'month' })">
                ←
              </button>
              <button v-bind="api.getViewTriggerProps({ view: 'month' })">
                {{ api.visibleRange.start.year }}
              </button>
              <button v-bind="api.getNextTriggerProps({ view: 'month' })">
                →
              </button>
            </div>

            <table v-bind="api.getTableProps({ view: 'month', columns: 4 })">
              <tbody v-bind="api.getTableBodyProps({ view: 'month' })">
                <tr
                  v-for="(months, monthsIndex) in api.getMonthsGrid({ columns: 4, format: 'short' })"
                  v-bind="api.getTableRowProps()"
                  :key="monthsIndex"
                >
                  <td
                    v-for="(month, monthIndex) in months"
                    :key="monthIndex"
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
                </tr>
              </tbody>
            </table>
          </div>

          <!-- Year View -->
          <div v-show="api.view === 'year'">
            <div v-bind="api.getViewControlProps({ view: 'year' })">
              <button v-bind="api.getPrevTriggerProps({ view: 'year' })">
                ←
              </button>
              <span>
                {{ api.getDecade().start }} - {{ api.getDecade().end }}
              </span>
              <button v-bind="api.getNextTriggerProps({ view: 'year' })">
                →
              </button>
            </div>

            <table v-bind="api.getTableProps({ view: 'year', columns: 4 })">
              <tbody v-bind="api.getTableBodyProps()">
                <tr
                  v-for="(years, yearsIndex) in api.getYearsGrid({ columns: 4 })"
                  :key="yearsIndex"
                  v-bind="api.getTableRowProps({ view: 'year' })"
                >
                  <td
                    v-for="(year, yearIndex) in years"
                    :key="yearIndex"
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
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </Teleport>
    <Toolbar>
      <StateVisualizer :state="state" />
    </Toolbar>
  </Layout>
</template>
