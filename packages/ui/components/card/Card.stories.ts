import Card, { type Props } from './Card.astro'
import FlexDecorator from '../../.astrobook/decorators/FlexDecorator.astro'

export default {
  component: Card,
}

export const Default = {
  args: {
    image: 'https://placehold.co/600x400',
    content: '<h2 class="text-2xl font-bold text-heading">Title</h2><p class="text-body text-base">Lorem ipsum dolor sit amet.</p>',
  } satisfies Props,
  decorators: [{ component: FlexDecorator }],
}
