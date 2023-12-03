import { ReactiveMap } from "@solid-primitives/map";
import { ReactiveSet } from "@solid-primitives/set";
import {
  Accessor,
  createEffect,
  createMemo,
  createRoot,
  getOwner,
  onCleanup,
  runWithOwner,
} from "solid-js";
import { createMutable } from "solid-js/store";
import { z } from "zod";
import { TypeVariant, t } from ".";
import { DataInput, DataOutput } from "../models";
import { createOptionMemo } from "../utils";
import { BaseType } from "./base";
import { None, Option, Some } from "./option";

/**
 * A Wildcard that belongs to a Node.
 */
export class Wildcard {
  types = new ReactiveSet<t.Wildcard>();

  dispose: () => void;

  value!: Accessor<Option<t.Any>>;

  directSourceConnections!: Accessor<Set<WildcardSourceConnector>>;
  indirectSourceConnections!: Accessor<Map<t.Any, WildcardSourceConnector>>;

  constructor(public id: string) {
    const { dispose, owner } = createRoot((dispose) => ({
      dispose,
      owner: getOwner(),
    }));

    this.dispose = dispose;

    const self = createMutable(this);

    runWithOwner(owner, () => {
      this.directSourceConnections = createMemo(() => {
        const ret = new Set<WildcardSourceConnector>();

        for (const type of self.types) {
          for (const conn of type.sourceConnections) {
            ret.add(conn);
          }
        }

        return ret;
      });

      this.indirectSourceConnections = createMemo((prev) => {
        const ret = new Map<t.Any, WildcardSourceConnector>();

        if (self.directSourceConnections().size > 0) {
          prev?.clear();
          return prev ?? ret;
        }

        for (const type of self.types) {
          type.resolverConnections.forEach((conn) => {
            const opposite = conn.getOpposite(type);

            opposite.wildcard.directSourceConnections().forEach((conn) => {
              ret.set(type, conn);
            });

            opposite.wildcard.indirectSourceConnections();
            //   .forEach((conn, typ) => {
            //     if (typ === type) return;

            //     ret.set(typ, conn);
            //   });
          });
        }

        // for (const type of self.types) {
        //   for (const [typ, conn] of type.connections) {
        //     if (typ instanceof t.Wildcard) {
        //       const wildcardConn = typ.wildcard
        //         .directSourceConnection()
        //         .orElse(() => typ.wildcard.indirectSourceConnection());

        //       if (wildcardConn.isSome()) {
        //         console.log("indirectSourceConnection", wildcardConn);
        //         return wildcardConn;
        //       }
        //     } else return Some(conn);
        //   }
        // }

        return ret;
      });

      this.value = createOptionMemo(() => {
        // const direct = self.directSourceConnection();
        // console.log("direct", direct);
        // const value = direct
        //   .orElse(() => {
        //     const indirect = self.indirectSourceConnection();
        //     console.log("indirect", indirect);
        //     return indirect;
        //   })
        //   .map((conn) => conn.source);
        // console.log("value", value);
        // return value;

        const value = self.directSourceConnections().values().next();
        if (!value.done) return Some(value.value.source);

        const value2 = self.indirectSourceConnections().values().next();
        console.log(self.indirectSourceConnections());
        if (!value2.done) return Some(value2.value.source);

        return None;
      });
    });

    return self;
    // runWithOwner(owner, () => createEffect(() => this.calculateValue()));
  }

  // calculateValue() {
  //   // first, we gather all types that are connected to types that are
  //   // connected to this wildcard
  //   const surroundingValues = (() => {
  //     let arr: BaseType<any>[] = [];

  //     for (const type of this.types) {
  //       for (const connection of type.connections.keys()) {
  //         arr.push(connection);
  //       }
  //     }

  //     return arr;
  //   })();

  //   // if we're only connected to wildcards, reset to nothing
  //   // this deals with circular wildcard connections
  //   // it's probs not as efficient as it could be but it works so hell yeah
  //   if (this.onlyConnectedToWildcards(new Set())) {
  //     this.setValue(None);
  //     return;
  //   }

  //   // if the wildcard's value is already one of the surrounding values, don't do anything
  //   if (
  //     untrack(() => this.value())
  //       .map((v) => !!surroundingValues.find((sv) => sv === v))
  //       .unwrapOr(false)
  //   )
  //     return;

  //   const [firstValue] = surroundingValues;

  //   const newValue = (() => {
  //     if (firstValue === undefined) return None;

  //     const nonWildcardType = surroundingValues.find(
  //       (t) => !(t instanceof WildcardType)
  //     );

  //     if (nonWildcardType) return Some(nonWildcardType);

  //     const selectedValue = firstValue as WildcardType;

  //     createEffect(() => {
  //       this.setValue(selectedValue.wildcard.value());
  //     });
  //   })();

  //   if (newValue) this.setValue(newValue);
  // }

  // onlyConnectedToWildcards(checked: Set<t.Wildcard>) {
  //   // we need to go through all the connections of all types associated with this wildcard
  //   for (const type of this.types) {
  //     for (const connection of type.connections.keys()) {
  //       if (connection instanceof t.Wildcard) {
  //         // don't do work twice!
  //         if (checked.has(connection)) continue;

  //         checked.add(connection);

  //         // this might do some double-work, but it gets the job done
  //         if (!connection.wildcard.onlyConnectedToWildcards(checked))
  //           return false;
  //       } // if this is reached, everything else becomes irrelevant
  //       else return false;
  //     }
  //   }

  //   return true;
  // }
}

class WildcardTypeConnector {
  private disposeListeners = new Set<() => void>();
  private _dispose: () => void;
  disposed = false;

  constructor(public a: t.Any, public b: t.Any) {
    const { dispose } = createRoot((dispose) => {
      createEffect(() => {
        if (a instanceof t.Wildcard === b instanceof t.Wildcard) return;

        let connection: WildcardTypeConnector | undefined;

        function connectWildcards(a: t.Any, b: t.Any) {
          if (a instanceof t.Wildcard) {
            const wildcardValue = a.wildcard.value();

            wildcardValue.map((wildcardValue) => {
              if (wildcardValue === b) return;

              connection = connectWildcardsInTypes(wildcardValue, b);
            });
          }
        }

        connectWildcards(a, b);
        connectWildcards(b, a);

        onCleanup(() => connection?.dispose());
      });

      return { dispose };
    });

    this._dispose = dispose;
  }

  getOpposite(a: BaseType<any>) {
    return a === this.a ? this.b : this.a;
  }

  addDisposeListener(cb: () => void) {
    this.disposeListeners.add(cb);

    return () => {
      this.disposeListeners.delete(cb);
    };
  }

  dispose() {
    if (this.a instanceof t.Wildcard) this.a.removeConnection(this);
    if (this.b instanceof t.Wildcard) this.b.removeConnection(this);

    this._dispose();

    for (const listener of this.disposeListeners) {
      listener();
    }

    this.disposed = true;
  }
}

class WildcardSourceConnector {
  private disposeListeners = new Set<() => void>();

  constructor(public source: t.Any, public wildcard: t.Wildcard) {}

  addDisposeListener(cb: () => void) {
    this.disposeListeners.add(cb);

    return () => {
      this.disposeListeners.delete(cb);
    };
  }

  dispose() {
    this.wildcard.removeSourceConnection(this);

    for (const listener of this.disposeListeners) {
      listener();
    }
  }
}

class WildcardResolverConnector {
  private disposeListeners = new Set<() => void>();

  constructor(public a: t.Wildcard, public b: t.Wildcard) {}

  getOpposite(a: t.Wildcard) {
    return a === this.a ? this.b : this.a;
  }

  addDisposeListener(cb: () => void) {
    this.disposeListeners.add(cb);

    return () => {
      this.disposeListeners.delete(cb);
    };
  }

  dispose() {
    this.a.resolverConnections.delete(this);
    this.b.resolverConnections.delete(this);

    for (const listener of this.disposeListeners) {
      listener();
    }
  }
}

/**
 * A type that is linked to a Wildcard.
 * May be owned by an AnyType or data IO.
 */
export class WildcardType extends BaseType<unknown> {
  connections = new ReactiveMap<t.Any, WildcardTypeConnector>();
  sourceConnections = new ReactiveSet<WildcardSourceConnector>();
  resolverConnections = new ReactiveSet<WildcardResolverConnector>();

  dispose: () => void;

  constructor(public wildcard: Wildcard) {
    super();

    const { owner, dispose } = createRoot((dispose) => ({
      owner: getOwner(),
      dispose,
    }));

    this.dispose = dispose;

    wildcard.types.add(this);

    runWithOwner(owner, () => {
      onCleanup(() => {
        wildcard.types.delete(this);
      });
    });
  }

  addConnection(connection: WildcardTypeConnector) {
    const opposite = connection.getOpposite(this);

    this.connections.set(opposite, connection);
  }

  removeConnection(connection: WildcardTypeConnector) {
    const opposite = connection.getOpposite(this);

    this.connections.delete(opposite);
  }

  addSourceConnection(connection: WildcardSourceConnector) {
    this.sourceConnections.add(connection);
  }

  removeSourceConnection(connection: WildcardSourceConnector) {
    this.sourceConnections.delete(connection);
  }

  addResolverConnection(connection: WildcardResolverConnector) {
    this.resolverConnections.add(connection);
  }

  removeResolverConnection(connection: WildcardResolverConnector) {
    this.resolverConnections.delete(connection);
  }

  default(): Option<unknown> {
    return this.wildcard
      .value()
      .map((v) => v.default())
      .expect("Cannot get default of unconnected wildcard!");
  }

  variant(): TypeVariant {
    return this.wildcard
      .value()
      .map((v) => v.variant())
      .unwrapOr("wildcard");
  }

  toString(): string {
    return this.wildcard
      .value()
      .map((v) => `Wildcard(${v.toString()})`)
      .unwrapOr("Wildcard");
  }

  asZodType(): z.ZodType {
    return this.wildcard
      .value()
      .map((v) => v.asZodType())
      .unwrapOrElse(() => z.any());
  }

  getWildcards(): Wildcard[] {
    return this.wildcard
      .value()
      .map((v) => v.getWildcards())
      .unwrapOrElse(() => [this.wildcard]);
  }

  eq(other: t.Any) {
    return other instanceof t.Wildcard && other.wildcard === this.wildcard;
  }
}

export function connectWildcardsInIO(
  output: DataOutput<t.Any>,
  input: DataInput<t.Any>
) {
  connectWildcardsInTypes(output.type, input.type);
}

export function connectWildcardsInTypes(
  a: BaseType<unknown>,
  b: BaseType<unknown>
): WildcardTypeConnector | undefined {
  if (a === b) return;

  if (a instanceof t.Wildcard || b instanceof t.Wildcard) {
    const connection = new WildcardTypeConnector(a, b);

    if (a instanceof t.Wildcard) a.addConnection(connection);
    if (b instanceof t.Wildcard) b.addConnection(connection);

    if (a instanceof t.Wildcard && b instanceof t.Wildcard) {
      const connection = new WildcardResolverConnector(a, b);
      a.addResolverConnection(connection);
      b.addResolverConnection(connection);
    } else if (a instanceof t.Wildcard && !(b instanceof t.Wildcard)) {
      const connection = new WildcardSourceConnector(b, a);
      a.addSourceConnection(connection);
    } else if (b instanceof t.Wildcard && !(a instanceof t.Wildcard)) {
      const connection = new WildcardSourceConnector(a, b);
      b.addSourceConnection(connection);
    }

    return connection;
  } else if (a instanceof t.Map && b instanceof t.Map)
    return connectWildcardsInTypes(a.value, b.value);
  else if (a instanceof t.List && b instanceof t.List)
    return connectWildcardsInTypes(a.item, b.item);
  else if (a instanceof t.Option && b instanceof t.Option)
    return connectWildcardsInTypes(a.inner, b.inner);
}

export function disconnectWildcardsInIO(
  output: DataOutput<t.Any>,
  input: DataInput<t.Any>
) {
  disconnectWildcardsInTypes(output.type, input.type);
}

export function disconnectWildcardsInTypes(a: t.Any, b: t.Any) {
  if (a instanceof t.Wildcard || b instanceof t.Wildcard) {
    let connection: WildcardTypeConnector | undefined;
    let sourceConnection: WildcardSourceConnector | undefined;
    let resolverConnection: WildcardResolverConnector | undefined;

    if (a instanceof t.Wildcard) connection = a.connections.get(b);
    if (b instanceof t.Wildcard) connection = b.connections.get(a);

    if (a instanceof t.Wildcard && b instanceof t.Wildcard) {
      resolverConnection ??= [...a.resolverConnections].find(
        (c) => c.a === a || c.b === a
      );
      resolverConnection ??= [...b.resolverConnections].find(
        (c) => c.a === b || c.b === b
      );
    }
    if (a instanceof t.Wildcard && !(b instanceof t.Wildcard))
      sourceConnection = [...a.sourceConnections].find((c) => c.source === b);
    else if (b instanceof t.Wildcard && !(a instanceof t.Wildcard))
      sourceConnection = [...b.sourceConnections].find((c) => c.source === a);

    if (connection) connection.dispose();
    if (sourceConnection) sourceConnection.dispose();
    if (resolverConnection) resolverConnection.dispose();
  } else if (a instanceof t.Map && b instanceof t.Map) {
    disconnectWildcardsInTypes(a.value, b.value);
  } else if (a instanceof t.List && b instanceof t.List)
    disconnectWildcardsInTypes(a.item, b.item);
  else if (a instanceof t.Option && b instanceof t.Option)
    disconnectWildcardsInTypes(a.inner, b.inner);
}
