import FadeInExpandTransition from './_internal/FadeInExpandTransition'
import BaseIconSwitchTransition from './_internal/IconSwitchTransition'
import { beforeNextFrameOnce } from './animation/next-frame-once'
import { beforeNextFrame } from './animation/next-frame'
import { off, on } from './events/delegate'
import { getFirstVNode, getSlot } from './vue/v-node'

export * from './dom/is-document'
export * from './dom/get-precise-event-target'
export * from './dom/resolve-to'
export * from './vue/call'
export * from './env/browser'
export * from './env/is-browser'
export * from './vue/resolve-slot'
export * from './env/is-native-lazy-load'
export * from './image/index'
export * from './vue/create-injection-key'
export * from './misc/index'
export * from './vue/flatten'
export * from './vue/get-first-slot-vnode'

export {
  FadeInExpandTransition,
  BaseIconSwitchTransition,
  beforeNextFrameOnce,
  beforeNextFrame,
  off,
  on,
  getFirstVNode,
  getSlot,
}
