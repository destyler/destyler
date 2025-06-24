/**
 * General type utilities
 */

import type { Machine } from './machine'

export type Dict<T = any> = Record<string, T>

export type MaybeArray<T> = T | T[]

export type VoidFunction = () => void

type IfEquals<X, Y, A, B> = (<T>() => T extends X ? 1 : 2) extends <T>() => T extends Y ? 1 : 2 ? A : B

type WritableKey<T> = {
  [P in keyof T]: IfEquals<{ [Q in P]: T[P] }, { -readonly [Q in P]: T[P] }, P, never>
}[keyof T]

export type Writable<T> = Pick<T, WritableKey<T>>

type Computed<T> = Omit<T, WritableKey<T>>

/**
 * Context types
 */

/** Combined context type with readonly computed properties */
export type Context<V, C> = V & Readonly<C>

/** Computed context properties definition */
export type TComputedContext<T> = {
  [K in keyof Computed<T>]: (ctx: T) => T[K]
}

/** User-provided context (only writable properties) */
export type UserContext<TContext> = Partial<Writable<TContext>>

/** Context change listener callback */
export type ContextListener<TContext extends Dict> = (context: TContext) => void

/**
 * Event types - can be either a string or object
 */

/** Base event object interface */
export interface EventObject { type: string }

/** Event can be a type string or event object */
export type Event<TEvent extends EventObject = EventObject> = TEvent['type'] | TEvent

/** Event object with additional properties */
export interface AnyEventObject extends EventObject {
  [key: string]: any
}

/** Function to send events to the machine */
export type Send<TEvent extends EventObject = AnyEventObject> = (event: Event<TEvent>) => void

/** Event listener callback */
export type EventListener<TEvent extends EventObject = AnyEventObject> = (event: TEvent) => void

/** Extract specific event type from union */
export type ExtractEvent<TEvent extends EventObject, K> = K extends TEvent['type']
  ? Extract<TEvent, { type: K }>
  : EventObject

/**
 * Expression types - actions and activities are expressions
 */

type Expression<TContext extends Dict, TEvent extends EventObject, TReturn> = (
  context: TContext,
  event: TEvent,
) => TReturn

/** Meta information passed to expressions */
export interface Meta<TContext extends Dict, TState extends StateSchema, TEvent extends EventObject> {
  state: State<TContext, TState>
  guards: Dict
  send: Send<TEvent>
  self: Self<TContext, TState, TEvent>
  initialContext: TContext
  initialState: string
  getState: () => State<TContext, TState, TEvent>
  getAction: (key: string) => ExpressionWithMeta<TContext, TState, TEvent, void>
  getGuard: (key: string) => GuardExpression<TContext, TState, TEvent>
}

/** Expression with access to meta information */
type ExpressionWithMeta<TContext extends Dict, TState extends StateSchema, TEvent extends EventObject, TReturn> = (
  context: TContext,
  event: TEvent,
  meta: Meta<TContext, TState, TEvent>,
) => TReturn

/**
 * Action types
 */

/** Single action - can be string reference or function */
export type Action<TContext extends Dict, TState extends StateSchema, TEvent extends EventObject> =
  | string
  | ExpressionWithMeta<TContext, TState, TEvent, void>

/** Multiple actions - can include conditional actions */
export type Actions<TContext extends Dict, TState extends StateSchema, TEvent extends EventObject> =
  | ChooseHelper<TContext, TState, TEvent>
  | MaybeArray<Action<TContext, TState, TEvent>>

/** Pure actions without conditional logic */
export type PureActions<TContext extends Dict, TState extends StateSchema, TEvent extends EventObject> = MaybeArray<
  Action<TContext, TState, TEvent>
>

/** Map of action names to implementations */
export interface ActionMap<TContext extends Dict, TState extends StateSchema, TEvent extends EventObject> {
  [action: string]: ExpressionWithMeta<TContext, TState, TEvent, void>
}

/**
 * Activity types
 */

/** Activity - long-running process with cleanup */
export type Activity<TContext extends Dict, TState extends StateSchema, TEvent extends EventObject> =
  | string
  | ExpressionWithMeta<TContext, TState, TEvent, VoidFunction | void | undefined>

/** Multiple activities */
export type Activities<TContext extends Dict, TState extends StateSchema, TEvent extends EventObject> = MaybeArray<
  Activity<TContext, TState, TEvent>
>

/** Map of activity names to implementations */
export interface ActivityMap<TContext extends Dict, TState extends StateSchema, TEvent extends EventObject> {
  [activity: string]: ExpressionWithMeta<TContext, TState, TEvent, VoidFunction | void | undefined>
}

/**
 * Transition types
 */

/** Transition definition with target, actions, and guards */
export interface TransitionDefinition<TContext extends Dict, TState extends StateSchema, TEvent extends EventObject> {
  /** Target state to transition to */
  target?: TState['value'] | undefined
  /** Actions to execute during transition */
  actions?: Actions<TContext, TState, TEvent> | undefined
  /** Guard condition for the transition */
  guard?: Guard<TContext, TState, TEvent> | undefined
  /** Whether this is an internal transition */
  internal?: boolean | undefined
}

/** Delay expression function */
export type DelayExpression<TContext extends Dict, TEvent extends EventObject> = Expression<TContext, TEvent, number>

/** Delay specification - string, number, or expression */
export type Delay<TContext extends Dict, TEvent extends EventObject> =
  | string
  | number
  | DelayExpression<TContext, TEvent>

/** Map of delay names to implementations */
export interface DelayMap<TContext extends Dict, TEvent extends EventObject> {
  [delay: string]: number | DelayExpression<TContext, TEvent>
}

/** Transition with delay specification for 'after' and 'every' */
export type DelayedTransition<
  TContext extends Dict,
  TState extends StateSchema,
  TEvent extends EventObject,
> = TransitionDefinition<TContext, TState, TEvent> & {
  /** The time to delay the event, in milliseconds */
  delay?: Delay<TContext, TEvent> | undefined
}

/** Collection of delayed transitions */
export type DelayedTransitions<TContext extends Dict, TState extends StateSchema, TEvent extends EventObject> =
  | Record<string | number, TState['value'] | MaybeArray<TransitionDefinition<TContext, TState, TEvent>>>
  | Array<DelayedTransition<TContext, TState, TEvent>>

/** Transition can be a string (target) or full definition object */
export type Transition<TContext extends Dict, TState extends StateSchema, TEvent extends EventObject> =
  | TState['value']
  | TransitionDefinition<TContext, TState, TEvent>

/** Multiple transition possibilities with guards */
export type Transitions<TContext extends Dict, TState extends StateSchema, TEvent extends EventObject> =
  | Transition<TContext, TState, TEvent>
  | Array<TransitionDefinition<TContext, TState, TEvent>>

/** Map of event types to their transitions */
export type TransitionDefinitionMap<TContext extends Dict, TState extends StateSchema, TEvent extends EventObject> = {
  [K in TEvent['type']]?:
    | TState['value']
    | MaybeArray<TransitionDefinition<TContext, TState, ExtractEvent<TEvent, K>>>
    | undefined
}

/**
 * State node definition
 */

/** Configuration for a single state node */
export interface StateNode<TContext extends Dict, TState extends StateSchema, TEvent extends EventObject> {
  /** The type of this state node */
  type?: 'final' | undefined
  /** The tags for the state node */
  tags?: MaybeArray<TState['tags'] extends string ? TState['tags'] : string> | undefined
  /** Activities to start on entry and stop on exit */
  activities?: Activities<TContext, TState, TEvent> | undefined
  /** Event to transition mappings */
  on?: TransitionDefinitionMap<TContext, TState, TEvent> | undefined
  /** Actions to execute on state entry */
  entry?: Actions<TContext, TState, TEvent> | undefined
  /** Actions to execute on state exit */
  exit?: Actions<TContext, TState, TEvent> | undefined
  /** Meta data associated with this state node */
  meta?: string | Dict | undefined
  /** Delayed transitions using setTimeout */
  after?: DelayedTransitions<TContext, TState, TEvent> | undefined
  /** Interval-based actions using setInterval */
  every?:
    | Record<string | number, Actions<TContext, TState, TEvent>>
    | Array<{
      delay?: number | string | Expression<TContext, TEvent, number>
      actions: Actions<TContext, TState, TEvent>
      guard?: Guard<TContext, TState, TEvent>
    }>
    | undefined
}

/**
 * Guard types
 */

/** Meta information available to guard functions */
export interface GuardMeta<TContext extends Dict, TState extends StateSchema, TEvent extends EventObject> {
  state: Pick<State<TContext, TState, TEvent>, 'matches'>
}

/** Guard expression function */
export type GuardExpression<
  TContext extends Dict,
  TState extends StateSchema,
  TEvent extends EventObject,
  TReturn = boolean,
> = (context: TContext, event: TEvent, guardMeta: GuardMeta<TContext, TState, TEvent>) => TReturn

/** Guard helper for complex guard logic */
export interface GuardHelper<TContext extends Dict, TState extends StateSchema, TEvent extends EventObject> {
  predicate: (guards: Dict) => GuardExpression<TContext, TState, TEvent>
}

/** Helper for conditional action selection */
export interface ChooseHelper<TContext extends Dict, TState extends StateSchema, TEvent extends EventObject> {
  predicate: (
    guards: Dict,
  ) => GuardExpression<TContext, TState, TEvent, PureActions<TContext, TState, TEvent> | undefined>
}

/** Guard can be string reference, function, or helper */
export type Guard<TContext extends Dict, TState extends StateSchema, TEvent extends EventObject> =
  | string
  | GuardExpression<TContext, TState, TEvent>
  | GuardHelper<TContext, TState, TEvent>

/** Map of guard names to implementations */
export interface GuardMap<TContext extends Dict, TState extends StateSchema, TEvent extends EventObject> {
  [guard: string]: GuardExpression<TContext, TState, TEvent>
}

/**
 * State types
 */

/** Schema defining state structure */
export interface StateSchema {
  value: string
  tags?: string | undefined
}

/** State initialization object */
export interface StateInitObject<TContext, TState extends StateSchema> {
  context?: TContext | undefined
  value: TState['value'] | null
  tags?: TState['tags'][] | undefined
}

/** State initialization type */
export type StateInit<TContext, TState extends StateSchema> = StateInitObject<TContext, TState>

/** State change listener callback */
export type StateListener<
  TContext extends Dict,
  TState extends StateSchema,
  TEvent extends EventObject = EventObject,
> = (state: State<TContext, TState, TEvent>) => void

/** Information about state transition */
export interface StateInfo<TContext extends Dict, TState extends StateSchema, TEvent extends EventObject> {
  /** Whether the state was re-entered */
  reenter: boolean
  /** Whether the state changed */
  changed: boolean
  /** The transition definition that caused this state */
  transition: TransitionDefinition<TContext, TState, TEvent> | undefined
  /** The state node configuration */
  stateNode: StateNode<TContext, TState, TEvent> | undefined
  /** The target state value */
  target: TState['value']
}

/**
 * Machine configuration types
 */

/** Main machine configuration */
export interface MachineConfig<TContext extends Dict, TState extends StateSchema, TEvent extends EventObject> {
  /** Actions to run after machine instantiation */
  created?: Actions<TContext, TState, TEvent> | undefined
  /** Actions to run when machine starts */
  entry?: Actions<TContext, TState, TEvent> | undefined
  /** Actions to run when machine stops */
  exit?: Actions<TContext, TState, TEvent> | undefined
  /** Root level activities */
  activities?: Activities<TContext, TState, TEvent> | undefined
  /** Unique machine identifier */
  id?: string | undefined
  /** Extended state data */
  context?: Writable<TContext> | undefined
  /** Context change watchers */
  watch?: { [K in keyof TContext]?: Actions<TContext, TState, TEvent> } | undefined
  /** Computed properties */
  computed?: Partial<TComputedContext<TContext>> | undefined
  /** Initial state */
  initial?: TState['value'] | undefined
  /** State node configurations */
  states?: Partial<Record<TState['value'], StateNode<TContext, TState, TEvent>>> | undefined
  /** Root level event transitions */
  on?: TransitionDefinitionMap<TContext, TState, TEvent> | undefined
}

/** Current state representation */
export interface State<
  TContext extends Dict,
  TState extends StateSchema = StateSchema,
  TEvent extends EventObject = AnyEventObject,
> {
  /** Current state value */
  value: TState['value'] | null
  /** Previous state value */
  previousValue: TState['value'] | null
  /** Current event */
  event: TEvent
  /** Previous event */
  previousEvent: TEvent
  /** Current context */
  context: TContext
  /** Whether machine is in final state */
  done: boolean
  /** Check if event can be sent */
  can: (event: string) => boolean
  /** Check if state matches given values */
  matches: (...value: TState['value'][]) => boolean
  /** Check if state has given tag */
  hasTag: (value: TState['tags']) => boolean
  /** Events that can be sent from current state */
  nextEvents: string[]
  /** Whether state has changed */
  changed: boolean
  /** Current state tags */
  tags: TState['tags'][]
}

/**
 * Machine options types
 */

/** Options for machine configuration */
export interface MachineOptions<TContext extends Dict, TState extends StateSchema, TEvent extends EventObject> {
  /** Enable debug logging */
  debug?: boolean | undefined
  /** Guard implementations */
  guards?: GuardMap<TContext, TState, TEvent> | undefined
  /** Action implementations */
  actions?: ActionMap<TContext, TState, TEvent> | undefined
  /** Delay implementations */
  delays?: DelayMap<TContext, TEvent> | undefined
  /** Activity implementations */
  activities?: ActivityMap<TContext, TState, TEvent> | undefined
  /** Synchronous execution mode */
  sync?: boolean | undefined
  /** Custom comparison functions for context properties */
  compareFns?: { [K in keyof TContext]?: CompareFn<TContext[K]> } | undefined
}

/** Options for machine hooks */
export interface HookOptions<TContext extends Dict, TState extends StateSchema, TEvent extends EventObject> {
  /** Synchronous execution mode */
  sync?: boolean
  /** Action implementations */
  actions?: ActionMap<TContext, TState, TEvent> | undefined
  /** Initial state */
  state?: StateInit<TContext, TState> | undefined
  /** Initial context */
  context?: UserContext<TContext> | undefined
}

/** Machine self-reference for advanced operations */
export interface Self<TContext extends Dict, TState extends StateSchema, TEvent extends EventObject> {
  /** Machine identifier */
  id: string
  /** Send event to this machine */
  send: (event: Event<TEvent>) => void
  /** Send event to parent machine */
  sendParent: (evt: AnyEventObject) => void
  /** Send event to child machine */
  sendChild: (evt: Event<TEvent>, to: string | ((ctx: TContext) => string)) => void
  /** Stop this machine */
  stop: VoidFunction
  /** Stop child machine */
  stopChild: (id: string) => void
  /** Stop activity */
  stopActivity: (id: string) => void
  /** Spawn new actor */
  spawn: <T>(src: T | (() => T), id?: string) => T
  /** Current state */
  state: State<TContext, TState, TEvent>
  /** Initial context */
  initialContext: TContext
  /** Initial state */
  initialState: string
}

/** Machine status enumeration */
export enum MachineStatus {
  NotStarted = 'Not Started',
  Running = 'Running',
  Stopped = 'Stopped',
}

/** Built-in action types */
export enum ActionTypes {
  Start = 'machine.start',
  Stop = 'machine.stop',
  Created = 'machine.created',
  Init = 'machine.init',
}

/** Machine type enumeration */
export enum MachineType {
  Machine = 'machine',
  Actor = 'machine.actor',
}

/** Comparison function type */
export type CompareFn<T = any> = (prev: T, next: T) => boolean

// utils

type AnyFunction = (...args: any[]) => any
type ReturnTypeOrValue<T> = T extends AnyFunction ? ReturnType<T> : T

export type StateFrom<T> =
  ReturnTypeOrValue<T> extends infer R
    ? R extends Machine<infer TContext, infer TState, infer TEvent>
      ? State<TContext, TState, TEvent>
      : never
    : never

export type ContextFrom<T> =
  ReturnTypeOrValue<T> extends infer R ? (R extends Machine<infer TContext, any, any> ? TContext : never) : never

export type EventFrom<T> =
  ReturnTypeOrValue<T> extends infer R ? (R extends Machine<any, any, infer TEvent> ? TEvent : never) : never

export interface ContextRef<T> { current: T | undefined }
