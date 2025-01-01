<script setup lang="ts">
import * as dialog from "@destyler/dialog";
import { normalizeProps, useMachine } from "@destyler/vue";
import { computed, Teleport, useId } from "vue";

const [state, send] = useMachine(dialog.machine({
  id: useId(),
  preventScroll: true,
  closeOnEscape: true,
  closeOnInteractOutside: false,
  role:'dialog'
}));
const api = computed(() => dialog.connect(state.value, send, normalizeProps));
</script>

<template>
  <button ref="ref" v-bind="api.getTriggerProps()">Open Dialog</button>
  <Teleport to="body">
    <div v-if="api.open">
      <div v-bind="api.getBackdropProps()" />
      <div v-bind="api.getPositionerProps()">
        <div v-bind="api.getContentProps()">
          <h2 v-bind="api.getTitleProps()">Edit profile</h2>
          <p v-bind="api.getDescriptionProps()">
            Make changes to your profile here. Click save when you are done.
          </p>
          <button v-bind="api.getCloseTriggerProps()">X</button>
          <input placeholder="Enter name..." />
          <button>Save Changes</button>
        </div>
      </div>
    </div>
  </Teleport>
</template>
