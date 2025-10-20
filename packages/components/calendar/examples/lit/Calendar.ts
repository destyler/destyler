import { MachineController, normalizeProps, portal, spread } from '@destyler/lit'
import { html, LitElement, unsafeCSS } from 'lit'
import { customElement } from 'lit/decorators.js'
import * as calendar from '../../index'
import styles from '../style.css?inline'
import '../style.css'
import '@destyler/shared-private/lit'

@customElement('destyler-calendar')
export class CalendarElement extends LitElement {
  private machine = new MachineController(
    this,
    calendar.machine({
      id: '1',
    }),
  )

  render() {
    const api = calendar.connect(this.machine.state, this.machine.send, normalizeProps)
    return html`
    <destyler-layout>
      <div ${spread(api.getControlProps())}>
        <input ${spread(api.getInputProps())} />
        <button ${spread(api.getTriggerProps())}>
          🗓
        </button>
      </div>
      ${api.open
        ? portal(html`
          <div ${spread(api.getPositionerProps())}>
            <div ${spread(api.getContentProps())}>
              <!-- Day View -->
              <div ?hidden=${api.view !== 'day'}>
                <div ${spread(api.getViewControlProps({ view: 'year' }))}>
                  <button ${spread(api.getPrevTriggerProps())}>
                    ←
                  </button>
                  <button ${spread(api.getViewTriggerProps())}>
                    ${api.visibleRangeText.start}
                  </button>
                  <button ${spread(api.getNextTriggerProps())}>
                    →
                  </button>
                </div>

                <table ${spread(api.getTableProps({ view: 'day' }))}>
                  <thead ${spread(api.getTableHeaderProps({ view: 'day' }))}>
                    <tr ${spread(api.getTableRowProps({ view: 'day' }))}>
                      ${api.weekDays.map(day => html`
                        <th
                          key=${day.narrow}
                          scope="col"
                          class="text-center text-xs font-medium text-muted-foreground p-1"
                        >
                          ${day.narrow}
                        </th>
                      `)}
                    </tr>
                  </thead>
                  <tbody ${spread(api.getTableBodyProps({ view: 'day' }))}>
                    ${api.weeks.map((week, weekIndex) => html`
                      <tr key=${weekIndex} ${spread(api.getTableRowProps({ view: 'day' }))}>
                        ${week.map(value => html`
                          <td ${spread(api.getDayTableCellProps({ value }))}>
                            <div ${api.getDayTableCellTriggerProps({ value })}>
                              ${value.day}
                            </div>
                          </td>
                        `)}
                      </tr>
                    `)}
                  </tbody>
                </table>
              </div>
              <!-- Month view -->
              <div ?hidden=${api.view !== 'month'}>
                <div ${spread(api.getViewControlProps({ view: 'month' }))}>
                  <button ${spread(api.getPrevTriggerProps())}>
                    ←
                  </button>
                  <button ${spread(api.getViewTriggerProps())}>
                    ${api.visibleRangeText.start}
                  </button>
                  <button ${spread(api.getNextTriggerProps())}>
                    →
                  </button>
                </div>

                <table ${api.getTableProps({ view: 'month', columns: 4 })}>
                  <tbody ${api.getTableBodyProps({ view: 'month' })}>
                    ${api.getMonthsGrid({ columns: 4, format: 'short' }).map((months, monthIndex) => html`
                      <tr key=${monthIndex} ${api.getTableRowProps()}>
                        ${months.map(month => html`
                          <td ${api.getMonthTableCellProps({ ...month, columns: 4 })}>
                            <div ${api.getMonthTableCellTriggerProps({ ...month, columns: 4 })}>
                              ${month.label}
                            </div>
                          </td>
                        `)}
                      </tr>
                    `)}
                  </tbody>
                </table>
            </div>
            <!-- Year View -->
            <div ?hidden=${api.view !== 'year'}>
              <div ${spread(api.getViewControlProps({ view: 'year' }))}>
                <button ${spread(api.getPrevTriggerProps())}>
                  ←
                </button>
                <button ${spread(api.getViewTriggerProps())}>
                  ${api.visibleRangeText.start} - ${api.visibleRangeText.end}
                </button>
                <button ${spread(api.getNextTriggerProps())}>
                  →
                </button>
              </div>

              <table ${api.getTableProps({ view: 'year', columns: 4 })}>
                <tbody ${api.getTableBodyProps({ view: 'year' })}>
                  ${api.getYearsGrid({ columns: 4 }).map((years, yearIndex) => html`
                    <tr key=${yearIndex} ${api.getTableRowProps({ view: 'year' })}>
                      ${years.map(year => html`
                        <td ${api.getYearTableCellProps({ ...year, columns: 4 })}>
                          <div ${api.getYearTableCellTriggerProps({ ...year, columns: 4 })}>
                            ${year.label}
                          </div>
                        </td>
                      `)}
                    </tr>
                  `)}
                </tbody>
              </table>
            </div>
          </div>
        </div>
        `, document.body)
        : ''}

      <destyler-toolbar>
        <destyler-state-visualizer .state=${this.machine.state}></destyler-state-visualizer>
      </destyler-toolbar>
    </destyler-layout>
    `
  }

  static styles = unsafeCSS(styles)
}

declare global {
  interface HTMLElementTagNameMap {
    'destyler-calendar': CalendarElement
  }
}
