import type { NormalizeProps, PropTypes } from "@destyler/types"
import type { MachineApi, Send, State } from "./types"

export function connect<T extends PropTypes>(state: State, send: Send, _normalize: NormalizeProps<T>): MachineApi {
  const present = state.matches("mounted", "unmountSuspended")
  return {
    skip: !state.context.initial && present,
    present,
    setNode(node) {
      if (!node) return
      send({ type: "NODE.SET", node })
    },
    unmount() {
      send({ type: "UNMOUNT" })
    },
  }
}
