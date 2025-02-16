<script lang="ts">
  import * as calendar from '@destyler/calendar'
  import { normalizeProps, useMachine } from '@destyler/svelte'

  const uid = $props.id();

  const [state, send] = useMachine(
    calendar.machine({
      id: uid,
    })
  )

  const api = $derived(calendar.connect(state, send, normalizeProps))
</script>

<div {...api.getControlProps()}>
  <input {...api.getInputProps()}>
  <button {...api.getTriggerProps()}>
    🗓
  </button>
</div>

<div {...api.getPositionerProps()}>
  <div {...api.getContentProps()}>
    <!-- Day View -->
    <div class:hidden={api.view === 'day'}>
      <div {...api.getViewControlProps({ view: 'year' })}>
        <button {...api.getPrevTriggerProps()}>
          Prev
        </button>
        <button {...api.getViewTriggerProps()}>
          {api.visibleRangeText.start}
        </button>
        <button {...api.getNextTriggerProps()}>
          Next
        </button>
      </div>

      <table {...api.getTableProps({ view: 'day' })}>
        <thead {...api.getTableHeaderProps({ view: 'day' })}>
          <tr {...api.getTableRowProps({ view: 'day' })}>
            {#each api.weekDays as day}
              <th scope="col">
                {day.narrow}
              </th>
            {/each}
          </tr>
        </thead>
        <tbody {...api.getTableBodyProps({ view: 'day' })}>
          {#each api.weeks as week}
            <tr {...api.getTableRowProps({ view: 'day' })}>
              {#each week as value}
                <td {...api.getDayTableCellProps({ value })}>
                  <div {...api.getDayTableCellTriggerProps({ value })}>
                    {value.day}
                  </div>
                </td>
              {/each}
            </tr>
          {/each}
        </tbody>
      </table>
    </div>

    <!-- Month View -->
    <div class:hidden={api.view === 'month'}>
      <div {...api.getViewControlProps({ view: 'month' })}>
        <button {...api.getPrevTriggerProps({ view: 'month' })}>
          Prev
        </button>
        <button {...api.getViewTriggerProps({ view: 'month' })}>
          {api.visibleRange.start.year}
        </button>
        <button {...api.getNextTriggerProps({ view: 'month' })}>
          Next
        </button>
      </div>

      <table {...api.getTableProps({ view: 'month', columns: 4 })}>
        <tbody {...api.getTableBodyProps({ view: 'month' })}>
          {#each api.getMonthsGrid({ columns: 4, format: 'short' }) as months}
            <tr {...api.getTableRowProps()}>
              {#each months as month}
                <td {...api.getMonthTableCellProps({ ...month, columns: 4 })}>
                  <div {...api.getMonthTableCellTriggerProps({ ...month, columns: 4 })}>
                    {month.label}
                  </div>
                </td>
              {/each}
            </tr>
          {/each}
        </tbody>
      </table>
    </div>

    <!-- Year View -->
    <div class:hidden={api.view === 'year'}>
      <div {...api.getViewControlProps({ view: 'year' })}>
        <button {...api.getPrevTriggerProps({ view: 'year' })}>
          Prev
        </button>
        <span>
          {api.getDecade().start} - {api.getDecade().end}
        </span>
        <button {...api.getNextTriggerProps({ view: 'year' })}>
          Next
        </button>
      </div>

      <table {...api.getTableProps({ view: 'year', columns: 4 })}>
        <tbody {...api.getTableBodyProps()}>
          {#each api.getYearsGrid({ columns: 4 }) as years}
            <tr {...api.getTableRowProps({ view: 'year' })}>
              {#each years as year}
                <td {...api.getYearTableCellProps({ ...year, columns: 4 })}>
                  <div {...api.getYearTableCellTriggerProps({ ...year, columns: 4 })}>
                    {year.label}
                  </div>
                </td>
              {/each}
            </tr>
          {/each}
        </tbody>
      </table>
    </div>
  </div>
</div>

<style>
  .hidden {
    display: none;
  }
</style>
