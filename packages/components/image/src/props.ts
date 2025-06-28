import { createProps } from "@destyler/types"
import { createSplitProps } from "@destyler/utils"
import type { UserDefinedContext } from "./types"

export const props = createProps<UserDefinedContext>()(["dir", "id", "ids", "onStatusChange", "getRootNode"])
export const splitProps = createSplitProps<Partial<UserDefinedContext>>(props)
