import { ReactiveMap } from "@solid-primitives/map";

import { type TypeVariant, type Wildcard, t } from ".";
import { BaseType } from "./base";

export type MapValue<T> = ReactiveMap<string, T>;

export class MapType<TValue extends BaseType<any>> extends BaseType<
	MapValue<t.infer<TValue>>
> {
	constructor(public value: TValue) {
		super();
	}

	default() {
		return new ReactiveMap<string, t.infer<TValue>>();
	}

	variant(): TypeVariant {
		return "map";
	}

	toString(): string {
		return `Map<${this.value.toString()}>`;
	}

	// asZodType() {
	//   return z.map(z.string(), this.value.asZodType());
	// }

	getWildcards(): Wildcard[] {
		return this.getWildcards();
	}

	eq(other: t.Any): boolean {
		return other instanceof t.Map && this.value.eq(other.value);
	}

	serialize() {
		return { variant: "map", value: this.value.serialize() };
	}

	hasUnconnectedWildcard(): boolean {
		return this.value.hasUnconnectedWildcard();
	}
}
