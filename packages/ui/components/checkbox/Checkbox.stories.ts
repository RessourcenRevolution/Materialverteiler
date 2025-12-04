import Checkbox, { type Props } from "./Checkbox.astro";
import FlexDecorator from "../../.astrobook/decorators/FlexDecorator.astro";

export default {
  component: Checkbox,
};

export const Default = {
  args: {
    name: "Checkbox",
    label: "Lorem ipsum dolor sit amet, consectetur adipiscing elit.",
  } satisfies Props,
  decorators: [{ component: FlexDecorator }],
};

export const Error = {
  args: {
    name: "Checkbox",
    label: "Label",
    error: "This field is required.",
  } satisfies Props,
  decorators: [{ component: FlexDecorator }],
};
