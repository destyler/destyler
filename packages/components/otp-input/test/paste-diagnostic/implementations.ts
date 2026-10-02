import { connect as baselineConnect } from './baseline/connect'
import { machine as baselineMachine } from './baseline/machine'
import { connect as candidateConnect } from './candidate/connect'
import { machine as candidateMachine } from './candidate/machine'

export const implementations = [
  { name: 'baseline', machine: baselineMachine, connect: baselineConnect },
  { name: 'candidate', machine: candidateMachine, connect: candidateConnect },
] as const
