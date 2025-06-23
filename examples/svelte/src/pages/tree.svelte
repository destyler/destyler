<script lang="ts">
  import * as tree from "@destyler/tree";
  import { normalizeProps, useMachine } from "@destyler/svelte";
  import TreeNode from "../components/TreeNode.svelte";
  import { treeControls } from '@destyler/shared-private-private';
  import Toolbar from '../components/toolbar.svelte'
  import StateVisualizer from "../components/state-visualizer.svelte"
  import {useControls} from '../hooks/use-controls.svelte'

  const controls = useControls(treeControls);

  interface Node {
    id: string;
    name: string;
    children?: Node[];
  }

  const collection = tree.collection<Node>({
    nodeToValue: (node) => node.id,
    nodeToString: (node) => node.name,
    rootNode: {
      id: "ROOT",
      name: "",
      children: [
        {
          id: "node_modules",
          name: "node_modules",
          children: [
            { id: "node_modules/zag-js", name: "destyler" },
            { id: "node_modules/pandacss", name: "unocss" },
            {
              id: "node_modules/@types",
              name: "@types",
              children: [
                { id: "node_modules/@types/react", name: "react" },
                { id: "node_modules/@types/react-dom", name: "react-dom" },
              ],
            },
          ],
        },
      ],
    },
  });

  const [state, send] = useMachine(
    tree.machine({ id: crypto.randomUUID(), collection }),
    { context: controls.context }
  );

  const api = $derived(tree.connect(state, send, normalizeProps));
</script>

<main class="tree">
  <div {...api.getRootProps()}>
    <h3 {...api.getLabelProps()}>My Documents</h3>
    <div {...api.getTreeProps()}>
      {#each api.collection.rootNode.children as node, index}
        <TreeNode
          node={node}
          indexPath={[index]}
          {api}
        />
      {/each}
    </div>
  </div>
</main>

<Toolbar {controls}>
  <StateVisualizer state={state} />
</Toolbar>
