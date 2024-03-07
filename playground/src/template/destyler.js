import { getCurrentInstance } from 'vue'

let installed = false

export function setupDestyler() {
  if (installed) return
  const instance = getCurrentInstance()
  installed = true
}
