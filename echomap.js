window.addEventListener("DOMContentLoaded", async () => {
  const WALL_NOTES_KEY = "echo-wall-notes";
  const MAP_RETURN_STORAGE_KEY = "echowall_map_return_v1";
  const MAP_RETURN_VERSION = 1;
  const MAP_RETURN_TTL_MS = 30 * 60 * 1000;
  const PUSTAKA_PLACE_ID = "B_PUSTAKA";
  const MASJID_PLACE_ID = "B_MASJID";
  const DEWAN_KULIAH_PLACE_ID = "B_DEWAN_KULIAH";
  const TUTORAN_MAKMAL_PLACE_ID = "B_BLOK_TUTORAN_MAKMAL";
  const LANGKASUKA_PLACE_ID = "B_LANGKASUKA";
  const SERAMBI_PLACE_ID = "B_SERAMBI";
  const DEWAN_MAHAWANGSA_PLACE_ID = "B_DEWAN_MAHAWANGSA";
  const KAFETERIA_A_PLACE_ID = "B_KAFETERIA_A";
  const KAFETERIA_B_PLACE_ID = "B_KAFETERIA_B";
  const KAFETERIA_C_PLACE_ID = "B_KAFETERIA_C";
  const KAFETERIA_PENTADBIRAN_PLACE_ID = "B_KAFETERIA_PENTADBIRAN";
  const SERI_PALAS_PLACE_ID = "B_SERI_PALAS";
  const SERI_TEMIN_PLACE_ID = "B_SERI_TEMIN";
  const SERI_LAKA_PLACE_ID = "B_SERI_LAKA";
  const BUILDING_INTERACTION_CONFIGS = Object.freeze([
    Object.freeze({
      id:PUSTAKA_PLACE_ID,
      className:"pustaka-building-footprint",
      idleColor:"#e0a040",
      hoverColor:"#d28c2c",
      selectedColor:"#b97418",
      opensPreview:true,
      showPilotEyebrow:true,
    }),
    Object.freeze({
      id:MASJID_PLACE_ID,
      className:"masjid-building-footprint",
      idleColor:"#3fa873",
      hoverColor:"#319565",
      selectedColor:"#238153",
      opensPreview:true,
      showPilotEyebrow:false,
    }),
    Object.freeze({
      id:DEWAN_KULIAH_PLACE_ID,
      className:"dewan-kuliah-building-footprint",
      idleColor:"#7487a6",
      hoverColor:"#667d9f",
      selectedColor:"#4f668a",
      opensPreview:true,
      showPilotEyebrow:false,
    }),
    Object.freeze({
      id:TUTORAN_MAKMAL_PLACE_ID,
      className:"tutoran-makmal-building-footprint",
      idleColor:"#9a7487",
      hoverColor:"#896477",
      selectedColor:"#744f63",
      opensPreview:true,
      showPilotEyebrow:false,
    }),
    Object.freeze({
      id:LANGKASUKA_PLACE_ID,
      className:"langkasuka-building-footprint",
      idleColor:"#8a8b62",
      hoverColor:"#77794f",
      selectedColor:"#62663d",
      opensPreview:true,
      showPilotEyebrow:false,
    }),
    Object.freeze({
      id:SERAMBI_PLACE_ID,
      className:"serambi-building-footprint",
      idleColor:"#9a766d",
      hoverColor:"#89645b",
      selectedColor:"#744f47",
      opensPreview:true,
      showPilotEyebrow:false,
    }),
    Object.freeze({
      id:DEWAN_MAHAWANGSA_PLACE_ID,
      className:"dewan-mahawangsa-building-footprint",
      idleColor:"#80769a",
      hoverColor:"#6d6388",
      selectedColor:"#584e73",
      opensPreview:true,
      showPilotEyebrow:false,
    }),
    Object.freeze({
      id:KAFETERIA_A_PLACE_ID,
      className:"kafeteria-a-building-footprint",
      idleColor:"#6f8f91",
      hoverColor:"#5d7d80",
      selectedColor:"#49686b",
      opensPreview:true,
      showPilotEyebrow:false,
    }),
    Object.freeze({
      id:KAFETERIA_B_PLACE_ID,
      className:"kafeteria-b-building-footprint",
      idleColor:"#6f8f91",
      hoverColor:"#5d7d80",
      selectedColor:"#49686b",
      opensPreview:true,
      showPilotEyebrow:false,
    }),
    Object.freeze({
      id:KAFETERIA_C_PLACE_ID,
      className:"kafeteria-c-building-footprint",
      idleColor:"#6f8f91",
      hoverColor:"#5d7d80",
      selectedColor:"#49686b",
      opensPreview:true,
      showPilotEyebrow:false,
    }),
    Object.freeze({
      id:KAFETERIA_PENTADBIRAN_PLACE_ID,
      className:"kafeteria-pentadbiran-building-footprint",
      idleColor:"#6f8f91",
      hoverColor:"#5d7d80",
      selectedColor:"#49686b",
      opensPreview:true,
      showPilotEyebrow:false,
    }),
    Object.freeze({
      id:SERI_PALAS_PLACE_ID,
      className:"seri-palas-building-footprint",
      idleColor:"#9c8bd9",
      hoverColor:"#8a78c8",
      selectedColor:"#725fb0",
      opensPreview:true,
      showPilotEyebrow:false,
    }),
    Object.freeze({
      id:SERI_TEMIN_PLACE_ID,
      className:"seri-temin-building-footprint",
      idleColor:"#9c8bd9",
      hoverColor:"#8a78c8",
      selectedColor:"#725fb0",
      opensPreview:true,
      showPilotEyebrow:false,
    }),
    Object.freeze({
      id:SERI_LAKA_PLACE_ID,
      className:"seri-laka-building-footprint",
      idleColor:"#9c8bd9",
      hoverColor:"#8a78c8",
      selectedColor:"#725fb0",
      opensPreview:true,
      showPilotEyebrow:false,
    }),
  ]);
  const PREVIEW_PLACE_IDS = new Set(
    BUILDING_INTERACTION_CONFIGS
      .filter(config => config.opensPreview)
      .map(config => config.id)
  );
  const BUILDING_TARGET_ZOOM = 18;
  const FEATURED_BUILDING_IDS = Object.freeze([
    "B_PUSTAKA",
    "B_DEWAN_KULIAH",
    "B_BLOK_TUTORAN_MAKMAL",
    "B_LANGKASUKA",
    "B_SERAMBI",
    "B_DEWAN_MAHAWANGSA",
    "B_KAFETERIA_A",
    "B_KAFETERIA_B",
    "B_KAFETERIA_C",
    "B_KAFETERIA_PENTADBIRAN",
    "B_SERI_PALAS",
    "B_SERI_TEMIN",
    "B_SERI_LAKA",
    "B_MASJID",
  ]);
  const DEFAULT_VIEW = [6.42559, 100.41959];
  const CAMPUS_BOUNDS = L.latLngBounds([6.42175, 100.41585], [6.42805, 100.42265]);

  function escapeHtml(value) {
    return String(value ?? "")
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;")
      .replace(/"/g, "&quot;")
      .replace(/'/g, "&#039;");
  }

  function getZoneName(zoneId) {
    const zone = window.CAMPUS_ZONES?.[zoneId];
    const language = I18n.getLanguage();
    return zone?.[language] || zone?.en || String(zoneId || "");
  }

  function getBuildingNameParts(name) {
    const value = String(name || "").trim();
    const match = value.match(/^(.+?)\s*\(([^()]+)\)\s*$/);
    return match
      ? { displayName: match[1].trim(), alternateName: match[2].trim() }
      : { displayName: value, alternateName: "" };
  }

  function getCategoryLabel(category) {
    const value = String(category || "");
    const translated = I18n.t("map.category." + value);
    return translated === "map.category." + value
      ? value.replace(/[-_]+/g, " ").replace(/\b\w/g, character => character.toUpperCase())
      : translated;
  }

  function truncateText(value, maximumLength = 180) {
    const text = String(value || "").trim();
    return text.length > maximumLength ? text.slice(0, maximumLength - 1).trimEnd() + "…" : text;
  }

  function getVisibleBuildingNotes(placeId) {
    try {
      const stored = localStorage.getItem(WALL_NOTES_KEY);
      if (!stored) return [];
      const parsed = JSON.parse(stored);
      if (!Array.isArray(parsed)) return [];
      return parsed
        .filter(note => note && note.contextType === "building" && note.placeId === placeId && !note.isHidden)
        .sort((left, right) => {
          const rightTime = Date.parse(right.createdAt || "") || 0;
          const leftTime = Date.parse(left.createdAt || "") || 0;
          return rightTime - leftTime;
        });
    } catch (error) {
      console.warn("Building notes could not be loaded:", error);
      return [];
    }
  }

  function formatNoteDate(value) {
    const date = new Date(value);
    if (!Number.isFinite(date.getTime())) return "";
    const locale = { en:"en-GB", ms:"ms-MY", zh:"zh-CN" }[I18n.getLanguage()] || "en-GB";
    return new Intl.DateTimeFormat(locale, { dateStyle:"medium" }).format(date);
  }

  function renderRecentBuildingNotes(notes) {
    if (!notes.length) {
      return '<p class="place-preview-empty">' + escapeHtml(I18n.t("map.previewEmpty")) + '</p>';
    }
    return '<div class="place-preview-notes">' + notes.slice(0, 2).map(note => {
      const author = note.isAnonymous ? I18n.t("map.anonymous") : (note.authorNickname || I18n.t("map.unknownAuthor"));
      const date = formatNoteDate(note.createdAt);
      const detail = date ? author + " · " + date : author;
      return '<article class="place-preview-note"><p>' + escapeHtml(truncateText(note.content)) + '</p><small>' + escapeHtml(detail) + '</small></article>';
    }).join("") + '</div>';
  }

  const map = L.map("map", { zoomControl: false, preferCanvas: true }).setView(DEFAULT_VIEW, 17);
  L.control.zoom({ position: "topright" }).addTo(map);
  L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
    attribution: "© OpenStreetMap contributors",
    maxZoom: 20,
  }).addTo(map);

  const buildingLayer = L.layerGroup().addTo(map);

  const mapSide = document.getElementById("map-side");
  const mapGuide = document.getElementById("map-guide");
  const buildingSearch = document.getElementById("building-search");
  const buildingList = document.getElementById("building-list");
  const buildingEmpty = document.getElementById("building-empty");
  const placePreview = document.getElementById("place-preview");
  let previewedPlaceId = "";
  let selectedFootprintId = "";
  let selectedBuildingId = "";
  const buildingFootprintControls = new Map();
  const featuredBuildings = FEATURED_BUILDING_IDS
    .map(id => window.CAMPUS_BUILDINGS.find(building => building.id === id))
    .filter(Boolean);

  function removeMapReturnSnapshot() {
    try {
      sessionStorage.removeItem(MAP_RETURN_STORAGE_KEY);
    } catch (error) {
      // Session storage is optional; the existing navigation remains available.
    }
  }

  function isMapReturnBuildingId(value, { allowEmpty = true } = {}) {
    if (value === "") return allowEmpty;
    return typeof value === "string" && Boolean(getInteractionBuilding(value));
  }

  function isValidMapReturnSnapshot(snapshot) {
    if (!snapshot || typeof snapshot !== "object" || Array.isArray(snapshot)) return false;
    if (snapshot.version !== MAP_RETURN_VERSION) return false;
    const createdAt = Number(snapshot.createdAt);
    const age = Date.now() - createdAt;
    if (!Number.isFinite(createdAt) || age < 0 || age > MAP_RETURN_TTL_MS) return false;
    if (!isMapReturnBuildingId(snapshot.placeId, { allowEmpty:false })) return false;
    if (!isMapReturnBuildingId(snapshot.selectedBuildingId)) return false;
    if (!isMapReturnBuildingId(snapshot.selectedFootprintId)) return false;
    if (!isMapReturnBuildingId(snapshot.previewedPlaceId)) return false;

    const latitude = Number(snapshot.center?.lat);
    const longitude = Number(snapshot.center?.lng);
    if (!Number.isFinite(latitude) || latitude < -90 || latitude > 90) return false;
    if (!Number.isFinite(longitude) || longitude < -180 || longitude > 180) return false;

    const zoom = Number(snapshot.zoom);
    const minimumZoom = map.getMinZoom();
    const maximumZoom = map.getMaxZoom();
    if (!Number.isFinite(zoom)) return false;
    if (Number.isFinite(minimumZoom) && zoom < minimumZoom) return false;
    if (Number.isFinite(maximumZoom) && zoom > maximumZoom) return false;

    return ["buildingListScrollTop", "previewBodyScrollTop", "windowScrollY"].every(field => {
      const value = Number(snapshot[field]);
      return Number.isFinite(value) && value >= 0;
    });
  }

  function readMapReturnSnapshot() {
    let stored;
    try {
      stored = sessionStorage.getItem(MAP_RETURN_STORAGE_KEY);
    } catch (error) {
      return null;
    }
    if (!stored) return null;
    try {
      const snapshot = JSON.parse(stored);
      if (isValidMapReturnSnapshot(snapshot)) return snapshot;
    } catch (error) {
      // Invalid JSON is removed below and otherwise ignored.
    }
    removeMapReturnSnapshot();
    return null;
  }

  function writeMapReturnSnapshot(snapshot) {
    try {
      sessionStorage.setItem(MAP_RETURN_STORAGE_KEY, JSON.stringify(snapshot));
      return true;
    } catch (error) {
      return false;
    }
  }

  function saveMapReturnSnapshot(placeId) {
    const building = getInteractionBuilding(placeId);
    if (!building) return false;
    const center = map.getCenter();
    const previewBody = placePreview.querySelector(".place-preview-body");
    return writeMapReturnSnapshot({
      version:MAP_RETURN_VERSION,
      createdAt:Date.now(),
      placeId:building.id,
      center:{ lat:center.lat, lng:center.lng },
      zoom:map.getZoom(),
      selectedBuildingId,
      selectedFootprintId,
      previewedPlaceId,
      buildingListScrollTop:buildingList.scrollTop,
      previewBodyScrollTop:previewBody?.scrollTop || 0,
      windowScrollY:window.scrollY,
    });
  }

  function syncBuildingSelectionState() {
    buildingList.querySelectorAll(".building-card").forEach(card => {
      const isSelected = card.dataset.buildingId === selectedBuildingId;
      card.classList.toggle("active", isSelected);
      card.setAttribute("aria-pressed", String(isSelected));
    });
  }

  function focusBuildingTarget(building) {
    const latitude = Number(building?.mapTarget?.lat);
    const longitude = Number(building?.mapTarget?.lng);
    if (!Number.isFinite(latitude) || !Number.isFinite(longitude)) return;
    map.flyTo([latitude, longitude], BUILDING_TARGET_ZOOM, { duration: .75 });
  }

  function renderBuildingList() {
    const query = buildingSearch.value.trim().toLocaleLowerCase();
    const matches = featuredBuildings.filter(building => building.name.toLocaleLowerCase().includes(query));
    buildingList.replaceChildren();
    matches.forEach(building => {
      const card = document.createElement("button");
      card.type = "button";
      card.className = "building-card";
      card.dataset.buildingId = building.id;
      card.setAttribute("aria-pressed", "false");
      card.innerHTML = '<span><strong>' + escapeHtml(building.name) + '</strong><small>' + escapeHtml(getCategoryLabel(building.category)) + '</small></span><span class="building-selected-mark" aria-hidden="true">✓</span>';
      card.addEventListener("click", () => {
        if (!selectBuildingFootprint(building.id)) {
          selectedBuildingId = building.id;
          syncBuildingSelectionState();
          clearBuildingFootprintSelection();
          if (previewedPlaceId) closePlacePreview({ restoreFocus:false });
        }
        focusBuildingTarget(building);
      });
      buildingList.appendChild(card);
    });
    buildingEmpty.hidden = matches.length !== 0;
    syncBuildingSelectionState();
  }

  buildingSearch.addEventListener("input", renderBuildingList);
  renderBuildingList();

  function closePlacePreview({ restoreFocus = true } = {}) {
    const closingPlaceId = previewedPlaceId;
    previewedPlaceId = "";
    mapGuide.hidden = false;
    placePreview.hidden = true;
    placePreview.replaceChildren();
    clearBuildingFootprintSelection();
    if (restoreFocus) {
      getBuildingFootprintControl(closingPlaceId)?.polygon.getElement()?.focus();
    }
  }

  function openPlacePreview(building, { scrollOnMobile = true } = {}) {
    if (!building || !PREVIEW_PLACE_IDS.has(building.id)) return;
    previewedPlaceId = building.id;
    const visibleNotes = getVisibleBuildingNotes(building.id);
    const nameParts = getBuildingNameParts(building.name);
    const previewEyebrow = getBuildingInteractionConfig(building.id)?.showPilotEyebrow
      ? '<p class="eyebrow">' + escapeHtml(I18n.t("map.previewEyebrow")) + '</p>'
      : "";
    const alternateName = nameParts.alternateName
      ? '<p class="place-preview-alias"><strong>' + escapeHtml(I18n.t("map.alternateName")) + ':</strong> ' + escapeHtml(nameParts.alternateName) + '</p>'
      : "";
    const moreAboutBuildingLink = building.id === KAFETERIA_PENTADBIRAN_PLACE_ID
      ? '<a class="place-preview-more-link" href="index.html#/place/B_KAFETERIA_PENTADBIRAN">' + escapeHtml(I18n.t("map.moreAboutBuilding")) + ' <span aria-hidden="true">→</span></a>'
      : "";
    const wallUrl = "index.html#/place/" + encodeURIComponent(building.id) + "/wall";
    placePreview.innerHTML =
      '<button id="place-preview-back" class="place-preview-back" type="button">← ' + escapeHtml(I18n.t("map.previewBack")) + '</button>' +
      '<div class="place-preview-body">' +
        '<span class="place-preview-icon" aria-hidden="true">' + escapeHtml(building.emoji) + '</span>' +
        previewEyebrow +
        '<h2>' + escapeHtml(nameParts.displayName) + '</h2>' +
        alternateName +
        '<dl class="place-preview-meta">' +
          '<div><dt>' + escapeHtml(I18n.t("map.buildingCategory")) + '</dt><dd>' + escapeHtml(getCategoryLabel(building.category)) + '</dd></div>' +
          '<div><dt>' + escapeHtml(I18n.t("map.functionalZone")) + '</dt><dd>' + escapeHtml(getZoneName(building.zoneId)) + '</dd></div>' +
        '</dl>' +
        '<p class="place-preview-description">' + escapeHtml(getLocalizedBuildingText(building, "description")) + '</p>' +
        moreAboutBuildingLink +
        '<div class="place-preview-count"><strong>' + visibleNotes.length + '</strong><span>' + escapeHtml(I18n.t("map.visibleNotes")) + '</span></div>' +
        '<h3 class="place-preview-notes-title">' + escapeHtml(I18n.t("map.recentNotes")) + '</h3>' +
        renderRecentBuildingNotes(visibleNotes) +
      '</div>' +
      '<a id="enter-pustaka-wall" class="btn btn-primary btn-lg btn-round place-preview-action" href="' + wallUrl + '">' + escapeHtml(I18n.t("place.enterWall")) + ' <span aria-hidden="true">→</span></a>';
    mapGuide.hidden = true;
    placePreview.hidden = false;
    const wallEntry = placePreview.querySelector("#enter-pustaka-wall");
    wallEntry.addEventListener("click", () => {
      saveMapReturnSnapshot(building.id);
    });
    wallEntry.addEventListener("keydown", event => {
      if (event.key !== " ") return;
      event.preventDefault();
      wallEntry.click();
    });
    placePreview.querySelector("#place-preview-back").addEventListener("click", () => {
      closePlacePreview();
    });
    if (scrollOnMobile && window.innerWidth < 980) {
      requestAnimationFrame(() => mapSide.scrollIntoView({ behavior:"smooth", block:"start" }));
    }
  }

  const buildingHitPane = map.createPane("building-hit-pane");
  buildingHitPane.style.zIndex = "450";
  function normalizeFootprintRing(ring) {
    if (!Array.isArray(ring) || ring.length < 3) return null;
    const normalizedRing = [];
    for (const point of ring) {
      if (
        !Array.isArray(point) ||
        point.length !== 2 ||
        typeof point[0] !== "number" ||
        typeof point[1] !== "number" ||
        !Number.isFinite(point[0]) ||
        !Number.isFinite(point[1])
      ) return null;
      normalizedRing.push([point[0], point[1]]);
    }
    return normalizedRing;
  }

  function normalizeBuildingFootprint(mapFootprint) {
    if (!Array.isArray(mapFootprint) || mapFootprint.length === 0) return null;
    const firstEntry = mapFootprint[0];
    const isSingleRing = Array.isArray(firstEntry) && !Array.isArray(firstEntry[0]);
    if (isSingleRing) return normalizeFootprintRing(mapFootprint);

    const normalizePolygon = polygon => {
      if (!Array.isArray(polygon) || polygon.length === 0) return null;
      const normalizedRings = polygon.map(normalizeFootprintRing);
      return normalizedRings.every(Boolean) ? normalizedRings : null;
    };
    const isMultiPolygon = Array.isArray(firstEntry?.[0]?.[0]);
    if (!isMultiPolygon) return normalizePolygon(mapFootprint);

    const normalizedPolygons = mapFootprint.map(normalizePolygon);
    return normalizedPolygons.every(Boolean) ? normalizedPolygons : null;
  }

  function getBuildingInteractionConfig(placeId) {
    return BUILDING_INTERACTION_CONFIGS.find(config => config.id === placeId) || null;
  }

  function getInteractionBuilding(placeId) {
    if (!getBuildingInteractionConfig(placeId)) return null;
    return window.getCampusBuilding?.(placeId) || null;
  }

  function getBuildingFootprintControl(placeId) {
    return buildingFootprintControls.get(placeId) || null;
  }

  function getIdleFootprintStyle(config) {
    return { color:config.idleColor, weight:2, opacity:0, fillOpacity:0 };
  }

  function getSelectedFootprintStyle(config) {
    return { color:config.selectedColor, weight:3, opacity:.95, fillOpacity:0 };
  }

  function syncBuildingFootprintStyle(placeId) {
    const control = getBuildingFootprintControl(placeId);
    if (!control) return;
    control.polygon.setStyle(selectedFootprintId === placeId
      ? getSelectedFootprintStyle(control.config)
      : getIdleFootprintStyle(control.config));
  }

  function setSelectedFootprint(placeId) {
    selectedFootprintId = buildingFootprintControls.has(placeId) ? placeId : "";
    buildingFootprintControls.forEach(control => syncBuildingFootprintStyle(control.config.id));
  }

  function clearBuildingFootprintSelection() {
    setSelectedFootprint("");
  }

  function highlightBuildingFootprint(placeId) {
    if (selectedFootprintId) return;
    const control = getBuildingFootprintControl(placeId);
    if (!control) return;
    control.polygon.setStyle({
      color:control.config.hoverColor,
      weight:2,
      opacity:.72,
      fillColor:control.config.idleColor,
      fillOpacity:.08,
    });
  }

  function selectBuildingFootprint(placeId, { scrollPreviewOnMobile = true } = {}) {
    const config = getBuildingInteractionConfig(placeId);
    const building = getInteractionBuilding(placeId);
    if (!config || !building) return false;
    if (!config.opensPreview && previewedPlaceId) closePlacePreview({ restoreFocus:false });
    setSelectedFootprint(placeId);
    selectedBuildingId = placeId;
    syncBuildingSelectionState();
    if (config.opensPreview) openPlacePreview(building, { scrollOnMobile:scrollPreviewOnMobile });
    return true;
  }

  function bindBuildingFootprintEvents(control) {
    const { building, config, polygon } = control;
    polygon.on("mouseover", () => {
      if (polygon.options.echoPlacementActive) return;
      highlightBuildingFootprint(config.id);
    });
    polygon.on("mouseout", () => {
      if (polygon.options.echoPlacementActive) return;
      syncBuildingFootprintStyle(config.id);
    });
    polygon.on("click", event => {
      if (polygon.options.echoPlacementActive) return;
      if (event.originalEvent) L.DomEvent.stopPropagation(event.originalEvent);
      selectBuildingFootprint(config.id);
    });

    const footprintElement = polygon.getElement();
    if (!footprintElement) return;
    footprintElement.style.outline = 'none';
    footprintElement.setAttribute("tabindex", "0");
    footprintElement.setAttribute("role", "button");
    footprintElement.setAttribute("aria-label", building.name);
    footprintElement.addEventListener("focus", () => highlightBuildingFootprint(config.id));
    footprintElement.addEventListener("blur", () => syncBuildingFootprintStyle(config.id));
    footprintElement.addEventListener("keydown", event => {
      if (event.key !== "Enter" && event.key !== " ") return;
      event.preventDefault();
      selectBuildingFootprint(config.id);
    });
  }

  function createBuildingFootprintControl(config) {
    const building = getInteractionBuilding(config.id);
    const footprintPoints = normalizeBuildingFootprint(building?.mapFootprint);
    if (!building || !footprintPoints) {
      console.warn(config.id + " or its map footprint is missing from the campus building registry.");
      return null;
    }

    const polygon = L.polygon(footprintPoints, {
      pane:"building-hit-pane",
      renderer:L.svg({ pane:"building-hit-pane" }),
      className:config.className,
      color:config.idleColor,
      weight:2,
      opacity:0,
      fill:true,
      fillColor:config.idleColor,
      fillOpacity:0,
      interactive:true,
      bubblingMouseEvents:false,
    }).addTo(buildingLayer);
    const control = { building, config, polygon };
    buildingFootprintControls.set(config.id, control);
    bindBuildingFootprintEvents(control);
    return control;
  }

  BUILDING_INTERACTION_CONFIGS.forEach(createBuildingFootprintControl);

  document.getElementById("fit-campus").addEventListener("click", () => {
    map.flyToBounds(CAMPUS_BOUNDS, { padding:[30,30], duration:.75 });
  });

  map.fitBounds(CAMPUS_BOUNDS, { padding:[24,24] });
  map.on("click", () => {
    selectedBuildingId = "";
    syncBuildingSelectionState();
    if (previewedPlaceId) closePlacePreview({ restoreFocus:false });
    else clearBuildingFootprintSelection();
  });

  let mapReturnRestoreAttempted = false;
  function restoreMapReturnSnapshot() {
    if (mapReturnRestoreAttempted) return false;
    mapReturnRestoreAttempted = true;
    const snapshot = readMapReturnSnapshot();
    if (!snapshot) return false;

    try {
      map.setView([snapshot.center.lat, snapshot.center.lng], snapshot.zoom, { animate:false });
      if (snapshot.selectedBuildingId) {
        if (!selectBuildingFootprint(snapshot.selectedBuildingId, { scrollPreviewOnMobile:false })) {
          throw new Error("The saved building selection is unavailable.");
        }
      } else {
        selectedBuildingId = "";
        syncBuildingSelectionState();
      }

      if (snapshot.previewedPlaceId) {
        const previewedBuilding = getInteractionBuilding(snapshot.previewedPlaceId);
        if (!previewedBuilding) throw new Error("The saved building preview is unavailable.");
        openPlacePreview(previewedBuilding, { scrollOnMobile:false });
      } else if (previewedPlaceId) {
        closePlacePreview({ restoreFocus:false });
      }
      setSelectedFootprint(snapshot.selectedFootprintId);

      requestAnimationFrame(() => {
        buildingList.scrollTop = snapshot.buildingListScrollTop;
        const previewBody = placePreview.querySelector(".place-preview-body");
        if (previewBody) previewBody.scrollTop = snapshot.previewBodyScrollTop;
        window.scrollTo({ top:snapshot.windowScrollY, left:0, behavior:"auto" });
        removeMapReturnSnapshot();
      });
      return true;
    } catch (error) {
      removeMapReturnSnapshot();
      return false;
    }
  }

  restoreMapReturnSnapshot();

  window.EchoMapNoteOverlay?.init({
    map,
    getFitCampusZoom:() => map.getBoundsZoom(CAMPUS_BOUNDS, false, L.point(60,60)),
    buildingZoom:BUILDING_TARGET_ZOOM,
    buildingPolygons:Object.freeze(Array.from(buildingFootprintControls.values(), control => Object.freeze({
      placeId:control.config.id,
      building:control.building,
      name:control.building.name,
      layer:control.polygon,
    }))),
  });

  window.addEventListener("echo:languagechange", () => {
    renderBuildingList();
    const previewedBuilding = getInteractionBuilding(previewedPlaceId);
    if (previewedBuilding) openPlacePreview(previewedBuilding, { scrollOnMobile:false });
  });
  window.addEventListener("pageshow", () => {
    const previewedBuilding = getInteractionBuilding(previewedPlaceId);
    if (previewedBuilding) openPlacePreview(previewedBuilding, { scrollOnMobile:false });
  });
});
