class MvSearch extends HTMLElement {
  static TAG: string = 'mv-search'

  private url: URL | null = null
  private target: string | null = null
  private abortController: AbortController

  constructor() {
    super()

    this.abortController = new AbortController()

    if (!this.getAttribute('url')) {
      console.error(MvSearch.TAG, 'no url attribute defined')
      return
    }
    this.url = new URL(window.location.protocol + '//' + window.location.host + this.getAttribute('url') || '')

    if (!this.getAttribute('target')) {
      console.error(MvSearch.TAG, 'no target attribute defined')
      return
    }
    this.target = this.getAttribute('target')
  }

  connectedCallback() {
    setTimeout(() => {
      const els = this.querySelectorAll('[data-mv-search=input]') as NodeListOf<HTMLInputElement | HTMLSelectElement>
      this.addEventListener('input', async () => {
        // Set URL params
        this.url?.searchParams.entries().forEach(([key]) => this.url?.searchParams.delete(key))
        els.forEach((el) => {
          if (el.name && el.value) {
            this.url?.searchParams.set(el.name, el.value)
          }
        })

        // Abort previous request
        this.abortController.abort()
        this.abortController = new AbortController()

        // Start timeout to show loading state
        const loadingTimeout = setTimeout(() => {
          this.setAttribute('loading', '')
        }, 1000)

        // Fetch and set HTML
        try {
          const response = await fetch(this.url!.pathname + this.url!.search, { signal: this.abortController.signal })
          const html = await response.text()
          const target = document.getElementById(this.target!)
          if (target) {
            target.innerHTML = html
          }
        }
        catch (e) {
          if (e instanceof DOMException && e.name !== 'AbortError') {
            console.log(e)
          }
        }

        // Exit loading state
        clearTimeout(loadingTimeout)
        this.removeAttribute('loading')
      })
    })
  }
}
customElements.define(MvSearch.TAG, MvSearch)
