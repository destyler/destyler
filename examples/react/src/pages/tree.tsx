import { normalizeProps, useMachine } from '@destyler/react'
import { treeControls } from '@destyler/shared-private'
import { StateVisualizer, Toolbar, useControls } from '@destyler/shared-private/react'
import * as tree from '@destyler/tree'
import { useId, useMemo } from 'react'
import { TreeNode } from '../components/TreeNode'

interface Node {
  id: string
  name: string
  children?: Node[]
}

export default function TreeDemo() {
  const controls = useControls(treeControls)

  const collection = useMemo(() => tree.collection<Node>({
    nodeToValue: node => node.id,
    nodeToString: node => node.name,
    rootNode: {
      id: 'ROOT',
      name: '',
      children: [
        {
          id: 'node_modules',
          name: 'node_modules',
          children: [
            { id: 'node_modules/destyler', name: 'destyler' },
            { id: 'node_modules/unocss', name: 'unocss' },
            {
              id: 'node_modules/@types',
              name: '@types',
              children: [
                { id: 'node_modules/@types/react', name: 'react' },
                { id: 'node_modules/@types/react-dom', name: 'react-dom' },
              ],
            },
          ],
        },
      ],
    },
  }), [])

  const [state, send] = useMachine(tree.machine({
    id: useId(),
    collection,
  }), {
    context: controls.context,
  })

  const api = tree.connect(state, send, normalizeProps)

  return (
    <>
      <main className="tree">
        <div {...api.getRootProps()}>
          <h3 {...api.getLabelProps()}>My Documents</h3>
          <div {...api.getTreeProps()}>
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
      <Toolbar controls={controls.ui()}>
        <StateVisualizer state={state} />
      </Toolbar>
    </>
  )
}
