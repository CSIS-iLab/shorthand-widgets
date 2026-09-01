<script>
  import GalleryRow from './GalleryRow.svelte'
  export let items = []
  export let assetsURL = ''
</script>

{#each items as item}
  <GalleryRow {item} {assetsURL} category="communication" />
{/each}
