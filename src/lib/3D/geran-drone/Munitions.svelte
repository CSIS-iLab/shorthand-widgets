<script>
  import GalleryRow from './GalleryRow.svelte'
  let { items = [], assetsURL = '', onlightbox } = $props()
</script>

{#each items as item}
  <GalleryRow {item} {assetsURL} category="munitions" {onlightbox} />
{/each}
