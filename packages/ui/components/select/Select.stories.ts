import Select, { type Props } from "./Select.astro";
import FlexDecorator from "../../.astrobook/decorators/FlexDecorator.astro";

export default {
  component: Select,
};

export const Default = {
  args: {
    id: "id1",
    name: "select",
    label: "Lorem ipsum dolor sit amet, consectetur adipiscing elit.",
    options: [
      { value: 'test1', label: 'Label 1' },
      { value: 'test2', label: 'Label 2' },
      { value: 'test3', label: 'Label 3' }
  ]
  } satisfies Props,
  decorators: [{ component: FlexDecorator }],
};

export const Error = {
  args: {
    id: "id2",
    name: "select",
    label: "Label",
    error: "This field is required.",
    options: [
      { value: 'test1', label: 'Label 1' },
      { value: 'test2', label: 'Label 2' },
      { value: 'test3', label: 'Label 3' }
  ]
  } satisfies Props,
  decorators: [{ component: FlexDecorator }],
};
