<script setup lang="ts">
import {
  DestylerLabel,
  DestylerTabsContent,
  DestylerTabsList,
  DestylerTabsRoot,
  DestylerTabsTrigger,
} from 'destyler'
</script>

<template>
  <DestylerTabsRoot class="w-[400px]" default-value="account">
    <DestylerTabsList class="h-9 items-center justify-center rounded-lg p-1 grid w-full grid-cols-2 bg-#F4F4F5 dark:bg-#27272A p-1 text-#71717A dark:text-#A1A1AA">
      <DestylerTabsTrigger
        class="inline-flex items-center justify-center whitespace-nowrap rounded-md px-3 py-1 text-sm font-medium ring-offset-#FFFFFF dark:ring-offset-#09090B transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 data-[state=active]:bg-#FFFFFF dark:data-[state=active]:bg-#09090B data-[state=active]:text-#09090B dark:data-[state=active]:text-#FAFAFA data-[state=active]:shadow"
        value="account"
      >
        Account
      </DestylerTabsTrigger>
      <DestylerTabsTrigger class="inline-flex items-center justify-center whitespace-nowrap rounded-md px-3 py-1 text-sm font-medium ring-offset-#FFFFFF dark:ring-offset-#09090B transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 data-[state=active]:bg-#FFFFFF dark:data-[state=active]:bg-#09090B data-[state=active]:text-#09090B dark:data-[state=active]:text-#FAFAFA data-[state=active]:shadow" value="password">
        Password
      </DestylerTabsTrigger>
    </DestylerTabsList>
    <DestylerTabsContent class="mt-2 ring-offset-#FFFFFF dark:ring-offset-#09090B focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2" value="account">
      <div class="rounded-xl border border-black border-op-9 dark:border-white dark:border-op-9 dark:bg-#09090B bg-#FFFFFF dark:text-#FAFAFA text-#09090B shadow">
        <div class="flex flex-col space-y-1.5 p-6">
          <h3 class="font-semibold leading-none tracking-tight">
            Account
          </h3>
          <p class="text-sm dark:text-#A1A1AA text-#71717A">
            Make changes to your account here. Click save when you're done.
          </p>
        </div>
        <div class="p-6 pt-0 space-y-2">
          <div class="space-y-1">
            <DestylerLabel
              class="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
              html-for="name"
            >
              Name
            </DestylerLabel>
            <input
              id="name"
              class="flex h-9 w-full rounded-md border dark:border-#27272A border-#E4E4E7 bg-transparent px-3 py-1 text-sm shadow-sm transition-colors file:border-0 file:bg-transparent file:text-sm file:font-medium dark:placeholder:text-#A1A1AA placeholder:text-#71717A focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50"
            >
          </div>
          <div class="space-y-1">
            <DestylerLabel
              class="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
              html-for="username"
            >
              Username
            </DestylerLabel>
            <input
              id="username"
              class="flex h-9 w-full rounded-md border dark:border-#27272A border-#E4E4E7 bg-transparent px-3 py-1 text-sm shadow-sm transition-colors file:border-0 file:bg-transparent file:text-sm file:font-medium dark:placeholder:text-#A1A1AA placeholder:text-#71717A focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50"
            >
          </div>
        </div>
        <div class="flex items-center p-6 pt-0 justify-end">
          <DestylerButton class="inline-flex items-center justify-center whitespace-nowrap rounded-md text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-1 disabled:pointer-events-none disabled:opacity-50 dark:bg-#FAFAFA dark:hover:bg-#FAFAFA/90 bg-#18181B hover:bg-#18181B/90 dark:text-#18181B text-#FAFAFA shadow h-9 px-4 py-2 cursor-pointer">
            Save Change
          </DestylerButton>
        </div>
      </div>
    </DestylerTabsContent>
    <DestylerTabsContent class="mt-2 ring-offset-#FFFFFF dark:ring-offset-#09090B focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2" value="password">
      <div class="rounded-xl border border-black border-op-9 dark:border-white dark:border-op-9 dark:bg-#09090B bg-#FFFFFF dark:text-#FAFAFA text-#09090B shadow">
        <div class="flex flex-col space-y-1.5 p-6">
          <h3 class="font-semibold leading-none tracking-tight">
            Password
          </h3>
          <p class="text-sm dark:text-#A1A1AA text-#71717A">
            Change your password here. After saving, you'll be logged out.
          </p>
        </div>
        <div class="p-6 pt-0 space-y-2">
          <div class="space-y-1">
            <DestylerLabel
              class="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
              html-for="name"
            >
              Current password
            </DestylerLabel>
            <input
              id="current-password"
              class="flex h-9 w-full rounded-md border dark:border-#27272A border-#E4E4E7 bg-transparent px-3 py-1 text-sm shadow-sm transition-colors file:border-0 file:bg-transparent file:text-sm file:font-medium dark:placeholder:text-#A1A1AA placeholder:text-#71717A focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50"
            >
          </div>
          <div class="space-y-1">
            <DestylerLabel
              class="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
              html-for="username"
            >
              New password
            </DestylerLabel>
            <input
              id="new-password"
              class="flex h-9 w-full rounded-md border dark:border-#27272A border-#E4E4E7 bg-transparent px-3 py-1 text-sm shadow-sm transition-colors file:border-0 file:bg-transparent file:text-sm file:font-medium dark:placeholder:text-#A1A1AA placeholder:text-#71717A focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50"
            >
          </div>
        </div>
        <div class="flex items-center p-6 pt-0 justify-end">
          <DestylerButton class="inline-flex items-center justify-center whitespace-nowrap rounded-md text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-1 disabled:pointer-events-none disabled:opacity-50 dark:bg-#FAFAFA dark:hover:bg-#FAFAFA/90 bg-#18181B hover:bg-#18181B/90 dark:text-#18181B text-#FAFAFA shadow h-9 px-4 py-2 cursor-pointer">
            Save Password
          </DestylerButton>
        </div>
      </div>
    </DestylerTabsContent>
  </DestylerTabsRoot>
</template>
