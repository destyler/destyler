import { normalizeProps, useMachine } from '@destyler/solid'
import { treeControls } from '@destyler/shared-private'
import * as tree from '@destyler/tree'
import { createMemo, createUniqueId } from 'solid-js'
import { TreeNode } from '../components/TreeNode'
import { useControls } from '../hooks/use-controls'
import { StateVisualizer } from '../components/tools/state-visualizer'
import { Toolbar } from '../components/tools/toolbar'

interface Node {
  id: string
  name: string
  children?: Node[]
}

export default function TreeDemo() {
  const controls = useControls(treeControls)

  const collection = createMemo(() => tree.collection<Node>({
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
  }))

  const [state, send] = useMachine(tree.machine({
    id: createUniqueId(),
    collection: collection(),
  }), {
    context: controls.context,
  })

  const api = createMemo(()=>tree.connect(state, send, normalizeProps))

  return (
    <>
      <main class="tree">
        <div {...api().getRootProps()}>
          <h3 {...api().getLabelProps()}>My Documents</h3>
          <div {...api().getTreeProps()}>
            {api().collection.rootNode.children?.map((node, index) => (
              <TreeNode
                node={node}
                indexPath={[index]}
                api={api()}
              />
            ))}
          </div>
        </div>
      </main>
      <Toolbar controls={controls.ui}>
        <StateVisualizer state={state} />
      </Toolbar>
    </>
  )
}
