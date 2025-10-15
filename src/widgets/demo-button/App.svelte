<script>
  export let label = 'Hello, Shorthand!';
  export let variant = 'primary';
</script>

<style>
  button {
    padding: 0.6rem 1rem;
    border-radius: 9999px;
    border: none;
    font: 600 14px/1 system-ui, sans-serif;
    cursor: pointer;
  }
  button.primary { background: royalblue; color: white; }
</style>

<button class={variant}>{label}</button>
