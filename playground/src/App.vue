<script setup lang="ts">
import { DestylerAvatar } from '@destyler/components/avatar/src'
import { DestylerTag } from '@destyler/components/tag/src'
import { DestylerIcon } from '@destyler/components/icon/src'

const checked = ref(false)

function handleClose() {
  console.log('close')
}
</script>

<template>
  <DestylerTag closable @close="handleClose">
    <template #avatar>
      <DestylerAvatar
        src="https://cdnimg103.lizhi.fm/user/2017/02/04/2583325032200238082_160x160.jpg"
      />
    </template>
    爱在西元前
    <template #close>
      <DestylerIcon name="i-carbon-close" />
    </template>
  </DestylerTag>
</template>

<style>

</style>
