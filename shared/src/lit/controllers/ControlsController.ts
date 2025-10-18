import type { ControlRecord } from '@destyler/shared-private'
import { deepGet, deepSet, getControlDefaults } from '@destyler/shared-private'
import { html } from 'lit'

export class ControlsController<T extends ControlRecord> {
  readonly config: T
  private state: any
  private listeners = new Set<(state: any) => void>()

  constructor(config: T) {
    this.config = config
    this.state = getControlDefaults(config)
  }

  get context() {
    return this.state
  }

  setState = (key: string, value: any) => {
    deepSet(this.state, key, value)
    this.emit()
  }

  getState = (key: string) => {
    return deepGet(this.state, key)
  }

  get keys() {
    return Object.keys(this.config)
  }

  subscribe(fn: (state: any) => void) {
    this.listeners.add(fn)
    return () => this.listeners.delete(fn)
  }

  private emit() {
    for (const fn of this.listeners) fn(this.state)
  }

  render() {
    return html`<div class="controls-container">
      ${this.keys.map((key) => {
        const def: any = (this.config as any)[key] ?? {}
        const { type, label = key, options, placeholder, min, max } = def
        const value = deepGet(this.state, key)
        switch (type) {
          case 'boolean':
            return html`<div class="checkbox" data-key=${key}>
              <input
                data-testid=${key}
                id=${label}
                type="checkbox"
                .checked=${!!value}
                @change=${(e: Event) => {
                  const target = e.target as HTMLInputElement
                  this.setState(key, target.checked)
                }}
              />
              <label for=${label}>${label}</label>
            </div>`
          case 'string':
            return html`<div class="text" data-key=${key}>
              <label style="margin-right: 10px;" for=${label}>${label}</label>
              <input
                data-testid=${key}
                id=${label}
                type="text"
                .value=${value ?? ''}
                placeholder=${placeholder ?? ''}
                @change=${(e: Event) => {
                  const target = e.target as HTMLInputElement
                  this.setState(key, target.value)
                }}
              />
            </div>`
          case 'select':
            return html`<div class="text" data-key=${key}>
              <label style="margin-right: 10px;" for=${label}>${label}</label>
              <select
                data-testid=${key}
                id=${label}
                .value=${value ?? ''}
                @change=${(e: Event) => {
                  const target = e.target as HTMLSelectElement
                  this.setState(key, target.value)
                }}
              >
                <option>-----</option>
                ${(options ?? []).map((option: any) => html`<option value=${option}>${option}</option>`)}
              </select>
            </div>`
          case 'number':
            return html`<div class="text" data-key=${key}>
              <label style="margin-right: 10px;" for=${label}>${label}</label>
              <input
                data-testid=${key}
                id=${label}
                type="number"
                .value=${value ?? 0}
                min=${min ?? ''}
                max=${max ?? ''}
                @change=${(e: Event) => {
                  const target = e.target as HTMLInputElement
                  const val = Number.parseFloat(target.value)
                  this.setState(key, Number.isNaN(val) ? 0 : val)
                }}
              />
            </div>`
          default:
            return html``
        }
      })}
    </div>`
  }
}

export type { ControlRecord }
