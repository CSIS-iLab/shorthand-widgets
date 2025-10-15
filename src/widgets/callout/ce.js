import App from './App.svelte';
import { mount } from 'svelte';

class XCallout extends HTMLElement {
  static get observedAttributes() { return ['image-src','href','bg','max-width','html']; }

  constructor() {
    super();
    this.root = this.attachShadow({ mode: 'open' });

    // Inject IBM Plex Sans into the Shadow DOM so styles match your snippet
    const link = document.createElement('link');
    link.rel = 'stylesheet';
    link.href = 'https://fonts.googleapis.com/css2?family=IBM+Plex+Sans&display=swap';
    this.root.appendChild(link);

    // Props from attributes
    this.props = {
      imageSrc: this.getAttribute('image-src') ?? undefined,
      href: this.getAttribute('href') ?? undefined,
      bg: this.getAttribute('bg') ?? undefined,
      maxWidth: this.getAttribute('max-width') ? Number(this.getAttribute('max-width')) : undefined,
      html: this.getAttribute('html') ?? undefined
    };

    this.instance = mount(App, { target: this.root, props: this.props });
  }

  attributeChangedCallback(name, _old, value) {
    const map = { 'image-src':'imageSrc', 'href':'href', 'bg':'bg', 'max-width':'maxWidth', 'html':'html' };
    const key = map[name];
    this.props[key] = (key === 'maxWidth' && value != null) ? Number(value) : value;
    this.instance?.update?.(this.props);
  }

  disconnectedCallback() {
    this.instance?.destroy?.();
  }
}
customElements.define('x-callout', XCallout);
