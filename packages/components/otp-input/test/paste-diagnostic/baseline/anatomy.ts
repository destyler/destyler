import { createAnatomy } from '@destyler/anatomy'

export const anatomy = createAnatomy('otpInput').parts('root', 'label', 'input', 'control')
export const parts = anatomy.build()
