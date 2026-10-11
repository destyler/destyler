// @vitest-environment happy-dom
import { formResetCases } from './form-reset.cases'

// Happy DOM does not honor canceled native reset default actions. Only the
// event/notification contract runs here; the browser suite uses form.reset().
formResetCases(form => form.dispatchEvent(new Event('reset', { bubbles: true, cancelable: true })))
