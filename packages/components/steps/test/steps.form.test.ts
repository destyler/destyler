// @vitest-environment happy-dom
import { formContracts } from './steps.form-contract'

// HTMLButtonElement.click exercises form defaults here, not native key activation.
formContracts('DOM click', async button => button.click())
