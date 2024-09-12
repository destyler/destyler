<script setup lang="ts">
import {
  SplitterGroup,
  SplitterPanel,
  SplitterResizeHandle,
  SplitterRoot,
} from '@destyler/splitter'
</script>

<template>
  <SplitterRoot class="w-full h-64 font-medium text-sm dark:bg-#09090b bg-#ffffff text-primary border border-border rounded-xl">
    <SplitterGroup
      id="splitter-group-1"
      direction="horizontal"
    >
      <SplitterPanel
        id="splitter-group-1-panel-1"
        :min-size="20"
        class="flex items-center justify-center"
      >
        Panel A
      </SplitterPanel>
      <SplitterResizeHandle
        id="splitter-group-1-resize-handle-1"
        class="w-px bg-border"
      />
      <SplitterPanel
        id="splitter-group-1-panel-2"
        :min-size="20"
      >
        <SplitterGroup
          id="splitter-group-2"
          direction="vertical"
        >
          <SplitterPanel
            id="splitter-group-2-panel-1"
            :min-size="20"
            class="flex items-center justify-center"
          >
            Panel B
          </SplitterPanel>
          <SplitterResizeHandle
            id="splitter-group-2-resize-handle-1"
            class="h-px bg-border"
          />
          <SplitterPanel
            id="splitter-group-2-panel-2"
            :min-size="20"
            class="flex items-center justify-center"
          >
            Panel C
          </SplitterPanel>
        </SplitterGroup>
      </SplitterPanel>
    </SplitterGroup>
  </SplitterRoot>
</template>
