/** @jsxImportSource solid-js */
import { Layout, StateVisualizer, Toolbar } from '@destyler/shared-private/solid'
import { normalizeProps, useMachine } from '@destyler/solid'
import { createMemo, createUniqueId, Index } from 'solid-js'
import * as calendar from '../../index'
import '../style.css'

export default function Breadcrumbs() {
  const [state, send] = useMachine(
    calendar.machine({
      id: createUniqueId(),
      locale: 'en',
      selectionMode: 'single',
    }),
  )
  const api = createMemo(() => calendar.connect(state, send, normalizeProps))

  return (
    <Layout>
      <div>
        <button>Outside Element</button>
      </div>
      <p>{`Visible range: ${api().visibleRangeText.formatted}`}</p>

      <output>
        <div>
          Selected:
          {' '}
          {api().valueAsString ?? '-'}
        </div>
        <div>
          Focused:
          {' '}
          {api().focusedValueAsString}
        </div>
      </output>

      <div {...api().getControlProps()}>
        <input {...api().getInputProps({ index: 0 })} />
        <button {...api().getClearTriggerProps()}>❌</button>
        <button {...api().getTriggerProps()}>🗓</button>
      </div>

      <div {...api().getContentProps()}>
        <div style={{ 'margin-bottom': '20px' }}>
          <select {...api().getMonthSelectProps()}>
            <Index each={api().getMonths()}>
              {(month, i) => (
                <option value={i + 1} selected={api().focusedValue.month === i + 1}>
                  {month().label}
                </option>
              )}
            </Index>
          </select>

          <select {...api().getYearSelectProps()}>
            <Index each={api().getYears()}>
              {year => (
                <option value={year().value} selected={api().focusedValue.year === year().value}>
                  {year().label}
                </option>
              )}
            </Index>
          </select>
        </div>

        <div hidden={api().view !== 'day'} style={{ width: '100%' }}>
          <div {...api().getViewControlProps()}>
            <button {...api().getPrevTriggerProps()}>Prev</button>
            <button
              {...api().getViewTriggerProps()}
              style={{ 'border': '0', 'padding': '4px 20px', 'border-radius': '4px' }}
            >
              {api().visibleRangeText.start}
            </button>
            <button {...api().getNextTriggerProps()}>Next</button>
          </div>

          <table {...api().getTableProps()}>
            <thead {...api().getTableHeaderProps()}>
              <tr {...api().getTableBodyProps()}>
                <Index each={api().weekDays}>
                  {day => (
                    <th scope="col" aria-label={day().long}>
                      {day().narrow}
                    </th>
                  )}
                </Index>
              </tr>
            </thead>
            <tbody {...api().getTableBodyProps()}>
              <Index each={api().weeks}>
                {week => (
                  <tr {...api().getTableRowProps()}>
                    <Index each={week()}>
                      {value => (
                        <td {...api().getDayTableCellProps({ value: value() })}>
                          <div {...api().getDayTableCellTriggerProps({ value: value() })}>{value().day}</div>
                        </td>
                      )}
                    </Index>
                  </tr>
                )}
              </Index>
            </tbody>
          </table>
        </div>

        <div style={{ 'display': 'flex', 'gap': '40px', 'margin-top': '24px' }}>
          <div hidden={api().view !== 'month'} style={{ width: '100%' }}>
            <div {...api().getViewControlProps({ view: 'month' })}>
              <button {...api().getPrevTriggerProps({ view: 'month' })}>Prev</button>
              <button {...api().getViewTriggerProps({ view: 'month' })}>{api().visibleRange.start.year}</button>
              <button {...api().getNextTriggerProps({ view: 'month' })}>Next</button>
            </div>

            <table {...api().getTableProps({ view: 'month', columns: 4 })}>
              <tbody>
                <Index each={api().getMonthsGrid({ columns: 4, format: 'short' })}>
                  {months => (
                    <tr {...api().getTableBodyProps({ view: 'month' })}>
                      <Index each={months()}>
                        {month => (
                          <td {...api().getMonthTableCellProps(month())}>
                            <div {...api().getMonthTableCellTriggerProps(month())}>{month().label}</div>
                          </td>
                        )}
                      </Index>
                    </tr>
                  )}
                </Index>
              </tbody>
            </table>
          </div>

          <div hidden={api().view !== 'year'} style={{ width: '100%' }}>
            <div {...api().getViewControlProps({ view: 'year' })}>
              <button {...api().getPrevTriggerProps({ view: 'year' })}>Prev</button>
              <span>
                {api().getDecade().start}
                {' '}
                -
                {' '}
                {api().getDecade().end}
              </span>
              <button {...api().getNextTriggerProps({ view: 'year' })}>Next</button>
            </div>

            <table {...api().getTableProps({ view: 'year', columns: 4 })}>
              <tbody>
                <Index each={api().getYearsGrid({ columns: 4 })}>
                  {years => (
                    <tr {...api().getTableBodyProps({ view: 'year' })}>
                      <Index each={years()}>
                        {year => (
                          <td {...api().getYearTableCellProps({ ...year(), columns: 4 })}>
                            <div {...api().getYearTableCellTriggerProps({ ...year(), columns: 4 })}>
                              {year().label}
                            </div>
                          </td>
                        )}
                      </Index>
                    </tr>
                  )}
                </Index>
              </tbody>
            </table>
          </div>
        </div>
      </div>
      <Toolbar>
        <StateVisualizer state={state} />
      </Toolbar>
    </Layout>

  )
}
