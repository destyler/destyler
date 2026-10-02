import { connect as baselineConnect } from './baseline/connect'
import { machine as baselineMachine } from './baseline/machine'
import { connect as candidateConnect } from './candidate/connect'
import { machine as candidateMachine } from './candidate/machine'

import { connect as controlledPostframeConnect } from './controlled-postframe/connect'
import { machine as controlledPostframeMachine } from './controlled-postframe/machine'
import { connect as controlledPreframeConnect } from './controlled-preframe/connect'
import { machine as controlledPreframeMachine } from './controlled-preframe/machine'

export const implementations = [
  { name: 'baseline', machine: baselineMachine, connect: baselineConnect },
  { name: 'candidate', machine: candidateMachine, connect: candidateConnect },
  { name: 'controlled-preframe', machine: controlledPreframeMachine, connect: controlledPreframeConnect },
  { name: 'controlled-postframe', machine: controlledPostframeMachine, connect: controlledPostframeConnect },
] as const
