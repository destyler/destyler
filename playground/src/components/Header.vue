<script setup lang="ts">
import {
  getSupportedEpVersions,
  getSupportedTSVersions,
  getSupportedVueVersions,
} from '@/utils/dependency'
import type { Ref } from 'vue'
import type { ReplStore, VersionKey } from '@/composables/store'
import {
  DestylerInfoRoot,
  DestylerButton,
  DestylerIcon,
  DestylerSelectContent,
  DestylerSelectGroup,
  DestylerSelectIcon,
  DestylerSelectItem,
  DestylerSelectItemIndicator,
  DestylerSelectItemText,
  DestylerSelectRoot,
  DestylerSelectScrollDownButton,
  DestylerSelectScrollUpButton,
  DestylerSelectTrigger,
  DestylerSelectValue,
  DestylerSelectViewport,
  DestylerPopoverContent,
  DestylerPopoverPortal,
  DestylerPopoverRoot,
  DestylerPopoverTrigger,
} from 'destyler'

const appVersion = import.meta.env.APP_VERSION
const replVersion = import.meta.env.REPL_VERSION

const emit = defineEmits<{
  (e: 'refresh'): void
}>()
const nightly = ref(false)
const dark = useDark()
const toggleDark = useToggle(dark)

const { store } = defineProps<{
  store: ReplStore
}>()

interface Version {
  text: string
  published: Ref<string[]>
  active: string
}

const versions = reactive<Record<VersionKey, Version>>({
  destyler: {
    text: 'Destyler',
    published: getSupportedEpVersions(nightly),
    active: store.versions.destyler,
  },
  vue: {
    text: 'Vue',
    published: getSupportedVueVersions(),
    active: store.versions.vue,
  },
  typescript: {
    text: 'TypeScript',
    published: getSupportedTSVersions(),
    active: store.versions.typescript,
  },
})

async function setVersion(key: VersionKey, v: string) {
  versions[key].active = `loading...`
  await store.setVersion(key, v)
  versions[key].active = v
}

const toggleNightly = () => {
  store.toggleNightly(nightly.value)
  setVersion('destyler', 'latest')
}

async function copyLink() {
  await navigator.clipboard.writeText(location.href)
  ElMessage.success('Sharable URL has been copied to clipboard.')
}

function refreshView() {
  emit('refresh')
}
</script>

<template>
  <nav>
    <div leading="[var(--nav-height)]" m-0 flex items-center font-medium>
      <Logo/>
      <div flex="~ gap-1" m="l-2" items-center lt-sm-hidden>
        <div text-xl>Destyler Playground</div>
        <div class="flex items-end gap-1">
          <DestylerInfoRoot
          class="text-sm px-2.5 py-1.5 inline-flex items-center font-medium rounded-md text-xs bg-#18181B dark:bg-#FAFAFA text-#FAFAFA dark:text-#18181B focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2"
        >
          v{{ appVersion }}, repl v{{ replVersion }}
        </DestylerInfoRoot>
        <DestylerInfoRoot
          v-if="store.pr"
          class="text-sm inline-flex items-center font-medium rounded-md text-xs px-2 py-1 bg-#18181B dark:bg-#FAFAFA text-#FAFAFA dark:text-#18181B focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2"
        >
          PR {{ store.pr }}
        </DestylerInfoRoot>
        </div>
      </div>
    </div>

    <div flex="~ gap-2" items-center>
      <div
        v-for="(v, key) of versions"
        :key="key"
        flex="~ gap-2"
        items-center
        lt-lg-hidden
      >
        <span>{{ v.text }}:</span>
        <DestylerSelectRoot v-model="v.active" :default-open="false">
          <DestylerSelectTrigger
            class="flex h-9 w-[180px] items-center justify-between whitespace-nowrap rounded-md border border-#E4E4E7 dark:border-#27272A bg-transparent px-3 py-2 text-sm shadow-sm ring-white dark:ring-#09090B placeholder:text-#A1A1AA focus:outline-none focus:ring-1 disabled:cursor-not-allowed disabled:opacity-50 [&>span]:line-clamp-1"
          >
            <DestylerSelectValue placeholder="Select a fruit">
              {{ v.active }}
            </DestylerSelectValue>
            <DestylerSelectIcon :as-child="true">
              <DestylerIcon name="radix-icons:caret-sort" class="w-4 h-4 op-50" />
            </DestylerSelectIcon>
          </DestylerSelectTrigger>
          <DestylerSelectContent :side-offset="4" :autocapitalize="true" position="popper" class="relative z-50 max-h-96 min-w-[8rem] overflow-hidden rounded-md border border-#E4E4E7 dark:border-#27272A bg-white dark:bg-#09090B text-#18181B dark:text-#FAFAFA shadow-md data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95 data-[side=bottom]:slide-in-from-top-2 data-[side=left]:slide-in-from-right-2 data-[side=right]:slide-in-from-left-2 data-[side=top]:slide-in-from-bottom-2 ">
            <DestylerSelectScrollUpButton class="flex cursor-default items-center justify-center py-1">
              <DestylerIcon name="radix-icons:chevron-up" />
            </DestylerSelectScrollUpButton>
            <DestylerSelectViewport
              class="p-1 w-full"
              style="height: var(--destyler_select_trigger_height); min-width: var(--destyler_select_trigger_width);"
            >
              <DestylerSelectGroup>
                <DestylerSelectItem
                  v-for="option in v.published"
                  :key="option"
                  :value="option"
                  class="relative cursor-pointer flex w-full cursor-default select-none items-center rounded-sm py-1.5 pl-2 pr-8 text-sm outline-none focus:bg-#F4F4F5 focus:text-#18181B dark:focus:bg-#27272A dark:focus:text-#FAFAFA data-[disabled]:pointer-events-none data-[disabled]:opacity-50"
                >
                  <span class="absolute right-2 flex h-3.5 w-3.5 items-center justify-center">
                    <DestylerSelectItemIndicator>
                      <DestylerIcon name="radix-icons:check" class="w-4 h-4" />
                    </DestylerSelectItemIndicator>
                  </span>
                  <DestylerSelectItemText>
                    {{ option }}
                  </DestylerSelectItemText>
                </DestylerSelectItem>
              </DestylerSelectGroup>
            </DestylerSelectViewport>
            <DestylerSelectScrollDownButton class="flex cursor-default items-center justify-center py-1">
              <DestylerIcon name="radix-icons:chevron-down" />
            </DestylerSelectScrollDownButton>
          </DestylerSelectContent>
        </DestylerSelectRoot>

      </div>

      <div flex="~ gap-4" text-lg>
        <DestylerButton i-ri-refresh-line hover:color-primary @click="refreshView" />
        <DestylerButton i-ri-share-line hover:color-primary @click="copyLink" />
        <DestylerButton
          i-ri-sun-line
          dark:i-ri-moon-line
          hover:color-primary
          @click="toggleDark()"
        />
        <DestylerButton
          as="a"
          href="https://github.com/destyler/destyler"
          target="_blank"
          flex
          hover:color-primary
        >
          <DestylerButton title="View on GitHub" i-ri-github-fill />
        </DestylerButton>

      </div>
    </div>
  </nav>
</template>

<style lang="scss">
nav {
  --bg: #fff;
  --bg-light: #fff;
  --border: #ddd;

  --at-apply: 'box-border flex justify-between px-4 z-999 relative';

  height: var(--nav-height);
  background-color: var(--bg);
  color: #000;
  border-bottom: 1px solid var(--border);
}

.dark nav {
  --bg: #1a1a1a;
  --bg-light: #242424;
  --border: #383838;

  --at-apply: 'shadow-none';
  color: #FFF;
  border-bottom: 1px solid var(--border);
}
</style>
