import { createProps } from "@destyler/types"
import type { UserDefinedContext } from "./types"

export const props = createProps<UserDefinedContext>()(["onExitComplete", "present", "immediate"])
