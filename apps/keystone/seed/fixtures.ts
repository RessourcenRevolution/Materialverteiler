// Test fixtures, seeded into a fresh database when SEED_TEST_DATA=true.
// Plain data only, so tests can import it to assert against.

export const apiUser = {
  name: 'Test API user',
  email: 'api@test.local',
  password: 'test-password-123',
}

export const homepage = {
  title: 'Home',
  slug: '',
  access: 'public',
  content: [
    {
      type: 'heading',
      level: 1,
      children: [{ text: 'Give materials a second life' }],
    },
    {
      type: 'paragraph',
      children: [{ text: 'Institutions pass on items and materials instead of discarding them.' }],
    },
  ],
}

export const mainNavigation = {
  name: 'main',
  items: [
    { title: 'Listings', path: '/app/listings', icon: '' },
    { title: 'About', path: '/about', icon: '' },
  ],
}
