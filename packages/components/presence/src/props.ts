import type { UserDefinedContext } from './types'
import { createProps } from '@destyler/types'

export const props = createProps<UserDefinedContext>()(['onExitComplete', 'present', 'immediate'])
