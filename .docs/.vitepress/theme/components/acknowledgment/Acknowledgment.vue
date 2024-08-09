<script setup lang="ts">
import { VPTeamMembers } from 'vitepress/theme'

const members = [
  {
    avatar: '/credits/radix-ui.png',
    name: 'Radix UI',
    title: 'An open-source UI component library for building high-quality, accessible design systems and web apps.',
    links: [
      { icon: 'github', link: 'https://github.com/radix-ui' },
      { icon: 'twitter', link: 'https://x.com/radix_ui' },
    ],
  },
  {
    avatar: '/credits/naive-ui.svg',
    name: 'Naive UI',
    title: 'A Vue 3 Component Library. Fairly Complete. Theme Customizable. Uses TypeScript. Fast.',
    links: [
      { icon: 'github', link: 'https://github.com/tusen-ai/naive-ui' },
    ],
  },
  {
    avatar: '/credits/radix-vue.svg',
    name: 'Radix Vue',
    title: 'Unstyled, accessible components for building high‑quality design systems and web apps in Vue.',
    links: [
      { icon: 'github', link: 'https://github.com/radix-vue/radix-vue' },
      { icon: 'discord', link: 'https://chat.radix-vue.com/' },
    ],
  },
  {
    avatar: '/credits/kobalte.png',
    name: 'Kobalte',
    title: 'A UI toolkit for building accessible web apps and design systems with SolidJS.',
    links: [
      { icon: 'github', link: 'https://github.com/kobaltedev/kobalte' },
    ],
  },
  {
    avatar: '/credits/headless-ui.png',
    name: 'Headless UI',
    title: 'A set of completely unstyled, fully accessible UI components, designed to integrate beautifully with Tailwind CSS.',
    links: [
      { icon: 'github', link: 'https://github.com/tailwindlabs/headlessui' },
    ],
  },
  {
    avatar: '/credits/melt-ui.png',
    name: 'Melt UI',
    title: 'A set of completely unstyled, fully accessible UI components, designed to integrate beautifully with Tailwind CSS.',
    links: [
      { icon: 'github', link: 'https://github.com/melt-ui/melt-ui' },
      { icon: 'discord', link: 'https://melt-ui.com/discord' },
    ],
  },
  {
    avatar: '/credits/vueuse.png',
    name: 'VueUse',
    title: 'Collection of essential Vue Composition Utilities for Vue 2 and 3',
    links: [
      { icon: 'github', link: 'https://github.com/vueuse/vueuse' },
      { icon: 'twitter', link: 'https://github.com/vueuse/vueuse' },
      { icon: 'discord', link: 'https://chat.antfu.me/' },
    ],
  },
  {
    avatar: '/credits/anu.svg',
    name: 'Anu',
    title: 'DX focused utility based vue component library',
    links: [
      { icon: 'github', link: 'https://github.com/jd-solanki/anu' },
      { icon: 'discord', link: 'https://discord.gg/8MTQuasmZf' },
    ],
  },
  {
    avatar: '/credits/floating-ui.png',
    name: 'Floating UI',
    title: 'A JavaScript library to position floating elements and create interactions for them.',
    links: [
      { icon: 'github', link: 'https://github.com/floating-ui/floating-ui' },
    ],
  },
  {
    avatar: '/credits/primevue.png',
    name: 'primevue',
    title: 'A JavaScript library to position floating elements and create interactions for them.',
    links: [
      { icon: 'github', link: 'https://github.com/primefaces/primevue' },
      { icon: 'twitter', link: 'https://x.com/primevue' },
      { icon: 'discord', link: 'https://discord.gg/gzKFYnpmCY' },
    ],
  },
  {
    avatar: '/credits/shadcn-ui.png',
    name: 'Shadcn UI',
    title: 'Beautifully designed components that you can copy and paste into your apps.',
    links: [
      { icon: 'github', link: 'https://github.com/shadcn-ui/ui' },
      { icon: 'twitter', link: 'https://x.com/shadcn' },
    ],
  },
  {
    avatar: '/credits/nuxt-ui.png',
    name: 'Nuxt UI',
    title: 'A UI Library for Modern Web Apps, powered by Vue & Tailwind CSS.',
    links: [
      { icon: 'github', link: 'https://github.com/nuxt/ui' },
      { icon: 'twitter', link: 'https://x.com/nuxt_js' },
      { icon: 'discord', link: 'https://chat.nuxt.dev/' },
    ],
  },
]
</script>

<template>
  <VPTeamMembers size="small" :members="members" />
</template>

<style scoped>
.VPTeamMembers :deep(.VPSocialLink){
  border-bottom: none;
}
</style>
