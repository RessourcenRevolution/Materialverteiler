import Badge, { type Props } from "./Badge.astro";
import FlexDecorator from "../../.astrobook/decorators/FlexDecorator.astro";

export default {
  component: Badge,
};

export const Neutral = {
  args: {
    label: "Label",
    variant: 'neutral'
  } satisfies Props,
  decorators: [{ component: FlexDecorator }],
};

export const Info = {
  args: {
    label: "Label",
    variant: 'info'
  } satisfies Props,
  decorators: [{ component: FlexDecorator }],
};

export const Success = {
  args: {
    label: "Label",
    variant: 'success'
  } satisfies Props,
  decorators: [{ component: FlexDecorator }],
};

export const Warning = {
  args: {
    label: "Label",
    variant: 'warning'
  } satisfies Props,
  decorators: [{ component: FlexDecorator }],
};

export const Error = {
  args: {
    label: "Label",
    variant: 'error'
  } satisfies Props,
  decorators: [{ component: FlexDecorator }],
};