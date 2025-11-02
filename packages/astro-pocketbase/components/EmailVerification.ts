import { LitElement, html } from "lit";
import { customElement } from "lit/decorators/custom-element.js";
import type { AstroPocketbase } from "../client/astro-pocketbase";

@customElement("astro-pocketbase-email-verification")
export class EmailVerification extends LitElement {
  static properties = {
    _state: { state: true },
  };

  pb?: string;
  declare _state: "loading" | "missing-token" | "success" | "error";

  constructor() {
    super();
    this._state = "loading";
  }

  connectedCallback() {
    super.connectedCallback();
    if (import.meta.env.SSR) {
      return;
    }
    setTimeout(async () => {
      const token = new URL(window.location.href).searchParams.get("token");
      const astroPocketbase = this.closest(
        "astro-pocketbase"
      ) as AstroPocketbase;
      const pb = astroPocketbase.usePocketbase();

      if (!token) {
        this._state = "missing-token";
      } else {
        try {
          await pb.collection("users").confirmVerification(token);
          this._state = "success";
        } catch (e) {
          this._state = "error";
        }
      }
    }, 500);
  }

  render() {
    return html`<slot name="${this._state}"></slot>`;
  }
}
