import { FooterSchema } from '~/schemas/footer'
import { NavigationSchema, type Navigation } from '~/schemas/navigation'
import { PageSchema } from '~/schemas/page'

const authState = {
  sessionToken: '',
}

const KEYSTONE_API_USER_EMAIL = process.env.KEYSTONE_API_USER_EMAIL
const KEYSTONE_API_USER_PASSWORD = process.env.KEYSTONE_API_USER_PASSWORD

if (!KEYSTONE_API_USER_EMAIL) {
  throw new Error('KEYSTONE_API_USER_EMAIL environment variable is not set')
}
if (!KEYSTONE_API_USER_PASSWORD) {
  throw new Error('KEYSTONE_API_USER_PASSWORD environment variable is not set')
}

export async function fetchKeystone({ query, variables, auth = true }: { query: string, variables?: Record<string, any>, auth?: boolean }) {
  if (!process.env.KEYSTONE_GRAPHQL_ENDPOINT) {
    throw new Error('KEYSTONE_GRAPHQL_ENDPOINT environment variable is not set')
  }
  if (auth && !authState.sessionToken) {
    const data = await fetchKeystone({
      auth: false,
      query: `
        mutation {
          authenticateUserWithPassword(
            email: "${KEYSTONE_API_USER_EMAIL}",
            password: "${KEYSTONE_API_USER_PASSWORD}"
          ) {
            ... on UserAuthenticationWithPasswordSuccess {
              sessionToken
            }
            ... on UserAuthenticationWithPasswordFailure {
              message
            }
          }
        }
      `,
    })
    if (data?.authenticateUserWithPassword?.message) {
      console.error(`Error authenticating user: ${data.authenticateUserWithPassword.message}`)
      throw new Error('Failed to authenticate with keystone')
    }
    if (!data?.authenticateUserWithPassword?.sessionToken) {
      throw new Error('Failed to authenticate with keystone, no session token returned')
    }
    authState.sessionToken = data?.authenticateUserWithPassword?.sessionToken
  }
  const response = await fetch(process.env.KEYSTONE_GRAPHQL_ENDPOINT, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', 'Cookie': `keystonejs-session=${authState.sessionToken}` },
    body: JSON.stringify({
      query: query,
      variables,
    }),
  })
  if (response.status >= 400) {
    const text = await response.text()
    throw new Error(`Error fetching data from Keystone: ${response.statusText} ${text}`)
  }

  const result = await response.json()
  return result?.data
}

export async function fetchLayout() {
  let data
  try {
    data = await fetchKeystone({
      query: `
      query Layout {
        navigations {
          name
          items {
            icon
            title
            path
          }
        }
        footers {
          content {
            document(hydrateRelationships: true)
          }
          links {
            icon
            title
            path
          }
        }
      }
    `,
    })
  }
  catch (error) {
    console.error(error)
    return { mainNavigation: null, metaNavigation: null, footer: null }
  }

  const mainNavigation = (data?.navigations as Navigation[] || [])?.find(nav => nav.name === 'main')
  const metaNavigation = (data?.navigations as Navigation[] || []).find(nav => nav.name === 'meta')

  return {
    mainNavigation: mainNavigation ? NavigationSchema.parse(mainNavigation) : null,
    metaNavigation: metaNavigation ? NavigationSchema.parse(metaNavigation) : null,
    footer: data?.footers?.[0] ? FooterSchema.parse(data?.footers?.[0]) : null,
  }
}

export async function fetchPage(path: string | undefined) {
  const data = await fetchKeystone({
    query: `
      query Page($where: PageWhereUniqueInput!) {
        page(where: $where) {
          title
          access
          content {
            document(hydrateRelationships: true)
          }
        }
      }
    `,
    variables: {
      where: {
        path: `/${path || ''}`,
      },
    },
  })

  const page = data?.page ? PageSchema.parse(data?.page) : null
  return {
    page,
  }
}
