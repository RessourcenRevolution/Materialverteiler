// Test fixtures, seeded into a fresh database when SEED_TEST_DATA=true.
// Plain data only, so tests can import it to assert against.

export const apiUser = {
  name: 'Test API user',
  email: 'api@test.local',
  password: 'test-password-123',
}

// Helpers to build Keystone document field content
const text = (value: string, marks: { bold?: true } = {}) => ({ text: value, ...marks })
const paragraph = (...children: object[]) => ({ type: 'paragraph', children })
const heading = (level: number, value: string) => ({ type: 'heading', level, children: [text(value)] })
const link = (href: string, value: string) => ({ type: 'link', href, children: [text(value)] })

const textBlock = (size: 'normal' | 'large', ...children: object[]) => ({
  type: 'component-block',
  component: 'text',
  props: { size, framed: false, content: null },
  children: [{ type: 'component-block-prop', propPath: ['content'], children }],
})

const buttonBlock = (href: string, label: string) => ({
  type: 'component-block',
  component: 'button',
  props: { link: href, size: 'large', variant: 'primary', content: null },
  children: [{ type: 'component-inline-prop', propPath: ['content'], children: [text(label)] }],
})

/** Image component block, for an Image item created by the seed. */
const imageBlock = (id: string) => ({
  type: 'component-block',
  component: 'image',
  props: { image: { id } },
  children: [{ type: 'component-inline-prop', children: [text('')] }],
})

// Photo: "Stacked wood planks (Unsplash)", CC0, via Wikimedia Commons
// https://commons.wikimedia.org/wiki/File:Stacked_wood_planks_(Unsplash).jpg
export const heroImage = {
  name: 'Stacked wood planks',
  altText: 'Stacked wooden planks',
  // Relative to the Keystone app folder
  file: 'seed/images/stacked-wood-planks.jpg',
}

const twoColumns = (left: object[], right: object[]) => ({
  type: 'layout',
  layout: [1, 1],
  children: [
    { type: 'layout-area', children: left },
    { type: 'layout-area', children: right },
  ],
})

export const homepage = {
  title: 'Home',
  slug: '',
  access: 'public',
}

/** Homepage content, with the ID of the seeded hero image. */
export const homepageContent = (heroImageId: string) => [
  twoColumns(
    [imageBlock(heroImageId)],
    [
      textBlock(
        'large',
        heading(1, 'Materialverteiler'),
        paragraph(
          text(
            'Materialverteiler stands for a future of circular economy, sustainable design and creative collaboration.',
            { bold: true },
          ),
        ),
        paragraph(
          text(
            'A simple, digital way for institutions to pass on items and materials, giving them a second life instead of discarding them.',
          ),
        ),
      ),
      buttonBlock('/app/signup', 'Join the community'),
    ],
  ),
  twoColumns(
    [
      textBlock(
        'normal',
        heading(2, 'Pass on your materials'),
        paragraph(
          text(
            'List furniture, building materials or leftovers from events and exhibitions. Other institutions can request them, and we take care of the rest.',
          ),
        ),
      ),
    ],
    [
      textBlock(
        'normal',
        heading(2, 'CO₂ accounting for your material'),
        paragraph(
          text(
            'On request, every distributed material gets a CO₂ balance, including methodology and indicators for your sustainability reporting.',
          ),
        ),
      ),
    ],
  ),
]

export const mainNavigation = {
  name: 'main',
  items: [
    { title: 'Listings', path: '/app/listings', icon: '' },
    { title: 'About us', path: '/about-us', icon: '' },
  ],
}

export const metaNavigation = {
  name: 'meta',
  items: [{ title: 'Profile', path: '/app/profile', icon: 'profile-circle' }],
}

export const footer = {
  content: [
    paragraph(text('Materialverteiler', { bold: true })),
    paragraph(link('mailto:info@example.org', 'info@example.org')),
  ],
  links: [
    { title: 'Log in', path: '/app/login', icon: '' },
    { title: 'Listings', path: '/app/listings', icon: '' },
    { title: 'About us', path: '/about-us', icon: '' },
    { title: 'Imprint', path: '/imprint', icon: '' },
    { title: 'Privacy', path: '/privacy', icon: '' },
  ],
}
