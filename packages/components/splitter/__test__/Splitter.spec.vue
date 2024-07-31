<script setup lang="ts">
import { SplitterGroup, SplitterPanel, SplitterResizeHandle } from '../src'
</script>

<template>
  <div>
    <SplitterGroup direction="horizontal">
      <SplitterPanel>
        Panel A
      </SplitterPanel>
      <SplitterResizeHandle />
      <SplitterPanel>
        <SplitterGroup direction="vertical">
          <SplitterPanel>
            Panel B1
          </SplitterPanel>
          <SplitterResizeHandle />
          <SplitterPanel>
            Panel B2
          </SplitterPanel>
        </SplitterGroup>
      </SplitterPanel>
      <SplitterResizeHandle />
      <SplitterPanel :max-size="20">
        Panel C
      </SplitterPanel>
    </SplitterGroup>
  </div>
</template>
