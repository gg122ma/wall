function getBuildingNotes(placeId) {
  return notes.filter(note => note.contextType === "building" && note.placeId === placeId && !note.isHidden);
}

function getBuildingDescription(building) {
  return getLocalizedBuildingText(building, "description");
}

function getBuildingZoneName(building) {
  const language = I18n.getLanguage();
  return CAMPUS_ZONES[building.zoneId]?.[language] || CAMPUS_ZONES[building.zoneId]?.en || building.zoneId;
}

function buildingPolygonPoints(building) {
  const polygon = Array.isArray(building.overviewPolygon) ? building.overviewPolygon : [];
  return polygon.map(point => `${Number(point[0]).toFixed(2)},${Number(point[1]).toFixed(2)}`).join(" ");
}

function renderBuildingMiniature(building, className = "") {
  return `<svg class="building-miniature ${className}" viewBox="0 0 100 100" role="img" aria-label="Bird's-eye outline of ${escapeHtml(building.name)}">
    <defs><linearGradient id="g-${escapeHtml(building.id)}" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="currentColor" stop-opacity=".2"/><stop offset="1" stop-color="currentColor" stop-opacity=".06"/></linearGradient></defs>
    <polygon points="${buildingPolygonPoints(building)}" fill="url(#g-${escapeHtml(building.id)})" stroke="currentColor" stroke-width="2.2" vector-effect="non-scaling-stroke" />
  </svg>`;
}

function renderPlaceDirectory(container) {
  const cards = CAMPUS_BUILDINGS.map((building, index) => {
    const count = getBuildingNotes(building.id).length;
    return `<button class="place-card reveal-card" data-reveal style="--reveal-delay:${Math.min(index * 35, 420)}ms" onclick="navigate('#/place/${encodeURIComponent(building.id)}')">
      <div class="place-card-visual" style="--place-color:${escapeHtml({ learning:'#5f74d6','student-life':'#9b70cf',residence:'#dc5b83',sports:'#4ba874',services:'#65748d',mobility:'#8b7867' }[building.zoneId] || '#8b5e3c')}">
        ${renderBuildingMiniature(building)}
        <span class="place-emoji">${escapeHtml(building.emoji)}</span>
      </div>
      <div class="place-card-copy"><span class="place-zone">${escapeHtml(getBuildingZoneName(building))}</span><h3>${escapeHtml(building.name)}</h3><p>${escapeHtml(getBuildingDescription(building))}</p></div>
      <span class="place-card-foot"><b>${count}</b> notes <span>${I18n.t("home.buildings.open")} →</span></span>
    </button>`;
  }).join("");

  container.innerHTML = `<div class="container places-page page-reveal">
    <button class="page-back" onclick="navigate('#/')">← ${I18n.t("nav.home")}</button>
    <header class="places-header"><p class="eyebrow">${I18n.t("places.eyebrow")}</p><h1>${I18n.t("places.title")}</h1><p>${I18n.t("places.description")}</p></header>
    <div class="place-filter-bar"><span>${CAMPUS_BUILDINGS.length} buildings</span><input id="place-search" class="form-input" type="search" placeholder="Search buildings" oninput="filterPlaceCards(event)" /></div>
    <div id="place-grid" class="place-grid">${cards}</div>
  </div>`;
}

function filterPlaceCards(event) {
  const query = String(event.target.value || "").trim().toLowerCase();
  document.querySelectorAll(".place-card").forEach(card => {
    card.hidden = query && !card.textContent.toLowerCase().includes(query);
  });
}

function renderHotNoteChip(note, index) {
  const x = Math.max(8, Math.min(78, Number(note.positionX || 12)));
  const y = Math.max(8, Math.min(76, Number(note.positionY || 12)));
  const author = note.isAnonymous ? "Anonymous" : (note.authorNickname || "User");
  return `<button class="overview-note-chip shape-${escapeHtml(note.shape || 'rounded')}" style="left:${x}%;top:${y}%;--chip-delay:${index * 70}ms;background:${escapeHtml(note.color || '#fff7c9')}" onclick="openModal(${Number(note.id)})">
    <span>${escapeHtml(String(note.content || "").slice(0, 86))}${String(note.content || "").length > 86 ? "…" : ""}</span><small>👍 ${Number(note.score || 0)} · ${escapeHtml(author)}</small>
  </button>`;
}

function renderPlaceProfile(container, placeId) {
  const building = getCampusBuilding(placeId);
  if (!building) {
    container.innerHTML = `<section class="container error-page"><h1>Building not found</h1><button class="btn btn-primary" onclick="navigate('#/places')">${I18n.t("place.back")}</button></section>`;
    return;
  }
  const buildingNotes = getBuildingNotes(building.id).sort((a, b) => Number(b.score || 0) - Number(a.score || 0));
  const hotNotes = buildingNotes.slice(0, 5);
  const description = getBuildingDescription(building);
  const language = I18n.getLanguage();
  const tags = building.tags?.[language] || building.tags?.en || [];

  container.innerHTML = `<div class="container place-profile page-reveal">
    <button class="page-back" onclick="navigate('#/places')">← ${I18n.t("place.back")}</button>
    <section class="place-profile-hero">
      <div class="place-profile-copy"><span class="place-profile-icon">${escapeHtml(building.emoji)}</span><p class="eyebrow">${escapeHtml(getBuildingZoneName(building))}</p><h1>${escapeHtml(building.name)}</h1><p class="place-profile-description">${escapeHtml(description)}</p><div class="place-profile-meta"><span><b>${I18n.t("place.floors")}</b>${Number(building.floors || 1)}</span><span><b>${I18n.t("place.hours")}</b>${escapeHtml(building.hours || "—")}</span><span><b>${I18n.t("place.zone")}</b>${escapeHtml(getBuildingZoneName(building))}</span></div><div class="place-tags">${tags.map(tag => `<span>${escapeHtml(tag)}</span>`).join("")}</div></div>
      <div class="building-overview" aria-label="${escapeHtml(I18n.t('place.hotNotes'))}">
        <div class="building-overview-grid"></div>
        ${renderBuildingMiniature(building, "building-overview-shape")}
        <div class="building-overview-title"><span>${I18n.t("place.hotNotes")}</span><b>${buildingNotes.length}</b></div>
        ${hotNotes.length ? hotNotes.map(renderHotNoteChip).join("") : `<p class="building-overview-empty">${I18n.t("place.noHotNotes")}</p>`}
      </div>
    </section>
    <section class="place-wall-entry"><div><p class="eyebrow">${I18n.t("wall.shared")}</p><h2>${escapeHtml(building.name)} Wall</h2><p>${escapeHtml(description)}</p></div><button class="btn btn-primary btn-lg btn-round" onclick="navigate('#/place/${encodeURIComponent(building.id)}/wall')">${I18n.t("place.enterWall")} →</button></section>
  </div>`;
}

function openPlaceFromMap(placeId) {
  if (!getCampusBuilding(placeId)) return false;
  location.href = `index.html#/place/${encodeURIComponent(placeId)}`;
  return true;
}

window.openPlaceFromMap = openPlaceFromMap;
