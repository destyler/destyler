import type { UserDefinedContext } from './types'
import { createProps } from '@destyler/types'
import { createSplitProps } from '@destyler/utils'

export const props = createProps<UserDefinedContext>()(['dir', 'id', 'ids', 'onStatusChange', 'getRootNode'])
export const splitProps = createSplitProps<Partial<UserDefinedContext>>(props)
