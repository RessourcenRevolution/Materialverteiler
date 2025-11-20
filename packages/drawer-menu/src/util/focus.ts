/**
 * Finds all focusable elements in a certain element
 * optionally filtering by visibility
 * @param root Element to search in
 * @returns List of focusable elements
 */
export function focusable(
  root: HTMLElement,
  { visibleOnly }: { visibleOnly: boolean } = { visibleOnly: false },
): HTMLElement[] | null {
  const focusable = Array.from(
    root.querySelectorAll('button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'),
  ) as HTMLElement[];
  if (!visibleOnly) {
    return focusable;
  }
  const visible = focusable.filter((f) => {
    const style = window.getComputedStyle(f);
    return style.display !== "hidden" && style.visibility !== "hidden";
  });
  return visible;
}
