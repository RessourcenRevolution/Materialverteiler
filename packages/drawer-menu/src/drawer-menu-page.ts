import { focusable } from "./util/focus";
import { waitForTransition } from "./util/transition";

/**
 * <drawer-menu-page>
 *
 * An open/closable page, as part of <drawer-menu>
 */
export class DrawerMenuPage extends HTMLElement {
  /**
   * First focussable element on this drawer-menu-page
   */
  _firstFocusable: HTMLElement | null = null;

  /**
   * Last focussable element on this drawer-menu-page
   */
  _lastFocusable: HTMLElement | null = null;

  /**
   * Last focussed element on this drawer-menu-page
   */
  _lastFocussed: HTMLElement | null = null;

  constructor() {
    super();

    // Track last focussed element on this page
    this.addEventListener("focusin", (e) => {
      this._lastFocussed = e.target as HTMLElement;
    });
  }

  connectedCallback() {
    setTimeout(() => {
      const _focusable = focusable(this);
      this._firstFocusable = _focusable?.[0] || null;

      // Find last focusable element
      this._lastFocusable = _focusable?.reverse()[0] as HTMLElement;
    });
  }

  /**
   * Open page
   */
  open(focus: boolean = true) {
    this.setAttribute("open", "");
    this.enable();

    if (!focus) {
      return;
    }

    waitForTransition(this, () => {
      this._firstFocusable?.focus();
    });
  }

  /**
   * Close page
   */
  close() {
    this.disable();
    this.removeAttribute("open");
  }

  /**
   * Enable page (when moving back from a child page)
   */
  enable() {
    this.removeAttribute("inert");
  }

  /**
   * Disable page content for interaction
   */
  disable() {
    this.setAttribute("inert", "");
  }

  /**
   * Reset focus to last focussed element,
   * or the first focussable element as fallback
   */
  resetFocus() {
    if (this._lastFocussed) {
      this.focusLastFocussed();
    } else {
      this.focusFirstFosable();
    }
  }

  /**
   * Focusses last focussable element on the page
   */
  focusFirstFosable() {
    this._firstFocusable?.focus();
  }

  /**
   * Focusses last focussable element on the page
   */
  focusLastFosable() {
    this._lastFocusable?.focus();
  }

  /**
   * Focusses last foccussed element on the page
   */
  focusLastFocussed() {
    this._lastFocussed?.focus();
  }
}

customElements.define("drawer-menu-page", DrawerMenuPage);
