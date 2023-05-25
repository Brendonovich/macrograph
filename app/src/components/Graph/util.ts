import {
  AnyType,
  BasePrimitiveType,
  EnumType,
  ListType,
  OptionType,
  PrimitiveVariant,
} from "@macrograph/core";
import { StructType } from "~/../../core/src/types/struct";

const DataPinTypeColours: Record<PrimitiveVariant, string> = {
  bool: "[--mg-current:#DC2626]",
  string: "[--mg-current:#DA5697]",
  int: "[--mg-current:#30F3DB]",
  float: "[--mg-current:#00AE75]",
};

export const colour = (type: AnyType): string => {
  if (type instanceof BasePrimitiveType)
    return DataPinTypeColours[type.primitiveVariant()];

  if (type instanceof ListType || type instanceof OptionType)
    return colour(type.inner);

  if (type instanceof EnumType) return "[--mg-current:#1B4DFF]";

  if (type instanceof StructType) return "[--mg-current:#1B4DFF]";

  const value = type.wildcard.value;

  if (value.isSome()) {
    return colour(value.unwrap());
  } else {
    return "[--mg-current:white]";
  }
};
