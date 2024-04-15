import clsx from "clsx";
import { createEffect, createSignal } from "solid-js";

interface Props {
	initialValue: number;
	value?: number;
	onChange(v: number): void;
	class?: string;
}

export const IntInput = (props: Props) => {
	// if NaN reset to 0
	const initialValue = isNaN(props.initialValue) ? 0 : props.initialValue;
	props.onChange(initialValue);

	createEffect(() => {
		if (props.value !== undefined) setValue(props.value.toString());
	});

	const [value, setValue] = createSignal(initialValue.toString());

	return (
		<input
			type="text"
			value={value()}
			onKeyDown={(e) => e.stopPropagation()}
			onKeyUp={(e) => e.stopPropagation()}
			onChange={(e) => {
				const value = e.target.value;

				setValue(value);

				const numValue = parseInt(value);
				if (!isNaN(numValue)) props.onChange(parseInt(value));
			}}
			onBlur={(e) => {
				const s = e.target.value;
				const num = parseInt(s);

				if (s.length === 0) {
					setValue("0");
					props.onChange(0);
				} else if (isNaN(num)) {
					setValue(props.initialValue.toString());
				} else {
					setValue(num.toString());
					props.onChange(num);
				}
			}}
			class={clsx(
				"w-full text-xs h-5 px-1 border border-neutral-500 rounded bg-black focus:border-yellow-500 focus:ring-0",
				props.class,
			)}
		/>
	);
};
