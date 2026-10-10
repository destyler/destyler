import type { Context, ValueChangeDetails } from '@destyler/tabs'

const stringOnly = ({ value }: { value: string }) => value.toUpperCase()

export const context: Context = { id: 'string-only-consumer', onValueChange: stringOnly }
export const handler: (details: ValueChangeDetails) => void = stringOnly
