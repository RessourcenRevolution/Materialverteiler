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

export const Link = {
  args: {
    label: "Link",
    href: "#",
  } satisfies Props,
  decorators: [{ component: FlexDecorator }],
};
