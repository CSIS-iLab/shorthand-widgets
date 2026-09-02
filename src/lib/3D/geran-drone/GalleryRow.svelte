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
      <div class="timeline-year">{item.year}</div>
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
        <img
          src={fullSrc}
          alt={image.sourceText}
          onclick={() =>
            onlightbox?.({
              src: fullSrc,
              alt: image.sourceText,
              caption: image.sourceText,
            })}
          style="cursor: pointer"
        />
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
