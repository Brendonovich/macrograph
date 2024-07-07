import clsx from "clsx";
import { ComponentProps } from "solid-js";

export function Card(props: ComponentProps<"div">) {
	return <div {...props} class={clsx("", props.class)} />;
}
