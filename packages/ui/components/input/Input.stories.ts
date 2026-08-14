import Input, { type Props } from './Input.astro'
import FlexDecorator from '../../.astrobook/decorators/FlexDecorator.astro'
import Icon from '../../.astrobook/icon.svg'

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

export const Prefix = {
  args: {
    id: 'input-default',
    name: 'input',
    label: 'Label',
    prefix: Icon,
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
