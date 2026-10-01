import type { PropTypes } from '@destyler/svelte'
import { mergeProps, normalizeProps, portal, reflect, useActor, useMachine, useService, useSnapshot } from '@destyler/svelte'

export const props: PropTypes['button'] = normalizeProps.button({ disabled: true, type: 'button' })
export const exports = { mergeProps, normalizeProps, portal, reflect, useActor, useMachine, useService, useSnapshot }
