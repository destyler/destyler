import { isBrowser } from '@destyler/shared'
import { nanoid } from 'nanoid/non-secure'

export function useUniqueId(
  idFromParams: string | null = null,
) {
  if (!isBrowser && !idFromParams)
    console.warn('DestylerSplitter component required `id` for SSR. Or you can wrap the component with `<ClientOnly>`.')

  return idFromParams ?? nanoid(6)
}
