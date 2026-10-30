import path from 'node:path'
import process from 'node:process'
import { defineConfig } from 'vitest/config'
import Browser from './vitest.browser.config.ts'
import Utils from './vitest.utils.config.ts'

const react18Root = path.resolve(process.env.REACT_18_DIR ?? path.resolve('node_modules/.cache/react-18'))
const react18Modules = path.join(react18Root, 'node_modules')

function packageAlias(name: string) {
  const root = path.join(react18Modules, name)
  return [
    { find: new RegExp(`^${name}$`), replacement: root },
    { find: new RegExp(`^${name}/(.*)$`), replacement: `${root}/$1` },
  ]
}

const alias = [
  ...packageAlias('react'),
  ...packageAlias('react-dom'),
  ...packageAlias('react-test-renderer'),
]

// Runs packages/frameworks/react/test against React 18 without changing the
// workspace's React 19 install or the `react >=18` peer range.
export default defineConfig({
  resolve: {
    alias,
    dedupe: ['react', 'react-dom', 'react-test-renderer'],
  },
  test: {
    projects: [
      {
        ...Utils,
        resolve: { alias },
        test: {
          ...Utils.test,
          name: { label: 'react-18-node', color: 'blue' },
          include: ['packages/frameworks/react/test/**/*.test.{ts,tsx}'],
        },
      },
      {
        ...Browser,
        resolve: { alias },
        optimizeDeps: {
          include: [
            'react',
            'react/jsx-runtime',
            'react/jsx-dev-runtime',
            'react-dom',
            'react-dom/client',
            'react-dom/server',
            'react-test-renderer',
          ],
        },
        test: {
          ...Browser.test,
          name: { label: 'react-18-browser', color: 'cyan' },
          include: ['packages/frameworks/react/test/**/*.spec.{ts,tsx}'],
        },
      },
    ],
  },
})
