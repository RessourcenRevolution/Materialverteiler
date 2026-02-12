import Input, { type Props } from './Input.astro'
import FlexDecorator from '../../.astrobook/decorators/FlexDecorator.astro'

export default {
  component: Input,
}

export const Default = {
  args: {
    id: 'input-default',
    name: 'input',
    label: 'Label',
  } satisfies Props,
  decorators: [{ component: FlexDecorator }],
}

export const Error = {
  args: {
    id: 'input-error',
    name: 'input',
    label: 'Label',
    error: 'This field is required.',
  } satisfies Props,
  decorators: [{ component: FlexDecorator }],
}
