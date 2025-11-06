import Container, { type Props } from "./Container.astro";
import FlexDecorator from "../../.astrobook/decorators/FlexDecorator.astro";

export default {
  component: Container,
};

export const Default = {
  args: {
    content:
      "Lorem ipsum dolor sit amet. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.",
  } satisfies Props,
  decorators: [{ component: FlexDecorator }],
};
export const Small = {
  args: {
    content:
      "Lorem ipsum dolor sit amet. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.",
    size: "sm",
  } satisfies Props,
  decorators: [{ component: FlexDecorator }],
};
export const Medium = {
  args: {
    content:
      "Lorem ipsum dolor sit amet. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.",
    size: "md",
  } satisfies Props,
  decorators: [{ component: FlexDecorator }],
};
export const Large = {
  args: {
    content:
      "Lorem ipsum dolor sit amet. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.",
    size: "lg",
  } satisfies Props,
  decorators: [{ component: FlexDecorator }],
};
export const ExtraLarge = {
  args: {
    content:
      "Lorem ipsum dolor sit amet. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.",
    size: "xl",
  } satisfies Props,
  decorators: [{ component: FlexDecorator }],
};
