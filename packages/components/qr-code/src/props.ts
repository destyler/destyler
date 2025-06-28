import { createProps } from "@destyler/types"
import { createSplitProps } from "@destyler/utils"
import type { UserDefinedContext } from "./types"

export const props = createProps<UserDefinedContext>()([
  "ids",
  "value",
  "id",
  "encoding",
  "dir",
  "getRootNode",
  "onValueChange",
])

export const splitProps = createSplitProps<Partial<UserDefinedContext>>(props)
