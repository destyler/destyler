export const OPEN_KEYS = [' ', 'Enter', 'ArrowUp', 'ArrowDown']
export const CONTENT_MARGIN = 10

export function shouldShowPlaceholder(value?: string) {
  return value === '' || value === undefined
}
