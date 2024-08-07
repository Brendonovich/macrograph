import * as v from "valibot";

import type { AnyType, TypeVariant } from ".";
import { BaseType } from "./base";
import type { Wildcard, WildcardType } from "./wildcard";

export type PrimitiveVariant = "int" | "float" | "string" | "bool";

export abstract class BasePrimitiveType<TOut> extends BaseType<TOut> {
	variant(): TypeVariant {
		return "primitive";
	}

	connectWildcard(_right: WildcardType) {}

	getWildcards(): Wildcard[] {
		return [];
	}

	abstract primitiveVariant(): PrimitiveVariant;

	eq(other: AnyType): boolean {
		return (
			other instanceof BasePrimitiveType &&
			other.primitiveVariant() === this.primitiveVariant()
		);
	}

	serialize() {
		return this.primitiveVariant();
	}

	hasUnconnectedWildcard(): boolean {
		return false;
	}
}

export class IntType extends BasePrimitiveType<number> {
	default() {
		return 0;
	}

	primitiveVariant(): PrimitiveVariant {
		return "int";
	}

	toString() {
		return "Int";
	}

	asZodType() {
		return v.pipe(v.number(), v.integer());
	}
}

export class FloatType extends BasePrimitiveType<number> {
	default() {
		return 0;
	}

	primitiveVariant(): PrimitiveVariant {
		return "float";
	}

	toString() {
		return "Float";
	}

	asZodType() {
		return v.number();
	}
}

export class StringType extends BasePrimitiveType<string> {
	default() {
		return "";
	}

	primitiveVariant(): PrimitiveVariant {
		return "string";
	}

	toString() {
		return "String";
	}

	asZodType() {
		return v.string();
	}
}

export class BoolType extends BasePrimitiveType<boolean> {
	default() {
		return false;
	}

	primitiveVariant(): PrimitiveVariant {
		return "bool";
	}

	toString() {
		return "Bool";
	}

	asZodType() {
		return v.boolean();
	}
}

export type PrimitiveType = IntType | FloatType | StringType | BoolType;
