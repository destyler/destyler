---
layout: docs
desc: unstyled component for vue.
---

# Animation

> Animate Destyler Components with CSS keyframes, native Vue Transition or JavaScript animation library of your choice.
>
> Adding animation to Destyler Components should feel similar to any other component, but there are some caveats noted here in regards to exiting animations with JS animation libraries.

## CSS animation

The simplest way to animate Components is with CSS.

You can use CSS animation to animate both mount and unmount phases. The latter is possible because the Destyler Components will suspend unmount while your animation plays out.

<CodePreview :tabs="[
  {value: 'css', label: 'style.css', icon: 'vscode-icons:file-type-css'}
]">

<template #css>

```css
@keyframes fadeIn {
  from {
    opacity: 0;
  }
  to {
    opacity: 1;
  }
}

@keyframes fadeOut {
  from {
    opacity: 1;
  }
  to {
    opacity: 0;
  }
}

.dialog-overlay[data-state="open"],
.dialog-content[data-state="open"] {
  animation: fadeIn 300ms ease-out;
}

.dialog-overlay[data-state="closed"],
.dialog-content[data-state="closed"] {
  animation: fadeOut 300ms ease-in;
}
```

</template>

</CodePreview>

## Vue Transition

Other than using CSS animation, you might prefer to use the native Vue `<Transition>`. Great news! It should be as easy as wrapping component (that has `forceMount` prop), and you are done!

<CodePreview :tabs="[
  {value: 'vue', label: 'index.vue', icon: 'vscode-icons:file-type-vue'}
]">

<template #vue>

```vue
<script setup lang="ts">
import {
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogOverlay,
  DialogPortal,
  DialogRoot,
  DialogTitle,
  DialogTrigger,
} from 'destyler'
</script>

<template>
  <DialogRoot v-model:open="open">
    <DialogTrigger>
      Edit profile
    </DialogTrigger>
    <DialogPortal>
      <Transition name="fade">
        <DialogOverlay />
      </Transition>
      <Transition name="fade">
        <DialogContent>
          <h1>Hello from inside the Dialog!</h1>
          <DialogClose>Close</DialogClose>
        </DialogContent>
      </Transition>
    </DialogPortal>
  </DialogRoot>
</template>

<style>
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.3s ease;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}
</style>
```

</template>

</CodePreview>
