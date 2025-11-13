import { LitElement, html, css } from 'lit';
import { customElement, property } from 'lit/decorators.js';

@customElement('image-uploader')
export class ImageUploader extends LitElement {
  @property({ type: Array })
  private selectedFiles: File[] = [];

  @property({ type: String })
  name = '';

  static styles = css`
    :host {
      display: block;
    }
    .preview-container {
      display: flex;
      flex-wrap: wrap;
      gap: 1rem;
      margin-top: 1rem;
    }
    .preview-item {
      position: relative;
      width: calc((100% - 3rem) / 4);
      aspect-ratio: 1/1;
    }
    .preview-item img {
      width: 100%;
      height: 100%;
      border: 1px solid #ddd;
      border-radius: 4px;
      object-fit: cover;
    }
    .remove-button {
      position: absolute;
      top: 0.25rem;
      right: 0.25rem;
      background: rgba(0, 0, 0, 0.7);
      color: white;
      border: none;
      border-radius: 50%;
      width: 1.5rem;
      height: 1.5rem;
      font-size: 0.8rem;
      cursor: pointer;
      display: flex;
      align-items: center;
      justify-content: center;
      z-index: 1;
    }
    .remove-button:hover {
      background: rgba(0, 0, 0, 0.9);
    }
    input[type="file"] {
      display: none;
    }
  `;

  connectedCallback() {
    super.connectedCallback();
    // Listen for the form's submit event
    this.closest('form')?.addEventListener('submit', this.handleFormSubmit);
  }

  disconnectedCallback() {
    super.disconnectedCallback();
    // Clean up the event listener
    this.closest('form')?.removeEventListener('submit', this.handleFormSubmit);
  }

  render() {
    return html`
      <input
        type="file"
        id="fileInput"
        accept="image/*"
        multiple
        @change=${this.handleFileSelect}
      />
      <button type="button" part="button" @click=${this.triggerFileInput}>
        Select Images
      </button>
      <div class="preview-container">
        ${this.selectedFiles.map(
          (file, index) => html`
            <div class="preview-item">
              <img src=${URL.createObjectURL(file)} alt=${file.name} />
              <button
                class="remove-button"
                @click=${() => this.removeFile(index)}
              >
                ×
              </button>
            </div>
          `
        )}
      </div>
    `;
  }

  private triggerFileInput() {
    this.shadowRoot?.getElementById('fileInput')?.click();
  }

  private handleFileSelect(e: Event) {
    const input = e.target as HTMLInputElement;
    if (input.files) {
      this.selectedFiles = [
        ...this.selectedFiles,
        ...Array.from(input.files).filter(file => file.type.match('image.*'))
      ];
      this.requestUpdate();
      input.value = ''; // Reset input to allow re-selecting the same files
    }
  }

  private removeFile(index: number) {
    this.selectedFiles = this.selectedFiles.filter((_, i) => i !== index);
    this.requestUpdate();
  }

  private handleFormSubmit = (e: Event) => {
    const form = e.target as HTMLFormElement;

    // Create a hidden file input for each selected file
      const input = document.createElement('input');
      input.type = 'file';
      input.name = `${this.name}`;
      input.style.display = 'none';
      form.appendChild(input);

    // Now let's create a DataTransfer to get a FileList
    const dataTransfer = new DataTransfer();
    this.selectedFiles.forEach((file) => {
      dataTransfer.items.add(file);
    });
    input.files = dataTransfer.files;
  };
}
