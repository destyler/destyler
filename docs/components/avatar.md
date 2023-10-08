# Avatar

<script setup>
import Avatar from '../.vitepress/components/Avatar.vue'
</script>

<Showcase title="avatar" >
  <Avatar />
</Showcase>

```vue
<script setup lang="ts">

</script>

<template>
  <div class="flex flex-wrap gap-4">
    <DestylerAvatar
      class="w-8 h-8"
      src="https://github.com/elonehoo.png"
    />

    <DestylerAvatar
      class="w-8 h-8 border-1px border-#3c3c431f dark:border-#5454547a rounded-1/2 flex justify-center items-center bg-white dark:bg-black"
      fallback="E"
    />

    <DestylerAvatar
      class="w-8 h-8 border-1px border-#3c3c431f dark:border-#5454547a rounded-1/2 flex justify-center items-center bg-white dark:bg-black"
      fallback="H"
    />
  </div>
</template>

<style scoped>
[destyler="avatar-root"]{
  @apply w-8 h-8;
}

[destyler="avatar-root"] :deep([destyler="avatar-img"]){
  @apply rounded-1/2;
}
</style>
```
