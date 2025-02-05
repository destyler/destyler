import { groupConnect } from './src/group.connect'
import { groupMachine } from './src/group.machine'

import { createToastMachine as createMachine } from './src/machine'

export { anatomy } from './src/anatomy'
export { connect } from './src/connect'
export type {
  ActionOptions,
  MachineApi as Api,
  GenericOptions,
  GroupMachineApi as GroupApi,
  UserDefinedGroupContext as GroupMachineContext,
  GroupProps,
  GroupService,
  GroupState,
  MachineContext,
  Options,
  Placement,
  PromiseOptions,
  Service,
  Status,
  StatusChangeDetails,
  Type,
} from './src/types'
export { createMachine }

export const group = {
  connect: groupConnect,
  machine: groupMachine,
}
