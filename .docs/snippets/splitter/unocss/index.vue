<script setup lang="ts">
import {
  SplitterGroup,
  SplitterPanel,
  SplitterResizeHandle,
  SplitterRoot,
} from '@destyler/splitter'
</script>

<template>
  <SplitterRoot
    w="full"
    h="64"
    font="medium"
    text="sm primary"
    bg="white dark:#09090b"
    border="~ border"
    rounded="xl"
  >
    <SplitterGroup
      id="splitter-group-1"
      direction="horizontal"
    >
      <SplitterPanel
        id="splitter-group-1-panel-1"
        :min-size="20"
        flex="~"
        items="center"
        justify="center"
      >
        Panel A
      </SplitterPanel>
      <SplitterResizeHandle
        id="splitter-group-1-resize-handle-1"
        w="px"
        bg="border"
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
            flex="~"
            items="center"
            justify="center"
          >
            Panel B
          </SplitterPanel>
          <SplitterResizeHandle
            id="splitter-group-2-resize-handle-1"
            h="px"
            bg="border"
          />
          <SplitterPanel
            id="splitter-group-2-panel-2"
            :min-size="20"
            flex="~"
            items="center"
            justify="center"
          >
            Panel C
          </SplitterPanel>
        </SplitterGroup>
      </SplitterPanel>
    </SplitterGroup>
  </SplitterRoot>
</template>
