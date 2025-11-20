import { verifyChildList } from "./util/custom-element";

/**
 * <drawer-menu-trigger>
 */
export class DrawerMenuTrigger extends HTMLElement {
  async connectedCallback() {
    if (!this.getAttribute("target")) {
      throw new Error("<drawer-menu-trigger> Target attribute is required");
    }

    await verifyChildList(this, () => !!this.querySelector("a,button"));

    const trigger = this.querySelector("a, button");

    if (!trigger) {
      throw new Error("<drawer-menu-trigger> Trigger element not found");
    }

    trigger?.addEventListener("click", () => {
      const dialog = document.getElementById(
        this.getAttribute("target")!
      ) as HTMLDialogElement;
      if (!dialog) {
        throw new Error(
          `<drawer-menu-trigger> Target dialog element not found with id: ${this.getAttribute(
            "target"
          )}`
        );
      }
      dialog?.showModal();
    });
  }
}

customElements.define("drawer-menu-trigger", DrawerMenuTrigger);
