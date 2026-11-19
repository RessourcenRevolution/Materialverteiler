import { expect } from '@playwright/test'
import { MAILPIT_URL } from './env'

type Message = { ID: string, Subject: string }

/** Waits for an email to the given address in the test mailpit, and returns its HTML. */
export async function waitForEmail(to: string): Promise<{ subject: string, html: string }> {
  let message: Message | undefined
  await expect.poll(async () => {
    const response = await fetch(`${MAILPIT_URL}/api/v1/search?query=${encodeURIComponent(`to:"${to}"`)}`)
    const { messages } = await response.json() as { messages: Message[] }
    message = messages[0]
    return message
  }, { message: `waiting for an email to ${to}` }).toBeDefined()

  const response = await fetch(`${MAILPIT_URL}/api/v1/message/${message!.ID}`)
  const { Subject, HTML } = await response.json() as { Subject: string, HTML: string }
  return { subject: Subject, html: HTML }
}
