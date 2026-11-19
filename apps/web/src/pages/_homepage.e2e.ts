import { expect, test } from '@playwright/test'
import { homepage, mainNavigation } from '../../../keystone/seed/fixtures'

test('renders the homepage from Keystone', async ({ page }) => {
  const response = await page.goto('/')

  expect(response?.status()).toBe(200)
  await expect(page).toHaveTitle(`${homepage.title} | Materialverteiler`)
  await expect(page.getByRole('heading', { level: 1 })).toHaveText('Materialverteiler')
})

test.describe('with a main navigation', () => {
  test('renders the navigation items in the header', async ({ page }) => {
    await page.goto('/')

    const nav = page.getByRole('banner').getByRole('navigation')
    for (const { title, path } of mainNavigation.items) {
      await expect(nav.getByRole('link', { name: title })).toHaveAttribute('href', path)
    }
  })

  test.describe('on mobile', () => {
    test.use({ viewport: { width: 390, height: 844 } })

    test('renders the navigation items in the drawer menu', async ({ page }) => {
      await page.goto('/')

      const drawer = page.locator('dialog#main-navigation')
      await expect(drawer).toBeHidden()

      await page.locator('drawer-menu-trigger').click()
      await expect(drawer).toBeVisible()
      for (const { title, path } of mainNavigation.items) {
        await expect(drawer.getByRole('link', { name: title })).toHaveAttribute('href', path)
      }
    })
  })
})

test('homepage screenshot', { tag: '@visual' }, async ({ page }) => {
  await page.goto('/')
  await expect(page).toHaveScreenshot('homepage.png', { fullPage: true })
})
