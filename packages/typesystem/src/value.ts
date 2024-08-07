import { Maybe } from "@macrograph/option";
import { ReactiveMap } from "@solid-primitives/map";

import {
	type Enum,
	type EnumVariants,
	type Struct,
	type StructFields,
	t,
} from ".";

export function deserializeValue(rawValue: any, type: t.Any): any {
	if (type instanceof t.Primitive) return rawValue;

	if (type instanceof t.List)
		return (rawValue as unknown[]).map((item) =>
			deserializeValue(item, type.item),
		);
	if (type instanceof t.Map) {
		const val = new ReactiveMap<string, any>();

		for (const [key, innerValue] of Object.entries(rawValue)) {
			val.set(key, deserializeValue(innerValue, type.value));
		}

		return val;
	}
	if (type instanceof t.Option)
		return Maybe(rawValue).map((v) => deserializeValue(v, type.inner));
	if (type instanceof t.Enum) {
		const value = rawValue as { variant: string; data?: any };

		return "data" in rawValue
			? {
					variant: rawValue.variant,
					data: Object.fromEntries(
						Object.entries(rawValue.data).map(([key, dataValue]) => {
							const variant = (type.inner as Enum<EnumVariants>).variants.find(
								(v) => v.name === value.variant,
							)!;

							return [key, deserializeValue(dataValue, variant.data![key]!)];
						}),
					),
				}
			: { variant: rawValue.variant };
	}
	if (type instanceof t.Struct) {
		const val: Record<string, any> = {};

		const fields = Object.values((type.struct as Struct<StructFields>).fields);

		for (const field of fields) {
			const value = rawValue[field.id];
			if (value === undefined)
				throw new Error(`Field '${field.id}' not found in data.`);

			val[field.id] = deserializeValue(value, field.type);
		}

		return val;
	}
}
