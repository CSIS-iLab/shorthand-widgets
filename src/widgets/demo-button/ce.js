import App from './App.svelte';
import { mount } from 'svelte';

class XDemoButton extends HTMLElement {
  static get observedAttributes() { return ['label','variant']; }

  constructor() {
    super();
    this.root = this.attachShadow({ mode: 'open' });
    this.props = {
      label: this.getAttribute('label') ?? 'Hello, Shorthand!',
      variant: this.getAttribute('variant') ?? 'primary'
    };
    this.instance = mount(App, { target: this.root, props: this.props });
  }

  attributeChangedCallback(name, _old, val) {
    this.props[name] = val;
    this.instance?.update?.(this.props);
  }

  disconnectedCallback() {
    this.instance?.destroy?.();
  }
}

customElements.define('x-demo-button', XDemoButton);
