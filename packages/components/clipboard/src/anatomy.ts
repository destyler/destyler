import { createAnatomy } from '@destyler/anatomy'

export const anatomy = createAnatomy('clipboard').parts('root', 'control', 'trigger', 'indicator', 'input', 'label')

export const parts = anatomy.build()
