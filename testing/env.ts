import { apiUser } from '../apps/keystone/seed/fixtures'

// Test stack runs on its own ports, so it can run next to the dev stack.
export const WEB_PORT = 3100
export const KEYSTONE_PORT = 3102
export const BROWSER_SERVER_PORT = 3200

export const WEB_URL = `http://localhost:${WEB_PORT}`
export const KEYSTONE_URL = `http://localhost:${KEYSTONE_PORT}`
export const KEYSTONE_GRAPHQL_ENDPOINT = `${KEYSTONE_URL}/api/graphql`

export const keystoneEnv = {
  PORT: String(KEYSTONE_PORT),
  // Everything in data/test is removed on each start of the test server
  DATABASE_URL: 'file:./data/test/keystone.db',
  IMAGES_PATH: 'data/test/images',
  SEED_TEST_DATA: 'true',
  SESSION_SECRET: 'test-session-secret-at-least-32-characters-long',
  KEYSTONE_BASE_URL: KEYSTONE_URL,
  WEB_APP_BASE_URL: WEB_URL,
}

export const webEnv = {
  PORT: String(WEB_PORT),
  APP_PORT: String(WEB_PORT),
  APP_HOST: 'localhost',
  APP_NAME: 'Materialverteiler',
  APP_LANGUAGE: 'en',
  TEST_MODE: 'false',
  // Pocketbase is not part of the test stack yet
  API_URL: 'http://localhost:3190',
  PUBLIC_API_URL: 'http://localhost:3190',
  KEYSTONE_BASE_URL: KEYSTONE_URL,
  KEYSTONE_GRAPHQL_ENDPOINT,
  KEYSTONE_API_USER_EMAIL: apiUser.email,
  KEYSTONE_API_USER_PASSWORD: apiUser.password,
}
