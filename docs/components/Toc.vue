<script setup lang="ts">
import { DestylerLabel } from '@destyler/label/src/label'
</script>

<template>
  <div class="hidden text-sm xl:block">
    <div class="sticky top-16 -mt-10 pt-4">
      <div class="relative overflow-hidden pb-10">
        <div class="h-full w-full rounded-[inherit]">
          <div style="min-width: 100%; display: table;">
            <div class="sticky top-16 -mt-10 h-[calc(100vh-3.5rem)] py-12">
              <div class="space-y-2">
                <p class="font-medium">
                  <DestylerLabel>On This Page</DestylerLabel>
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
