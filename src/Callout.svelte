<!-- src/Callout.svelte -->
<svelte:options
  customElement={{
    tag: 'x-callout',
    props: {
      heading:  { reflect: true, type: 'String' },
      imageSrc: { attribute: 'image-src', type: 'String' },
      imageAlt: { attribute: 'image-alt', type: 'String' },
      variant:  { reflect: true, type: 'String' },
      compact:  { reflect: true, type: 'Boolean' },
      maxWidth: { attribute: 'max-width', type: 'Number' }
    }
  }}
/>

<script>
  let {
    heading = 'Heads up!',
    imageSrc = '',
    imageAlt = '',
    variant = 'info',
    compact = false,
    maxWidth = 560
  } = $props();
</script>

<style>
  :host { display:block }
  .wrap {
    box-shadow: 0 4px 16px rgba(0,0,0,.08);
    border-radius: 12px;
    padding: 16px;
    background: #fff;
    display: grid;
    gap: 12px;
  }
  .wrap.compact { padding: 12px; }
  .variant-info    { border-left: 6px solid #3b82f6 }
  .variant-warning { border-left: 6px solid #f59e0b }
  .variant-success { border-left: 6px solid #10b981 }
  .variant-danger  { border-left: 6px solid #ef4444 }
  .media img { width:100%; height:auto; display:block; border-radius:8px }
  .heading { font: 600 1.125rem/1.3 system-ui, sans-serif; margin:0 }
</style>

<div class="wrap {compact ? 'compact' : ''} variant-{variant}" style={`max-width:${maxWidth}px`}>
  {#if imageSrc}
    <div class="media"><img src={imageSrc} alt={imageAlt} /></div>
  {/if}
  {#if heading}<h3 class="heading">{heading}</h3>{/if}
  <div class="body"><slot /></div>
</div>
