<script setup lang="ts">
import { ref } from 'vue'
import {
  NavigationContent,
  NavigationIndicator,
  NavigationItem,
  NavigationLink,
  NavigationList,
  NavigationRoot,
  NavigationTrigger,
  NavigationViewport,
} from '../src'
import NavigationListItem from './NavigationListItem.spec.vue'

export interface TestProps {
  disableClickTrigger?: boolean
  disableHoverTrigger?: boolean
}

const props = withDefaults(defineProps<TestProps>(), {
  disableClickTrigger: false,
  disableHoverTrigger: false,
})

const currentTrigger = ref('')
</script>

<template>
  <div>
    <NavigationRoot
      v-model="currentTrigger"
      v-bind="props"
    >
      <NavigationList>
        <NavigationItem>
          <NavigationTrigger>
            Learn
          </NavigationTrigger>
          <NavigationContent>
            <ul>
              <li>
                <NavigationLink
                  href="/"
                  target="_blank"
                  @select.prevent
                >
                  <svg width="38" height="38" viewBox="0 0 150 138" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M87.85 97.0008V96.7508C88.15 95.7508 88.05 93.9008 87.1 92.3008C86.6 91.3008 85.65 90.3508 84.1 89.9008C82.65 89.4008 81.05 89.5008 79.7 90.2008C78.45 90.9008 77.3 92.0508 76.9 93.4008C75.75 96.9508 74.25 100.251 72.15 103.151C69.95 106.101 67.15 108.651 63.6 110.701C57 114.451 49.4 115.201 42.5 113.501C35.65 111.701 29.4 107.251 25.55 100.551C24 97.8508 25 94.3008 27.7 92.7008C30.4 91.2008 33.95 92.1508 35.55 94.9008C37.75 98.7508 41.35 101.251 45.35 102.301C49.45 103.351 54 102.901 57.95 100.601C59.9 99.4508 61.55 98.0008 62.8 96.3008C64.2 94.4508 65.2 92.3508 65.85 90.1008L65.95 89.7008C67.4 85.3508 70.8 81.5508 74.95 79.7008C78.8 77.8508 83.3 77.4508 87.7 78.8508C92.35 80.4508 95.4 83.4508 97.2 86.8008C99.65 91.3508 99.75 96.6008 98.9 99.7508C98.55 101.001 98.25 102.251 97.75 103.501H121.15C121.95 102.051 122.7 100.451 123.25 98.7508C124.05 96.3008 124.5 93.6008 124.5 90.9008C124.5 87.1508 123.7 83.6008 122.25 80.4008C120.8 77.1508 118.6 74.2008 115.95 71.8008C113.5 69.7008 113.35 66.0508 115.4 63.7008C116.4 62.6008 117.85 61.9008 119.25 61.7508C124.5 60.8508 129.3 58.9008 132.65 55.2008C136.15 51.4008 138.35 45.4508 138.35 36.5508V17.3008L127.85 25.2508C126.25 26.4008 124.4 26.7008 122.8 26.1508V26.2508C119.05 25.1008 115.1 24.5508 111.2 24.5508C107.2 24.5508 103.25 25.1008 99.6 26.2508C97.65 26.8008 95.75 26.3508 94.25 25.1008L83.9 17.3008V36.5008C83.9 42.0508 84.7 46.4008 86.25 49.8008C87.6 52.9508 89.5 55.3508 91.75 57.1008C94.25 59.0508 94.7 62.6508 92.8 65.1508C90.95 67.4508 86.9 68.4008 84.6 70.0008C82.8 71.4008 81.15 72.8008 79.85 74.4008C77.7 76.8008 74.1 77.2008 71.65 75.1508C71.1 74.6008 70.65 74.0008 70.35 73.4508C67.5 68.9508 63.5 65.1508 58.85 62.6008C46.6 55.7008 30.8 57.9008 20.85 67.9008C15.1 73.6508 11.5 81.6008 11.5 90.4508C11.5 101.251 17.25 111.201 25.85 117.801C32.05 122.551 39.5 125.201 47.15 125.701C54.7 126.201 62.55 124.501 69.45 120.601C74 118.051 78 114.651 81.1 110.501C84.2 106.401 86.55 101.901 87.85 97.0008ZM0 90.5008C0 78.4508 4.85 67.6508 12.7 59.8008C26.35 46.1508 47.7 43.2008 64.45 52.5508C68.9 55.0008 72.85 58.2008 76.1 62.0008C77 61.2008 77.9 60.7008 78.8 60.0508C77.65 58.3008 76.5 56.3508 75.55 54.2508C73.5 49.4008 72.3 43.5508 72.3 36.5008V22.7508L72.35 5.75083C72.35 4.60083 72.7 3.30083 73.5 2.30083C75.4 -0.24917 79.05 -0.74917 81.55 1.15083L99.1 14.4508C103.05 13.4508 107.15 13.0008 111.15 13.0008C115.15 13.0008 119.15 13.4508 123.2 14.4508L140.35 1.50083C141.35 0.600832 142.75 0.000830095 144.2 0.000830095C147.35 0.000830095 149.95 2.65083 149.95 5.75083V36.5008C149.95 48.6508 146.5 57.1008 141.15 62.9508C138 66.5008 134.15 68.9008 130.05 70.6008C131.05 72.2508 132 73.9008 132.85 75.6508C134.9 80.3008 136.1 85.4508 136.1 90.8508C136.1 94.8508 135.45 98.7008 134.25 102.251C133.1 105.851 131.35 109.201 129.2 112.201C128.2 113.901 126.4 115.001 124.35 115.001H92.05C91.5 115.851 90.85 116.701 90.25 117.551C86.1 122.851 80.95 127.351 75.15 130.601C66.4296 135.551 56.4589 137.861 46.45 137.251C36.65 136.551 26.95 133.151 18.85 126.901C7.45 118.201 0 104.851 0 90.5008Z" fill="white" />
                  </svg>

                  <div>
                    Destyler
                  </div>
                  <p>
                    Unstyled component for vue.
                  </p>
                </NavigationLink>
              </li>

              <NavigationListItem
                href="https://github.com/destyler"
                title="On demand Import"
              >
                Provide resolver to automatically import only used components.
              </NavigationListItem>
              <NavigationListItem href="https://www.typescriptlang.org/" title="Typescript Supported">
                Support TypeScript & type checked & type inference.
              </NavigationListItem>
              <NavigationListItem
                href="https://github.com/destyler/destyler"
                title="Unstyled"
              >
                Easily customizable and great for building design system and web apps.
              </NavigationListItem>
            </ul>
          </NavigationContent>
        </NavigationItem>

        <NavigationItem>
          <NavigationTrigger>
            Overview
          </NavigationTrigger>
          <NavigationContent>
            <ul>
              <NavigationListItem
                title="Introduction"
                href="https://destyler-dev.vercel.app/guide/introduction"
              >
                Destyler is a UI toolkit for building accessible web apps and design systems with Vue.
              </NavigationListItem>
              <NavigationListItem
                title="Getting started"
                href="https://destyler-dev.vercel.app/guide/install"
              >
                A quick tutorial to get you up and running with Destyler.
              </NavigationListItem>
              <NavigationListItem
                title="Playground"
                href="https://play-destyler-dev.vercel.app"
              >
                Real time online use of destyler.
              </NavigationListItem>
              <NavigationListItem
                title="Stories"
                href="https://histoire.dev/"
              >
                A new way to write stories
              </NavigationListItem>
              <NavigationListItem
                title="Test"
                href="https://vitest.dev/"
              >
                A Vite-native testing framework. It's fast!
              </NavigationListItem>
              <NavigationListItem
                title="Releases"
                href="https://github.com/destyler/destyler/releases/tag/v0.0.3"
              >
                Destyler releases and their changelogs.
              </NavigationListItem>
            </ul>
          </NavigationContent>
        </NavigationItem>

        <NavigationItem>
          <NavigationLink
            href="https://github.com/destyler"
          >
            Github
          </NavigationLink>
        </NavigationItem>

        <NavigationIndicator>
          <div />
        </NavigationIndicator>
      </NavigationList>

      <div>
        <NavigationViewport />
      </div>
    </NavigationRoot>
  </div>
</template>
