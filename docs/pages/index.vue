<script setup lang="ts">
import { DestylerButton } from '@destyler/button/src/button'
import { version } from '../../package.json'

const colorMode = useColorMode()

function toggleTheme() {
  colorMode.preference = colorMode.preference === 'light' ? 'dark' : 'light'
}
</script>

<template>
  <div class="relative flex flex-col h-[100vh] items-center justify-center bg-white dark:bg-black transition-bg">
    <div class="absolute inset-0 overflow-hidden">
      <div class="jumbo absolute -inset-[10px] opacity-50" />
    </div>
    <h1 class="relative flex items-center text-5xl font-bold text-gray-800 dark:text-white dark:opacity-80 transition-colors">
      Destyler
      <span class="ml-1.5 rounded-xl bg-current p-2 text-[0.5em] leading-none">
        <span class="text-white dark:text-black">{{ version }}</span>
      </span>
    </h1>
    <div class="mt-4">
      <DestylerButton
        class="px-3 py-1 border border-stone-200 rounded-full drop-shadow-sm text-sm text-stone-800 dark:text-white bg-white/40 dark:bg-black/40 backdrop-blur-lg hover:border-stone-300 transition-colors dark:border-stone-500 dark:hover:border-stone-400 mr-2"
      >
        Get Started
      </DestylerButton>
      <DestylerButton
        class="px-3 py-1 border border-stone-200 rounded-full drop-shadow-sm text-sm text-stone-800 dark:text-white bg-white/40 dark:bg-black/40 backdrop-blur-lg hover:border-stone-300 transition-colors dark:border-stone-500 dark:hover:border-stone-400"
        @click="toggleTheme()"
      >
        Toggle Theme
      </DestylerButton>
    </div>
  </div>
</template>

<style scoped>
@keyframes jumbo {
    from {
        background-position: 50% 50%, 50% 50%;
    }
    to {
        background-position: 350% 50%, 350% 50%;
    }
}

.jumbo {
    --stripes: repeating-linear-gradient(
        100deg,
        #fff 0%,
        #fff 7%,
        transparent 10%,
        transparent 12%,
        #fff 16%
    );
    --stripesDark: repeating-linear-gradient(
        100deg,
        #000 0%,
        #000 7%,
        transparent 10%,
        transparent 12%,
        #000 16%
    );
    --rainbow: repeating-linear-gradient(
        100deg,
        #60a5fa 10%,
        #e879f9 15%,
        #60a5fa 20%,
        #5eead4 25%,
        #60a5fa 30%
    );
    background-image: var(--stripes), var(--rainbow);
    background-size: 300%, 200%;
    background-position: 50% 50%, 50% 50%;

    filter: blur(10px) invert(100%);

    mask-image: radial-gradient(ellipse at 100% 0%, black 40%, transparent 70%);

    pointer-events: none;
}

.jumbo::after {
    content: "";
    position: absolute;
    inset: 0;
    background-image: var(--stripes), var(--rainbow);
    background-size: 200%, 100%;
    animation: jumbo 60s linear infinite;
    background-attachment: fixed;
    mix-blend-mode: difference;
}

.dark .jumbo {
    background-image: var(--stripesDark), var(--rainbow);
    filter: blur(10px) opacity(50%) saturate(200%);
}
.dark .jumbo::after {
    background-image: var(--stripesDark), var(--rainbow);
}
</style>
