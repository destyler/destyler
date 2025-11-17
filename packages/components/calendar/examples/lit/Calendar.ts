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
      id: 'calendar:lit',
      locale: 'en',
      selectionMode: 'single',
    }),
  )

  render() {
    const api = calendar.connect(this.machine.state, this.machine.send, normalizeProps)
    return html`
    <destyler-layout>
      <p>${`Visible range: ${api.visibleRangeText.formatted}`}</p>
      <output>
        <div>Selected: ${api.valueAsString ?? '-'}</div>
        <div>Focused: ${api.focusedValueAsString}</div>
      </output>

      <div ${spread(api.getControlProps())}>
        <input ${spread(api.getInputProps())} />
        <button ${spread(api.getClearTriggerProps())}>❌</button>
        <button ${spread(api.getTriggerProps())}>🗓</button>
      </div>

      ${api.open
        ? portal(html`
          <div ${spread(api.getPositionerProps())}>
            <div ${spread(api.getContentProps())}>
              <div style="margin-bottom: 20px; display: flex; gap: 12px;">
                <select ${spread(api.getMonthSelectProps())}>
                  ${api.getMonths().map(month => html`<option value=${month.value}>${month.label}</option>`)}
                </select>
                <select ${spread(api.getYearSelectProps())}>
                  ${api.getYears().map(year => html`<option value=${year.value}>${year.label}</option>`)}
                </select>
              </div>

              <div ?hidden=${api.view !== 'day'}>
                <div ${spread(api.getViewControlProps({ view: 'year' }))}>
                  <button ${spread(api.getPrevTriggerProps())}>←</button>
                  <button ${spread(api.getViewTriggerProps())}>${api.visibleRangeText.start}</button>
                  <button ${spread(api.getNextTriggerProps())}>→</button>
                </div>

                <table ${spread(api.getTableProps({ view: 'day' }))}>
                  <thead ${spread(api.getTableHeaderProps({ view: 'day' }))}>
                    <tr ${spread(api.getTableRowProps({ view: 'day' }))}>
                      ${api.weekDays.map(day => html`
                        <th scope="col">
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
                            <div ${spread(api.getDayTableCellTriggerProps({ value }))}>
                              ${value.day}
                            </div>
                          </td>
                        `)}
                      </tr>
                    `)}
                  </tbody>
                </table>
              </div>

              <div style="display: flex; gap: 40px;">
                <div ?hidden=${api.view !== 'month'} style="width: 100%;">
                  <div ${spread(api.getViewControlProps({ view: 'month' }))}>
                    <button ${spread(api.getPrevTriggerProps({ view: 'month' }))}>←</button>
                    <button ${spread(api.getViewTriggerProps({ view: 'month' }))}>${api.visibleRange.start.year}</button>
                    <button ${spread(api.getNextTriggerProps({ view: 'month' }))}>→</button>
                  </div>

                  <table ${spread(api.getTableProps({ view: 'month', columns: 4 }))}>
                    <tbody ${spread(api.getTableBodyProps({ view: 'month' }))}>
                      ${api.getMonthsGrid({ columns: 4, format: 'short' }).map((months, monthIndex) => html`
                        <tr key=${monthIndex} ${spread(api.getTableRowProps({ view: 'month' }))}>
                          ${months.map(month => html`
                            <td ${spread(api.getMonthTableCellProps({ ...month, columns: 4 }))}>
                              <div ${spread(api.getMonthTableCellTriggerProps({ ...month, columns: 4 }))}>
                                ${month.label}
                              </div>
                            </td>
                          `)}
                        </tr>
                      `)}
                    </tbody>
                  </table>
                </div>

                <div ?hidden=${api.view !== 'year'} style="width: 100%;">
                  <div ${spread(api.getViewControlProps({ view: 'year' }))}>
                    <button ${spread(api.getPrevTriggerProps({ view: 'year' }))}>←</button>
                    <span>
                      ${api.getDecade().start}
                      -
                      ${api.getDecade().end}
                    </span>
                    <button ${spread(api.getNextTriggerProps({ view: 'year' }))}>→</button>
                  </div>

                  <table ${spread(api.getTableProps({ view: 'year', columns: 4 }))}>
                    <tbody ${spread(api.getTableBodyProps({ view: 'year' }))}>
                      ${api.getYearsGrid({ columns: 4 }).map((years, yearIndex) => html`
                        <tr key=${yearIndex} ${spread(api.getTableRowProps({ view: 'year' }))}>
                          ${years.map(year => html`
                            <td ${spread(api.getYearTableCellProps({ ...year, columns: 4 }))}>
                              <div ${spread(api.getYearTableCellTriggerProps({ ...year, columns: 4 }))}>
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
          </div>
        `, document.body)
        : null}

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
