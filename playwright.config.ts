import type { PlaywrightTestConfig } from '@playwright/test'
import process from 'node:process'
import { defineConfig } from '@playwright/test'

const CI = !!process.env.CI

type InferServer<T> = Exclude<T extends Array<infer U> ? U : T, undefined>

type WebServer = InferServer<PlaywrightTestConfig['webServer']>

export function getWebServer(): WebServer {
  const framework = process.env.FRAMEWORK || 'react'

  const frameworks: Record<string, WebServer> = {
    react: {
      cwd: './examples/react',
      command: 'pnpm run dev --port 3000',
      url: 'http://localhost:3000',
      reuseExistingServer: !CI,
    },
    vue: {
      cwd: './examples/vue',
      command: 'pnpm run dev --port 3001',
      url: 'http://localhost:3001',
      reuseExistingServer: !CI,
    },
    solid: {
      cwd: './examples/solid',
      command: 'pnpm run dev --port 3002',
      url: 'http://localhost:3002',
      reuseExistingServer: !CI,
    },
    svelte: {
      cwd: './examples/svelte',
      command: 'pnpm run dev --port 3003',
      url: 'http://localhost:3003',
      reuseExistingServer: !CI,
    },
  }

  return frameworks[framework]
}

const webServer = getWebServer()

export default defineConfig({
  testDir: './packages',
  outputDir: './test/results',
  testMatch: 'components/*/test/*.e2e.ts',
  fullyParallel: !CI,
  timeout: 30_000,
  expect: {
    timeout: 20_000,
  },
  forbidOnly: !!CI,
  reportSlowTests: null,
  retries: process.env.CI ? 1 : 0,
  workers: process.env.CI ? 1 : '50%',
  reporter: [
    process.env.CI ? ['github', ['junit', { outputFile: 'test/junit.xml' }]] : ['list'],
    ['html', { outputFolder: 'test/report', open: 'never' }],
  ],
  webServer,
  use: {
    baseURL: webServer.url,
    trace: 'retain-on-failure',
    screenshot: 'only-on-failure',
    video: 'retain-on-failure',
    locale: 'en-US',
    timezoneId: 'GMT',
  },
})
