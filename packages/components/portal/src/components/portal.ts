import { render as litRender, nothing } from 'lit';
import { directive } from 'lit/directive.js';
import { AsyncDirective } from 'lit/async-directive.js';

export type TargetOrSelector = Node | string;

export interface PortalOptions {
  placeholder?: unknown;
}


function getTarget(targetOrSelector: TargetOrSelector): Node {
  let target = targetOrSelector;
  if (typeof target === 'string') {
    target = document.querySelector(target) as Node;
    if (target === null) {
      throw Error(`Could not locate portal target with selector "${targetOrSelector}".`);
    }
  }

  return target;
}

export class PortalDirective extends AsyncDirective {
  private containerId = `portal-${self.crypto.randomUUID()}`;
  private container: any;
  private target: Node | undefined;

  render(
    content: unknown | Promise<unknown>,
    targetOrSelector: TargetOrSelector | Promise<TargetOrSelector> = document.body,
    options?: PortalOptions,
  ) {
    Promise.resolve(targetOrSelector).then(async (targetOrSelector) => {
      if (!targetOrSelector) {
        throw Error(
          "Target was falsy. Are you using a Lit ref before its value is defined? If so, try using Lit's @queryAsync decorator instead (https://lit.dev/docs/api/decorators/#queryAsync).",
        );
      }
      const newTarget = getTarget(targetOrSelector);

      if (!this.container) {
        const newContainer = document.createElement('div');
        newContainer.id = this.containerId;
        this.container = newContainer;
      }

      if (this.target && this.target !== newTarget) {
        this.target?.removeChild(this.container);
        newTarget.appendChild(this.container);
        this.target = newTarget;
      }

      if (!this.target) {
        this.target = newTarget;

        if (options?.placeholder) {
          if (!this.target.contains(this.container)) {
            this.target.appendChild(this.container);
          }
          litRender(options.placeholder, this.container);
        }
      }

      const resolvedContent = await Promise.resolve(content);

      if (!this.target.contains(this.container)) {
        this.target.appendChild(this.container);
      }

      litRender(resolvedContent, this.container);
    });

    return nothing;
  }

  protected override disconnected(): void {
    if (this.target?.contains(this.container)) {
      this.target?.removeChild(this.container);
    } else {
      console.warn(
        'portal directive was disconnected after the portal container was removed from the target.',
      );
    }
  }

  protected override reconnected(): void {
    this.target?.appendChild(this.container);
  }
}

export const portal = directive(PortalDirective);
