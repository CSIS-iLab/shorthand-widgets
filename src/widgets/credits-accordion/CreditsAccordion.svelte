<svelte:options customElement="x-credits-accordion" />

<script>
  // ATTRIBUTES (props)
  export let id = '';                  // <-- read the host element's id
  export let title = 'Details';
  export let preset = 'brand';
  export let config = '';              // "", "inline", or a JSON string
  export let configUrl = '';           // optional remote JSON

  // STATE
  let items = [];
  let html = '';

  const parse = (s) => { try { return JSON.parse(s) } catch { return null } };

  import { onMount } from 'svelte';
  onMount(async () => {
    let cfg = {};

    if (config === 'inline') {
      const el = id && document.getElementById(`${id}-config`);   // <-- use prop `id`
      if (el?.textContent) cfg = parse(el.textContent) || {};
    } else if (config && config.trim().startsWith('{')) {
      cfg = parse(config) || {};
    } else if (configUrl) {
      const res = await fetch(configUrl);
      cfg = await res.json();
    }

    title  = cfg.title  ?? title;
    preset = cfg.preset ?? preset;
    html   = cfg.html   ?? html;
    items  = Array.isArray(cfg.items) ? cfg.items : items;
  });
</script>

<div class="accordion {preset}">
  <details>
    <summary class="box-title"><span class="caret">❯</span> {title}</summary>
    <div class="box-content">
      {#if items.length}
        {#each items as it}
          {#if it.heading}<h4>{it.heading}</h4>{/if}
          {#if it.html}<div class="rt">{@html it.html}</div>{/if}
        {/each}
      {:else if html}
        <div class="rt">{@html html}</div>
      {/if}
    </div>
  </details>
</div>

<style>
  /* container */
  .accordion { width: 100%; }
  details {
    border-radius: 8px; overflow: hidden;
    box-shadow: 0 -1px 0 var(--bg), 0 0 2px rgba(0,0,0,.12), 0 2px 4px rgba(0,0,0,.24);
  }

  /* header */
  summary.box-title {
    background: var(--bg);
    color: var(--fg);
    cursor: pointer;
    user-select: none;
    padding: 20px 24px;
    font: 700 20px/1.2 "Bitter", system-ui, serif;
    list-style: none;
  }
  summary::-webkit-details-marker { display: none; }
  .caret { display: inline-block; margin-right: 12px; transform: rotate(0deg); transition: transform .15s ease; }
  details[open] .caret { transform: rotate(90deg); }

  /* content */
  .box-content {
    display: block;
    background: #fff;
    color: #111;
    padding: 24px 20px 28px;
    font: 400 14px/1.55 "Bitter", system-ui, serif;
  }
  .box-content > * { max-width: 800px; margin-left: auto; margin-right: auto; }
  .rt :global(a)    { color: inherit; text-decoration: underline; }
  .rt :global(ul)   { padding-left: 1.2em; margin: .6em 0; }
  .rt :global(li)   { margin: .35em 0; }
  .rt :global(h2), .rt :global(h3), .rt :global(h4) { margin: 1.2em 0 .5em; }

  /* presets */
  .brand { --bg:#DE1648; --fg:#fff; }
  .dark  { --bg:#0b0f13; --fg:#fff; }
  .light { --bg:#f3f4f6; --fg:#111; }

  @media (max-width: 900px) {
    summary.box-title { font-size: 18px; }
  }
</style>
