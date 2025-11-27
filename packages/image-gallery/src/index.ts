export class ImageGallery extends HTMLElement {
  #images: string[] = []
  #image: string | null = null
  #shadow: ShadowRoot | null = null
  #previouslyFocusedElement: HTMLElement | null = null

  constructor() {
    super()
    this.#shadow = this.attachShadow({ mode: 'open' })
    this.handleKeydown = this.handleKeydown.bind(this)
  }

  connectedCallback() {
    this.#previouslyFocusedElement = document.activeElement as HTMLElement
    this.#images = this.getAttribute('images')?.split(',') || []
    this.#image = this.getAttribute('image')
    if (!this.#images || !this.#image) {
      throw new Error('[ImageGallery] images and image attributes are required')
    }

    this.render()
    this.addEventListeners()

    const closeButton = this.#shadow!.querySelector('.close') as HTMLElement
    closeButton?.focus()
  }

  disconnectedCallback() {
    document.removeEventListener('keydown', this.handleKeydown)
    this.#previouslyFocusedElement?.focus()
  }

  handleKeydown(event: KeyboardEvent) {
    if (event.key === 'Escape') {
      this.close()
    }

    if (event.key === 'Tab') {
      const focusableElements = this.#shadow!.querySelectorAll<HTMLElement>(
        'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])',
      )
      const firstElement = focusableElements[0]
      const lastElement = focusableElements[focusableElements.length - 1]

      if (event.shiftKey) {
        if (document.activeElement === firstElement || this.#shadow?.activeElement === firstElement) {
          lastElement.focus()
          event.preventDefault()
        }
      }
      else {
        if (document.activeElement === lastElement || this.#shadow?.activeElement === lastElement) {
          firstElement.focus()
          event.preventDefault()
        }
      }
    }
  }

  close() {
    this.dispatchEvent(new CustomEvent('remove'))
  }

  render() {
    if (!this.#shadow) return
    this.#shadow.innerHTML = `
        <style>
            :host {
                position: fixed;
                z-index: 1000;
                width: 100%;
                height: 100%;
                background-color: rgba(0, 0, 0, 0.9);
                display: flex;
                align-items: center;
                justify-content: center;
            }
            .close {
                position: absolute;
                right: 1rem;
                top: 1rem;
                background: white;
                border-radius: 999px;
                padding: 0.666rem;
                cursor: pointer;
                display: flex;
                align-items: center;
                justify-content: center;
                border: 0;
                box-shadow: 0 3px 5px 0 rgba(0,0,0,0.5);
            }
            .gallery-container {
                display: flex;
                flex-direction: column;
                height: 100%;
                width: 100%;
            }
            .image {
                display: flex;
                flex-grow: 1;
                align-items: center;
                justify-content: center;
                overflow: hidden;
                height: calc(90% - 2rem);
            }
            .image img {
                width: 100%;
                max-width: 100%;
                max-height: 100%;
                object-fit: contain;
            }
            .thumbnails {
                display: flex;
                justify-content: center;
                padding: 1rem 0;
                height: 10%;
                flex-shrink: 0;
                gap: 0.5rem;
            }
            .thumbnails button {
                padding: 0;
                border: 2px solid transparent;
                background: none;
                cursor: pointer;
                display: block;
                aspect-ratio: 1/1;
            }
            .thumbnails button:focus-visible {
                outline: 2px solid white;
                outline-offset: 2px;
            }
            .thumbnails button[aria-current="true"] {
                border-color: white;
            }
            .thumbnails img {
                aspect-ratio: 1/1;
                object-fit: cover;
                display: block;
                width: 100%;
            }
        </style>
        <div class="gallery-container" role="dialog" aria-modal="true" aria-label="Image gallery">
            <button class="close" aria-label="Close gallery">
                <svg width="33px" height="33px" stroke-width="1.5" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" color="#000000"><path d="M6.75827 17.2426L12.0009 12M17.2435 6.75736L12.0009 12M12.0009 12L6.75827 6.75736M12.0009 12L17.2435 17.2426" stroke="#000000" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"></path></svg>
            </button>
            <div class="image">
                <img src="${this.#image}" alt="Enlarged image">
            </div>
            <div class="thumbnails">
                ${this.#images.map(img => `
                    <button aria-current="${img === this.#image}" data-src="${img}">
                        <img src="${img}" alt="Image thumbnail">
                    </button>
                `).join('')}
            </div>
        </div>
        `
  }

  addEventListeners() {
    document.addEventListener('keydown', this.handleKeydown)

    const close = this.#shadow!.querySelector('.close')
    close?.addEventListener('click', () => this.close())

    const thumbnailsContainer = this.#shadow!.querySelector('.thumbnails')
    thumbnailsContainer?.addEventListener('click', (event) => {
      const button = (event.target as HTMLElement).closest('button')
      if (button) {
        const newImageSrc = button.dataset.src
        if (newImageSrc) {
          this.updateMainImage(newImageSrc)
        }
      }
    })

    thumbnailsContainer?.addEventListener('keydown', (event: Event) => {
      if (event instanceof KeyboardEvent && (event.key === 'ArrowRight' || event.key === 'ArrowLeft')) {
        const buttons = Array.from(thumbnailsContainer.querySelectorAll('button'))
        const currentIndex = buttons.findIndex(btn => btn === document.activeElement || btn === this.#shadow?.activeElement)
        if (currentIndex === -1) return

        let nextIndex
        if (event.key === 'ArrowRight') {
          nextIndex = (currentIndex + 1) % buttons.length
        }
        else { // ArrowLeft
          nextIndex = (currentIndex - 1 + buttons.length) % buttons.length
        }
        buttons[nextIndex].focus()
        event.preventDefault()
      }
    })
  }

  updateMainImage(newSrc: string) {
    const mainImage = this.#shadow!.querySelector('.image img') as HTMLImageElement
    mainImage.src = newSrc
    this.#image = newSrc

    const thumbnails = Array.from(this.#shadow!.querySelectorAll('.thumbnails button')) as HTMLElement[]
    thumbnails.forEach((thumb) => {
      thumb.setAttribute('aria-current', String(thumb.dataset.src === newSrc))
    })
  }
}

customElements.define('image-gallery', ImageGallery)
