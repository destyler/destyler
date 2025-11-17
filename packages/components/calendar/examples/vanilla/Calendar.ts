import type { ContextFrom } from '@destyler/vanilla'
import type { State as CalendarState } from '../../index'
import { Layout, StateVisualizer, Toolbar } from '@destyler/shared-private/vanilla'
import { Component, normalizeProps, spreadProps } from '@destyler/vanilla'
import * as calendar from '../../index'
import '../style.css'

type CalendarMachineContext = ContextFrom<typeof calendar.machine>

class CalendarExample extends Component<
  calendar.Context,
  calendar.Api,
  CalendarMachineContext,
  calendar.MachineState
> {
  private readonly visibleEl: HTMLElement
  private readonly selectedEl: HTMLElement
  private readonly focusedEl: HTMLElement
  private readonly controlEl: HTMLElement
  private readonly inputEl: HTMLInputElement
  private readonly clearBtn: HTMLButtonElement
  private readonly triggerBtn: HTMLButtonElement
  private readonly positionerEl: HTMLElement
  private readonly contentEl: HTMLElement
  private readonly monthSelect: HTMLSelectElement
  private readonly yearSelect: HTMLSelectElement

  private readonly daySection: HTMLElement
  private readonly dayControl: HTMLElement
  private readonly dayPrev: HTMLButtonElement
  private readonly dayViewTrigger: HTMLButtonElement
  private readonly dayNext: HTMLButtonElement
  private readonly dayTable: HTMLTableElement
  private readonly dayHead: HTMLTableSectionElement
  private readonly dayBody: HTMLTableSectionElement

  private readonly monthSection: HTMLElement
  private readonly monthControl: HTMLElement
  private readonly monthPrev: HTMLButtonElement
  private readonly monthViewTrigger: HTMLButtonElement
  private readonly monthNext: HTMLButtonElement
  private readonly monthTable: HTMLTableElement
  private readonly monthBody: HTMLTableSectionElement

  private readonly yearSection: HTMLElement
  private readonly yearControl: HTMLElement
  private readonly yearPrev: HTMLButtonElement
  private readonly decadeLabel: HTMLElement
  private readonly yearNext: HTMLButtonElement
  private readonly yearTable: HTMLTableElement
  private readonly yearBody: HTMLTableSectionElement

  private readonly stateListeners = new Set<(state: CalendarState) => void>()

  constructor(rootEl: HTMLElement, context: calendar.Context, options?: any) {
    super(rootEl, context, options)
    this.visibleEl = rootEl.querySelector('[data-calendar-visible]') as HTMLElement
    this.selectedEl = rootEl.querySelector('[data-calendar-selected]') as HTMLElement
    this.focusedEl = rootEl.querySelector('[data-calendar-focused]') as HTMLElement

    this.controlEl = rootEl.querySelector('[data-calendar-control]') as HTMLElement
    this.inputEl = rootEl.querySelector('[data-calendar-input]') as HTMLInputElement
    this.clearBtn = rootEl.querySelector('[data-calendar-clear]') as HTMLButtonElement
    this.triggerBtn = rootEl.querySelector('[data-calendar-trigger]') as HTMLButtonElement

    this.positionerEl = rootEl.querySelector('[data-calendar-positioner]') as HTMLElement
    this.contentEl = rootEl.querySelector('[data-calendar-content]') as HTMLElement
    this.monthSelect = rootEl.querySelector('[data-calendar-month]') as HTMLSelectElement
    this.yearSelect = rootEl.querySelector('[data-calendar-year]') as HTMLSelectElement

    this.daySection = rootEl.querySelector('[data-calendar-day-view]') as HTMLElement
    this.dayControl = rootEl.querySelector('[data-calendar-day-control]') as HTMLElement
    this.dayPrev = rootEl.querySelector('[data-calendar-prev]') as HTMLButtonElement
    this.dayViewTrigger = rootEl.querySelector('[data-calendar-view-trigger]') as HTMLButtonElement
    this.dayNext = rootEl.querySelector('[data-calendar-next]') as HTMLButtonElement
    this.dayTable = rootEl.querySelector('[data-calendar-day-table]') as HTMLTableElement
    this.dayHead = rootEl.querySelector('[data-calendar-day-head]') as HTMLTableSectionElement
    this.dayBody = rootEl.querySelector('[data-calendar-day-body]') as HTMLTableSectionElement

    this.monthSection = rootEl.querySelector('[data-calendar-month-view]') as HTMLElement
    this.monthControl = rootEl.querySelector('[data-calendar-month-control]') as HTMLElement
    this.monthPrev = rootEl.querySelector('[data-calendar-month-prev]') as HTMLButtonElement
    this.monthViewTrigger = rootEl.querySelector('[data-calendar-month-trigger]') as HTMLButtonElement
    this.monthNext = rootEl.querySelector('[data-calendar-month-next]') as HTMLButtonElement
    this.monthTable = rootEl.querySelector('[data-calendar-month-table]') as HTMLTableElement
    this.monthBody = rootEl.querySelector('[data-calendar-month-body]') as HTMLTableSectionElement

    this.yearSection = rootEl.querySelector('[data-calendar-year-view]') as HTMLElement
    this.yearControl = rootEl.querySelector('[data-calendar-year-control]') as HTMLElement
    this.yearPrev = rootEl.querySelector('[data-calendar-year-prev]') as HTMLButtonElement
    this.decadeLabel = rootEl.querySelector('[data-calendar-decade]') as HTMLElement
    this.yearNext = rootEl.querySelector('[data-calendar-year-next]') as HTMLButtonElement
    this.yearTable = rootEl.querySelector('[data-calendar-year-table]') as HTMLTableElement
    this.yearBody = rootEl.querySelector('[data-calendar-year-body]') as HTMLTableSectionElement
  }

  initService(context: calendar.Context) {
    return calendar.machine(context) as calendar.Service
  }

  initApi() {
    return calendar.connect(this.service.state, this.service.send, normalizeProps)
  }

  onStateChange(fn: (state: CalendarState) => void) {
    this.stateListeners.add(fn)
  }

  protected override onTransition(state: CalendarState) {
    this.stateListeners.forEach(listener => listener(state))
  }

  render = () => {
    const api = this.api
    const selectedText = Array.isArray(api.valueAsString) ? api.valueAsString.join(', ') : api.valueAsString ?? '-'

    this.visibleEl.textContent = `Visible range: ${api.visibleRangeText.formatted}`
    this.selectedEl.textContent = selectedText
    this.focusedEl.textContent = api.focusedValueAsString ?? ''

    spreadProps(this.rootEl, api.getRootProps())
    spreadProps(this.controlEl, api.getControlProps())
    spreadProps(this.inputEl, api.getInputProps())
    spreadProps(this.clearBtn, api.getClearTriggerProps())
    spreadProps(this.triggerBtn, api.getTriggerProps())

    spreadProps(this.positionerEl, api.getPositionerProps())
    spreadProps(this.contentEl, api.getContentProps())

    this.renderSelects(api)
    this.renderDayView(api)
    this.renderMonthView(api)
    this.renderYearView(api)
  }

  private renderSelects(api: calendar.Api) {
    this.monthSelect.innerHTML = ''
    api.getMonths().forEach(month => {
      const option = document.createElement('option')
      option.value = String(month.value)
      option.textContent = month.label
      this.monthSelect.appendChild(option)
    })
    spreadProps(this.monthSelect, api.getMonthSelectProps())

    this.yearSelect.innerHTML = ''
    api.getYears().forEach(year => {
      const option = document.createElement('option')
      option.value = String(year.value)
      option.textContent = year.label
      this.yearSelect.appendChild(option)
    })
    spreadProps(this.yearSelect, api.getYearSelectProps())
  }

  private renderDayView(api: calendar.Api) {
    this.daySection.hidden = api.view !== 'day'
    spreadProps(this.dayControl, api.getViewControlProps({ view: 'year' }))
    spreadProps(this.dayPrev, api.getPrevTriggerProps())
    spreadProps(this.dayViewTrigger, api.getViewTriggerProps())
    this.dayViewTrigger.textContent = api.visibleRangeText.start
    spreadProps(this.dayNext, api.getNextTriggerProps())

    spreadProps(this.dayTable, api.getTableProps({ view: 'day' }))
    spreadProps(this.dayHead, api.getTableHeaderProps({ view: 'day' }))
    spreadProps(this.dayBody, api.getTableBodyProps({ view: 'day' }))

    this.dayHead.innerHTML = ''
    const headRow = document.createElement('tr')
    spreadProps(headRow, api.getTableRowProps({ view: 'day' }))
    api.weekDays.forEach(day => {
      const th = document.createElement('th')
      th.scope = 'col'
      th.textContent = day.narrow
      headRow.appendChild(th)
    })
    this.dayHead.appendChild(headRow)

    this.dayBody.innerHTML = ''
    api.weeks.forEach(week => {
      const row = document.createElement('tr')
      spreadProps(row, api.getTableRowProps({ view: 'day' }))
      week.forEach(value => {
        const cell = document.createElement('td')
        spreadProps(cell, api.getDayTableCellProps({ value }))
        const trigger = document.createElement('button')
        spreadProps(trigger, { type: 'button', ...api.getDayTableCellTriggerProps({ value }) })
        trigger.onclick = (event) => {
          event.preventDefault()
          this.service.send({ type: 'CELL.CLICK', cell: 'day', value })
        }
        trigger.onpointermove = (event) => {
          if (event.pointerType === 'touch')
            return
          this.service.send({ type: 'CELL.POINTER_MOVE', cell: 'day', value, focus: true })
        }
        trigger.textContent = String(value.day)
        cell.appendChild(trigger)
        row.appendChild(cell)
      })
      this.dayBody.appendChild(row)
    })
  }

  private renderMonthView(api: calendar.Api) {
    this.monthSection.hidden = api.view !== 'month'
    spreadProps(this.monthControl, api.getViewControlProps({ view: 'month' }))
    spreadProps(this.monthPrev, api.getPrevTriggerProps({ view: 'month' }))
    spreadProps(this.monthViewTrigger, api.getViewTriggerProps({ view: 'month' }))
    this.monthViewTrigger.textContent = String(api.visibleRange.start.year)
    spreadProps(this.monthNext, api.getNextTriggerProps({ view: 'month' }))

    spreadProps(this.monthTable, api.getTableProps({ view: 'month', columns: 4 }))
    spreadProps(this.monthBody, api.getTableBodyProps({ view: 'month' }))

    this.monthBody.innerHTML = ''
    api.getMonthsGrid({ columns: 4, format: 'short' }).forEach(months => {
      const row = document.createElement('tr')
      spreadProps(row, api.getTableRowProps({ view: 'month' }))
      months.forEach(month => {
        const cell = document.createElement('td')
        spreadProps(cell, api.getMonthTableCellProps({ ...month, columns: 4 }))
        const trigger = document.createElement('button')
        spreadProps(trigger, { type: 'button', ...api.getMonthTableCellTriggerProps({ ...month, columns: 4 }) })
        trigger.onclick = (event) => {
          event.preventDefault()
          this.service.send({ type: 'CELL.CLICK', cell: 'month', value: month.value })
        }
        trigger.textContent = month.label
        cell.appendChild(trigger)
        row.appendChild(cell)
      })
      this.monthBody.appendChild(row)
    })
  }

  private renderYearView(api: calendar.Api) {
    this.yearSection.hidden = api.view !== 'year'
    spreadProps(this.yearControl, api.getViewControlProps({ view: 'year' }))
    spreadProps(this.yearPrev, api.getPrevTriggerProps({ view: 'year' }))
    spreadProps(this.yearNext, api.getNextTriggerProps({ view: 'year' }))
    const decade = api.getDecade()
    this.decadeLabel.textContent = `${decade.start} - ${decade.end}`

    spreadProps(this.yearTable, api.getTableProps({ view: 'year', columns: 4 }))
    spreadProps(this.yearBody, api.getTableBodyProps({ view: 'year' }))

    this.yearBody.innerHTML = ''
    api.getYearsGrid({ columns: 4 }).forEach(years => {
      const row = document.createElement('tr')
      spreadProps(row, api.getTableRowProps({ view: 'year' }))
      years.forEach(year => {
        const cell = document.createElement('td')
        spreadProps(cell, api.getYearTableCellProps({ ...year, columns: 4 }))
        const trigger = document.createElement('button')
        spreadProps(trigger, { type: 'button', ...api.getYearTableCellTriggerProps({ ...year, columns: 4 }) })
        trigger.onclick = (event) => {
          event.preventDefault()
          this.service.send({ type: 'CELL.CLICK', cell: 'year', value: year.value })
        }
        trigger.textContent = year.label
        cell.appendChild(trigger)
        row.appendChild(cell)
      })
      this.yearBody.appendChild(row)
    })
  }
}

export function render(target: HTMLElement) {
  const layout = Layout()
  target.innerHTML = ''
  target.appendChild(layout.root)

  layout.main.innerHTML = `
    <div data-calendar-root>
      <p data-calendar-visible></p>
      <output>
        <div>Selected: <span data-calendar-selected>-</span></div>
        <div>Focused: <span data-calendar-focused>-</span></div>
      </output>
      <div data-calendar-control>
        <input data-calendar-input />
        <button data-calendar-clear>❌</button>
        <button data-calendar-trigger>🗓</button>
      </div>
      <div data-calendar-positioner>
        <div data-calendar-content>
          <div style="margin-bottom: 20px; display: flex; gap: 12px;">
            <select data-calendar-month></select>
            <select data-calendar-year></select>
          </div>
          <div data-calendar-day-view>
            <div data-calendar-day-control>
              <button data-calendar-prev>←</button>
              <button data-calendar-view-trigger>Month</button>
              <button data-calendar-next>→</button>
            </div>
            <table data-calendar-day-table>
              <thead data-calendar-day-head></thead>
              <tbody data-calendar-day-body></tbody>
            </table>
          </div>
          <div style="display: flex; gap: 40px;">
            <div data-calendar-month-view style="width: 100%;">
              <div data-calendar-month-control>
                <button data-calendar-month-prev>←</button>
                <button data-calendar-month-trigger></button>
                <button data-calendar-month-next>→</button>
              </div>
              <table data-calendar-month-table>
                <tbody data-calendar-month-body></tbody>
              </table>
            </div>
            <div data-calendar-year-view style="width: 100%;">
              <div data-calendar-year-control>
                <button data-calendar-year-prev>←</button>
                <span data-calendar-decade></span>
                <button data-calendar-year-next>→</button>
              </div>
              <table data-calendar-year-table>
                <tbody data-calendar-year-body></tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    </div>
  `

  const rootEl = layout.main.querySelector<HTMLElement>('[data-calendar-root]')
  if (!rootEl)
    return

  const toolbar = Toolbar()
  layout.root.appendChild(toolbar.root)

  const instance = new CalendarExample(rootEl, {
    id: 'calendar:vanilla',
    locale: 'en',
    selectionMode: 'single',
  })

  instance.init()

  const updateVisualizer = (state?: CalendarState) => {
    if (!state)
      return
    toolbar.setVisualizerSlot(() => StateVisualizer({ state }))
  }

  updateVisualizer(instance.state as CalendarState)
  instance.onStateChange(updateVisualizer)
}
