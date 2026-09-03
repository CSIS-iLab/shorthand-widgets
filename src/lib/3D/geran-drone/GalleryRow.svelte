<script>
  let { item = {}, assetsURL = "", category = "", onlightbox } = $props()
</script>

<div
  class="gallery-row hidden"
  data-category={category}
  data-subCategory={item.subCategory ?? ""}
>
  <div class="timeline-column">
    {#if item.year}
      <time class="timeline-year">{item.year}</time>
    {/if}
    <div class="timeline-description">
      <p>{item.description}</p>
    </div>
  </div>
  <div class="gallery-column">
    {#each item.images as image}
      {@const filename = image.src.split("/").pop()}
      {@const fullSrc = `${assetsURL}/${filename}`}
      <figure>
        <button
          class="lightbox-trigger"
          onclick={() =>
            onlightbox?.({
              src: fullSrc,
              alt: image.sourceText,
              caption: image.sourceText,
            })}
          aria-label="View larger image of {image.sourceText}"
        >
          <img src={fullSrc} alt={image.sourceText} />
        </button>
        <figcaption class="dynamic-caption">
          {#if image.link}
            <a href={image.link} target="_blank" rel="noopener noreferrer">
              {image.sourceText}
            </a>
          {/if}
        </figcaption>
      </figure>
    {/each}
  </div>
</div>

<style>
  .lightbox-trigger {
    background: none;
    border: none;
    padding: 0;
    cursor: pointer;
    display: block;
    width: 100%;
  }
</style>
