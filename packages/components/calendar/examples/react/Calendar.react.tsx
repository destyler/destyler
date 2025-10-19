import { normalizeProps, Portal, useMachine } from '@destyler/react'
import { Layout, StateVisualizer, Toolbar } from '@destyler/shared-private/react'
import { useId } from 'react'
import * as calendar from '../../index'
import '../style.css'

export default function Breadcrumbs() {
  const [state, send] = useMachine(
    calendar.machine({
      id: useId(),
      locale: 'en',
      selectionMode: 'single',
    }),
  )

  const api = calendar.connect(state, send, normalizeProps)

  return (
    <Layout>
      <div {...api.getControlProps()}>
        <input {...api.getInputProps()} />
        <button {...api.getTriggerProps()}>
          🗓
        </button>
      </div>
      <Portal>
        <div {...api.getPositionerProps()}>
          <div {...api.getContentProps()}>
            {/* Day View */}
            <div hidden={api.view !== 'day'}>
              <div {...api.getViewControlProps({ view: 'year' })}>
                <button {...api.getPrevTriggerProps()}>
                  ←
                </button>
                <button {...api.getViewTriggerProps()}>
                  {api.visibleRangeText.start}
                </button>
                <button {...api.getNextTriggerProps()}>
                  →
                </button>
              </div>

              <table {...api.getTableProps({ view: 'day' })}>
                <thead {...api.getTableHeaderProps({ view: 'day' })}>
                  <tr {...api.getTableRowProps({ view: 'day' })}>
                    {api.weekDays.map(day => (
                      <th
                        key={day.narrow}
                        scope="col"
                        className="text-center text-xs font-medium text-muted-foreground p-1"
                      >
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

            {/* Month View */}
            <div hidden={api.view !== 'month'}>
              <div {...api.getViewControlProps({ view: 'month' })}>
                <button {...api.getPrevTriggerProps({ view: 'month' })}>
                  ←
                </button>
                <button {...api.getViewTriggerProps({ view: 'month' })}>
                  {api.visibleRange.start.year}
                </button>
                <button {...api.getNextTriggerProps({ view: 'month' })}>
                  →
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

            {/* Year View */}
            <div hidden={api.view !== 'year'}>
              <div {...api.getViewControlProps({ view: 'year' })}>
                <button {...api.getPrevTriggerProps({ view: 'year' })}>
                  ←
                </button>
                <span>
                  {api.getDecade().start}
                  {' '}
                  -
                  {' '}
                  {api.getDecade().end}
                </span>
                <button {...api.getNextTriggerProps({ view: 'year' })}>
                  →
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
          </div>
        </div>
      </Portal>
      <Toolbar>
        <StateVisualizer state={state} />
      </Toolbar>
    </Layout>
  )
}
