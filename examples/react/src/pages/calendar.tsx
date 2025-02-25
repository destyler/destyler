import * as calendar from '@destyler/calendar'
import { normalizeProps, useMachine } from '@destyler/react'
import { useId } from 'react'
import { createPortal } from 'react-dom'

export default function Calendar() {
  const [state, send] = useMachine(
    calendar.machine({
      id: useId(),
    }),
  )

  const api = calendar.connect(state, send, normalizeProps)

  return (
    <>
      <div {...api.getControlProps()}>
        <input {...api.getInputProps()} />
        <button {...api.getTriggerProps()}>
          🗓
        </button>
      </div>
      {createPortal(
        <div {...api.getPositionerProps()}>
          <div {...api.getContentProps()}>
            {/* Day View */}
            {api.view !== 'day' && (
              <div>
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
                      {api.weekDays.map(day => (
                        <th key={day.narrow} scope="col">
                          {day.narrow}
                        </th>
                      ))}
                    </tr>
                  </thead>
                  <tbody {...api.getTableBodyProps({ view: 'day' })}>
                    {api.weeks.map((week, weekIndex) => (
                      <tr key={weekIndex} {...api.getTableRowProps({ view: 'day' })}>
                        {week.map(value => (
                          <td key={value.day} {...api.getDayTableCellProps({ value })}>
                            <div {...api.getDayTableCellTriggerProps({ value })}>
                              {value.day}
                            </div>
                          </td>
                        ))}
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}

            {/* Month View */}
            {api.view !== 'month' && (
              <div>
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
                    {api.getMonthsGrid({ columns: 4, format: 'short' }).map((months, monthIndex) => (
                      <tr key={monthIndex} {...api.getTableRowProps()}>
                        {months.map(month => (
                          <td
                            key={month.label}
                            {...api.getMonthTableCellProps({
                              ...month,
                              columns: 4,
                            })}
                          >
                            <div
                              {...api.getMonthTableCellTriggerProps({
                                ...month,
                                columns: 4,
                              })}
                            >
                              {month.label}
                            </div>
                          </td>
                        ))}
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}

            {/* Year View */}
            {api.view !== 'year' && (
              <div>
                <div {...api.getViewControlProps({ view: 'year' })}>
                  <button {...api.getPrevTriggerProps({ view: 'year' })}>
                    Prev
                  </button>
                  <span>
                    {api.getDecade().start}
                    {' '}
                    -
                    {' '}
                    {api.getDecade().end}
                  </span>
                  <button {...api.getNextTriggerProps({ view: 'year' })}>
                    Next
                  </button>
                </div>

                <table {...api.getTableProps({ view: 'year', columns: 4 })}>
                  <tbody {...api.getTableBodyProps()}>
                    {api.getYearsGrid({ columns: 4 }).map((years, yearIndex) => (
                      <tr key={yearIndex} {...api.getTableRowProps({ view: 'year' })}>
                        {years.map(year => (
                          <td
                            key={year.label}
                            {...api.getYearTableCellProps({
                              ...year,
                              columns: 4,
                            })}
                          >
                            <div
                              {...api.getYearTableCellTriggerProps({
                                ...year,
                                columns: 4,
                              })}
                            >
                              {year.label}
                            </div>
                          </td>
                        ))}
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </div>,
        document.body,
      )}
    </>
  )
}
