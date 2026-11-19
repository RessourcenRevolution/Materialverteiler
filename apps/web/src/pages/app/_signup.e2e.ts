import { expect, test, type Page } from '@playwright/test'
import { waitForEmail } from '../../../../../testing/mailpit'
import fixtures from '../../../../api/seed/fixtures.json' with { type: 'json' }

/** A new user, with a unique e-mail address per test. */
const newUser = () => ({
  firstname: 'Jane',
  lastname: 'Doe',
  email: `jane.doe.${Date.now()}@test.local`,
  password: 'a-secure-password',
  team: 'City Library',
  teamType: 'public',
  teamCity: 'Cologne',
  message: 'We have tables and chairs to pass on.',
})

async function fillSignupForm(page: Page, user: ReturnType<typeof newUser>) {
  await page.getByLabel('Firstname').fill(user.firstname)
  await page.getByLabel('Lastname').fill(user.lastname)
  await page.getByLabel('E-Mail').fill(user.email)
  await page.getByLabel('Password').fill(user.password)
  await page.getByLabel('Business/organisation', { exact: true }).fill(user.team)
  await page.locator('#team_type').selectOption(user.teamType)
  await page.getByLabel('City of business/organisation').fill(user.teamCity)
  await page.getByLabel('Your message to us').fill(user.message)
  // The checkbox input is hidden, its box is drawn by the label
  await page.locator('label[for="terms"]').click({ position: { x: 12, y: 12 } })
  await expect(page.getByRole('checkbox')).toBeChecked()
}

test.beforeEach(async ({ page }) => {
  await page.goto('/app/signup')
})

test('creates an account and sends a verification e-mail', async ({ page }) => {
  const user = newUser()
  await fillSignupForm(page, user)
  await page.getByRole('button', { name: 'Signup' }).click()

  await expect(page).toHaveURL('/app/listings')

  const email = await waitForEmail(user.email)
  expect(email.html).toContain('/app/profile/confirm-email?token=')
})

test('shows an error when the e-mail address is already in use', async ({ page }) => {
  await fillSignupForm(page, { ...newUser(), email: fixtures.existingUser.email })
  await page.getByRole('button', { name: 'Signup' }).click()

  await expect(page.getByText('There is already an account with this e-mail address.')).toBeVisible()
  await expect(page).toHaveURL(/\/app\/signup/)
})

test('shows an error when the password is too short, and keeps the entered values', async ({ page }) => {
  const user = { ...newUser(), password: 'short' }
  await fillSignupForm(page, user)
  await page.getByRole('button', { name: 'Signup' }).click()

  await expect(page.getByText('Password should be at least 8 characters long.')).toBeVisible()
  await expect(page.getByLabel('Firstname')).toHaveValue(user.firstname)
  await expect(page.getByLabel('E-Mail')).toHaveValue(user.email)
})

test('signup page screenshot', { tag: '@visual' }, async ({ page }) => {
  await expect(page).toHaveScreenshot('signup.png', { fullPage: true })
})
