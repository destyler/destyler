import { normalizeProps, useMachine } from '@destyler/react'
import * as tree from '@destyler/tree'
import { useId } from 'react'
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
    id: useId(),
    collection,
    expandedValue: ['node_modules', 'node_modules/@destyler'],
  }))

  const api = tree.connect(state, send, normalizeProps)

  return (
    <main className="tree-container">
      <div {...api.getRootProps()} className="tree-root">
        <div {...api.getTreeProps()} className="tree-content">
          {api.collection.rootNode.children?.map((node: any, index: any) => (
            <TreeNode
              key={node.id}
              node={node}
              indexPath={[index]}
              api={api}
            />
          ))}
        </div>
      </div>
    </main>
  )
}
