<svelte:options
  customElement={{
    tag: "x-audio-brief",
    props: {
      /* content and sources */
      title: { reflect: true, type: "String" },
      audioSrc: { attribute: "audio-src", type: "String" },
      transcriptSrc: { attribute: "transcript-src", type: "String" },
      bgImage: { attribute: "bg-image", type: "String" },
      backgroundImageAlt: { attribute: "background-image-alt", type: "String" },

      /* background fallback color if no background image */
      bgColor: { attribute: "bg-color", type: "String" },

      /* fonts */
      fontUrl: { attribute: "font-url", type: "String" },
      fontFamily: { attribute: "font-family", type: "String" },

      /* URLS for icons */
      iconPlay: { attribute: "icon-play", type: "String" },
      iconPause: { attribute: "icon-pause", type: "String" },
      iconSkipBack: { attribute: "icon-skip-back", type: "String" },
      iconSkipForward: { attribute: "icon-skip-forward", type: "String" },
      iconSkipStart: { attribute: "icon-skip-start", type: "String" },
      iconSkipEnd: { attribute: "icon-skip-end", type: "String" },
      iconMenu: { attribute: "icon-menu", type: "String" },
      iconDownload: { attribute: "icon-download", type: "String" },
      iconShare: { attribute: "icon-share", type: "String" },
      iconBack: { attribute: "icon-back", type: "String" },
      iconSpeed: { attribute: "icon-speed", type: "String" },

      /* Styles */
      borderRadius:  { attribute: "border-radius",  type: "String" }, // -> --ab-border-radius
      textColor:     { attribute: "text",           type: "String" }, // -> --ab-text
      surface:       { attribute: "surface",        type: "String" }, // -> --ab-surface
      accent:        { attribute: "accent",         type: "String" }, // -> --ab-accent
      titleSize:     { attribute: "title-size",     type: "String" }, // -> --ab-title-size

      progressBg:    { attribute: "progress-bg",    type: "String" }, // -> --ab-progress-bg
      progressFill:  { attribute: "progress-fill",  type: "String" }, // -> --ab-progress-fill

      menuBg:        { attribute: "menu-bg",        type: "String" }, // -> --ab-menu-bg
      menuFg:        { attribute: "menu-fg",        type: "String" }, // -> --ab-menu-fg
      menuHoverBg:   { attribute: "menu-hover-bg",  type: "String" }, // -> --ab-menu-hover-bg
      menuHoverFg:   { attribute: "menu-hover-fg",  type: "String" }, // -> --ab-menu-hover-fg

      iconFilter:         { attribute: "icon-filter",          type: "String" }, // -> --ab-icon-filter
      menuIconFilter:     { attribute: "menu-icon-filter",     type: "String" }, // -> --ab-menu-icon-filter
      menuIconHoverFilter:{ attribute: "menu-icon-hover-filter", type: "String" }, // -> --ab-menu-icon-hover-filter
    },
  }}
/>

<script>
  // Runes: props + state
  let {
    /* content and sources */
    title = "Audio Brief",
    audioSrc = "",
    transcriptSrc = "",
    bgImage = "",
    backgroundImageAlt = "",
 
    /* theme fallback color when image absent (also sits under the image) */
    bgColor = "#050f27",


    /* fonts */
    fontUrl = "",
    fontFamily = "'IBM Plex Sans', system-ui, sans-serif",

    /* icons */
    iconPlay = "https://res.cloudinary.com/csisideaslab/image/upload/v1706117784/Shorthand/Global%20Forecast/play-svgrepo-com.svg",
    iconPause = "https://res.cloudinary.com/csisideaslab/image/upload/v1706119327/Shorthand/Global%20Forecast/pause-svgrepo-com.svg",
    iconSkipBack = "https://res.cloudinary.com/csisideaslab/image/upload/v1706201954/Shorthand/Global%20Forecast/backward.svg",
    iconSkipForward = "https://res.cloudinary.com/csisideaslab/image/upload/v1706201954/Shorthand/Global%20Forecast/forward.svg",
    iconSkipStart = "https://res.cloudinary.com/csisideaslab/image/upload/v1706117793/Shorthand/Global%20Forecast/backward-3-svgrepo-com.svg",
    iconSkipEnd = "https://res.cloudinary.com/csisideaslab/image/upload/v1706117789/Shorthand/Global%20Forecast/forward-3-svgrepo-com.svg",
    iconMenu = "https://res.cloudinary.com/csisideaslab/image/upload/v1706120568/Shorthand/Global%20Forecast/kebab-menu-svgrepo-com.svg",
    iconDownload = "https://res.cloudinary.com/csisideaslab/image/upload/v1706148613/Shorthand/Global%20Forecast/download-svgrepo-com.svg",
    iconShare = "https://res.cloudinary.com/csisideaslab/image/upload/v1706148595/Shorthand/Global%20Forecast/share-alt-svgrepo-com.svg",
    iconBack = "https://res.cloudinary.com/csisideaslab/image/upload/v1706148618/Shorthand/Global%20Forecast/left-arrow-svgrepo-com.svg",
    iconSpeed = "https://res.cloudinary.com/csisideaslab/image/upload/v1706148589/Shorthand/Global%20Forecast/playback-speed-svgrepo-com.svg",

    /* --- Style props that map to CSS variables --- */
    borderRadius = "20px",
    textColor = "#fffefa",
    surface = "#0d1e45",
    accent = "#5ea0ff",
    titleSize = "1.6em",

    progressBg = "#ffffff30",
    progressFill = "#0066cc",

    menuBg = "#f9f9f9",
    menuFg = "#111",
    menuHoverBg = "#0a2458",
    menuHoverFg = "#fcfcfc",

    iconFilter = "invert(100%) sepia(59%) saturate(541%) hue-rotate(298deg) brightness(104%) contrast(105%)",
    menuIconFilter = "invert(0%)",
    menuIconHoverFilter = "invert(100%)",
  } = $props();

  // Load Google Font dynamically inside the shadow root
  $effect(() => {
    const root = (audioEl?.getRootNode && audioEl.getRootNode()) || document;
    const host = root.host; // only defined in Shadow DOM
    if (host) host.style.setProperty("--ab-font", fontFamily);
  });

  // Load Google Font once (shared across components and web page)
  /* URL is appended to the document head so it becomes global */
  $effect(() => {
    if (!fontUrl) return;

    const target = document.head;

    // Preconnects (once)
    if (
      !target.querySelector(
        'link[rel="preconnect"][href="https://fonts.googleapis.com"]'
      )
    ) {
      const pc1 = document.createElement("link");
      pc1.rel = "preconnect";
      pc1.href = "https://fonts.googleapis.com";
      target.appendChild(pc1);
    }
    if (
      !target.querySelector(
        'link[rel="preconnect"][href="https://fonts.gstatic.com"]'
      )
    ) {
      const pc2 = document.createElement("link");
      pc2.rel = "preconnect";
      pc2.href = "https://fonts.gstatic.com";
      pc2.crossOrigin = "anonymous";
      target.appendChild(pc2);
    }

    // The actual font stylesheet (dedupe by href)
    let link = target.querySelector(
      `link[rel="stylesheet"][href="${fontUrl}"]`
    );
    if (!link) {
      link = document.createElement("link");
      link.rel = "stylesheet";
      link.href = fontUrl;
      target.appendChild(link);
    }

    // no cleanup: we dedupe by href so multiple components can share it
  });

  let audioEl = $state();
  let isPlaying = $state(false);
  let progressPct = $state(0);
  let menuOpen = $state(false);
  let speedOpen = $state(false);
  let playbackRate = $state(1);

  const speeds = [0.5, 0.75, 1, 1.25, 1.5, 2];

  function togglePlay() {
    if (!audioEl) return;
    if (audioEl.paused) {
      audioEl.play();
      isPlaying = true;
    } else {
      audioEl.pause();
      isPlaying = false;
    }
  }

  function skip(delta) {
    if (!audioEl) return;
    const dur = audioEl.duration ?? 0;
    const next = Math.max(
      0,
      Math.min(
        (audioEl.currentTime || 0) + delta,
        Number.isFinite(dur) ? dur : 0
      )
    );
    audioEl.currentTime = next;
  }

  function toStart() {
    if (audioEl) audioEl.currentTime = 0;
  }

  function toEnd() {
    if (audioEl && Number.isFinite(audioEl.duration))
      audioEl.currentTime = audioEl.duration;
  }

  function onTimeUpdate() {
    if (!audioEl || !Number.isFinite(audioEl.duration)) {
      progressPct = 0;
      return;
    }
    progressPct = (audioEl.currentTime / audioEl.duration) * 100;
  }

  function onProgressClick(e) {
    if (!audioEl || !Number.isFinite(audioEl.duration)) return;
    const rect = e.currentTarget.getBoundingClientRect();
    const ratio = (e.clientX - rect.left) / rect.width;
    audioEl.currentTime = ratio * audioEl.duration;
  }

  function onProgressKeydown(e) {
    if (!audioEl || !Number.isFinite(audioEl.duration)) return;

    const step = 5; // seconds per arrow key
    switch (e.key) {
      case "ArrowLeft":
        e.preventDefault();
        audioEl.currentTime = Math.max(0, audioEl.currentTime - step);
        break;
      case "ArrowRight":
        e.preventDefault();
        audioEl.currentTime = Math.min(
          audioEl.duration,
          audioEl.currentTime + step
        );
        break;
      case "Home":
        e.preventDefault();
        audioEl.currentTime = 0;
        break;
      case "End":
        e.preventDefault();
        audioEl.currentTime = audioEl.duration;
        break;
      case "PageDown":
        e.preventDefault();
        audioEl.currentTime = Math.max(0, audioEl.currentTime - 10);
        break;
      case "PageUp":
        e.preventDefault();
        audioEl.currentTime = Math.min(
          audioEl.duration,
          audioEl.currentTime + 10
        );
        break;
    }
  }

  function setSpeed(s) {
    playbackRate = s;
    if (audioEl) audioEl.playbackRate = s;
  }

  // Keep the element's playbackRate in sync if prop changes
  $effect(() => {
    if (audioEl) audioEl.playbackRate = playbackRate;
  });

  // Close menus on outside clicks — attach and clean up properly
  $effect(() => {
    function onDocClick(e) {
      // if click is outside this custom element, close menus
      const root =
        (typeof getRootNode === "function" && getRootNode()) || document;
      const host = root.host || null;
      const path = e.composedPath ? e.composedPath() : [e.target];
      if (host && !path.includes(host)) {
        menuOpen = false;
        speedOpen = false;
      }
    }
    document.addEventListener("click", onDocClick);
    return () => document.removeEventListener("click", onDocClick);
  });
</script>

<div class="player">
  <div class="bg-wrap" style={`--ab-bg-fallback:${bgColor}`}>
    {#if bgImage}
      <img
        alt={backgroundImageAlt}
        src={bgImage}
        aria-hidden={backgroundImageAlt ? "false" : "true"}
      />
    {/if}
  </div>

  <div class="controls">
    <h2 class="title">{title}</h2>

    <audio
      bind:this={audioEl}
      src={audioSrc}
      ontimeupdate={onTimeUpdate}
      onplay={() => (isPlaying = true)}
      onpause={() => (isPlaying = false)}
      {playbackRate}
    ></audio>

    <div
      class="progress"
      role="slider"
      aria-label="Seek"
      tabindex="0"
      aria-valuemin="0"
      aria-valuemax={Math.floor(audioEl?.duration || 0)}
      aria-valuenow={Math.floor(audioEl?.currentTime || 0)}
      onclick={onProgressClick}
      onkeydown={onProgressKeydown}
      style={`--ab-progress:${progressPct}%`}
    >
      <div class="bar"></div>
    </div>

    <div class="row">
      <button class="icon" aria-label="Skip to start" onclick={toStart}>
        <img class="icon-img" alt="" src={iconSkipStart} />
      </button>

      <button
        class="icon"
        aria-label="Skip back 10 seconds"
        onclick={() => skip(-10)}
      >
        <img class="icon-img" alt="" src={iconSkipBack} />
      </button>

      <button
        class="icon"
        aria-label={isPlaying ? "Pause" : "Play"}
        onclick={togglePlay}
      >
        <img class="icon-img" alt="" src={isPlaying ? iconPause : iconPlay} />
      </button>

      <button
        class="icon"
        aria-label="Skip forward 10 seconds"
        onclick={() => skip(10)}
      >
        <img class="icon-img" alt="" src={iconSkipForward} />
      </button>

      <button class="icon" aria-label="Skip to end" onclick={toEnd}>
        <img class="icon-img" alt="" src={iconSkipEnd} />
      </button>

      <div class="kebab">
        <button
          class="icon"
          aria-haspopup="menu"
          aria-expanded={menuOpen}
          onclick={() => {
            menuOpen = !menuOpen;
            speedOpen = false;
          }}
        >
          <img class="icon-img" alt="Menu" src={iconMenu} />
        </button>

        <div class="menu" class:open={menuOpen} role="menu">
          <button
            class="item"
            role="menuitem"
            onclick={() => {
              if (!audioSrc) return;
              const a = document.createElement("a");
              a.href = audioSrc.includes("/upload/")
                ? audioSrc.replace("upload/", "upload/fl_attachment/")
                : audioSrc;
              a.download = "";
              a.click();
              menuOpen = false;
            }}
          >
            <img class="mini-icon" alt="" src={iconDownload} />
            Download Audio
          </button>

          {#if transcriptSrc}
            <button
              class="item"
              role="menuitem"
              onclick={() => {
                const a = document.createElement("a");
                a.href = transcriptSrc;
                a.target = "_blank";
                a.click();
                menuOpen = false;
              }}
            >
              <img class="mini-icon" alt="" src={iconDownload} />
              Download Transcript
            </button>
          {/if}

          <button
            class="item"
            role="menuitem"
            onclick={async () => {
              const shareUrl = audioSrc || location.href;
              try {
                if (navigator.share) {
                  await navigator.share({ title, url: shareUrl });
                } else if (navigator.clipboard) {
                  await navigator.clipboard.writeText(shareUrl);
                }
              } catch {}
              menuOpen = false;
            }}
          >
            <img class="mini-icon" alt="" src={iconShare} />
            Share Audio
          </button>

          <button
            class="item"
            role="menuitem"
            onclick={() => {
              speedOpen = true;
            }}
          >
            <img class="mini-icon" alt="" src={iconSpeed} />
            Playback Speed
          </button>

          {#if speedOpen}
            <div class="submenu" style="padding:6px 6px 10px">
              <button
                class="item"
                onclick={() => {
                  speedOpen = false;
                }}
              >
                <img class="mini-icon" alt="" src={iconBack} />
                Back to Options
              </button>
              {#each speeds as s}
                <button
                  class="item speedBtn"
                  selected={s === playbackRate}
                  onclick={() => {
                    setSpeed(s);
                  }}
                >
                  {s}x{s === 1 ? " (Normal)" : ""}
                </button>
              {/each}
            </div>
          {/if}
        </div>
      </div>
    </div>
  </div>
</div>

<style>
  :host {
    display: block;
    font-family: var(--ab-font, "IBM Plex Sans", system-ui, sans-serif);
    color: var(--ab-text, #fffefa);
  }

  .player {
    position: relative;
    width: 100%;
    height: 411px;
    border-radius: var(--ab-border-radius, 20px);
  }

  @media (min-width: 900px) {
    .player {
      margin: auto;
      min-width: 390px;
      max-width: 700px;
      max-height: 400px;
    }
  }

  .bg-wrap {
    position: absolute;
    inset: 0;
    height: 95%;
    overflow: hidden;
    z-index: 1;
    border-radius: var(--ab-border-radius, 20px);
    background: var(--ab-bg-fallback, #050f27);
  }

  .bg-wrap img {
    width: 100%;
    height: auto;
    display: block;
  }

  .controls {
    position: absolute;
    inset-inline: 0;
    bottom: 0;
    z-index: 2;
    background: var(--ab-surface, #0d1e45);
    border-radius: var(--ab-border-radius, 20px);
    padding-top: 10px;
  }

  .title {
    margin: 5px 20px;
    max-width: 90%;
    font-size: var(--ab-title-size, 1.6em);
    font-weight: 700;
    color: var(--ab-text, #fffefa);
  }

  .progress {
    width: calc(100% - 40px);
    height: 20px;
    margin: 15px auto 0;
    border-radius: 2px;
    background: var(--ab-progress-bg, #ffffff30);
    position: relative;
    cursor: pointer;
  }

  .progress > .bar {
    height: 100%;
    width: var(--ab-progress, 0%);
    border-radius: 2px;
    background: var(--ab-progress-fill, #0066cc);
  }

  .row {
    display: flex;
    justify-content: space-around;
    align-items: center;
    gap: 8px;
    padding: 14px 0 18px;
  }

  button.icon {
    appearance: none;
    border: 0;
    background: transparent;
    padding: 6px;
    border-radius: 8px;
    cursor: pointer;
  }
  button.icon:focus-visible {
    outline: 2px solid var(--ab-accent, #5ea0ff);
    outline-offset: 2px;
  }

  .icon-img {
    width: 35px;
    height: 35px;
    margin: 6px;
    filter: var(
      --ab-icon-filter,
      invert(100%) sepia(59%) saturate(541%) hue-rotate(298deg) brightness(104%)
        contrast(105%)
    );
  }

  .kebab {
    position: relative;
  }

  .menu {
    display: none;
    position: absolute;
    right: 0;
    top: -4px;
    background: var(--ab-menu-bg, #f9f9f9);
    color: var(--ab-menu-fg, #111);
    min-width: 180px;
    box-shadow: 0 8px 16px rgba(0, 0, 0, 0.2);
    border-radius: 8px;
    padding: 6px;
    z-index: 10;
  }
  .menu.open {
    display: block;
  }

  .menu button.item {
    display: flex;
    align-items: center;
    gap: 8px;
    width: 100%;
    background: transparent;
    border: 0;
    text-align: left;
    padding: 10px 12px;
    color: inherit;
    border-radius: 6px;
    cursor: pointer;
  }
  .menu button.item:hover {
    background: var(--ab-menu-hover-bg, #0a2458);
    color: var(--ab-menu-hover-fg, #fcfcfc);
  }

  .menu .mini-icon {
    width: 1em;
    height: 1em;
    filter: var(--ab-menu-icon-filter, invert(0%));
    transition: filter 0.15s ease; /* optional: smoother hover */
  }

  /* NEW: match icon to hovered item’s “light on dark” colors */
  .menu button.item:hover .mini-icon,
  .menu button.item:focus-visible .mini-icon {
    filter: var(
      --ab-menu-icon-hover-filter,
      invert(100%)
    ); /* default: light icon */
  }

  .submenu {
    max-height: 220px;
    overflow: auto;
  }
  .speedBtn[selected]::before {
    content: "✓ ";
  }
</style>
