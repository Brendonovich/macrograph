import {
	DEFAULT,
	type Node,
	type PropertyValue,
	type SchemaProperties,
} from "@macrograph/runtime";
import { For, Match, Show, Switch, createMemo } from "solid-js";
import { SidebarSection } from "../../components/Sidebar";
import {
	CheckBox,
	FloatInput,
	IntInput,
	SelectInput,
	TextInput,
} from "../../components/ui";
import { useCore } from "../../contexts";

export function Properties(props: {
	node: Node;
	properties: SchemaProperties;
}) {
	return (
		<SidebarSection title="Node Properties">
			<For
				each={Object.values(props.properties)}
				fallback={
					<div class="text-center pt-6 w-full text-neutral-400">
						Node has no properties
					</div>
				}
			>
				{(property) => {
					const properties = createMemo(() => props.node.state.properties);

					return (
						<div class="p-2 flex flex-col gap-1">
							<span class="text-xs font-medium text-gray-200">
								{property.name}
							</span>
							<Switch>
								<Match when={"source" in property && property}>
									{(property) => {
										const options = createMemo(() => {
											return property().source({ node: props.node });
										});

										const selectedOption = () => {
											return options().find(
												(o) => o.id === properties()[property().id]!,
											);
										};

										return (
											<SelectInput<PropertyValue>
												options={options()}
												optionValue="id"
												optionTextValue="display"
												getLabel={(o) => o.display}
												value={selectedOption()}
												onChange={(v) => {
													props.node.setProperty(property().id, v.id);
												}}
											/>
										);
									}}
								</Match>
								<Match when={"type" in property && property}>
									{(property) => {
										const value = createMemo(
											() => properties()[property().id]!,
										);

										const onChange = (v: any) => {
											props.node.setProperty(property().id, v);
										};

										return (
											<Show
												when={(() => {
													const v = value();
													return v !== "symbol" && v !== undefined;
												})()}
											>
												<Switch>
													<Match
														when={property().type.primitiveVariant() === "bool"}
													>
														<CheckBox
															value={value() as any}
															onChange={onChange}
														/>
													</Match>
													<Match
														when={
															property().type.primitiveVariant() === "string"
														}
													>
														<TextInput
															value={value() as any}
															onChange={onChange}
														/>
													</Match>
													<Match
														when={property().type.primitiveVariant() === "int"}
													>
														<IntInput
															initialValue={value() as any}
															value={value() as any}
															onChange={onChange}
														/>
													</Match>
													<Match
														when={
															property().type.primitiveVariant() === "float"
														}
													>
														<FloatInput
															initialValue={value() as any}
															value={value() as any}
															onChange={onChange}
														/>
													</Match>
												</Switch>
											</Show>
										);
									}}
								</Match>
								<Match when={"resource" in property && property}>
									{(property) => {
										const core = useCore();

										const items = () => {
											const resource = core.project.resources.get(
												property().resource,
											);
											if (!resource) return [];

											const dflt = resource.items.find(
												(i) => i.id === resource.default,
											);

											return [
												{
													id: DEFAULT,
													name: dflt
														? `Default (${dflt.name})`
														: "No Items Available",
												},
												...resource.items,
											];
										};

										const valueId = createMemo(
											() => props.node.state.properties[property().id],
										);

										return (
											<SelectInput
												options={items()}
												optionValue="id"
												optionTextValue="name"
												getLabel={(o) => o.name}
												value={
													items().find((i) => i.id === valueId()) ??
													items().find((i) => i.id === DEFAULT)
												}
												onChange={(v) =>
													props.node.setProperty(property().id, v.id)
												}
											/>
										);
									}}
								</Match>
							</Switch>
						</div>
					);
				}}
			</For>
		</SidebarSection>
	);
}
