export const isDef = <T = any>(val?: T): val is T => typeof val !== 'undefined'
