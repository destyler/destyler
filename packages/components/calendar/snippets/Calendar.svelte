<script lang="ts">
  import * as calendar from '../index'
  import { normalizeProps, useMachine, portal } from '@destyler/svelte'
  import './style.css'

  const id = $props.id()
  const [state, send] = useMachine(
    calendar.machine({
      id: id,
      locale: 'en',
      selectionMode: 'single',
    }),
  )

  const api = $derived(calendar.connect(state, send, normalizeProps))
</script>

<div {...api.getControlProps()}>
  <input {...api.getInputProps()} />
  <button {...api.getTriggerProps()} class="i-ph-calendar-dots-bold" ></button>
</div>
<div use:portal>
  <div {...api.getPositionerProps()} data-layout="sinppets">
    <div {...api.getContentProps()}>
        {#if api.view === 'day'}
          <!-- Day View -->
          <div {...api.getViewControlProps({ view: 'year' })} hidden={api.view !== 'day'}>
            <button {...api.getPrevTriggerProps()}>←</button>
            <button {...api.getViewTriggerProps()}>{api.visibleRangeText.start}</button>
            <button {...api.getNextTriggerProps()}>→</button>
          </div>

          <div hidden={api.view !== 'day'}>
            <table {...api.getTableProps({ view: 'day' })}>
              <thead {...api.getTableHeaderProps({ view: 'day' })}>
                <tr {...api.getTableRowProps({ view: 'day' })}>
                  {#each api.weekDays as day, dayIndex}
                    <th scope="col" class="text-center text-xs font-medium text-muted-foreground p-1">{day.narrow}</th>
                  {/each}
                </tr>
              </thead>
              <tbody {...api.getTableBodyProps({ view: 'day' })}>
                {#each api.weeks as week, weekIndex}
                  <tr {...api.getTableRowProps({ view: 'day' })}>
                    {#each week as value, valueIndex}
                      <td {...api.getDayTableCellProps({ value })}>
                        <div {...api.getDayTableCellTriggerProps({ value })}>{value.day}</div>
                      </td>
                    {/each}
                  </tr>
                {/each}
              </tbody>
            </table>
          </div>
        {/if}

        {#if api.view === 'month'}
          <!-- Month View -->
          <div {...api.getViewControlProps({ view: 'month' })} hidden={api.view !== 'month'}>
            <button {...api.getPrevTriggerProps({ view: 'month' })}>←</button>
            <button {...api.getViewTriggerProps({ view: 'month' })}>{api.visibleRange.start.year}</button>
            <button {...api.getNextTriggerProps({ view: 'month' })}>→</button>
          </div>

          <div hidden={api.view !== 'month'}>
            <table {...api.getTableProps({ view: 'month', columns: 4 })}>
              <tbody {...api.getTableBodyProps({ view: 'month' })}>
                {#each api.getMonthsGrid({ columns: 4, format: 'short' }) as months, monthsIndex}
                  <tr {...api.getTableRowProps()}>
                    {#each months as month, monthIndex}
                      <td {...api.getMonthTableCellProps({ ...month, columns: 4 })}>
                        <div {...api.getMonthTableCellTriggerProps({ ...month, columns: 4 })}>{month.label}</div>
                      </td>
                    {/each}
                  </tr>
                {/each}
              </tbody>
            </table>
          </div>
        {/if}

        {#if api.view === 'year'}
          <!-- Year View -->
          <div {...api.getViewControlProps({ view: 'year' })} hidden={api.view !== 'year'}>
            <button {...api.getPrevTriggerProps({ view: 'year' })}>←</button>
            <span>{api.getDecade().start} - {api.getDecade().end}</span>
            <button {...api.getNextTriggerProps({ view: 'year' })}>→</button>
          </div>

          <div hidden={api.view !== 'year'}>
            <table {...api.getTableProps({ view: 'year', columns: 4 })}>
              <tbody {...api.getTableBodyProps()}>
                {#each api.getYearsGrid({ columns: 4 }) as years, yearsIndex}
                  <tr {...api.getTableRowProps({ view: 'year' })}>
                    {#each years as year, yearIndex}
                      <td {...api.getYearTableCellProps({ ...year, columns: 4 })}>
                        <div {...api.getYearTableCellTriggerProps({ ...year, columns: 4 })}>{year.label}</div>
                      </td>
                    {/each}
                  </tr>
                {/each}
              </tbody>
            </table>
          </div>
        {/if}
    </div>
  </div>
</div>
