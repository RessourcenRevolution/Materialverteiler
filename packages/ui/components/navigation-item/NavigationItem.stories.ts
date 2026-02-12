import NavigationItem, { type Props } from './NavigationItem.astro'
import FlexDecorator from '../../.astrobook/decorators/FlexDecorator.astro'

export default {
  component: NavigationItem,
}

export const Default = {
  args: {
    name: 'NavigationItem',
  } satisfies Props,
  decorators: [{ component: FlexDecorator }],
}
