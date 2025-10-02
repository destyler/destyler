<script lang="ts">
  import * as tree from '@destyler/tree'
  import { normalizeProps, useMachine } from '@destyler/svelte'
  import TreeNode from './Node.svelte'

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
                { id: 'src/components/Button.svelte', name: 'Button.svelte' },
                { id: 'src/components/Layout.svelte', name: 'Layout.svelte' },
              ],
            },
            {
              id: 'src/pages',
              name: 'pages',
              children: [
                { id: 'src/pages/index.svelte', name: 'index.svelte' },
                { id: 'src/pages/about.svelte', name: 'about.svelte' },
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
                    { id: 'src/snippets/tree/Tree.svelte', name: 'Tree.svelte' },
                    { id: 'src/snippets/tree/TreeNode.svelte', name: 'TreeNode.svelte' },
                  ],
                },
              ],
            },
            { id: 'src/App.svelte', name: 'App.svelte' },
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
        { id: 'svelte.config.js', name: 'svelte.config.js' },
        { id: 'vite.config.ts', name: 'vite.config.ts' },
        { id: 'tsconfig.json', name: 'tsconfig.json' },
        { id: 'unocss.config.ts', name: 'unocss.config.ts' },
        { id: 'README.md', name: 'README.md' },
      ],
    },
  })

  const [state, send] = useMachine(tree.machine({
    id: crypto.randomUUID(),
    collection,
    expandedValue: ['node_modules', 'node_modules/@destyler'],
  }))

  const api = $derived(tree.connect(state, send, normalizeProps))
</script>

<main class="tree-container">
  <div {...api.getRootProps()} class="tree-root">
    <div {...api.getTreeProps()} class="tree-content">
      {#each api.collection.rootNode.children as node, index}
        <TreeNode
          {node}
          indexPath={[index]}
          {api}
        />
      {/each}
    </div>
  </div>
</main>
