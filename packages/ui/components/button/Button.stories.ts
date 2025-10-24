import Button, { type Props } from "./Button.astro";
import FlexDecorator from "../../.astrobook/decorators/FlexDecorator.astro";

export default {
  component: Button,
};

export const Default = {
  args: {
    label: "Button 2",
  } satisfies Props,
  decorators: [{ component: FlexDecorator }],
};
