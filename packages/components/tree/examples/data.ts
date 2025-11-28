import { collection } from '../index'

export interface FileNode {
  id: string
  name: string
  children?: FileNode[]
}

const fileTree: FileNode = {
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
            { id: 'src/components/TreeView.tsx', name: 'TreeView.tsx' },
            { id: 'src/components/TreeNode.tsx', name: 'TreeNode.tsx' },
          ],
        },
        {
          id: 'src/routes',
          name: 'routes',
          children: [
            { id: 'src/routes/index.page.tsx', name: 'index.page.tsx' },
            { id: 'src/routes/settings.page.tsx', name: 'settings.page.tsx' },
          ],
        },
        {
          id: 'src/lib',
          name: 'lib',
          children: [
            { id: 'src/lib/collections.ts', name: 'collections.ts' },
            { id: 'src/lib/theme.ts', name: 'theme.ts' },
          ],
        },
        { id: 'src/app.tsx', name: 'app.tsx' },
        { id: 'src/main.ts', name: 'main.ts' },
      ],
    },
    {
      id: 'public',
      name: 'public',
      children: [
        { id: 'public/favicon.ico', name: 'favicon.ico' },
        { id: 'public/robots.txt', name: 'robots.txt' },
      ],
    },
    {
      id: 'scripts',
      name: 'scripts',
      children: [
        { id: 'scripts/build.ts', name: 'build.ts' },
        { id: 'scripts/release.ts', name: 'release.ts' },
      ],
    },
    { id: 'package.json', name: 'package.json' },
    { id: 'pnpm-lock.yaml', name: 'pnpm-lock.yaml' },
    { id: 'tsconfig.json', name: 'tsconfig.json' },
    { id: 'README.md', name: 'README.md' },
  ],
}

export const defaultExpandedBranches = ['src', 'src/components', 'public']

export function createFileTreeCollection() {
  return collection<FileNode>({
    nodeToValue: node => node.id,
    nodeToString: node => node.name,
    rootNode: fileTree,
  })
}
