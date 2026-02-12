import FileInput, { type Props } from './FileInput.astro'
import FlexDecorator from '../../.astrobook/decorators/FlexDecorator.astro'

export default {
  component: FileInput,
}

export const Default = {
  args: {
    name: 'input',
    label: 'Label',
  } satisfies Props,
  decorators: [{ component: FlexDecorator }],
}
