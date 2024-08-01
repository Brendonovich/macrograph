import { ContextMenu } from "@kobalte/core";
import type { CommentBox as CommentBoxModel } from "@macrograph/runtime";
import { createEventListenerMap } from "@solid-primitives/event-listener";
import clsx from "clsx";
import {
	Show,
	createMemo,
	createRoot,
	createSignal,
	onCleanup,
	onMount,
} from "solid-js";

import { useInterfaceContext } from "../../context";
import { useGraphContext } from "./Context";
import { ContextMenuContent, ContextMenuItem } from "./ContextMenu";
import { handleSelectableItemMouseDown } from "./util";

interface Props {
	box: CommentBoxModel;
	onSelected(): void;
}

export function CommentBox(props: Props) {
	const interfaceCtx = useInterfaceContext();
	const graph = useGraphContext();

	const box = () => props.box;
	const position = () => props.box.position;
	const size = () => props.box.size;

	const [editing, setEditing] = createSignal(false);

	const isSelected = createMemo(() =>
		graph.state.selectedItemIds.some(
			(item) => item?.type === "commentBox" && item.id === box().id,
		),
	);

	return (
		<div
			class={clsx(
				"rounded overflow-hidden border-black/75 border absolute top-0 left-0",
				isSelected() && "ring-2 ring-mg-focus",
			)}
			style={{
				transform: `translate(${position().x}px, ${position().y}px)`,
				width: `${size().x}px`,
				height: `${size().y}px`,
				"background-color": `rgb(from ${box().tint} r g b / 0.3`,
			}}
		>
			<div class="truncate bg-white/50 text-black font-medium cursor-pointer outline-none">
				<Show
					when={editing()}
					fallback={
						<ContextMenu.Root
							onOpenChange={(o) => {
								if (o) props.onSelected();
							}}
						>
							<ContextMenu.Trigger<"button">
								as="button"
								class="p-2 pl-3 outline-none w-full text-left"
								onClick={(e) => {
									e.preventDefault();
									e.stopPropagation();
								}}
								onMouseDown={(e) =>
									handleSelectableItemMouseDown(
										e,
										graph,
										interfaceCtx,
										props.onSelected,
										{ type: "commentBox", id: box().id },
									)
								}
								onDblClick={(e) => !e.shiftKey && setEditing(true)}
							>
								{props.box.text}
							</ContextMenu.Trigger>
							<ContextMenuContent>
								<ContextMenuItem onSelect={() => setEditing(true)}>
									Rename
								</ContextMenuItem>
								<ContextMenuItem
									onSelect={() => {
										graph
											.model()
											.deleteCommentbox(
												box(),
												(node) => interfaceCtx.nodeSizes.get(node),
												false,
											);
										interfaceCtx.save();
									}}
									class="text-red-500 flex flex-row gap-2 items-center justify-between"
								>
									Delete
								</ContextMenuItem>
								<ContextMenuItem
									onSelect={() => {
										graph
											.model()
											.deleteCommentbox(
												box(),
												(node) => interfaceCtx.nodeSizes.get(node),
												true,
											);
										interfaceCtx.save();
									}}
									class="text-red-500 flex flex-row gap-2 items-center justify-between"
								>
									Delete with nodes
								</ContextMenuItem>
							</ContextMenuContent>
						</ContextMenu.Root>
					}
				>
					{(_) => {
						const [value, setValue] = createSignal(props.box.text);

						let ref: HTMLInputElement | undefined;

						onMount(() => ref?.focus());

						return (
							<div class="flex flex-row">
								<input
									ref={ref}
									class="m-2 p-0 pl-1 border-0 flex-1 rounded"
									type="text"
									value={value()}
									onInput={(e) => setValue(e.target.value)}
									onContextMenu={(e) => e.stopPropagation()}
									onMouseDown={(e) => e.stopPropagation()}
									onBlur={() => {
										if (value() !== "") props.box.text = value();
										interfaceCtx.save();

										setEditing(false);
									}}
									onKeyPress={(e) => {
										if (e.key === "Enter") {
											e.preventDefault();
											ref?.blur();
										}
									}}
								/>
							</div>
						);
					}}
				</Show>
			</div>
			<div
				class="bg-transparent w-2 h-2 cursor-nwse-resize -right-1 -bottom-1 fixed"
				onMouseDown={(e) => {
					e.currentTarget.focus();
					e.stopPropagation();

					setEditing(false);

					switch (e.button) {
						case 0: {
							props.onSelected();

							createRoot((dispose) => {
								onCleanup(() => interfaceCtx.save());

								createEventListenerMap(window, {
									mouseup: dispose,
									mousemove: (e) => {
										const scale = graph.state.scale;

										props.box.size = {
											x: box().size.x + e.movementX / scale,
											y: box().size.y + e.movementY / scale,
										};
									},
								});
							});

							break;
						}
						default:
							break;
					}
				}}
			/>
		</div>
	);
}
