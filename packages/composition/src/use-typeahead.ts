import { refAutoReset } from '@destyler/shared'
import type { Ref } from 'vue'

export function useTypeahead(collections: Ref<HTMLElement[]>) {
  const search = refAutoReset('', 1000)

  const handleTypeaheadSearch = (key: string) => {
    search.value = search.value + key
    const items = collections.value
    const currentItem = document.activeElement
    const currentMatch
      = items.find(item => item === currentItem)?.textContent?.trim() ?? ''
    const values = items.map(item => item.textContent?.trim() ?? '')
    const nextMatch = getNextMatch(values, search.value, currentMatch)

    const newItem = items.find(
      item => item.textContent?.trim() === nextMatch,
    )

    if (newItem)
      (newItem as HTMLElement).focus()
  }

  const resetTypeahead = () => {
    search.value = ''
  }

  return {
    search,
    handleTypeaheadSearch,
    resetTypeahead,
  }
}

export function wrapArray<T>(array: T[], startIndex: number) {
  return array.map((_, index) => array[(startIndex + index) % array.length])
}
export function getNextMatch(
  values: string[],
  search: string,
  currentMatch?: string,
) {
  const isRepeated
    = search.length > 1 && Array.from(search).every(char => char === search[0])
  const normalizedSearch = isRepeated ? search[0] : search
  const currentMatchIndex = currentMatch ? values.indexOf(currentMatch) : -1
  let wrappedValues = wrapArray(values, Math.max(currentMatchIndex, 0))
  const excludeCurrentMatch = normalizedSearch.length === 1
  if (excludeCurrentMatch)
    wrappedValues = wrappedValues.filter(v => v !== currentMatch)
  const nextMatch = wrappedValues.find(value =>
    value.toLowerCase().startsWith(normalizedSearch.toLowerCase()),
  )
  return nextMatch !== currentMatch ? nextMatch : undefined
}
