<script setup lang="ts">
import { DestylerSplitterGroup, DestylerSplitterPanel, DestylerSplitterResizeHandle, DestylerSplitterRoot } from '../src'
</script>

<template>
  <DestylerSplitterRoot class="w-full h-64 px-8 text-white font-medium text-sm">
    <DestylerSplitterGroup id="splitter-group-1" direction="horizontal">
      <DestylerSplitterPanel id="splitter-group-1-panel-1" :min-size="20" class="bg-dark rounded-xl flex items-center justify-center">
        Panel A
      </DestylerSplitterPanel>
      <DestylerSplitterResizeHandle id="splitter-group-1-resize-handle-1" class="w-2" />
      <DestylerSplitterPanel id="splitter-group-1-panel-2" :min-size="20">
        <DestylerSplitterGroup id="splitter-group-2" direction="vertical">
          <DestylerSplitterPanel id="splitter-group-2-panel-1" :min-size="20" class="bg-dark rounded-xl flex items-center justify-center">
            Panel B
          </DestylerSplitterPanel>
          <DestylerSplitterResizeHandle id="splitter-group-2-resize-handle-1" class="h-2" />
          <DestylerSplitterPanel id="splitter-group-2-panel-2" :min-size="20" class="bg-dark rounded-xl flex items-center justify-center">
            Panel C
          </DestylerSplitterPanel>
        </DestylerSplitterGroup>
      </DestylerSplitterPanel>
    </DestylerSplitterGroup>
  </DestylerSplitterRoot>
</template>
