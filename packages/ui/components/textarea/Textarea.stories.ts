import Textarea, { type Props } from "./Textarea.astro";
import FlexDecorator from "../../.astrobook/decorators/FlexDecorator.astro";

export default {
  component: Textarea,
};

export const Default = {
  args: {
    name: "textarea",
    label: "Label",
    placeholder: "Placeholder...",
  } satisfies Props,
  decorators: [{ component: FlexDecorator }],
};

export const Error = {
  args: {
    name: "textarea",
    label: "Label",
    placeholder: "Placeholder...",
    error: "This field is required.",
  } satisfies Props,
  decorators: [{ component: FlexDecorator }],
};
