/**
 * Bind a click event handler to elements with a certain data-* attribute
 * @param root Root element to query into
 * @param attr Attribute to look for
 * @param handler Handler function providing the target element defined by id in
 * the given attribute
 *
 * Example:
 *
 * Given the following html structure
 *
 * <div>
 *  <button data-show="menu1"></button>
 *  <button data-show="menu2"></button>
 * </div>
 * <div id="menu1">
 *  ...
 * </div>
 * <div id="menu2">
 *  ...
 * </div>
 *
 * The following handleDataClick usage displays the given elements based on a click
 * of the buttons:
 *
 * handleDataClick(this, 'data-show', (target) => target.style.display = 'block');
 */
export function handleDataClick<T>(
  root: HTMLElement,
  attr: string,
  handler: (element: HTMLElement, dataTarget?: T, id?: string) => void,
) {
  const elements = root.querySelectorAll(`[${attr}]`) as NodeListOf<HTMLElement>;
  elements.forEach((element) => {
    element.addEventListener("click", (e) => {
      e.preventDefault();
      const id = element.getAttribute(attr);
      if (!id) {
        handler(element);
        return;
      }
      const target = document.getElementById(id) as T;
      if (!target) {
        return;
      }
      handler(element, target, id);
    });
  });
}
