<script setup lang="ts">
import { computed, ref } from 'vue'
import { Pane, Splitpanes } from 'splitpanes'
import { Hako } from 'vue-hako'
import { onShouldUpdateContent, orchestrator } from '~/orchestrator'
import sizes from '~/data/screen-sizes.json'

const initialScript = ref('')
const initialTemplate = ref('')
const initialStyle = ref('')
const size = ref<keyof typeof sizes>('Default')
const enabled = computed(() => size.value === 'Default')
const width = computed(() => sizes[size.value][0])
const height = computed(() => sizes[size.value][1])

onShouldUpdateContent(() => {
  if (orchestrator.activeFile) {
    initialScript.value = orchestrator.activeFile?.script
    initialTemplate.value = orchestrator.activeFile?.template
    initialStyle.value = orchestrator.activeFile?.style
  }
})

function onContentChanged(source: string, content: string) {
  if (orchestrator.activeFile) {
    if (source === 'script')
      orchestrator.activeFile.script = content
    else if (source === 'template')
      orchestrator.activeFile.template = content
    else if (source === 'css')
      orchestrator.activeFile.style = content
  }
}
</script>

<template>
  <Splitpanes class="default-theme">
    <Pane>
      <div class="h-full flex flex-col">
        <TabBar />
        <Splitpanes class="default-theme editors-height" horizontal>
          <Pane>
            <Container title="Script Setup" class="rounded-b-md" no-overflow no-rounding>
              <template #default>
                <Editor
                  language="javascript"
                  :value="initialScript"
                  @change="content => onContentChanged('script', content)"
                />
              </template>
            </Container>
          </Pane>
          <Pane>
            <Container title="Template" class="border-1 border-white" no-overflow>
              <template #default>
                <Editor
                  language="html"
                  :value="initialTemplate"
                  @change="content => onContentChanged('template', content)"
                />
              </template>
            </Container>
          </Pane>
          <Pane>
            <Container title="Style" class="border-1 border-white" no-overflow>
              <template #default>
                <Editor
                  language="css"
                  :value="initialStyle"
                  @change="content => onContentChanged('css', content)"
                />
              </template>
            </Container>
          </Pane>
        </Splitpanes>
      </div>
    </Pane>
    <Pane>
      <Splitpanes horizontal class="default-theme">
        <Pane>
          <Container title="Output">
            <template #controls>
              <Select v-model="size">
                <template #default="{ value }">
                  <i-carbon-devices />
                  <span>
                    {{ value }}
                  </span>
                </template>
                <template #items>
                  <SelectItem v-for="(_, index) in sizes" :key="index" :value="index">
                    {{ index }}
                  </SelectItem>
                </template>
              </Select>
            </template>
            <template #default>
              <div h="full" :class="{ 'p-8 bg-light-700 dark:bg-dark-300': !enabled }">
                <Hako
                  h="full"
                  w="full"
                  :width="width"
                  :height="height"
                  :disable-scaling="enabled"
                >
                  <Preview shadow="lg" bg="dark:dark-700 light-100" />
                </Hako>
              </div>
            </template>
          </Container>
        </Pane>
        <Pane size="25">
          <Container title="Console">
            <Console />
          </Container>
        </Pane>
      </Splitpanes>
    </Pane>
  </Splitpanes>
</template>
