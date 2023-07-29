import { onMount, Show } from "solid-js";
import { CoreProvider } from "./contexts";
import { Graph } from "~/components/Graph";
import { GraphList } from "~/components/ProjectSidebar";
import {
  CommentBox,
  core,
  SerializedProject,
  Node,
  DataInput,
} from "@macrograph/core";
import "@macrograph/packages";
import { createUIStore, UIStoreProvider } from "./UIStore";
import { PrintOutput } from "./components/PrintOutput";
import Settings from "./settings";
import { Fallback } from "@kobalte/core/dist/types/image";

function App() {
  const ui = createUIStore();

  onMount(async () => {
    const savedProject = localStorage.getItem("project");
    if (savedProject)
      await core.load(SerializedProject.parse(JSON.parse(savedProject)));

    const firstGraph = core.project.graphs.values().next();
    if (firstGraph) ui.setCurrentGraph(firstGraph.value);
  });

  return (
    <UIStoreProvider store={ui}>
      <CoreProvider core={core}>
        <div
          class="w-screen h-screen flex flex-row overflow-hidden select-none"
          onContextMenu={(e) => {
            e.preventDefault();
            e.stopPropagation();
          }}
        >
          <div class="flex flex-col bg-neutral-600 w-64 shadow-2xl">
            <Settings />
            <GraphList onChange={(g) => ui.setCurrentGraph(g)} />
            <PrintOutput />
          </div>
          <Show when={ui.state.currentGraph} fallback="No Graph">
            {(graph) => <Graph graph={graph()} />}
          </Show>
          <div>
            <Show when={ui.state.selectedItem}>
              {(item) => (
                <div class="flex flex-col bg-neutral-600 w-96 shadow-2xl">
                  <Show when={item() instanceof CommentBox}>
                    {/* @ts-ignore */}
                    {item().text}
                  </Show>
                  <Show when={item() instanceof Node}>
                    {/* @ts-ignore */}
                    {item().name}
                    <br />
                    {item().position.x}
                    <br />
                    {item().position.y}
                    <br />
                    {item().inputs.map((input) => (
                      <Show when={input instanceof DataInput}>
                        <div>
                          {input.name}: {input.defaultValue}
                          <br />
                        </div>
                      </Show>
                    ))}
                  </Show>
                </div>
              )}
            </Show>
          </div>
        </div>
      </CoreProvider>
    </UIStoreProvider>
  );
}

export default App;
