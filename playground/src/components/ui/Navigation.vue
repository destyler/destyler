<script setup lang="ts">
import { useClipboard, useEventListener, useVModel } from '@vueuse/core'
import { isDark, toggleDark } from '~/logic/dark'
import { exportState } from '~/orchestrator'

const props = defineProps<{ modelValue: boolean }>()
const isOpen = useVModel(props)
const { copy } = useClipboard()

function share() {
  const state = exportState()
  window.location.hash = state
  return copy(window.location.href)
}

useEventListener('keydown', (ev) => {
  if (ev.ctrlKey && ev.code === 'KeyS' && !ev.shiftKey) {
    ev.preventDefault()
    share().then(() => alert('URL copied to clipboard'))
  }
})
</script>

<template>
  <div
    position="fixed left-0 top-0 bottom-0"
    p="y-4 x-2"
    w="18"
    flex="~ col"
    items="center"
    spcae="y-2"
  >
    <Logo class="w-12" />
    <span class="flex-1" />
    <Button
      icon
      text="base"
      @click="toggleDark()"
    >
      <i-carbon-moon v-if="isDark" />
      <i-carbon-sun v-else />
    </Button>
    <Button
      icon
      text="base"
      @click="share"
    >
      <i-carbon-share />
    </Button>
    <Button
      icon
      text="base"
      @click="isOpen = true"
    >
      <i-carbon-settings />
    </Button>
    <a href="https://github.com/destyler/destyler" target="_blank">
      <Button
        icon
        text="base"
      >
        <i-mdi-github />
      </Button>
    </a>
  </div>
</template>
