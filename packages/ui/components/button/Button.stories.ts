import Button, { type Props } from "./Button.astro";
import FlexDecorator from "../../.astrobook/decorators/FlexDecorator.astro";

export default {
  component: Button,
};

export const Default = {
  args: {
    label: "Button",
  } satisfies Props,
  decorators: [{ component: FlexDecorator }],
};

export const Primary = {
  args: {
    label: "Button",
    variant: "primary"
  } satisfies Props,
  decorators: [{ component: FlexDecorator }],
};

export const Link = {
  args: {
    label: "Link",
    href: "#",
  } satisfies Props,
  decorators: [{ component: FlexDecorator }],
};

export const Outline = {
  args: {
    label: "Button",
    outline: true,
  } satisfies Props,
  decorators: [{ component: FlexDecorator }],
};
