document.addEventListener('DOMContentLoaded', function () {
  setTimeout(() => {
    // Focus the first element with aria-invalid attribute or data-autofocus attribute
    const first = document.querySelector('[aria-invalid="true"], [data-autofocus]') as HTMLElement
    if (first) first.focus()
  }, 150)
})
