import Callout from './widgets/callout/App.svelte';
import { mount } from 'svelte';

mount(Callout, {
  target: document.getElementById('demo'),
  props: { /* use defaults or override here */ }
});
