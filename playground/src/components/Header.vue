<script setup lang="ts">
import {
  getSupportedEpVersions,
  getSupportedTSVersions,
  getSupportedVueVersions,
} from '@/utils/dependency'
import type { Ref } from 'vue'
import type { ReplStore, VersionKey } from '@/composables/store'
import {DestylerInfoRoot, DestylerButton} from 'destyler'

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
  elementPlus: {
    text: 'Destyler',
    published: getSupportedEpVersions(nightly),
    active: store.versions.elementPlus,
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
  setVersion('elementPlus', 'latest')
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
        <el-select
          :model-value="v.active"
          size="small"
          fit-input-width
          w-36
          @update:model-value="setVersion(key, $event)"
        >
          <el-option v-for="ver of v.published" :key="ver" :value="ver">
            {{ ver }}
          </el-option>
        </el-select>
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

        <el-popover trigger="click" width="300px">
          <Settings />
          <template #reference>
            <button i-ri:settings-line hover:color-primary />
          </template>
        </el-popover>
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
  box-shadow: 0 0 6px var(--el-color-primary);

  .el-select {
    width: 140px;
  }
}

.dark nav {
  --bg: #1a1a1a;
  --bg-light: #242424;
  --border: #383838;

  --at-apply: 'shadow-none';
  border-bottom: 1px solid var(--border);
}
</style>
