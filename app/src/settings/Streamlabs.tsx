import { sl } from "@macrograph/packages";
import { z } from "zod";
import { Field, Form, createForm, zodForm } from "@modular-forms/solid";
import { Match, Switch } from "solid-js";
import { Button, Input } from "./ui";

const Schema = z.object({
  botToken: z.string(),
});

export default () => {
  return (
    <Switch fallback="Loading...">
      <Match when={sl.token().value}>
        <Button onSubmit={sl.disconnect}>Disconnect</Button>
      </Match>
      <Match when={sl.token().value === "null"}>
        {(_) => {
          const [, { Form, Field }] = createForm({
            initialValues: {
              botToken: sl.token().value,
            },
            validate: zodForm(Schema),
          });

          return (
            <Form
              onSubmit={(d) => sl.setToken(d.botToken)}
              class="flex flex-row space-x-4"
            >
              <Field name="botToken">
                {(field, props) => (
                  <Input
                    {...props}
                    type="password"
                    placeholder="Streamlabs Token"
                    value={field.value}
                  />
                )}
              </Field>
              <Button type="submit">Submit</Button>
            </Form>
          );
        }}
      </Match>
    </Switch>
  );
};
