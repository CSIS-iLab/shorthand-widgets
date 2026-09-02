import GLightbox from "glightbox"
import "glightbox/dist/css/glightbox.min.css"

export function initFilters(shadowRoot, materials) {
  const {
    resetMaterialOpacities,
    focusComponentXRay,
    showHiddenComponent,
    highlightNavigation,
    highlightSatNav,
    highlightAirframe,
    highlightPropulsion,
    highlightCommunication,
  } = materials

  const qs = (sel) => shadowRoot.querySelector(sel)
  const qsa = (sel) => shadowRoot.querySelectorAll(sel)

  let lightbox = null

  const filterButtons = qsa(".filter-btn")
  const munitionsButtons = qsa(".munitions-btn")
  const navigationButtons = qsa(".navigation-btn")
  const munitionsFilter = qs(".munitions-filter")
  const navigationFilter = qs(".navigation-filter")
  const landingEl = qs(".landing")
  const mainContainer = qs(".timeline-container")

  function refreshLightbox() {
    if (lightbox) lightbox.destroy()
    const activeElements = Array.from(
      shadowRoot.querySelectorAll(".glightbox-active"),
    )

    lightbox = GLightbox({
      elements: activeElements,
      loop: true,
      openEffect: "zoom",
      closeEffect: "zoom",
      draggable: true,
      appendTo: shadowRoot.host,
    })

    // Manually attach click listeners since shadow DOM blocks document-level events
    activeElements.forEach((el, index) => {
      el.addEventListener("click", (e) => {
        e.preventDefault()
        lightbox.openAt(index)
      })
    })
  }

  // =========================================================
  //  MUNITIONS SUB-FILTER
  // =========================================================
  munitionsButtons.forEach((button) => {
    button.addEventListener("click", (e) => {
      e.stopPropagation()
      munitionsButtons.forEach((btn) => btn.classList.remove("active"))
      button.classList.add("active")

      const subFilter = button.getAttribute("data-subfilter")

      qsa(".gallery-row[data-category='munitions']").forEach((item) => {
        item.classList.toggle(
          "hidden",
          subFilter !== "all" &&
            item.getAttribute("data-subCategory") !== subFilter,
        )
      })

      refreshLightbox()

      if (subFilter === "mun-1") focusComponentXRay("warheads", 0.1)
      else if (subFilter === "mun-2")
        showHiddenComponent(
          "Missile",
          [-1.44, 2.15, 0.69],
          [0.25, -0.05, -0.03],
        )
      else if (subFilter === "mun-3")
        showHiddenComponent("Munitions", [1.8, 0.7, -0.8], [-0.2, -0.75, 0])
      else resetMaterialOpacities()
    })
  })

  // =========================================================
  //  NAVIGATION SUB-FILTER
  // =========================================================
  navigationButtons.forEach((button) => {
    button.addEventListener("click", (e) => {
      e.stopPropagation()
      navigationButtons.forEach((btn) => btn.classList.remove("active"))
      button.classList.add("active")

      const subFilter = button.getAttribute("data-subfilter")

      qsa(".gallery-row[data-category='navigation']").forEach((item) => {
        item.classList.toggle(
          "hidden",
          subFilter !== "all" &&
            item.getAttribute("data-subCategory") !== subFilter,
        )
      })

      refreshLightbox()
      resetMaterialOpacities()

      if (subFilter === "nav-1") highlightNavigation()
      else if (subFilter === "nav-2") highlightSatNav()
    })
  })

  // =========================================================
  //  MAIN FILTER
  // =========================================================
  function applyFilter(filterValue) {
    const galleryRows = qsa(".gallery-row")

    // Munitions sub-menu
    if (munitionsFilter) {
      if (filterValue === "munitions") {
        munitionsFilter.style.display = "flex"
        munitionsButtons.forEach((btn) =>
          btn.classList.toggle(
            "active",
            btn.getAttribute("data-subfilter") === "mun-1",
          ),
        )
        focusComponentXRay("warheads", 0.1)
      } else {
        munitionsFilter.style.display = "none"
        resetMaterialOpacities()
      }
    }

    // Navigation sub-menu
    if (navigationFilter) {
      if (filterValue === "navigation") {
        navigationFilter.style.display = "flex"
        navigationButtons.forEach((btn) =>
          btn.classList.toggle(
            "active",
            btn.getAttribute("data-subfilter") === "nav-1",
          ),
        )
        highlightNavigation()
      } else {
        navigationFilter.style.display = "none"
      }
    }

    // Landing state
    if (!filterValue || filterValue === "none") {
      if (landingEl) landingEl.style.display = "block"
      galleryRows.forEach((row) => row.classList.add("hidden"))
      refreshLightbox()
      return
    }

    if (landingEl) landingEl.style.display = "none"

    // Row visibility & lightbox sync
    galleryRows.forEach((row) => {
      const category = row.getAttribute("data-category")
      const subCat = row.getAttribute("data-subCategory")
      const anchors = row.querySelectorAll(".glightbox")

      let activeSubFilter = "all"
      if (category === "munitions") {
        activeSubFilter =
          qs(".munitions-btn.active")?.getAttribute("data-subfilter") ?? "all"
      } else if (category === "navigation") {
        activeSubFilter =
          qs(".navigation-btn.active")?.getAttribute("data-subfilter") ?? "all"
      }

      const visible =
        (filterValue === "all" || category === filterValue) &&
        (activeSubFilter === "all" || subCat === activeSubFilter)

      row.classList.toggle("hidden", !visible)
      anchors.forEach((a) => a.classList.toggle("glightbox-active", visible))
    })

    refreshLightbox()
  }

  // Main filter buttons
  const initialActive = qs(".filter-btn.active")
  applyFilter(initialActive?.getAttribute("data-filter") ?? "none")

  filterButtons.forEach((button) => {
    button.addEventListener("click", () => {
      filterButtons.forEach((btn) => btn.classList.remove("active"))
      button.classList.add("active")

      const filter = button.getAttribute("data-filter")
      applyFilter(filter)

      // Trigger 3D highlight for the selected category
      if (filter === "airframe") highlightAirframe()
      else if (filter === "propulsion") highlightPropulsion()
      else if (filter === "communication") highlightCommunication()

      mainContainer?.scrollTo({ top: 0 })
    })
  })

  return {
    destroy: () => lightbox?.destroy(),
  }
}
