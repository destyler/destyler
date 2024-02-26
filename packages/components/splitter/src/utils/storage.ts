import type { PanelData, PanelGroupStorage } from '../types'

export function initializeDefaultStorage(storageObject: PanelGroupStorage) {
  try {
    if (typeof localStorage !== 'undefined') {
      // Bypass this check for future calls
      storageObject.getItem = (name: string) => {
        return localStorage.getItem(name)
      }
      storageObject.setItem = (name: string, value: string) => {
        localStorage.setItem(name, value)
      }
    }
    else {
      throw new TypeError('localStorage not supported in this environment')
    }
  }
  catch (error) {
    console.error(error)

    storageObject.getItem = () => null
    storageObject.setItem = () => {}
  }
}

export interface PanelConfigurationState {
  expandToSizes: {
    [panelId: string]: number
  }
  layout: number[]
}

export interface SerializedPanelGroupState {
  [panelIds: string]: PanelConfigurationState
}

function getPanelGroupKey(autoSaveId: string): string {
  return `radix-vue:${autoSaveId}`
}

// Note that Panel ids might be user-provided (stable) or useId generated (non-deterministic)
// so they should not be used as part of the serialization key.
// Using the min/max size attributes should work well enough as a backup.
// Pre-sorting by minSize allows remembering layouts even if panels are re-ordered/dragged.
function getPanelKey(panels: PanelData[]): string {
  return panels
    .map((panel) => {
      const { constraints, id, idIsFromProps, order } = panel
      if (idIsFromProps) {
        return id
      }
      else {
        return order
          ? `${order}:${JSON.stringify(constraints)}`
          : JSON.stringify(constraints)
      }
    })
    .sort((a, b) => a.localeCompare(b))
    .join(',')
}

function loadSerializedPanelGroupState(
  autoSaveId: string,
  storage: PanelGroupStorage,
): SerializedPanelGroupState | null {
  try {
    const panelGroupKey = getPanelGroupKey(autoSaveId)
    const serialized = storage.getItem(panelGroupKey)
    if (serialized) {
      const parsed = JSON.parse(serialized)
      if (typeof parsed === 'object' && parsed != null)
        return parsed as SerializedPanelGroupState
    }
  }
  catch (error) {}

  return null
}

export function loadPanelGroupState(
  autoSaveId: string,
  panels: PanelData[],
  storage: PanelGroupStorage,
): PanelConfigurationState | null {
  const state = loadSerializedPanelGroupState(autoSaveId, storage) ?? {}
  const panelKey = getPanelKey(panels)
  return state[panelKey] ?? null
}

export function savePanelGroupState(
  autoSaveId: string,
  panels: PanelData[],
  panelSizesBeforeCollapse: Map<string, number>,
  sizes: number[],
  storage: PanelGroupStorage,
): void {
  const panelGroupKey = getPanelGroupKey(autoSaveId)
  const panelKey = getPanelKey(panels)
  const state = loadSerializedPanelGroupState(autoSaveId, storage) ?? {}
  state[panelKey] = {
    expandToSizes: Object.fromEntries(panelSizesBeforeCollapse.entries()),
    layout: sizes,
  }

  try {
    storage.setItem(panelGroupKey, JSON.stringify(state))
  }
  catch (error) {
    console.error(error)
  }
}
