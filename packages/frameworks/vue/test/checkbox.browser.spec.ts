/**
 * Framework canary: mount a tiny checkbox via the Vue adapter.
 * Keep to 1–2 smoke cases — not a full matrix.
 */
import type { App } from 'vue'
import { afterEach, beforeEach, describe, expect, it } from 'vitest'
import { page } from 'vitest/browser'
import { computed, createApp, defineComponent, h, nextTick } from 'vue'
import * as checkbox from '../../../components/checkbox'
import { normalizeProps, useMachine } from '../index'

let host: HTMLElement | null = null
let app: App | null = null

function mountCheckbox() {
  host = document.createElement('div')
  document.body.appendChild(host)

  const Root = defineComponent({
    setup() {
      const [state, send] = useMachine(checkbox.machine({ id: 'vue-checkbox-canary' }))
      const api = computed(() => checkbox.connect(state.value, send, normalizeProps))

      return () => {
        const a = api.value
        return h(
          'label',
          { ...a.getRootProps(), 'data-testid': 'vue-checkbox-root' },
          [
            h('div', a.getControlProps()),
            h(
              'span',
              { ...a.getLabelProps(), 'data-testid': 'vue-checkbox-label' },
              a.checked ? 'checked' : 'unchecked',
            ),
            h('input', {
              ...a.getHiddenInputProps(),
              'data-testid': 'vue-checkbox-input',
            }),
          ],
        )
      }
    },
  })

  app = createApp(Root)
  app.mount(host)
}

describe('vue checkbox framework canary', () => {
  beforeEach(async () => {
    mountCheckbox()
    await nextTick()
  })

  afterEach(() => {
    app?.unmount()
    app = null
    if (host?.parentElement)
      document.body.removeChild(host)
    host = null
  })

  it('starts unchecked', async () => {
    await expect.element(page.getByTestId('vue-checkbox-root')).toHaveAttribute('data-state', 'unchecked')
    await expect.element(page.getByTestId('vue-checkbox-label')).toHaveTextContent('unchecked')
  })

  it('toggles checked on root click', async () => {
    await page.getByTestId('vue-checkbox-root').click()
    await expect.element(page.getByTestId('vue-checkbox-root')).toHaveAttribute('data-state', 'checked')
    await expect.element(page.getByTestId('vue-checkbox-label')).toHaveTextContent('checked')

    await page.getByTestId('vue-checkbox-root').click()
    await expect.element(page.getByTestId('vue-checkbox-root')).toHaveAttribute('data-state', 'unchecked')
  })
})
