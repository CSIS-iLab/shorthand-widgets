<svelte:options customElement="x-callout" />
<script>
  // Public props (everything has sensible defaults)
  export let imageSrc =
    "https://res.cloudinary.com/csisideaslab/image/upload/v1704306843/hidden-reach/HR5-Snapshot-Header.jpg";
  export let link_to =
    "https://features.csis.org/snapshots/china-submarine-diplomacy/";
  export let background_color = "#22484e";
  export let max_width = 800;

  // Allow rich text with a link; you control the content (trusted)
  export let html = `
    This Hidden Reach <a href="https://features.csis.org/snapshots/china-submarine-diplomacy/">Snapshot</a>
    uses satellite imagery to reveal how China is quietly using submarine diplomacy
    to deepen its influence along the Bay of Bengal.
  `;
</script>

<!-- Structure -->
<div id="callout-container" style={`--background_color:${background_color}; --maxw:${max_width}px`}>
  <div id="callout-image">
    <a href={link_to}>
      <img src={imageSrc} alt="Callout" />
    </a>
  </div>
  <div id="callout-text">
    {@html html}
  </div>
</div>

<style>
  /* Container */
  #callout-container {
    display: flex;
    align-items: center;
    background-color: var(--background_color);
    max-width: var(--max_width);
    margin: auto;
    font-family: "IBM Plex Sans", sans-serif;
  }

  #callout-image {
    max-height: 195px;
  }

  #callout-image img {
    width: auto; /* Maintain the aspect ratio */
    max-height: 195px; /*You can set this to the desired height */
  }

  #callout-image a {
    text-decoration: none;
    border-bottom: none !important;
  }

  #callout-text {
    flex: 1; /* Allows the text div to fill up the remaining space */
    font-size: 1rem; /* Adjust the font size as needed */
    margin: 24px; /* Add some padding around the content */
    color: #f8f7f7; /* Your choice of text color */
  }

  #callout-text :global(a) {
    color: #f8f7f7; /* Style for the 'Read' link */
    text-decoration: none; /* Removes underline from the link */
  }

  /* Add responsiveness to the container */
  @media (max-width: 1400px) {
    #callout-container {
      flex-direction: column; /* Stack the image and text on smaller screens */
    }

    #callout-image {
      margin: 0; /* Ensure no margin around the image container */
      width: 100%; /* Image container takes full width */
    }

    #callout-image img {
      width: 100%; /* Image takes full width of its container */
      height: auto; /* Maintain aspect ratio */
      margin-bottom: 0; /* Remove the space below the image */
    }

    #callout-text {
      padding: 24px; /* Keep padding, or adjust as needed */
    }
  }
</style>
