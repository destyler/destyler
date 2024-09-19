<script setup lang="ts">
import { useData } from 'vitepress'
import { BreadcrumbsContent, BreadcrumbsItem, BreadcrumbsLabel, BreadcrumbsRoot, BreadcrumbsSeparator, Icon } from 'destyler'

const { frontmatter } = useData()
</script>

<template>
  <main class="min-h-[calc(100vh-var(--header-height))]">
    <div class="mx-auto px-4 sm:px-6 lg:px-8 max-w-7xl">
      <div class="flex flex-col lg:grid lg:grid-cols-10 lg:gap-8">
        <div class="lg:col-span-10">
          <div class="flex flex-col lg:grid lg:grid-cols-10 lg:gap-8 py-8">
            <div class="lg:col-span-8">
              <article class="article prose mt-4">
                <div class="mb-3 text-sm/6 font-semibold text-primary gap-1.5 flex flex-col gap-y-8 items-start">
                  <BreadcrumbsRoot>
                    <BreadcrumbsContent class="gap-1.5 flex items-center sm:gap-2.5 text-sm">
                      <BreadcrumbsItem
                        class="
                        before:content-none! p-none!
                        flex items-center text-sm gap-1.5
                        "
                      >
                        <BreadcrumbsLabel
                          class="
                          border-none!
                          overflow-hidden text-ellipsis whitespace-nowrap cursor-pointer
                          text-muted-foreground! hover:text-foreground!
                          data-[state=active]:text-foreground!"
                        >
                          Blog
                        </BreadcrumbsLabel>
                        <BreadcrumbsSeparator class="w-2 text-muted-foreground!">
                          <Icon name="carbon:chevron-right" />
                        </BreadcrumbsSeparator>
                      </BreadcrumbsItem>
                      <BreadcrumbsItem
                        class="
                        before:content-none! p-none!
                        flex items-center text-sm gap-1.5
                        "
                      >
                        <BreadcrumbsLabel
                          class="
                          border-none!
                          overflow-hidden text-ellipsis whitespace-nowrap cursor-pointer
                          text-muted-foreground! hover:text-foreground!
                          data-[state=active]:text-foreground!"
                        >
                          {{ frontmatter.title }}
                        </BreadcrumbsLabel>
                        <BreadcrumbsSeparator class="w-2 text-muted-foreground!">
                          <Icon name="carbon:chevron-right" />
                        </BreadcrumbsSeparator>
                      </BreadcrumbsItem>
                    </BreadcrumbsContent>
                  </BreadcrumbsRoot>
                  <div>
                    <span>Release</span>
                    <span class="text-gray-500 dark:text-gray-400">
                      ·
                      <time>August 22, 2024</time>
                    </span>
                  </div>
                </div>
                <div class="flex flex-col lg:flex-row items-start gap-6">
                  <div class="flex-1">
                    <div class="flex flex-col lg:flex-row lg:items-center lg:justify-between">
                      <h1
                        class="text-3xl sm:text-4xl font-bold text-gray-900 dark:text-white tracking-tight mb-4!"
                      >
                        {{ frontmatter.title }}
                      </h1>
                    </div>
                    <div class="text-lg text-gray-500 dark:text-gray-400">
                      {{ frontmatter.desc }}
                    </div>
                  </div>
                </div>
                <Line class="my-8" />
                <Content class="prose Doc m-auto" />
              </article>
            </div>
            <div class="lg:col-span-2 order-first lg:order-last">
              <nav class="sticky top-[--header-height] bg-background backdrop-blur -mx-4 sm:-mx-6 px-4 sm:px-6 lg:px-4 lg:-mx-4 overflow-y-auto max-h-[calc(100vh-var(--header-height))]">
                <div class="py-3 lg:py-8 lg:border-0 space-y-3">
                  <Toc />
                  <div class="hidden lg:block">
                    <Line />
                    <Community />
                  </div>
                </div>
              </nav>
            </div>
          </div>
        </div>
      </div>
    </div>
  </main>
</template>
