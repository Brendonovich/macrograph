import {
  ComponentProps,
  ErrorBoundary,
  For,
  ParentProps,
  Show,
  Suspense,
  createSignal,
  startTransition,
} from "solid-js";
import { Dialog as KDialog } from "@kobalte/core";

import { Dialog } from "./ui";
import { useCore } from "../contexts";
import {
  projectToClipboardItem,
  writeClipboardItemToClipboard,
} from "../clipboard";
import { usePlatform } from "../platform";
import { createMemo } from "solid-js";
import { Dynamic } from "solid-js/web";

function IconContainer(props: ParentProps<ComponentProps<"div">>) {
  return (
    <div
      {...props}
      class="bg-neutral-900 rounded w-8 h-8 flex flex-col items-center justify-center p-1"
    />
  );
}

export default () => {
  const platform = usePlatform();

  return (
    <div class="flex flex-col gap-2 p-1">
      <div class="flex flex-row gap-1 text-white">
        <Show
          when={platform.projectPersistence}
          keyed
          fallback={<CopyProjectButton />}
        >
          {(projectPersistence) => (
            <>
              <button
                title="Save Project"
                onClick={(e) => projectPersistence.saveProject(e.shiftKey)}
              >
                <IconContainer>
                  <IconFaSolidSave class="w-full h-full" />
                </IconContainer>
              </button>
              <button
                title="Load Project"
                onClick={() => projectPersistence.loadProject()}
              >
                <IconContainer>
                  <IconTdesignFolderImport class="w-full h-full" />
                </IconContainer>
              </button>
            </>
          )}
        </Show>
      </div>
      <Show when={platform.projectPersistence} keyed>
        {(projectPerstence) => (
          <Show when={projectPerstence.url}>
            {(url) => (
              <div class="break-all">
                <p class="text-xs font-medium text-gray-200">Project Path</p>
                <p class="text-sm font-mono">{url()}</p>
              </div>
            )}
          </Show>
        )}
      </Show>
    </div>
  );
};

function CopyProjectButton() {
  const core = useCore();

  return (
    <button
      title="Copy Project"
      onClick={() =>
        writeClipboardItemToClipboard(projectToClipboardItem(core.project))
      }
    >
      <IconContainer>
        <IconTablerClipboard class="w-full h-full" />
      </IconContainer>
    </button>
  );
}

const Section = (props: { title: string } & ParentProps) => {
  return (
    <section class="bg-neutral-900 rounded-md divide-y divide-neutral-600 border border-neutral-600">
      <h3 class="p-3 font-medium text-xl">{props.title}</h3>
      <div class="p-4">{props.children}</div>
    </section>
  );
};
