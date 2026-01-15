import type { Navigation } from '~/schemas/navigation'
import type { Page } from '~/schemas/page'

async function fetchKeystone({ query, variables }: { query: string, variables?: Record<string, any> }) {
  if (!process.env.KEYSTONE_GRAPHQL_ENDPOINT) {
    throw new Error('KEYSTONE_GRAPHQL_ENDPOINT environment variable is not set')
  }
  const response = await fetch(process.env.KEYSTONE_GRAPHQL_ENDPOINT, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      query: query,
      variables,
    }),
  })

  const result = await response.json()
  return result?.data
}

export async function fetchNavigations() {
  const data = await fetchKeystone({
    query: `
      query Navigations {
        navigations {
          name
          items {
            icon
            title
            path
          }
        }
      }
    `,
  })
  const mainNavigation = (data?.navigations as Navigation[] || [])?.find(nav => nav.name === 'main') || null as Navigation | null
  const metaNavigation = (data?.navigations as Navigation[] || []).find(nav => nav.name === 'meta') || null as Navigation | null
  return {
    mainNavigation,
    metaNavigation,
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

  const page = data?.page as Page | null
  return {
    page,
  }
}
