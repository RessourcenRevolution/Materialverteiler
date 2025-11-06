import Alert, { type Props } from "./Alert.astro";
import FlexDecorator from "../../.astrobook/decorators/FlexDecorator.astro";

export default {
  component: Alert,
};

export const Info = {
  args: {
    variant: "info",
    text: "This is an informational alert.",
  } satisfies Props,
  decorators: [{ component: FlexDecorator }],
};

export const Success = {
  args: {
    variant: "success",
    text: "This is an successful alert.",
  } satisfies Props,
  decorators: [{ component: FlexDecorator }],
};

export const Warning = {
  args: {
    variant: "warning",
    text: "This is a warning alert.",
  } satisfies Props,
  decorators: [{ component: FlexDecorator }],
};

export const Error = {
  args: {
    variant: "error",
    text: "This is a error alert.",
  } satisfies Props,
  decorators: [{ component: FlexDecorator }],
};

export const Button = {
  args: {
    variant: "info",
    text: "This is an alert with a button.",
    button: {
      label: "Button",
      href: "#",
      outline: true,
    },
  } satisfies Props,
  decorators: [{ component: FlexDecorator }],
};
