export function waitForTransition(node: HTMLElement, handler: () => void) {
  const styles = window.getComputedStyle(node);
  const transitionDuration = Number(styles.transitionDuration.replace("s", "")) || 0;
  setTimeout(handler, transitionDuration * 1000);
}