<!-- components/Propulsion.svelte -->
<script>
  import GalleryRow from "./GalleryRow.svelte"
  export let items = []
  export let assetsURL = ""
</script>

{#each items as item}
  <GalleryRow {item} {assetsURL} category="propulsion" />
{/each}
