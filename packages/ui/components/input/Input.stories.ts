import Input, { type Props } from "./Input.astro";
import FlexDecorator from "../../.astrobook/decorators/FlexDecorator.astro";

export default {
  component: Input,
};

export const Default = {
  args: {
    name: "input",
    label: "Label",
    placeholder: "Placeholder...",
  } satisfies Props,
  decorators: [{ component: FlexDecorator }],
};
