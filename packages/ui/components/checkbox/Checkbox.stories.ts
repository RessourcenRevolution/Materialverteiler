import Checkbox, { type Props } from "./Checkbox.astro";
import FlexDecorator from "../../.astrobook/decorators/FlexDecorator.astro";

export default {
  component: Checkbox,
};

export const Default = {
  args: {
    id: "id1",
    name: "Checkbox",
    label: "Lorem ipsum dolor sit amet, consectetur adipiscing elit.",
  } satisfies Props,
  decorators: [{ component: FlexDecorator }],
};

export const Error = {
  args: {
    id: "id2",
    name: "Checkbox",
    label: "Label",
    error: "This field is required.",
  } satisfies Props,
  decorators: [{ component: FlexDecorator }],
};
