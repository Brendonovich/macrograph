import { Package, t } from "@macrograph/core";
import { option } from "@macrograph/core/src/types/t";
import {
  Body,
  Box,
  Circle,
  EventEmitter,
  ImpactEvent,
  Plane,
  PostStepEvent,
  Shape,
  World,
} from "p2";

let worlds = new Map<string, [World, EventEmitter[], number]>();
let bodies = new Map<string, Body>();
let shapes = new Map<string, Shape>();

export function pkg() {
  const pkg = new Package({
    name: "Physics",
  });

  pkg.createNonEventSchema({
    name: "Create World",
    variant: "Exec",
    generateIO(io) {
      return {
        name: io.dataInput({
          id: "name",
          name: "World Name",
          type: t.string(),
        }),
        gravityx: io.dataInput({
          id: "gravityX",
          name: "Gravity X",
          type: t.float(),
        }),
        gravityy: io.dataInput({
          id: "gravityY",
          name: "Gravity Y",
          type: t.float(),
        }),
      };
    },
    run({ ctx, io }) {
      let gravity = [0, 0] as [number, number];
      let events = [] as EventEmitter[];

      if (ctx.getInput(io.gravityx) != 0)
        gravity[0] = ctx.getInput(io.gravityx);
      if (ctx.getInput(io.gravityy) != 0)
        gravity[1] = ctx.getInput(io.gravityy);
      let world = new World({
        gravity,
      });

      if (worlds.has(ctx.getInput(io.name))) return;

      let poststep = world.on(`postStep`, function (event: PostStepEvent) {
        pkg.emitEvent({
          name: "postStep",
          data: {
            world: ctx.getInput(io.name),
            data: event,
          },
        });
      });

      events.push(poststep);

      let impact = world.on(`impact`, function (event: ImpactEvent) {
        pkg.emitEvent({
          name: "impact",
          data: {
            data: event,
          },
        });
      });

      events.push(impact);

      worlds.set(ctx.getInput(io.name), [world, events, 0]);
    },
  });

  pkg.createNonEventSchema({
    name: "Create Body",
    variant: "Exec",
    generateIO(io) {
      return {
        name: io.dataInput({
          id: "name",
          name: "Name",
          type: t.string(),
        }),
        // angle: io.dataInput({
        //   id: "angle",
        //   name: "Angle",
        //   type: t.option(t.float()),
        // }),
        // angularForce: io.dataInput({
        //     id: "angularForce",
        //     name: "Angular Force",
        //     type: t.option(t.float()),
        // }),
        // angularVelocity: io.dataInput({
        //     id: "angularVelocity",
        //     name: "Angular Velocity",
        //     type: t.option(t.float()),
        // }),
        // BoundingRadius: io.dataInput({
        //     id: "BoundingRadius",
        //     name: "Bounding Radius",
        //     type: t.option(t.float()),
        // }),
        // collisionResponse: io.dataInput({
        //     id: "collisionResponse",
        //     name: "Collision Response",
        //     type: t.option(t.float()),
        // }),
        // damping: io.dataInput({
        //     id: "damping",
        //     name: "Damping",
        //     type: t.option(t.float()),
        // }),
        // fixedRotation: io.dataInput({
        //     id: "fixedRotation",
        //     name: "Fixed Rotation",
        //     type: t.option(t.bool()),
        // }),
        // fixedX: io.dataInput({
        //     id: "fixedX",
        //     name: "Fixed X Axis",
        //     type: t.option(t.bool()),
        // }),
        // fixedY: io.dataInput({
        //     id: "fixedY",
        //     name: "Fixed Y Axis",
        //     type: t.option(t.bool()),
        // }),
        // forceX: io.dataInput({
        //     id: "forceX",
        //     name: "X Axis Force",
        //     type: t.option(t.float()),
        // }),
        // forceY: io.dataInput({
        //     id: "forceY",
        //     name: "Y Axis Force",
        //     type: t.option(t.float()),
        // }),
        // gravityScale: io.dataInput({
        //     id: "gravityScale",
        //     name: "Gravity Scale",
        //     type: t.option(t.float()),
        // }),
        // inertia: io.dataInput({
        //     id: "inertia",
        //     name: "Inertia",
        //     type: t.option(t.float()),
        // }),
        mass: io.dataInput({
          id: "mass",
          name: "Mass",
          type: t.float(),
        }),
        positionX: io.dataInput({
          id: "positionX",
          name: "Position X",
          type: t.float(),
        }),
        positionY: io.dataInput({
          id: "positionY",
          name: "Position Y",
          type: t.float(),
        }),
        // type: io.dataInput({
        //     id: "type",
        //     name: "Type",
        //     type: t.int(),
        // }),
      };
    },
    run({ ctx, io }) {
      const thingy: Record<string, any> = {};

      //   ctx.getInput(io.mass).map((v) => (thingy.mass = v));
      //   ctx.getInput(io.positionX).map((v) => (thingy.position[0] = v));
      //   ctx.getInput(io.positionY).map((v) => (thingy.position[1] = v));

      if (ctx.getInput(io.mass) != 0) thingy.mass = ctx.getInput(io.mass);
      if (ctx.getInput(io.positionX) != 0 && ctx.getInput(io.positionY) != 0) {
        thingy.position = [
          ctx.getInput(io.positionX),
          ctx.getInput(io.positionY),
        ];
      }
      if (ctx.getInput(io.positionX) != 0 && ctx.getInput(io.positionY) === 0) {
        thingy.position = [ctx.getInput(io.positionX), 0];
      }
      if (ctx.getInput(io.positionX) === 0 && ctx.getInput(io.positionY) != 0) {
        thingy.position = [0, ctx.getInput(io.positionY)];
      }
      thingy.id = ctx.getInput(io.name);

      let body = new Body(thingy);

      if (!bodies.has(ctx.getInput(io.name)))
        bodies.set(ctx.getInput(io.name), body);
    },
  });

  pkg.createNonEventSchema({
    name: "Create Circle Shape",
    variant: "Exec",
    generateIO(io) {
      return {
        name: io.dataInput({
          id: "name",
          name: "Name",
          type: t.string(),
        }),
        radius: io.dataInput({
          id: "radius",
          name: "Radius",
          type: t.float(),
        }),
      };
    },
    run({ ctx, io }) {
      let shape = new Circle({ radius: ctx.getInput(io.radius) });
      if (!shapes.has(ctx.getInput(io.name)))
        shapes.set(ctx.getInput(io.name), shape);
    },
  });

  pkg.createNonEventSchema({
    name: "Create Box Shape",
    variant: "Exec",
    generateIO(io) {
      return {
        name: io.dataInput({
          id: "name",
          name: "Name",
          type: t.string(),
        }),
        height: io.dataInput({
          id: "height",
          name: "Height",
          type: t.float(),
        }),
        width: io.dataInput({
          id: "width",
          name: "Width",
          type: t.float(),
        }),
      };
    },
    run({ ctx, io }) {
      let shape = new Box({
        height: ctx.getInput(io.height),
        width: ctx.getInput(io.width),
      });
      if (!shapes.has(ctx.getInput(io.name)))
        shapes.set(ctx.getInput(io.name), shape);
    },
  });

  pkg.createNonEventSchema({
    name: "Create Plane Shape",
    variant: "Exec",
    generateIO(io) {
      return {
        name: io.dataInput({
          id: "name",
          name: "Name",
          type: t.string(),
        }),
      };
    },
    run({ ctx, io }) {
      let shape = new Plane({});
      if (!shapes.has(ctx.getInput(io.name)))
        shapes.set(ctx.getInput(io.name), shape);
    },
  });

  pkg.createNonEventSchema({
    name: "Add Shape To Body",
    variant: "Exec",
    generateIO(io) {
      return {
        bodyName: io.dataInput({
          id: "bodyName",
          name: "Body Name",
          type: t.string(),
        }),
        shapeName: io.dataInput({
          id: "shapeName",
          name: "Shape Name",
          type: t.string(),
        }),
      };
    },
    run({ ctx, io }) {
      if (!bodies.has(ctx.getInput(io.bodyName))) return;
      if (!shapes.has(ctx.getInput(io.shapeName))) return;
      let body = bodies.get(ctx.getInput(io.bodyName));
      let shape = shapes.get(ctx.getInput(io.shapeName));

      body?.addShape(shape!);
    },
  });

  pkg.createNonEventSchema({
    name: "Add Body To World",
    variant: "Exec",
    generateIO(io) {
      return {
        bodyName: io.dataInput({
          id: "bodyName",
          name: "Body Name",
          type: t.string(),
        }),
        worldName: io.dataInput({
          id: "worldName",
          name: "World Name",
          type: t.string(),
        }),
      };
    },
    run({ ctx, io }) {
      if (!bodies.has(ctx.getInput(io.bodyName))) return;
      if (!worlds.has(ctx.getInput(io.worldName))) return;
      let body = bodies.get(ctx.getInput(io.bodyName));
      let world = worlds.get(ctx.getInput(io.worldName))!;

      world[0].addBody(body!);
    },
  });

  pkg.createNonEventSchema({
    name: "Remove Body To World",
    variant: "Exec",
    generateIO(io) {
      return {
        bodyName: io.dataInput({
          id: "bodyName",
          name: "Body Name",
          type: t.string(),
        }),
        worldName: io.dataInput({
          id: "worldName",
          name: "World Name",
          type: t.string(),
        }),
      };
    },
    run({ ctx, io }) {
      if (!bodies.has(ctx.getInput(io.bodyName))) return;
      if (!worlds.has(ctx.getInput(io.worldName))) return;
      let body = bodies.get(ctx.getInput(io.bodyName));
      let world = worlds.get(ctx.getInput(io.worldName))!;

      world[0].removeBody(body!);
    },
  });

  pkg.createNonEventSchema({
    name: "Get Bodies in World",
    variant: "Exec",
    generateIO(io) {
      return {
        worldName: io.dataInput({
          id: "worldName",
          name: "World Name",
          type: t.string(),
        }),
        bodies: io.dataOutput({
          id: "bodies",
          name: "Bodies",
          type: t.list(t.string()),
        }),
      };
    },
    run({ ctx, io }) {
      if (!worlds.has(ctx.getInput(io.worldName))) return;
      let world = worlds.get(ctx.getInput(io.worldName))!;
      let bodies: string[] = [];
      world[0].bodies.forEach((data) => {
        bodies.push(data.id);
      });
      ctx.setOutput(io.bodies, bodies);
    },
  });

  pkg.createNonEventSchema({
    name: "Get Body",
    variant: "Exec",
    generateIO(io) {
      return {
        bodyName: io.dataInput({
          id: "bodyName",
          name: "Body Name",
          type: t.string(),
        }),
        positionX: io.dataOutput({
          id: "positionX",
          name: "Position X",
          type: t.float(),
        }),
        positionY: io.dataOutput({
          id: "positionY",
          name: "Position Y",
          type: t.float(),
        }),
        angle: io.dataOutput({
          id: "angle",
          name: "Angle",
          type: t.float(),
        }),
      };
    },
    run({ ctx, io }) {
      if (!bodies.has(ctx.getInput(io.bodyName))) return;
      let body = bodies.get(ctx.getInput(io.bodyName))!;

      ctx.setOutput(io.positionX, body.position[0]);
      ctx.setOutput(io.positionY, body.position[1]);
      ctx.setOutput(io.angle, body.angle);
    },
  });

  pkg.createNonEventSchema({
    name: "Start Physics",
    variant: "Exec",
    generateIO(io) {
      return {
        worldName: io.dataInput({
          id: "worldName",
          name: "World Name",
          type: t.string(),
        }),
        frequency: io.dataInput({
          id: "frequency",
          name: "Frequency (FPS)",
          type: t.int(),
        }),
      };
    },
    run({ ctx, io }) {
      if (!worlds.has(ctx.getInput(io.worldName))) return;
      let world = worlds.get(ctx.getInput(io.worldName))!;

      if (world[2] != 0) return;

      let interval = window.setInterval(() => {
        world[0].step(ctx.getInput(io.frequency) / 1000);
      }, (1 / ctx.getInput(io.frequency)) * 1000);

      world[2] = interval;
      worlds.set(ctx.getInput(io.worldName), world);
    },
  });

  pkg.createNonEventSchema({
    name: "Stop Physics",
    variant: "Exec",
    generateIO(io) {
      return {
        worldName: io.dataInput({
          id: "worldName",
          name: "World Name",
          type: t.string(),
        }),
      };
    },
    run({ ctx, io }) {
      if (!worlds.has(ctx.getInput(io.worldName))) return;
      let world = worlds.get(ctx.getInput(io.worldName))!;

      clearInterval(world[2]);

      world[2] = 0;

      worlds.set(ctx.getInput(io.worldName), world);
    },
  });

  pkg.createEventSchema({
    name: "Post Step",
    event: "postStep",
    generateIO(io) {
      return {
        exec: io.execOutput({
          id: "exec",
        }),
        world: io.dataOutput({
          id: "world",
          name: "World",
          type: t.string(),
        }),
      };
    },
    run({ ctx, data, io }) {
      ctx.setOutput(io.world, data.world);
      ctx.exec(io.exec);
    },
  });

  return pkg;
}
