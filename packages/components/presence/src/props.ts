import type { UserDefinedContext } from './types'
import { createProps } from '@zag-js/types'

export const props = createProps<UserDefinedContext>()(['onExitComplete', 'present', 'immediate'])
