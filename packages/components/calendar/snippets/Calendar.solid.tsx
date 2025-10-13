/** @jsxImportSource solid-js */
import * as calendar from '@destyler/calendar'
import { normalizeProps, useMachine } from '@destyler/solid'
import { createMemo, createUniqueId, For } from 'solid-js'
import { Portal } from 'solid-js/web'
import './style.css'

export default function Calendar() {
  const [state, send] = useMachine(
    calendar.machine({
      id: createUniqueId(),
      locale: 'en',
      selectionMode: 'single',
    }),
  )
  const api = createMemo(() => calendar.connect(state, send, normalizeProps))

  return (
    <>
      <div {...api().getControlProps()}>
        <input {...api().getInputProps()} />
        <button {...api().getTriggerProps()} class="i-ph-calendar-dots-bold" />
      </div>
      <Portal>
        <div {...api().getPositionerProps()} data-layout="sinppets">
          <div {...api().getContentProps()}>
            {/* Day View */}
            <div hidden={api().view !== 'day'}>
              <div {...api().getViewControlProps({ view: 'year' })}>
                <button {...api().getPrevTriggerProps()}>←</button>
                <button {...api().getViewTriggerProps()}>
                  {api().visibleRangeText.start}
                </button>
                <button {...api().getNextTriggerProps()}>→</button>
              </div>

              <table {...api().getTableProps({ view: 'day' })}>
                <thead {...api().getTableHeaderProps({ view: 'day' })}>
                  <tr {...api().getTableRowProps({ view: 'day' })}>
                    <For each={api().weekDays}>
                      {day => (
                        <th scope="col" class="text-center text-xs font-medium text-muted-foreground p-1">
                          {day.narrow}
                        </th>
                      )}
                    </For>
                  </tr>
                </thead>
                <tbody {...api().getTableBodyProps({ view: 'day' })}>
                  <For each={api().weeks}>
                    {week => (
                      <tr {...api().getTableRowProps({ view: 'day' })}>
                        <For each={week}>
                          {value => (
                            <td {...api().getDayTableCellProps({ value })}>
                              <div {...api().getDayTableCellTriggerProps({ value })}>
                                {value.day}
                              </div>
                            </td>
                          )}
                        </For>
                      </tr>
                    )}
                  </For>
                </tbody>
              </table>
            </div>

            {/* Month View */}
            <div hidden={api().view !== 'month'}>
              <div {...api().getViewControlProps({ view: 'month' })}>
                <button {...api().getPrevTriggerProps({ view: 'month' })}>←</button>
                <button {...api().getViewTriggerProps({ view: 'month' })}>
                  {api().visibleRange.start.year}
                </button>
                <button {...api().getNextTriggerProps({ view: 'month' })}>→</button>
              </div>

              <table {...api().getTableProps({ view: 'month', columns: 4 })}>
                <tbody {...api().getTableBodyProps({ view: 'month' })}>
                  <For each={api().getMonthsGrid({ columns: 4, format: 'short' })}>
                    {months => (
                      <tr {...api().getTableRowProps()}>
                        <For each={months}>
                          {month => (
                            <td
                              {...api().getMonthTableCellProps({
                                ...month,
                                columns: 4,
                              })}
                            >
                              <div
                                {...api().getMonthTableCellTriggerProps({
                                  ...month,
                                  columns: 4,
                                })}
                              >
                                {month.label}
                              </div>
                            </td>
                          )}
                        </For>
                      </tr>
                    )}
                  </For>
                </tbody>
              </table>
            </div>

            {/* Year View */}
            <div hidden={api().view !== 'year'}>
              <div {...api().getViewControlProps({ view: 'year' })}>
                <button {...api().getPrevTriggerProps({ view: 'year' })}>←</button>
                <span>
                  {api().getDecade().start}
                  {' '}
                  -
                  {' '}
                  {api().getDecade().end}
                </span>
                <button {...api().getNextTriggerProps({ view: 'year' })}>→</button>
              </div>

              <table {...api().getTableProps({ view: 'year', columns: 4 })}>
                <tbody {...api().getTableBodyProps()}>
                  <For each={api().getYearsGrid({ columns: 4 })}>
                    {years => (
                      <tr {...api().getTableRowProps({ view: 'year' })}>
                        <For each={years}>
                          {year => (
                            <td
                              {...api().getYearTableCellProps({
                                ...year,
                                columns: 4,
                              })}
                            >
                              <div
                                {...api().getYearTableCellTriggerProps({
                                  ...year,
                                  columns: 4,
                                })}
                              >
                                {year.label}
                              </div>
                            </td>
                          )}
                        </For>
                      </tr>
                    )}
                  </For>
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </Portal>
    </>
  )
}
