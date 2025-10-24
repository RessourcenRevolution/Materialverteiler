import Card, { type Props } from "./Card.astro";
import FlexDecorator from "../../.astrobook/decorators/FlexDecorator.astro";

export default {
  component: Card,
};

export const Default = {
  args: {
    title: "Title",
    content: "<p>Lorem ipsum dolor sit amet.</p>",
  } satisfies Props,
  decorators: [{ component: FlexDecorator }],
};
export const NoBorder = {
  args: {
    title: "Title",
    content: "<p>Lorem ipsum dolor sit amet.</p>",
    border: false,
  } satisfies Props,
  decorators: [{ component: FlexDecorator }],
};
