import Heading, { type Props } from "./Heading.astro";
import FlexDecorator from "../../.astrobook/decorators/FlexDecorator.astro";

export default {
  component: Heading,
};

export const Xl = {
  args: {
    tag: "h1",
    text: "Heading",
    size: 'xl'
  } satisfies Props,
  decorators: [{ component: FlexDecorator }],
};

export const Lg = {
  args: {
    tag: "h2",
    text: "Heading",
    size: 'lg'
  } satisfies Props,
  decorators: [{ component: FlexDecorator }],
};

export const Md = {
  args: {
    tag: "h3",
    text: "Heading",
    size: 'md'
  } satisfies Props,
  decorators: [{ component: FlexDecorator }],
};

export const Sm = {
  args: {
    tag: "h4",
    text: "Heading",
    size: 'sm'
  } satisfies Props,
  decorators: [{ component: FlexDecorator }],
};