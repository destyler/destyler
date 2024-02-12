<script setup lang="ts">
import { DestylerTabsContent, DestylerTabsIndicator, DestylerTabsList, DestylerTabsRoot, DestylerTabsTrigger } from '../src'
</script>

<template>
  <DestylerTabsRoot class="flex flex-col w-full sm:w-[300px] shadow-[0_2px_10px] shadow-#000000" default-value="tab1">
    <DestylerTabsList class="relative shrink-0 flex border-b border-#3C393F" aria-label="Manage your account">
      <DestylerTabsIndicator class="absolute px-8 left-0 h-[2px] bottom-0 w-[--radix-tabs-indicator-size] translate-x-[--radix-tabs-indicator-position] rounded-full transition-[width,transform] duration-300">
        <div class="bg-#3E7949 w-full h-full" />
      </DestylerTabsIndicator>
      <DestylerTabsTrigger
        class="bg-white px-5 h-[45px] flex-1 flex items-center justify-center text-[15px] leading-none text-#B5B2BC select-none  rounded-tl-md  hover:text-#71D083 data-[state=active]:text-#71D083 outline-none cursor-default"
        value="tab1"
      >
        Account
      </DestylerTabsTrigger>
      <DestylerTabsTrigger
        class="bg-white px-5 h-[45px] flex-1 flex items-center justify-center text-[15px] leading-none text-#B5B2BC select-none  rounded-tr-md hover:text-#71D083 data-[state=active]:text-#71D083 outline-none cursor-default"
        value="tab2"
      >
        Password
      </DestylerTabsTrigger>
    </DestylerTabsList>
    <DestylerTabsContent
      class="grow p-5 bg-white rounded-b-md outline-none focus:shadow-[0_0_0_2px] focus:shadow-black"
      value="tab1"
    >
      <p class="mb-5 !mt-0 text-#B5B2BC text-[15px] !leading-normal">
        Make changes to your account here. Click save when you're done.
      </p>
      <fieldset class="mb-[15px] w-full flex flex-col justify-start">
        <label class="text-[13px] leading-none mb-2.5 text-#B1F1CB block" for="name"> Name </label>
        <input
          id="name"
          class="grow shrink-0 rounded px-2.5 text-[15px] leading-none text-#71D083 shadow-[0_0_0_1px] shadow-#28684A h-[35px] focus:shadow-[0_0_0_2px] focus:shadow-green8 outline-none"
          value="Pedro Duarte"
        >
      </fieldset>
      <fieldset class="mb-[15px] w-full flex flex-col justify-start">
        <label class="text-[13px] leading-none mb-2.5 text-#B1F1CB block" for="username"> Username </label>
        <input
          id="username"
          class="grow shrink-0 rounded px-2.5 text-[15px] leading-none text-#71D083 shadow-[0_0_0_1px] shadow-#28684A h-[35px] focus:shadow-[0_0_0_2px] focus:shadow-green8 outline-none"
          value="@peduarte"
        >
      </fieldset>
      <div class="flex justify-end mt-5">
        <button
          class="inline-flex items-center justify-center rounded px-[15px] text-[15px] leading-none font-medium h-[35px] bg-green4 text-green11 hover:bg-green5 focus:shadow-[0_0_0_2px] focus:shadow-#28684A outline-none cursor-default"
        >
          Save changes
        </button>
      </div>
    </DestylerTabsContent>
    <DestylerTabsContent
      class="grow p-5 bg-white rounded-b-md outline-none focus:shadow-[0_0_0_2px] focus:shadow-black"
      value="tab2"
    >
      <p class="mb-5 !mt-0 text-#B5B2BC text-[15px] !leading-normal">
        Change your password here. After saving, you'll be logged out.
      </p>
      <fieldset class="mb-[15px] w-full flex flex-col justify-start">
        <label class="text-[13px] leading-none mb-2.5 text-#B1F1CB block" for="currentPassword">
          Current password
        </label>
        <input
          id="currentPassword"
          class="grow shrink-0 rounded px-2.5 text-[15px] leading-none text-#71D083 shadow-[0_0_0_1px] shadow-#28684A h-[35px] focus:shadow-[0_0_0_2px] focus:shadow-green8 outline-none"
          type="password"
        >
      </fieldset>
      <fieldset class="mb-[15px] w-full flex flex-col justify-start">
        <label class="text-[13px] leading-none mb-2.5 text-#B1F1CB block" for="newPassword"> New password </label>
        <input
          id="newPassword"
          class="grow shrink-0 rounded px-2.5 text-[15px] leading-none text-#71D083 shadow-[0_0_0_1px] shadow-#28684A h-[35px] focus:shadow-[0_0_0_2px] focus:shadow-green8 outline-none"
          type="password"
        >
      </fieldset>
      <fieldset class="mb-[15px] w-full flex flex-col justify-start">
        <label class="text-[13px] leading-none mb-2.5 text-#B1F1CB block" for="confirmPassword">
          Confirm password
        </label>
        <input
          id="confirmPassword"
          class="grow shrink-0 rounded px-2.5 text-[15px] leading-none text-#71D083 shadow-[0_0_0_1px] shadow-#28684A h-[35px] focus:shadow-[0_0_0_2px] focus:shadow-green8 outline-none"
          type="password"
        >
      </fieldset>
      <div class="flex justify-end mt-5">
        <button
          class="inline-flex items-center justify-center rounded px-[15px] text-[15px] leading-none font-medium h-[35px] bg-green4 text-#3DD68C hover:bg-#174933 focus:shadow-[0_0_0_2px] focus:shadow-#28684A outline-none cursor-default"
        >
          Change password
        </button>
      </div>
    </DestylerTabsContent>
  </DestylerTabsRoot>
</template>
