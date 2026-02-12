document.addEventListener('DOMContentLoaded', function () {
  setTimeout(() => {
    const first = document.querySelector('[data-autofocus]') as HTMLElement
    if (first) first.focus()
  }, 150)
})
