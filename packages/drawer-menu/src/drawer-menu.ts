import { last } from "./util/array";
import { verifyChildList } from "./util/custom-element";
import { focusable } from "./util/focus";
import { handleDataClick } from "./util/data-click";
import { DrawerMenuPage } from "./drawer-menu-page";

/**
 * <drawer-menu>
 *
 * Reset the drawer-menu to it's initial page when opening/closing, and makes
 * sure focus stays trapped in the drawer-menu <dialog> element.
 */
class DrawerMenu extends HTMLElement {
  /**
   * Dialog element which opens/closes this drawer-menu
   */
  _dialog: HTMLDialogElement | null = null;

  /**
   * Back button
   */
  _backButton: HTMLButtonElement | null = null;

  /**
   * Drawer-menu-pages part of this drawer-menu
   */
  _pages: DrawerMenuPage[] | null = null;

  /**
   * Initial visible main page
   */
  _initialPage: DrawerMenuPage | null = null;

  /**
   * Current open page
   */
  _openPages: DrawerMenuPage[] = [];

  /**
   * First focusable element in this menu
   */
  _firstFocusable: HTMLElement | null = null;

  /**
   * Cached value of the width of the laptop viewport
   * so that the drawer can be closed when reaching that breakpoint
   */
  laptopViewportWidth: number = -1;

  constructor() {
    super();
  }

  async connectedCallback() {
    this.laptopViewportWidth = 1024;

    // Wait for the right elements to be there
    try {
      await verifyChildList(this, () => {
        return (
          !!this.querySelector("dialog") &&
          !!this.querySelector("drawer-menu-page[open]")
        );
      });
    } catch (err) {
      console.error("Required child elements not found to initialize <drawer-menu>");
      return;
    }

    this.init();
  }

  init() {
    this._dialog = this.querySelector("dialog");
    this._backButton = this.querySelector("[data-drawer-menu-page-back]");
    this._pages = Array.from(this.querySelectorAll("drawer-menu-page"));
    this._initialPage = this.querySelector("drawer-menu-page[open]");
    this._firstFocusable = focusable(this)?.[0] || null;

    if (!this._dialog) {
      console.warn("No <dialog> found in <drawer-menu>");
      return;
    }

    if (!this._initialPage) {
      console.warn("No inital open <drawer-menu-page> found in <drawer-menu>");
      return;
    }

    // Open initial page
    this.openPage(this._initialPage.id, false);

    // Disable all other pages
    this._pages.slice(1).forEach((page) => page.disable());

    // Disable back-button
    this.activateBackButton(false);

    // Handle clicks on showing (next) page
    handleDataClick<DrawerMenuPage>(this, "data-drawer-menu-page-show", (_element, dataTarget) => {
      if (dataTarget) {
        this.openPage(dataTarget.id);
      }
    });

    // Handle clicks on hiding current page
    handleDataClick<DrawerMenuPage>(this, "data-drawer-menu-page-hide", (_element, dataTarget) => {
      if (dataTarget) {
        this.closePage(dataTarget.id);
      }
    });

    // Handle page back
    handleDataClick<DrawerMenuPage>(this, "data-drawer-menu-page-back", () => {
      const id = last(this._openPages)?.id;
      if (id) {
        this.closePage(id);
      }
    });

    // Detect dialog focus-out by prepending fake focusable element
    const pre = document.createElement("div");
    pre.tabIndex = 0;
    this._dialog.prepend(pre);
    pre.addEventListener("focusin", () => {
      // On dialog start focusout, focus last item of active page
      last(this._openPages)?.focusLastFosable();
    });

    // Detect dialog focus-out by appending fake focusable element
    const post = document.createElement("div");
    post.tabIndex = 0;
    this._dialog.append(post);
    post.addEventListener("focusin", () => {
      // On dialog end focusout, focus first item of the menu
      const _focusable = focusable(this, { visibleOnly: true });
      // Skip one item because of pre/post focus catchers
      _focusable?.[1]?.focus();
    });

    this._dialog.addEventListener('click', (event) => {
      if (!this._dialog) return;
      var rect = this._dialog.getBoundingClientRect();
      var isInDialog = (rect.top <= event.clientY && event.clientY <= rect.top + rect.height &&
        rect.left <= event.clientX && event.clientX <= rect.left + rect.width);
      if (!isInDialog) {
        this._dialog.close();
      }
  });

    // Observe if dialog in this drawer-menu gets opened/closed
    let observer = new MutationObserver((event) => {
      if (this._dialog && event[0].attributeName == "open") {
        if (this._dialog.hasAttribute("open")) {
          this.handleMenuOpen();
        } else {
          this.handleMenuClose();
        }
      }
    });
    observer.observe(this._dialog, { attributes: true });
  }

  /**
   * Opens a page
   * Also disables the current active page for interaction
   * @param pageId page id
   */
  openPage(pageId: string, focus: boolean = true) {
    const page = this._pages?.find((p) => p.id === pageId) || null;
    if (!page) {
      return;
    }

    // Disable current open page
    last(this._openPages)?.disable();

    // Show next page
    this._openPages?.push(page);
    page?.open(focus);

    this.setAttribute("active", page.id);
    this.setAttribute("level", ((this._openPages?.length || 0) - 1).toString());

    // Enable back-button
    if (this._openPages.length > 1) {
      this.activateBackButton(true);
    }
  }

  /**
   * Close a page if it is the current active page
   * Also enables it's parent page for interaction
   * @param pageId page id
   */
  closePage(pageId: string) {
    if (last(this._openPages)?.id !== pageId) {
      console.warn("[drawer-menu] not closing page with id", pageId, " not current open page");
      return;
    }

    // Close page
    const page = this._openPages?.pop();
    page?.close();

    // Enable parent page
    last(this._openPages)?.enable();
    this.setAttribute("active", last(this._openPages)?.id || "");
    this.setAttribute("level", ((this._openPages?.length || 0) - 1).toString());

    // Disable back-button
    if (this._openPages.length === 1) {
      this.activateBackButton(false);
    }

    // Wait for enabling to apply,
    // then reset focus in page
    setTimeout(() => {
      last(this._openPages)?.resetFocus();
    });
  }

  /**
   * Handles opening the menu
   * hides all pages
   */
  handleMenuOpen() {
    document.body.classList.add("overflow-hidden");
    window.addEventListener("resize", this.handleWindowResize);
  }

  /**
   * Handles closing of the menu,
   * hides all pages
   */
  handleMenuClose() {
    this.closePages();
    document.body.classList.remove("overflow-hidden");
    window.removeEventListener("resize", this.handleWindowResize);
  }

  handleWindowResize = () => {
    if (window.innerWidth > this.laptopViewportWidth && this._dialog?.hasAttribute("open")) {
      this._dialog.close();
    }
  };

  /**
   * Closes all drawer-menu-pages except the initial page
   */
  closePages() {
    this._openPages
      ?.slice(1)
      .reverse()
      .forEach((page) => {
        this.closePage(page.id);
      });
  }

  activateBackButton(activate: boolean) {
    if (activate) {
      this._backButton?.removeAttribute("tabindex");
    } else {
      this._backButton?.setAttribute("tabindex", "-1");
    }
    this._backButton?.setAttribute("aria-hidden", activate ? "true" : "false");
  }
}

customElements.define("drawer-menu", DrawerMenu);
