/** @jsxImportSource solid-js */
import * as hoverCard from '@destyler/hover-card'
import { normalizeProps, useMachine } from '@destyler/solid'
import { createMemo, createUniqueId } from 'solid-js'
import { Portal } from 'solid-js/web'

export default function HoverCard() {
  const [state, send] = useMachine(hoverCard.machine({
    id: createUniqueId(),
  }))

  const api = createMemo(() => hoverCard.connect(state, send, normalizeProps))

  return (
    <div class=" mt-0!">
      <a
        href="https://twitter.com/elonehoo"
        target="_blank"
        {...api().getTriggerProps()}
        class="btn no-underline!"
      >
        Hover
      </a>

      {api().open && (
        <Portal mount={document.body}>
          <div {...api().getPositionerProps()}>
            <div
              {...api().getContentProps()}
              class="z-50 w-64 rounded-md border border-border! bg-popover p-4 text-popover-foreground shadow-md outline-none animate-in zoom-in-90"
            >
              <div class="flex gap-4 mt-0!">
                <img
                  src="https://github.com/elonehoo.png"
                  alt="Profile"
                  class="h-12 w-12 rounded-full border border-border!"
                />
                <div class="space-y-1">
                  <h4 class="text-sm font-semibold">elonehoo</h4>
                  <p class="text-sm text-muted-foreground">Frontend Developer</p>
                </div>
              </div>
              <div class="mt-4 text-sm text-muted-foreground">
                I hope every sunny afternoon can be wasted.
              </div>
              <div class="mt-4 flex items-center text-sm text-muted-foreground">
                <div class="w-4 h-4 i-carbon:logo-x mr-2" />
                @elonehoo
              </div>
            </div>
          </div>
        </Portal>
      )}
    </div>
  )
}
