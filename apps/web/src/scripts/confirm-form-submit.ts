/**
 * Small custom element to display a confirmation message before form submission.
 */
export class ConfirmFormSubmit extends HTMLElement {
  #button: HTMLButtonElement | null = null
  #message: string | null = this.getAttribute('message')

  connectedCallback() {
    this.#button = this.querySelector('button[type="submit"]')
    if (!this.#button) {
      console.error('<confirm-submit> Button with type="submit" not found.')
      return
    }
    this.#button?.addEventListener('click', e => this.confirm(e))
  }

  confirm(e: MouseEvent) {
    e.preventDefault()
    if (window.confirm(this.#message || 'Are you sure you want to continue?')) {
      this.closest('form')?.submit()
    }
  }
}

customElements.define('confirm-form-submit', ConfirmFormSubmit)
