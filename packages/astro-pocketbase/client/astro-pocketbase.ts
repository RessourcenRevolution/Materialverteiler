import PocketBase from "pocketbase";

export class AstroPocketbase extends HTMLElement {
  pb?: PocketBase = undefined;

  connectedCallback(): void {
    const url = this.getAttribute("pocketbase-url");
    if (url) {
      this.pb = new PocketBase(url);
    }
  }

  usePocketbase(): PocketBase {
    if (!this.pb) {
      throw new Error("[astro-pocketbase] pocketbase url not defined");
    }
    return this.pb;
  }
}
customElements.define("astro-pocketbase", AstroPocketbase);
