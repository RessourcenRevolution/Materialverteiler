import ImageInput, { type Props } from './ImageInput.astro'
import FlexDecorator from '../../.astrobook/decorators/FlexDecorator.astro'

export default {
  component: ImageInput,
}

export const Default = {
  args: {
    name: 'input',
    label: 'Label',
  } satisfies Props,
  decorators: [{ component: FlexDecorator }],
}
