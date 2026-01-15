import { FooterSchema } from '~/schemas/footer'
import { NavigationSchema, type Navigation } from '~/schemas/navigation'
import { PageSchema } from '~/schemas/page'

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
