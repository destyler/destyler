/** @jsxImportSource solid-js */
import { normalizeProps, useMachine } from '@destyler/solid'
import * as tree from '@destyler/tree'
import { createMemo, createUniqueId } from 'solid-js'
import TreeNode from './Node.tsx'

interface Node {
  id: string
  name: string
  children?: Node[]
}

const collection = tree.collection<Node>({
  nodeToValue: node => node.id,
  nodeToString: node => node.name,
  rootNode: {
    id: 'ROOT',
    name: '',
    children: [
      {
        id: 'src',
        name: 'src',
        children: [
          {
            id: 'src/components',
            name: 'components',
            children: [
              { id: 'src/components/Button.tsx', name: 'Button.tsx' },
              { id: 'src/components/Layout.tsx', name: 'Layout.tsx' },
            ],
          },
          {
            id: 'src/pages',
            name: 'pages',
            children: [
              { id: 'src/pages/index.tsx', name: 'index.tsx' },
              { id: 'src/pages/about.tsx', name: 'about.tsx' },
            ],
          },
          {
            id: 'src/snippets',
            name: 'snippets',
            children: [
              {
                id: 'src/snippets/tree',
                name: 'tree',
                children: [
                  { id: 'src/snippets/tree/Tree.tsx', name: 'Tree.tsx' },
                  { id: 'src/snippets/tree/TreeNode.tsx', name: 'TreeNode.tsx' },
                ],
              },
            ],
          },
          { id: 'src/App.tsx', name: 'App.tsx' },
          { id: 'src/main.ts', name: 'main.ts' },
          { id: 'src/style.css', name: 'style.css' },
        ],
      },
      {
        id: 'public',
        name: 'public',
        children: [
          { id: 'public/favicon.ico', name: 'favicon.ico' },
          { id: 'public/logo.svg', name: 'logo.svg' },
        ],
      },
      { id: 'package.json', name: 'package.json' },
      { id: 'vite.config.ts', name: 'vite.config.ts' },
      { id: 'tsconfig.json', name: 'tsconfig.json' },
      { id: 'unocss.config.ts', name: 'unocss.config.ts' },
      { id: 'README.md', name: 'README.md' },
    ],
  },
})

export default function Tree() {
  const [state, send] = useMachine(tree.machine({
    id: createUniqueId(),
    collection,
    expandedValue: ['node_modules', 'node_modules/@destyler'],
  }))

  const api = createMemo(() => tree.connect(state, send, normalizeProps))

  return (
    <main class="relative max-w-300px rounded-2xl border border-border/40 bg-card p-2 text-card-foreground shadow-xl shadow-black/8 mt-0!">
      <div {...api().getRootProps()} class="w-full mt-0!">
        <div {...api().getTreeProps()} class="space-y-1 mt-0!">
          {api().collection.rootNode.children?.map((node: any, index: any) => (
            <TreeNode
              node={node}
              indexPath={[index]}
              api={api()}
            />
          ))}
        </div>
      </div>
    </main>
  )
}
