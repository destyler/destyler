import type { FocusTrapOptions } from '../../shareds/focus-trap'
import { FocusTrap } from '../../shareds/focus-trap'

// These names were available to consumers before activation bookkeeping existed.
// Compile against the public entry point with strict settings and target ES2016.
export class PublicActivationTrap extends FocusTrap {
  activationId = 'consumer-owned'
}

export class ProtectedActivationTrap extends FocusTrap {
  protected activationId = 'consumer-owned'
}

export class PrivateActivationTrap extends FocusTrap {
  private activationId = 'consumer-owned'

  readActivationId() {
    return this.activationId
  }
}

export class AccessorActivationTrap extends FocusTrap {
  get activationId() {
    return 'consumer-owned'
  }
}

export function acceptSubclasses(element: HTMLElement, options: FocusTrapOptions): FocusTrap[] {
  return [
    new PublicActivationTrap(element, options),
    new ProtectedActivationTrap(element, options),
    new PrivateActivationTrap(element, options),
    new AccessorActivationTrap(element, options),
  ]
}
