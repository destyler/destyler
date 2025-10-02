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
  <div v-bind="api.getControlProps()" class="relative">
    <input 
      v-bind="api.getInputProps()"
      class="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
    >
    <button 
      v-bind="api.getTriggerProps()" 
      class="absolute right-2 top-1/2 -translate-y-1/2 rounded-sm opacity-70 transition-opacity hover:opacity-100"
    >
      🗓
    </button>
  </div>
  <Teleport to="body">
    <div v-bind="api.getPositionerProps()" class="z-101">
      <div 
        v-bind="api.getContentProps()" 
        class="bg-background border border-border shadow-lg rounded-lg p-4 w-auto min-w-[280px]"
      >
        <!-- Day View -->
        <div v-show="api.view !== 'day'">
          <div 
            v-bind="api.getViewControlProps({ view: 'year' })"
            class="flex items-center justify-between mb-4"
          >
            <button 
              v-bind="api.getPrevTriggerProps()"
              class="rounded-md px-2 py-1 text-muted-foreground hover:bg-muted"
            >
              ←
            </button>
            <button 
              v-bind="api.getViewTriggerProps()"
              class="font-medium text-foreground hover:underline"
            >
              {{ api.visibleRangeText.start }}
            </button>
            <button 
              v-bind="api.getNextTriggerProps()"
              class="rounded-md px-2 py-1 text-muted-foreground hover:bg-muted"
            >
              →
            </button>
          </div>

          <table v-bind="api.getTableProps({ view: 'day' })" class="w-full border-collapse">
            <thead v-bind="api.getTableHeaderProps({ view: 'day' })">
              <tr v-bind="api.getTableRowProps({ view: 'day' })">
                <template v-for="(day) in api.weekDays">
                  <th scope="col" class="text-center text-xs font-medium text-muted-foreground p-1">
                    {{ day.narrow }}
                  </th>
                </template>
              </tr>
            </thead>
            <tbody v-bind="api.getTableBodyProps({ view: 'day' })">
              <template v-for="(week) in api.weeks">
                <tr v-bind="api.getTableRowProps({ view: 'day' })">
                  <template v-for="(value) in week">
                    <td v-bind="api.getDayTableCellProps({ value })" class="p-0">
                      <div 
                        v-bind="api.getDayTableCellTriggerProps({ value })" 
                        class="flex items-center justify-center w-8 h-8 rounded-md mx-auto text-sm hover:bg-muted aria-selected:bg-primary aria-selected:text-primary-foreground transition-colors"
                      >
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
          <div 
            v-bind="api.getViewControlProps({ view: 'month' })"
            class="flex items-center justify-between mb-4"
          >
            <button 
              v-bind="api.getPrevTriggerProps({ view: 'month' })"
              class="rounded-md px-2 py-1 text-muted-foreground hover:bg-muted"
            >
              ←
            </button>
            <button 
              v-bind="api.getViewTriggerProps({ view: 'month' })"
              class="font-medium text-foreground hover:underline"
            >
              {{ api.visibleRange.start.year }}
            </button>
            <button 
              v-bind="api.getNextTriggerProps({ view: 'month' })"
              class="rounded-md px-2 py-1 text-muted-foreground hover:bg-muted"
            >
              →
            </button>
          </div>

          <table v-bind="api.getTableProps({ view: 'month', columns: 4 })" class="w-full border-collapse">
            <tbody v-bind="api.getTableBodyProps({ view: 'month' })">
              <template v-for="(months) in api.getMonthsGrid({ columns: 4, format: 'short' })">
                <tr v-bind="api.getTableRowProps()">
                  <template v-for="(month) in months">
                    <td
                      v-bind="api.getMonthTableCellProps({
                        ...month,
                        columns: 4,
                      })"
                      class="p-1"
                    >
                      <div
                        v-bind="api.getMonthTableCellTriggerProps({
                          ...month,
                          columns: 4,
                        })"
                        class="flex items-center justify-center p-2 w-full rounded-md text-sm hover:bg-muted aria-selected:bg-primary aria-selected:text-primary-foreground transition-colors"
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
          <div 
            v-bind="api.getViewControlProps({ view: 'year' })"
            class="flex items-center justify-between mb-4"
          >
            <button 
              v-bind="api.getPrevTriggerProps({ view: 'year' })"
              class="rounded-md px-2 py-1 text-muted-foreground hover:bg-muted"
            >
              ←
            </button>
            <span class="font-medium text-foreground">
              {{ api.getDecade().start }} - {{ api.getDecade().end }}
            </span>
            <button 
              v-bind="api.getNextTriggerProps({ view: 'year' })"
              class="rounded-md px-2 py-1 text-muted-foreground hover:bg-muted"
            >
              →
            </button>
          </div>

          <table v-bind="api.getTableProps({ view: 'year', columns: 4 })" class="w-full border-collapse">
            <tbody v-bind="api.getTableBodyProps()">
              <template v-for="(years) in api.getYearsGrid({ columns: 4 })">
                <tr v-bind="api.getTableRowProps({ view: 'year' })">
                  <template v-for="(year) in years">
                    <td
                      v-bind="api.getYearTableCellProps({
                        ...year,
                        columns: 4,
                      })"
                      class="p-1"
                    >
                      <div
                        v-bind="api.getYearTableCellTriggerProps({
                          ...year,
                          columns: 4,
                        })"
                        class="flex items-center justify-center p-2 w-full rounded-md text-sm hover:bg-muted aria-selected:bg-primary aria-selected:text-primary-foreground transition-colors"
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
