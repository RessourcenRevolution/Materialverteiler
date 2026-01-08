import Button, { type Props } from "./Button.astro";
import FlexDecorator from "../../.astrobook/decorators/FlexDecorator.astro";
import icon from "./icon.svg";

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

export const Small = {
  args: {
    label: "Button",
    size: 'sm'
  } satisfies Props,
  decorators: [{ component: FlexDecorator }],
};

export const Large = {
  args: {
    label: "Button",
    size: 'lg'
  } satisfies Props,
  decorators: [{ component: FlexDecorator }],
};

export const Icon = {
  args: {
    label: "Button",
    icon: icon
  } satisfies Props,
  decorators: [{ component: FlexDecorator }],
};

export const IconSmall = {
  args: {
    label: "Button",
    icon: icon,
    size: 'sm'
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
  } satisfies Props,
  decorators: [{ component: FlexDecorator }],
};
