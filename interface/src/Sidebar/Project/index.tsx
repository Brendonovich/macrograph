import type { Graph, Project } from "@macrograph/runtime";

import { CustomTypes } from "./CustomTypes";
import { Graphs } from "./Graphs";
import { PrintOutput } from "./PrintOutput";
import { Resources } from "./Resources";
import { Variables } from "./Variables";

export function Sidebar(props: {
	project: Project;
	currentGraph?: Graph;
	onGraphClicked(graph: Graph): void;
}) {
	return (
		<>
			<Graphs
				currentGraph={props.currentGraph?.id}
				onGraphClicked={props.onGraphClicked}
			/>
			<PrintOutput />
			<Variables project={props.project} />
			<CustomTypes />
			<Resources />
		</>
	);
}
