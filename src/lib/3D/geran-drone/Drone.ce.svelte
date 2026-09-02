<svelte:options
  customElement={{
    tag: "csis-geran-drone",
    props: {
      timelineURL: { attribute: "timeline-url", type: "String" },
      sourcesURL: { attribute: "sources-url", type: "String" },
      assetsURL: { attribute: "assets-url", type: "String" },
    },
  }}
/>

<script>
  import { onMount, onDestroy, tick } from "svelte"
  import { initSketchfab } from "$lib/geran-drone/lib/sketchfab"
  import { initFilters } from "$lib/geran-drone/lib/filters"
  import { createMaterialController } from "$lib/geran-drone/lib/materials"
  import { getData } from "$lib/geran-drone/api/data"
  import Airframe from "./Airframe.svelte"
  import Propulsion from "./Propulsion.svelte"
  import Navigation from "./Navigation.svelte"
  import Communications from "./Communications.svelte"
  import Munitions from "./Munitions.svelte"

  let { timelineURL = "", sourcesURL = "", assetsURL = "" } = $props()

  let iframeEl
  let containerEl
  let apiRef = null
  let filters = null
  let data = $state([])

  // custom lightbox state
  let lightboxImage = $state(null)

  function openLightbox(src, alt, caption) {
    lightboxImage = { src, alt, caption }
  }

  function closeLightbox() {
    lightboxImage = null
  }

  const materials = createMaterialController(() => apiRef)

  let airframeItems = $derived(data.filter((d) => d.category === "airframe"))
  let propulsionItems = $derived(
    data.filter((d) => d.category === "propulsion"),
  )
  let navigationItems = $derived(
    data.filter((d) => d.category === "navigation"),
  )
  let communicationItems = $derived(
    data.filter((d) => d.category === "communication"),
  )
  let munitionsItems = $derived(data.filter((d) => d.category === "munitions"))

  onMount(async () => {
    const shadowRoot = containerEl.getRootNode()

    data = await getData(timelineURL, sourcesURL)
    await tick()

    filters = initFilters(shadowRoot, materials)
    initSketchfab(iframeEl, {
      onReady: (api) => {
        apiRef = api
      },
    })
  })

  onDestroy(() => {
    filters?.destroy()
  })
</script>

<div class="master-container" bind:this={containerEl}>
  <div class="filter-container">
    <button class="filter-btn" data-filter="airframe">Airframe</button>
    <button class="filter-btn" data-filter="propulsion">Propulsion</button>
    <button class="filter-btn" data-filter="navigation">Navigation</button>
    <button class="filter-btn" data-filter="communication">Communication</button
    >
    <button class="filter-btn" data-filter="munitions">Munitions</button>
  </div>

  <div class="panel-container">
    <div class="drone-container">
      <iframe
        bind:this={iframeEl}
        title="Shahed drone"
        id="drone-model"
        frameborder="0"
        allowfullscreen
        mozallowfullscreen="true"
        webkitallowfullscreen="true"
        allow="autoplay; fullscreen; xr-spatial-tracking"
        xr-spatial-tracking
        execution-while-out-of-viewport
        execution-while-not-rendered
        web-share
        width="100%"
        height="680"
      ></iframe>
    </div>

    <div class="timeline-container">
      <div class="gallery-container">
        <div class="landing">
          <img
            src="{assetsURL}/arrow-up.png"
            alt="arrow up"
            style="opacity: 40%; max-width: 22px; margin-top: 0px; margin-bottom: 20px;"
          />
          <p>
            Select a component from the menu to explore a timeline of its
            evolution
          </p>
        </div>

        <div class="navigation-filter">
          <button class="navigation-btn active" data-subfilter="nav-1"
            >Flight Control</button
          >
          <button class="navigation-btn" data-subfilter="nav-2"
            >Satellite Navigation</button
          >
        </div>

        <div class="munitions-filter">
          <button class="munitions-btn active" data-subfilter="mun-1"
            >Warhead</button
          >
          <button class="munitions-btn" data-subfilter="mun-2"
            >Anti-Air Armament</button
          >
          <button class="munitions-btn" data-subfilter="mun-3"
            >Auxiliary Munitions</button
          >
        </div>

        <div id="dynamic-gallery-rows">
          <Airframe
            items={airframeItems}
            {assetsURL}
            onlightbox={(e) => openLightbox(e.src, e.alt, e.caption)}
          />
          <Propulsion
            items={propulsionItems}
            {assetsURL}
            onlightbox={(e) => openLightbox(e.src, e.alt, e.caption)}
          />
          <Navigation
            items={navigationItems}
            {assetsURL}
            onlightbox={(e) => openLightbox(e.src, e.alt, e.caption)}
          />
          <Communications
            items={communicationItems}
            {assetsURL}
            onlightbox={(e) => openLightbox(e.src, e.alt, e.caption)}
          />
          <Munitions
            items={munitionsItems}
            {assetsURL}
            onlightbox={(e) => openLightbox(e.src, e.alt, e.caption)}
          />
        </div>
      </div>
    </div>
  </div>

  {#if lightboxImage}
    <div class="lightbox-overlay" onclick={closeLightbox}>
      <div class="lightbox-modal" onclick={(e) => e.stopPropagation()}>
        <button class="lightbox-close" onclick={closeLightbox}>✕</button>
        <img src={lightboxImage.src} alt={lightboxImage.alt} />
        {#if lightboxImage.caption}
          <p class="lightbox-caption">{lightboxImage.caption}</p>
        {/if}
      </div>
    </div>
  {/if}
</div>

<style>
  :global {
    * {
      margin: 0;
      padding: 0;
      font-family: Inter;
      box-sizing: border-box;
    }

    a {
      color: #414141;
    }

    .master-container {
      border-radius: 20px;
      margin: 10px;
      background-color: #f5f5f5;
    }

    .panel-container {
      display: flex;
      justify-content: space-between;
      gap: 2%;
      padding: 10px;
      border-radius: 20px;
      background-color: #f5f5f5;
    }

    .drone-container {
      display: block;
      width: 50%;
      background-color: #ebebeb;
      border-radius: 18px;
    }

    .timeline-container {
      display: flex;
      flex-direction: column;
      width: 50%;
      margin: auto;
      background: none;
      max-height: 650px;
      overflow-y: auto;
    }

    .landing {
      max-width: 300px;
      margin-left: auto;
      margin-right: auto;
      align-items: center;
      text-align: center;
      opacity: 30%;
    }

    /* Filters */
    .filter-container,
    .munitions-filter,
    .navigation-filter {
      display: flex;
      flex-wrap: wrap;
      justify-content: center;
      gap: 25px;
      padding-bottom: 30px;
      padding-top: 20px;
    }

    .filter-btn,
    .munitions-btn,
    .navigation-btn {
      padding: 7px 18px;
      border: 0px solid #ccc;
      background: #d9d9d9;
      border-radius: 12px;
      color: #808080;
      cursor: pointer;
      font-size: medium;
      transition: all 0.25s cubic-bezier(0.4, 0, 0.2, 1);
    }

    .munitions-filter,
    .navigation-filter {
      padding-top: 5px;
      padding-bottom: 50px;
    }

    .filter-btn.active,
    .munitions-btn.active,
    .navigation-btn.active {
      color: #070707;
      background: #bf3636;
      color: #f5f5f5;
      opacity: 100;
      pointer-events: none;
    }

    .filter-btn:hover,
    .munitions-btn:hover,
    .navigation-btn:hover {
      background: #a8a8a8;
      color: #000000;
    }

    /* Row Configuration */
    .gallery-row {
      display: grid;
      grid-template-columns: 30% 70%; /* Exact width split */
      align-items: center;
    }

    /* Image Column Constraint */
    .gallery-column {
      width: 100%;
      padding-left: 7%;
    }

    .gallery-column img {
      width: 100%;
      height: auto;
      object-fit: cover;
      max-width: 450px;
      max-height: 350px;
      box-shadow: 0 2px 5px rgba(0, 0, 0, 0.1);
      cursor: pointer;
    }

    .gallery-column img:hover {
      filter: brightness(70%);
      transition: filter 200ms ease-in-out;
    }

    figcaption {
      opacity: 50%;
      font-size: small;
      margin-bottom: 20px;
    }

    .timeline-column {
      position: relative;
      height: 100%;
      align-items: left;
      padding-right: 15%;
      text-align: right;
      border-right: 1px solid #0a2558;
    }

    .timeline-column::after {
      content: "";
      position: absolute;
      width: 14px;
      height: 14px;
      background-color: #333;
      border-radius: 50%;
      right: -7.5px;
      top: 8px;
      border: 3px solid #f5f5f5;
      box-sizing: border-box;
    }

    .timeline-year {
      font-weight: bold;
      margin-top: 5px;
    }

    .timeline-description {
      font-size: 0.9rem;
      color: #333;
      margin-left: 10px;
      margin-top: 5px;
    }

    /* Hide rows cleanly during filtering */
    .gallery-row.hidden {
      display: none;
    }

    /*____________ MOBILE___________ */

    @media only screen and (max-width: 580px) {
      .gallery-column {
        padding: 10px;
        padding-left: 18px;
      }
      .timeline-column {
        padding-right: 18px;
        font-size: 0.95rem;
      }
      .timeline-description {
        font-size: 0.85rem;
      }
      figcaption {
        font-size: 10px;
      }

      .gallery-row {
        grid-template-columns: 35% 65%;
      }
    }

    @media only screen and (max-width: 780px) {
      .timeline-container {
        width: 100vw;
      }
      .drone-container {
        display: none;
      }
    }

    .lightbox-overlay {
      position: fixed;
      inset: 0;
      background: rgba(0, 0, 0, 0.85);
      z-index: 999999;
      display: flex;
      align-items: center;
      justify-content: center;
    }

    .lightbox-modal {
      position: relative;
      max-width: 90vw;
      max-height: 90vh;
      display: flex;
      flex-direction: column;
      align-items: center;
    }

    .lightbox-modal img {
      max-width: 90vw;
      max-height: 80vh;
      object-fit: contain;
      box-shadow: none;
      cursor: default;
    }

    .lightbox-close {
      position: absolute;
      top: -40px;
      right: 0;
      background: none;
      border: none;
      color: white;
      font-size: 24px;
      cursor: pointer;
    }

    .lightbox-caption {
      color: white;
      text-align: center;
      margin-top: 10px;
      font-size: 0.9rem;
      opacity: 0.8;
    }
  }
</style>
