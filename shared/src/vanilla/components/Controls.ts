type ControlConfig = Record<string, any>
interface Control {
  config: ControlConfig
  getState: (key: string) => any
  setState: (key: string, value: any) => void
  keys: string[]
  subscribe: (fn: (state: any) => void) => () => void
}

export function Controls(control: Control): HTMLDivElement {
  const container = document.createElement('div')
  container.className = 'controls-container'

  function renderControls() {
    // 清空内容
    while (container.firstChild) container.removeChild(container.firstChild)
    // 渲染所有控件
    for (const key of control.keys) {
      const value = control.config[key]
      let el: HTMLDivElement | null = null

      if (value.type === 'boolean') {
        el = document.createElement('div')
        el.className = 'checkbox'
        const input = document.createElement('input')
        input.type = 'checkbox'
        input.id = value.label || key
        input.checked = !!control.getState(key)
        input.dataset.testid = key
        input.oninput = (e: Event) => control.setState(key, (e.target as HTMLInputElement).checked)
        const label = document.createElement('label')
        label.htmlFor = value.label || key
        label.textContent = value.label || key
        el.append(input, label)
      }
      else if (value.type === 'string') {
        el = document.createElement('div')
        el.className = 'text'
        const label = document.createElement('label')
        label.style.marginRight = '10px'
        label.textContent = value.label || key
        const input = document.createElement('input')
        input.type = 'text'
        input.placeholder = value.placeholder || ''
        input.value = control.getState(key) || ''
        input.dataset.testid = key
        input.onkeydown = (event: KeyboardEvent) => {
          if (event.key === 'Enter') {
            control.setState(key, (event.target as HTMLInputElement).value)
          }
        }
        el.append(label, input)
      }
      else if (value.type === 'select') {
        el = document.createElement('div')
        el.className = 'text'
        const label = document.createElement('label')
        label.style.marginRight = '10px'
        label.htmlFor = value.label || key
        label.textContent = value.label || key
        const select = document.createElement('select')
        select.id = value.label || key
        select.dataset.testid = key
        select.value = control.getState(key) || ''
        const optionEmpty = document.createElement('option')
        optionEmpty.textContent = '-----'
        select.append(optionEmpty)
        for (const option of value.options || []) {
          const opt = document.createElement('option')
          opt.value = option
          opt.textContent = option
          select.append(opt)
        }
        select.onchange = (e: Event) => control.setState(key, (e.target as HTMLSelectElement).value)
        el.append(label, select)
      }
      else if (value.type === 'number') {
        el = document.createElement('div')
        el.className = 'text'
        const label = document.createElement('label')
        label.style.marginRight = '10px'
        label.htmlFor = value.label || key
        label.textContent = value.label || key
        const input = document.createElement('input')
        input.type = 'number'
        input.id = value.label || key
        input.dataset.testid = key
        if (value.min !== undefined)
          input.min = value.min
        if (value.max !== undefined)
          input.max = value.max
        input.value = control.getState(key)
        input.onkeydown = (e: KeyboardEvent) => {
          if (e.key === 'Enter') {
            const val = Number.parseFloat((e.target as HTMLInputElement).value)
            control.setState(key, Number.isNaN(val) ? 0 : val)
          }
        }
        el.append(label, input)
      }

      if (el)
        container.appendChild(el)
    }
  }

  renderControls()

  // 只注册一次订阅，避免递归死循环
  control.subscribe(() => {
    renderControls()
  })

  return container
}
