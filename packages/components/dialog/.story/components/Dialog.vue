<script setup lang="ts">
import { ref } from 'vue'
import { Icon } from '@destyler/icon'
import {
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogOverlay,
  DialogPortal,
  DialogRoot,
  DialogTitle,
  DialogTrigger,
} from '../../src'

const dialogOpen = ref(false)
</script>

<template>
  <DialogRoot v-model:open="dialogOpen">
    <DialogTrigger
      class="text-green11 shadow-blackA7 hover:bg-mauve3 inline-flex h-[35px] items-center justify-center rounded-[4px] bg-white px-[15px] font-medium leading-none shadow-[0_2px_10px] focus:shadow-[0_0_0_2px] focus:shadow-black focus:outline-none"
    >
      Edit profile
    </DialogTrigger>
    <DialogPortal>
      <Transition name="fade">
        <DialogOverlay
          class="bg-blackA9 fixed inset-0"
        />
      </Transition>
      <Transition name="fade">
        <DialogContent
          :is-escape-key-down-default="true"
          class="fixed top-[50%] left-[50%] max-h-[85vh] w-[90vw] max-w-[450px] translate-x-[-50%] translate-y-[-50%] rounded-[6px] bg-white p-[25px] shadow-[hsl(206_22%_7%_/_35%)_0px_10px_38px_-10px,_hsl(206_22%_7%_/_20%)_0px_10px_20px_-15px] focus:outline-none"
          @pointer-down-outside.prevent
        >
          <DialogTitle class="text-mauve12 m-0 text-[17px] font-medium">
            Edit profile
          </DialogTitle>
          <DialogDescription
            class="text-mauve11 mt-[10px] mb-5 text-[15px] leading-normal"
          >
            Make changes to your profile here. Click save when you're done.
          </DialogDescription>
          <fieldset class="mb-[15px] flex items-center gap-5">
            <label
              class="text-green11 w-[90px] text-right text-[15px]"
              for="name"
            >
              Name
            </label>
            <input
              id="name"
              class="text-green11 shadow-green7 focus:shadow-green8 inline-flex h-[35px] w-full flex-1 items-center justify-center rounded-[4px] px-[10px] text-[15px] leading-none shadow-[0_0_0_1px] outline-none focus:shadow-[0_0_0_2px]"
              defaultValue="Elone Hoo"
            >
          </fieldset>
          <fieldset class="mb-[15px] flex items-center gap-5">
            <label
              class="text-green11 w-[90px] text-right text-[15px]"
              for="username"
            >
              Username
            </label>
            <input
              id="username"
              class="text-green11 shadow-green7 focus:shadow-green8 inline-flex h-[35px] w-full flex-1 items-center justify-center rounded-[4px] px-[10px] text-[15px] leading-none shadow-[0_0_0_1px] outline-none focus:shadow-[0_0_0_2px]"
              defaultValue="@elonehoo"
            >
          </fieldset>
          <div class="mt-[25px] flex justify-end">
            <DialogClose as-child>
              <button
                class="bg-green4 text-green11 hover:bg-green5 focus:shadow-green7 inline-flex h-[35px] items-center justify-center rounded-[4px] px-[15px] font-medium leading-none focus:shadow-[0_0_0_2px] focus:outline-none"
              >
                Save changes
              </button>
            </DialogClose>
          </div>
          <DialogClose
            class="text-green11 hover:bg-green4 focus:shadow-green7 absolute top-[10px] right-[10px] inline-flex h-[25px] w-[25px] appearance-none items-center justify-center rounded-full focus:shadow-[0_0_0_2px] focus:outline-none"
            aria-label="Close"
          >
            <Icon name="lucide:x" />
          </DialogClose>
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
