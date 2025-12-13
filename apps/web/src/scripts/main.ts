import '@rr/image-gallery'
import './confirm-form-submit'

/*
 * Open ImageGallery when clicking on an image with a data-image-gallery attribute
  */
const images: string[] = []
document.querySelectorAll('[data-image-gallery]').forEach((trigger) => {
  images.push(trigger.getAttribute('data-image-gallery') as string)
  trigger.addEventListener('click', () => {
    const image = trigger.getAttribute('data-image-gallery')!
    const gallery = document.createElement('image-gallery')
    gallery.setAttribute('image', image)
    gallery.setAttribute('images', images.join(','))
    document.body.appendChild(gallery)
    document.body.classList.add('overflow-hidden')
    gallery.addEventListener('remove', () => {
      gallery.remove()
      document.body.classList.remove('overflow-hidden')
    })
  })
})

/**
 * Enable scrolling a scroll container with scroll snap to the next or previous element
 */
document.querySelectorAll('[data-scroll-snap]').forEach((button) => {
  button.addEventListener('click', () => {
    // Take parent element and scroll to next child of its scoll snap container
    const scrollContainer = button.parentElement?.querySelector('[data-scroll-container]')
    if (!scrollContainer) {
      console.error('No scroll container found for [data-scroll-snap] button')
      return
    }
    const width = scrollContainer.getBoundingClientRect().width
    const current = scrollContainer.scrollLeft
    if (button.getAttribute('data-scroll-snap') === 'next') {
      scrollContainer.scrollTo({ left: current + width, top: 0, behavior: 'smooth' })
    }
    else if (button.getAttribute('data-scroll-snap') === 'previous') {
      scrollContainer.scrollTo({ left: current - width, top: 0, behavior: 'smooth' })
    }
  })
})
