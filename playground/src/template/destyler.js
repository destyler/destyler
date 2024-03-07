import { getCurrentInstance } from 'vue'

let installed = false

export function setupElementPlus() {
  if (installed) return
  const instance = getCurrentInstance()
  installed = true
}
