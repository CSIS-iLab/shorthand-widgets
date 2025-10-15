import DemoButton from './widgets/demo-button/App.svelte';
import { mount } from 'svelte';

mount(DemoButton, {
  target: document.getElementById('demo'),
  props: { label: 'Local dev button', variant: 'primary' }
});
