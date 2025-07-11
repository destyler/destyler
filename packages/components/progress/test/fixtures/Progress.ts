import { Component, normalizeProps, spreadProps } from '@destyler/vanilla'
import * as progress from '../../index'

export class Progress extends Component<progress.Context, progress.Api> {
  initService(context: progress.Context) {
    return progress.machine(context)
  }

  initApi() {
    return progress.connect(this.service.state, this.service.send, normalizeProps)
  }

  render = () => {
    const rootEl = this.rootEl
    this.addCleanup(spreadProps(rootEl, this.api.getRootProps()))

    const labelEl = rootEl.querySelector<HTMLElement>('.progress-label')
    if (labelEl) {
      this.addCleanup(spreadProps(labelEl, this.api.getLabelProps()))
    }

    const trackEl = rootEl.querySelector<HTMLElement>('.progress-track')
    if (trackEl) {
      this.addCleanup(spreadProps(trackEl, this.api.getTrackProps()))
    }

    const rangeEl = rootEl.querySelector<HTMLElement>('.progress-range')
    if (rangeEl) {
      this.addCleanup(spreadProps(rangeEl, this.api.getRangeProps()))
    }

    const valueTextEl = rootEl.querySelector<HTMLElement>('.progress-value-text')
    if (valueTextEl) {
      this.addCleanup(spreadProps(valueTextEl, this.api.getValueTextProps()))
      valueTextEl.textContent = this.api.valueAsString
    }

    const indeterminateTrackEl = rootEl.querySelector<HTMLElement>('.indeterminate-track')
    if (indeterminateTrackEl) {
      // Create indeterminate progress instance
      const indeterminateProgress = new Progress(indeterminateTrackEl, {
        id: crypto.randomUUID(),
        value: 25,
        max: 100,
        min: 0,
      })
      indeterminateProgress.init()
    }

    // Setup button event handlers
    const setValueBtn = rootEl.querySelector<HTMLButtonElement>('.set-value-btn')
    if (setValueBtn) {
      setValueBtn.onclick = () => this.api.setValue(50)
    }

    const setMaxBtn = rootEl.querySelector<HTMLButtonElement>('.set-max-btn')
    if (setMaxBtn) {
      setMaxBtn.onclick = () => this.api.setToMax()
    }

    const setMinBtn = rootEl.querySelector<HTMLButtonElement>('.set-min-btn')
    if (setMinBtn) {
      setMinBtn.onclick = () => this.api.setToMin()
    }
  }
}

export function createProgress(): Promise<HTMLDivElement> {
  return new Promise((resolve) => {
    const container = document.createElement('div')

    // Regular progress
    const progressContainer = document.createElement('div')
    progressContainer.className = 'progress'
    progressContainer.style.width = '300px'

    const label = document.createElement('div')
    label.className = 'progress-label'
    label.textContent = 'Progress Label'

    const track = document.createElement('div')
    track.className = 'progress-track'
    track.style.height = '10px'
    track.style.background = '#f0f0f0'
    track.style.borderRadius = '5px'

    const range = document.createElement('div')
    range.className = 'progress-range'
    range.style.height = '100%'
    range.style.background = '#007acc'
    range.style.borderRadius = '5px'

    const valueText = document.createElement('div')
    valueText.className = 'progress-value-text'

    track.appendChild(range)
    progressContainer.appendChild(label)
    progressContainer.appendChild(track)
    progressContainer.appendChild(valueText)

    // Indeterminate progress
    const indeterminateTrack = document.createElement('div')
    indeterminateTrack.className = 'indeterminate-track'
    indeterminateTrack.setAttribute('data-testid', 'indeterminate-progress')
    indeterminateTrack.style.height = '10px'
    indeterminateTrack.style.background = '#f0f0f0'
    indeterminateTrack.style.borderRadius = '5px'
    indeterminateTrack.style.marginTop = '20px'

    const indeterminateRange = document.createElement('div')
    indeterminateRange.className = 'progress-range'
    indeterminateRange.style.height = '100%'
    indeterminateRange.style.background = '#007acc'
    indeterminateRange.style.borderRadius = '5px'

    indeterminateTrack.appendChild(indeterminateRange)

    // Control buttons
    const buttonContainer = document.createElement('div')
    buttonContainer.style.marginTop = '20px'

    const setValueBtn = document.createElement('button')
    setValueBtn.className = 'set-value-btn'
    setValueBtn.textContent = 'Set to 50'
    setValueBtn.setAttribute('data-testid', 'set-value')

    const setMaxBtn = document.createElement('button')
    setMaxBtn.className = 'set-max-btn'
    setMaxBtn.textContent = 'Set to Max'
    setMaxBtn.setAttribute('data-testid', 'set-max')

    const setMinBtn = document.createElement('button')
    setMinBtn.className = 'set-min-btn'
    setMinBtn.textContent = 'Set to Min'
    setMinBtn.setAttribute('data-testid', 'set-min')

    buttonContainer.appendChild(setValueBtn)
    buttonContainer.appendChild(setMaxBtn)
    buttonContainer.appendChild(setMinBtn)

    container.appendChild(progressContainer)
    container.appendChild(indeterminateTrack)
    container.appendChild(buttonContainer)

    resolve(container)
  })
}
