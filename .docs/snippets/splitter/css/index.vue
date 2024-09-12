<script setup lang="ts">
import {
  SplitterGroup,
  SplitterPanel,
  SplitterResizeHandle,
  SplitterRoot,
} from '@destyler/splitter'
</script>

<template>
  <SplitterRoot class="splitter-root">
    <SplitterGroup
      id="splitter-group-1"
      direction="horizontal"
    >
      <SplitterPanel
        id="splitter-group-1-panel-1"
        :min-size="20"
        class="panel"
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
            class="panel"
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
            class="panel"
          >
            Panel C
          </SplitterPanel>
        </SplitterGroup>
      </SplitterPanel>
    </SplitterGroup>
  </SplitterRoot>
</template>
