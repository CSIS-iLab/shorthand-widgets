<!-- Compiles directly to <x-cpp-callout> -->
<svelte:options
  customElement={{
    tag: 'x-cpp-callout',
    props: {
      href:       { type: 'String', reflect: true },             // used by image link (and default text link)
      imageSrc:   { attribute: 'image-src', type: 'String' },    // image URL
      imageAlt:   { attribute: 'image-alt', type: 'String' },    // image alt text
      bg:         { type: 'String', reflect: true },             // background color
      maxWidth:   { attribute: 'max-width', type: 'Number' }     // px
    }
  }}
/>

<script>
  let {
    href = 'https://features.csis.org/snapshots/china-submarine-diplomacy/',
    imageSrc = 'https://res.cloudinary.com/csisideaslab/image/upload/v1704306843/hidden-reach/HR5-Snapshot-Header.jpg',
    imageAlt = 'Callout Image',
    bg = '#22484e',
    maxWidth = 800
  } = $props();
</script>

<style>
  /* Shadow DOM styles — encapsulated by default */
  @import url("https://fonts.googleapis.com/css2?family=IBM+Plex+Sans&display=swap");

  :host {
    display: block;
    font-family: "IBM Plex Sans", system-ui, sans-serif;
  }

  .callout-container {
    display: flex;
    align-items: center;
    background-color: var(--cpp-callout-bg, #22484e);
    max-width: 800px;
    margin: auto;
    color: #f8f7f7;
  }

  .callout-image {
    max-height: 195px;
  }

  .callout-image a {
    text-decoration: none;
    border-bottom: none !important;
  }

  .callout-image img {
    width: auto;
    max-height: 195px;
    display: block;
  }

  .callout-text {
    flex: 1;
    font-size: 1rem;
    margin: 24px;
  }

  .callout-text a {
    color: inherit;
    text-decoration: none;
  }

  /* Responsive */
  @media (max-width: 1400px) {
    .callout-container {
      flex-direction: column;
    }

    .callout-image {
      margin: 0;
      width: 100%;
    }

    .callout-image img {
      width: 100%;
      height: auto;
      margin-bottom: 0;
    }

    .callout-text {
      padding: 24px;
      margin: 0 24px 24px 24px; /* keep visual rhythm */
    }
  }
</style>

<div
  class="callout-container"
  style={`--cpp-callout-bg:${bg}; max-width:${maxWidth}px`}
>
  <div class="callout-image">
    <a href={href}>
      <img src={imageSrc} alt={imageAlt} />
    </a>
  </div>

  <div class="callout-text">
    <!-- If no slot provided, show a sensible default message that links to href -->
    <slot>
      This Hidden Reach <a href={href}>Snapshot</a> uses satellite imagery to
      reveal how China is quietly using submarine diplomacy to deepen its
      influence along the Bay of Bengal.
    </slot>
  </div>
</div>
