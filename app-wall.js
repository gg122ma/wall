const MAX_IMAGE_SOURCE_BYTES = 8 * 1024 * 1024;
const MAX_STORED_IMAGE_BYTES = 450 * 1024;
const ALLOWED_IMAGE_TYPES = new Set(["image/jpeg", "image/png", "image/webp"]);
const MAP_RETURN_STORAGE_KEY = "echowall_map_return_v1";
const MAP_RETURN_VERSION = 1;
const MAP_RETURN_TTL_MS = 30 * 60 * 1000;
const NOTE_COLOR_PRESETS = Object.freeze([
  { value:"#BFDBFE", label:"Soft blue" },
  { value:"#FEF08A", label:"Soft yellow" },
  { value:"#BBF7D0", label:"Soft green" },
  { value:"#FBCFE8", label:"Soft pink" },
  { value:"#FED7AA", label:"Soft orange" },
  { value:"#FFF7ED", label:"Warm cream" },
  { value:"#E9D5FF", label:"Soft purple" },
  { value:"#CBD5E1", label:"Grey blue" },
  { value:"#CFFAFE", label:"Soft cyan" },
  { value:"#FDE68A", label:"Golden yellow" },
]);

let pendingImageDataUrl = "";
let pendingImageName = "";
let imageProcessing = false;

function dataUrlByteSize(dataUrl) {
  const base64 = String(dataUrl || "").split(",")[1] || "";
  const padding = (base64.match(/=*$/) || [""])[0].length;
  return Math.max(0, Math.floor((base64.length * 3) / 4) - padding);
}

function blobToDataUrl(blob) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(String(reader.result || ""));
    reader.onerror = () => reject(new Error("The selected image could not be read."));
    reader.readAsDataURL(blob);
  });
}

function loadImageFile(file) {
  return new Promise((resolve, reject) => {
    const objectUrl = URL.createObjectURL(file);
    const image = new Image();
    image.onload = () => {
      URL.revokeObjectURL(objectUrl);
      resolve(image);
    };
    image.onerror = () => {
      URL.revokeObjectURL(objectUrl);
      reject(new Error("The selected file is not a readable image."));
    };
    image.src = objectUrl;
  });
}

function canvasToBlob(canvas, type, quality) {
  return new Promise((resolve, reject) => {
    canvas.toBlob(blob => {
      if (blob) resolve(blob);
      else reject(new Error("This browser could not process the selected image."));
    }, type, quality);
  });
}

async function compressNoteImage(file) {
  if (!ALLOWED_IMAGE_TYPES.has(file.type)) {
    throw new Error("Please choose a JPG, PNG, or WebP image.");
  }
  if (file.size > MAX_IMAGE_SOURCE_BYTES) {
    throw new Error("The original image must be 8 MB or smaller.");
  }

  const source = await loadImageFile(file);
  const maxDimension = 1280;
  const initialScale = Math.min(1, maxDimension / Math.max(source.naturalWidth, source.naturalHeight));
  let width = Math.max(1, Math.round(source.naturalWidth * initialScale));
  let height = Math.max(1, Math.round(source.naturalHeight * initialScale));
  let quality = 0.84;
  let lastDataUrl = "";

  for (let attempt = 0; attempt < 10; attempt += 1) {
    const canvas = document.createElement("canvas");
    canvas.width = width;
    canvas.height = height;
    const context = canvas.getContext("2d", { alpha: true });
    if (!context) throw new Error("Image processing is not available in this browser.");

    context.drawImage(source, 0, 0, width, height);
    let blob;
    try {
      blob = await canvasToBlob(canvas, "image/webp", quality);
    } catch {
      blob = await canvasToBlob(canvas, "image/jpeg", quality);
    }

    lastDataUrl = await blobToDataUrl(blob);
    if (blob.size <= MAX_STORED_IMAGE_BYTES) return lastDataUrl;

    if (quality > 0.58) {
      quality -= 0.08;
    } else {
      width = Math.max(1, Math.round(width * 0.82));
      height = Math.max(1, Math.round(height * 0.82));
      quality = 0.76;
    }
  }

  if (dataUrlByteSize(lastDataUrl) <= MAX_STORED_IMAGE_BYTES * 1.15) return lastDataUrl;
  throw new Error("This image is too detailed to store locally. Please choose a smaller image.");
}

function updateImagePreview() {
  const preview = document.getElementById("image-preview");
  const previewImage = document.getElementById("image-preview-img");
  if (!preview || !previewImage) return;

  const safeSource = safeImageDataUrl(pendingImageDataUrl);
  if (!safeSource) {
    preview.classList.add("hidden");
    previewImage.removeAttribute("src");
    return;
  }

  previewImage.src = safeSource;
  preview.classList.remove("hidden");
}

function setImageStatus(message, isError = false) {
  const status = document.getElementById("image-status");
  if (!status) return;
  status.textContent = message;
  status.classList.toggle("form-error", isError);
}

function setImageProcessing(isProcessing) {
  imageProcessing = isProcessing;
  const submit = document.getElementById("note-submit");
  const input = document.getElementById("form-image");
  if (submit) {
    submit.disabled = isProcessing;
    submit.textContent = isProcessing ? "Processing photo…" : "📌 Pin to Wall";
  }
  if (input) input.disabled = isProcessing;
}

async function handleImageSelection(event) {
  const input = event.target;
  const file = input.files && input.files[0];
  pendingImageDataUrl = "";
  pendingImageName = "";
  updateImagePreview();
  setImageStatus("");

  if (!file) return;

  setImageProcessing(true);
  setImageStatus("Resizing photo for local storage…");
  try {
    pendingImageDataUrl = await compressNoteImage(file);
    pendingImageName = String(file.name || "photo").slice(0, 120);
    updateImagePreview();
    const sizeKb = Math.ceil(dataUrlByteSize(pendingImageDataUrl) / 1024);
    setImageStatus(`Photo ready (${sizeKb} KB after compression).`);
  } catch (error) {
    input.value = "";
    pendingImageDataUrl = "";
    pendingImageName = "";
    updateImagePreview();
    setImageStatus(error instanceof Error ? error.message : "The photo could not be processed.", true);
  } finally {
    setImageProcessing(false);
  }
}

function removeSelectedImage() {
  pendingImageDataUrl = "";
  pendingImageName = "";
  const input = document.getElementById("form-image");
  if (input) input.value = "";
  updateImagePreview();
  setImageStatus("");
}


let selectedPhotoCropScale = 1;
let selectedImageFit = "cover";
const noteTranslationState = new Map();

function renderWall(container, orgId, majorId) {
  const org = organizations.find(item => item.id === orgId);
  const major = majors.find(item => item.id === majorId);
  renderContextWall(container, {
    contextType: "community",
    orgId,
    majorId,
    title: major?.name || "",
    kicker: `${org?.name || ""} community`,
    icon: org?.emoji || "🏛️",
    backPath: `#/org/${orgId}`,
  });
}

function removeInvalidMapReturnSnapshot() {
  try {
    sessionStorage.removeItem(MAP_RETURN_STORAGE_KEY);
  } catch (error) {
    // Session storage is optional; the existing building profile return remains available.
  }
}

function isKnownMapReturnBuildingId(value, { allowEmpty = true } = {}) {
  if (value === "") return allowEmpty;
  return typeof value === "string" && Boolean(getCampusBuilding(value));
}

function readMatchingMapReturnSnapshot(placeId) {
  let stored;
  try {
    stored = sessionStorage.getItem(MAP_RETURN_STORAGE_KEY);
  } catch (error) {
    return null;
  }
  if (!stored) return null;

  let snapshot;
  try {
    snapshot = JSON.parse(stored);
  } catch (error) {
    removeInvalidMapReturnSnapshot();
    return null;
  }

  const createdAt = Number(snapshot?.createdAt);
  const age = Date.now() - createdAt;
  const validStructure = Boolean(snapshot) &&
    typeof snapshot === "object" &&
    !Array.isArray(snapshot) &&
    snapshot.version === MAP_RETURN_VERSION &&
    Number.isFinite(createdAt) &&
    age >= 0 &&
    age <= MAP_RETURN_TTL_MS &&
    isKnownMapReturnBuildingId(snapshot.placeId, { allowEmpty:false }) &&
    isKnownMapReturnBuildingId(snapshot.selectedBuildingId) &&
    isKnownMapReturnBuildingId(snapshot.selectedFootprintId) &&
    isKnownMapReturnBuildingId(snapshot.previewedPlaceId) &&
    Number.isFinite(Number(snapshot.center?.lat)) &&
    Number(snapshot.center.lat) >= -90 &&
    Number(snapshot.center.lat) <= 90 &&
    Number.isFinite(Number(snapshot.center?.lng)) &&
    Number(snapshot.center.lng) >= -180 &&
    Number(snapshot.center.lng) <= 180 &&
    Number.isFinite(Number(snapshot.zoom)) &&
    ["buildingListScrollTop", "previewBodyScrollTop", "windowScrollY"].every(field => {
      const value = Number(snapshot[field]);
      return Number.isFinite(value) && value >= 0;
    });

  if (!validStructure) {
    removeInvalidMapReturnSnapshot();
    return null;
  }
  return snapshot.placeId === placeId ? snapshot : null;
}

function leaveContextWall(backPath, useDocumentNavigation = false, mapReturnPlaceId = "") {
  if (mapReturnPlaceId) {
    if (readMatchingMapReturnSnapshot(mapReturnPlaceId)) {
      location.href = "map.html";
      return;
    }
    navigate(backPath);
    return;
  }
  if (useDocumentNavigation) {
    location.href = backPath;
    return;
  }
  navigate(backPath);
}

function renderBuildingWall(container, placeId) {
  const building = getCampusBuilding(placeId);
  if (!building) {
    container.innerHTML = `<section class="container error-page"><h1>Building not found</h1><button class="btn btn-primary" onclick="navigate('#/places')">${I18n.t("place.back")}</button></section>`;
    return;
  }
  renderContextWall(container, {
    contextType: "building",
    placeId: building.id,
    title: building.name,
    kicker: getBuildingZoneName(building),
    icon: building.emoji || "🏢",
    backPath: `#/place/${building.id}`,
    mapReturnPlaceId:building.id,
  });
}

function renderContextWall(container, context) {
  wallState.contextType = context.contextType;
  wallState.orgId = context.orgId || 0;
  wallState.majorId = context.majorId || 0;
  wallState.placeId = context.placeId || "";
  const visibleCount = getContextNotes().length;

  container.innerHTML = `
    <div class="wall-page page-reveal">
      <div class="wall-sticky-stack">
        <header class="wall-context-bar">
          <div class="wall-context-main">
            <button class="wall-back-btn" onclick="leaveContextWall('${escapeHtml(context.backPath)}', ${context.useDocumentNavigation ? "true" : "false"}, '${escapeHtml(context.mapReturnPlaceId || "")}')" aria-label="Leave this wall">←</button>
            <div class="wall-context-icon">${escapeHtml(context.icon)}</div>
            <div><p class="wall-context-kicker">${escapeHtml(context.kicker)}</p><h1>${escapeHtml(context.title)}</h1></div>
          </div>
          <div class="wall-context-meta"><span><b id="wall-result-count">${visibleCount}</b> notes</span><span class="wall-live-dot"></span><span>${I18n.t("wall.shared")}</span></div>
        </header>

        <div class="toolbar">
          <div class="toolbar-scroll" aria-label="Wall controls">
            <div class="filter-group" aria-label="Category filters">
              <button class="filter-btn ${wallState.category === "all" ? "active" : ""}" data-category="all" onclick="setCategoryFilter('all')">${I18n.t("wall.all")}</button>
              <button class="filter-btn ${wallState.category === "academic" ? "active" : ""}" data-category="academic" onclick="setCategoryFilter('academic')">📚 ${I18n.t("wall.academic")}</button>
              <button class="filter-btn ${wallState.category === "koko" ? "active" : ""}" data-category="koko" onclick="setCategoryFilter('koko')">🎖️ ${I18n.t("wall.activities")}</button>
              <button class="filter-btn ${wallState.category === "campus_life" ? "active" : ""}" data-category="campus_life" onclick="setCategoryFilter('campus_life')">🏫 ${I18n.t("wall.campusLife")}</button>
              <button class="filter-btn ${wallState.category === "emotional" ? "active" : ""}" data-category="emotional" onclick="setCategoryFilter('emotional')">💛 ${I18n.t("wall.support")}</button>
            </div>
            <span class="toolbar-divider" aria-hidden="true"></span>
            <div class="filter-group compact" aria-label="Sort order">
              <button class="filter-btn ${wallState.sort === "hot" ? "active" : ""}" data-sort="hot" onclick="setSortOrder('hot')">🔥 ${I18n.t("wall.hot")}</button>
              <button class="filter-btn ${wallState.sort === "new" ? "active" : ""}" data-sort="new" onclick="setSortOrder('new')">🕒 ${I18n.t("wall.new")}</button>
            </div>
          </div>
          <div class="toolbar-actions">
            <label class="search-box"><span class="search-icon">⌕</span><input type="search" class="search-input" placeholder="${escapeHtml(I18n.t("wall.search"))}" value="${escapeHtml(wallState.search || "")}" oninput="handleSearchInput(event)" aria-label="${escapeHtml(I18n.t("wall.search"))}" /><button type="button" class="search-clear ${wallState.search ? "" : "hidden"}" onclick="clearSearch()" aria-label="Clear search">✕</button></label>
            <button class="btn btn-primary btn-round wall-compose-btn" onclick="openDrawer()"><span>＋</span> ${I18n.t("wall.leaveNote")}</button>
          </div>
        </div>
      </div>

      <div class="wall-canvas-wrap"><div class="wall-canvas-grid" aria-hidden="true"></div><div class="wall-canvas" id="wall-canvas" aria-live="polite"></div></div>
    </div>`;
  renderWallNotes();
}

function getContextNotes() {
  return notes.filter(note => {
    if (note.isHidden) return false;
    if (wallState.contextType === "building") return note.contextType === "building" && note.placeId === wallState.placeId;
    return note.contextType === "community" && Number(note.orgId) === wallState.orgId && Number(note.majorId) === wallState.majorId;
  });
}

function getFilteredNotes() {
  return getContextNotes().filter(note => {
    if (wallState.category !== "all" && note.category !== wallState.category) return false;
    const query = wallState.search.trim().toLowerCase();
    if (!query) return true;
    const content = String(note.content || "").toLowerCase();
    const author = note.isAnonymous ? "anonymous" : String(note.authorNickname || "user").toLowerCase();
    return content.includes(query) || author.includes(query);
  }).sort((a, b) => wallState.sort === "new"
    ? new Date(b.createdAt || 0) - new Date(a.createdAt || 0)
    : Number(b.score || 0) - Number(a.score || 0));
}

function stableWallLayoutHash(value) {
  let hash = 2166136261;
  for (const character of String(value || "")) {
    hash ^= character.charCodeAt(0);
    hash = Math.imul(hash, 16777619);
  }
  return hash >>> 0;
}

function getWallLayoutClass() {
  const layoutKey = wallState.contextType === "building"
    ? `building:${wallState.placeId}`
    : `community:${wallState.orgId}:${wallState.majorId}`;
  return `wall-layout-${stableWallLayoutHash(layoutKey) % 4}`;
}

function renderWallNotes() {
  const canvas = document.getElementById("wall-canvas");
  if (!canvas) return;
  canvas.className = `wall-canvas ${getWallLayoutClass()}`;
  const filtered = getFilteredNotes();
  const resultCount = document.getElementById("wall-result-count");
  if (resultCount) resultCount.textContent = String(filtered.length);

  if (!filtered.length) {
    canvas.style.minHeight = "560px";
    canvas.innerHTML = `<div class="wall-empty-state"><div class="wall-empty-icon">🍃</div><h2>${I18n.t("wall.empty.title")}</h2><p>${I18n.t("wall.empty.body")}</p><button class="btn btn-primary" onclick="openDrawer()">${I18n.t("wall.leaveNote")}</button></div>`;
    return;
  }

  canvas.style.minHeight = "560px";
  canvas.innerHTML = "";
  filtered.forEach((note, index) => canvas.appendChild(buildNoteDOM(note, index)));
}

function getSafeNoteColor(note, category) {
  const noteColor = String(note?.color || "").trim();
  const categoryColor = String(CATEGORY_COLORS[category]?.[0] || "#DBEAFE");
  if (/^#[0-9a-fA-F]{6}$/.test(noteColor)) return noteColor;
  return /^#[0-9a-fA-F]{6}$/.test(categoryColor) ? categoryColor : "#DBEAFE";
}

function buildNoteDOM(note, index) {
  const element = document.createElement("article");
  const category = Object.prototype.hasOwnProperty.call(CATEGORY_COLORS, note.category) ? note.category : "academic";
  const shape = SHAPES.includes(note.shape) ? note.shape : "rounded";
  const imageSource = getNoteImageSource(note);
  element.className = `note-item shape-${shape} cat-${category}${imageSource ? " has-photo" : ""}`;
  element.style.backgroundColor = getSafeNoteColor(note, category);
  element.style.setProperty("--note-delay", `${Math.min(index * 35, 350)}ms`);
  element.style.setProperty("--photo-scale", String(Math.max(1, Math.min(1.8, Number(note.imageCropScale || 1)))));
  element.style.setProperty("--photo-fit", note.imageFit === "contain" ? "contain" : "cover");

  const rotation = Number.isFinite(Number(note.rotation)) ? Number(note.rotation) : 0;
  element.style.setProperty("--note-rotation", `${Math.max(-2.5, Math.min(2.5, rotation))}deg`);
  element.tabIndex = 0;
  element.setAttribute("role", "button");
  element.setAttribute("aria-label", `Open note by ${note.isAnonymous ? "Anonymous" : note.authorNickname || "User"}`);
  element.onclick = () => openModal(note.id);
  element.onkeydown = event => {
    if (event.key === "Enter" || event.key === " ") { event.preventDefault(); openModal(note.id); }
  };

  const name = note.isAnonymous ? "Anonymous" : (note.authorNickname || "User");
  const categoryIcon = { academic: "📚", koko: "🎖️", campus_life: "🏫", emotional: "💛" }[category];
  element.innerHTML = `<div class="note-pin" aria-hidden="true"></div><div class="note-category-label">${categoryIcon} ${category.replace("campus_life", "campus life")}</div>${imageSource ? `<div class="note-photo"><img src="${imageSource}" alt="${escapeHtml(note.imageName || "Photo attached to note")}" loading="lazy" /></div>` : ""}<div class="note-content">${escapeHtml(note.content)}</div><div class="note-footer" onclick="event.stopPropagation()"><span class="note-author">👤 ${escapeHtml(name)}</span><button class="note-votes ${note.userVote ? "voted" : ""}" onclick="openModal(${Number(note.id)})" aria-label="Open note voting">👍 ${Number(note.score || 0)}</button></div>`;
  return element;
}

let searchTimer;
function handleSearchInput(event) {
  const value = event.target.value;
  document.querySelector(".search-clear")?.classList.toggle("hidden", !value);
  clearTimeout(searchTimer);
  searchTimer = setTimeout(() => { wallState.search = value; renderWallNotes(); }, 180);
}
function clearSearch() {
  wallState.search = "";
  const input = document.querySelector(".search-input");
  if (input) { input.value = ""; input.focus(); }
  document.querySelector(".search-clear")?.classList.add("hidden");
  renderWallNotes();
}
function setCategoryFilter(category) {
  wallState.category = category;
  document.querySelectorAll("[data-category]").forEach(button => button.classList.toggle("active", button.dataset.category === category));
  renderWallNotes();
}
function setSortOrder(sort) {
  wallState.sort = sort;
  document.querySelectorAll("[data-sort]").forEach(button => button.classList.toggle("active", button.dataset.sort === sort));
  renderWallNotes();
}

async function toggleNoteTranslation(id) {
  const state = noteTranslationState.get(Number(id));
  if (state?.showTranslated) {
    noteTranslationState.set(Number(id), { ...state, showTranslated: false });
    openModal(id);
    return;
  }
  if (state?.translatedText) {
    noteTranslationState.set(Number(id), { ...state, showTranslated: true });
    openModal(id);
    return;
  }
  const note = notes.find(item => Number(item.id) === Number(id));
  if (!note) return;
  const button = document.getElementById("modal-translate-button");
  if (button) { button.disabled = true; button.textContent = I18n.t("common.loading"); }
  try {
    const translatedText = await TranslationService.translateText(note.content, I18n.getLanguage());
    noteTranslationState.set(Number(id), { translatedText, showTranslated: true });
    openModal(id);
  } catch (error) {
    showToast(error?.code === "TRANSLATION_NOT_CONFIGURED" ? I18n.t("wall.translationUnavailable") : (error?.message || I18n.t("common.error")));
    if (button) { button.disabled = false; button.textContent = I18n.t("wall.translate"); }
  }
}

function openModal(id) {
  const note = notes.find(item => Number(item.id) === Number(id));
  if (!note) return;
  const overlay = document.getElementById("modal-overlay");
  const modalCard = document.getElementById("modal-card");
  const content = document.getElementById("modal-content");
  if (!overlay || !modalCard || !content) return;
  const name = note.isAnonymous ? "Anonymous" : (note.authorNickname || "User");
  const imageSource = getNoteImageSource(note);
  const category = Object.prototype.hasOwnProperty.call(CATEGORY_COLORS, note.category) ? note.category : "academic";
  const shape = SHAPES.includes(note.shape) ? note.shape : "rounded";
  const safeColor = getSafeNoteColor(note, category);
  const categoryLabel = { academic: "ACADEMIC", koko: "ACTIVITIES", campus_life: "CAMPUS LIFE", emotional: "SUPPORT" }[category];
  const translation = noteTranslationState.get(Number(id));
  const visibleText = translation?.showTranslated ? translation.translatedText : note.content;

  Array.from(modalCard.classList).forEach(className => {
    if (className.startsWith("modal-shape-")) modalCard.classList.remove(className);
  });
  modalCard.classList.remove("modal-note-shaped");
  modalCard.classList.add("modal-note-shaped", `modal-shape-${shape}`);
  modalCard.style.setProperty("--modal-note-color", safeColor);
  modalCard.dataset.noteShape = shape;
  modalCard.dataset.noteCategory = category;
  content.innerHTML = `<div class="modal-note-tools"><span class="badge badge-pill cat-${category}">${categoryLabel}</span><button id="modal-translate-button" class="btn btn-outline btn-sm" type="button" onclick="toggleNoteTranslation(${Number(note.id)})">${translation?.showTranslated ? I18n.t("wall.showOriginal") : I18n.t("wall.translate")}</button></div>${imageSource ? `<div class="modal-note-photo-wrap" style="--photo-scale:${Math.max(1, Math.min(1.8, Number(note.imageCropScale || 1)))};--photo-fit:${note.imageFit === "contain" ? "contain" : "cover"}"><img class="modal-note-photo" src="${imageSource}" alt="${escapeHtml(note.imageName || "Photo attached to note")}" /></div>` : ""}<div class="handwriting modal-note-text">${escapeHtml(visibleText)}</div>${translation?.showTranslated ? `<p class="translation-label">Translated to ${escapeHtml(I18n.getLanguage())}</p>` : ""}<div class="modal-note-footer"><div>👤 ${escapeHtml(name)}<br><span style="font-size:0.75rem">${formatDate(note.createdAt, true)}</span></div><div class="modal-vote-actions"><button class="btn btn-outline btn-sm" onclick="voteNote(${Number(note.id)},'up')">👍 Agree (${Number(note.upvotes || 0)})</button><button class="btn btn-outline btn-sm" onclick="voteNote(${Number(note.id)},'down')">👎 Disagree (${Number(note.downvotes || 0)})</button></div></div>`;
  overlay.classList.remove("hidden");
  document.body.classList.add("overlay-open");
  requestAnimationFrame(() => overlay.querySelector(".modal-close")?.focus());
}
function closeModal(event) {
  const overlay = document.getElementById("modal-overlay");
  if (!overlay) return;
  if (!event || event.target === overlay || event.target.classList.contains("modal-close")) {
    overlay.classList.add("hidden"); document.body.classList.remove("overlay-open");
  }
}
function voteNote(id, type) {
  const note = notes.find(item => Number(item.id) === Number(id));
  if (!note || !["up", "down"].includes(type)) return;
  note.upvotes = Number(note.upvotes || 0); note.downvotes = Number(note.downvotes || 0);
  if (note.userVote === type) {
    if (type === "up") note.upvotes = Math.max(0, note.upvotes - 1); else note.downvotes = Math.max(0, note.downvotes - 1);
    note.userVote = null;
  } else {
    if (note.userVote === "up") note.upvotes = Math.max(0, note.upvotes - 1);
    if (note.userVote === "down") note.downvotes = Math.max(0, note.downvotes - 1);
    if (type === "up") note.upvotes += 1; else note.downvotes += 1;
    note.userVote = type;
  }
  note.score = note.upvotes - note.downvotes;
  saveNotes(); renderWallNotes(); openModal(id);
}

function updateCropScale(event) {
  selectedPhotoCropScale = Math.max(1, Math.min(1.8, Number(event.target.value || 1)));
  document.getElementById("crop-scale-value").textContent = `${Math.round(selectedPhotoCropScale * 100)}%`;
  document.getElementById("image-preview")?.style.setProperty("--photo-scale", String(selectedPhotoCropScale));
}
function updateImageFit(event) {
  selectedImageFit = event.target.value === "contain" ? "contain" : "cover";
  document.getElementById("image-preview")?.style.setProperty("--photo-fit", selectedImageFit);
}

let activeNoteSelect = null;
let noteSelectsInitialized = false;
let noteColorManuallySelected = false;

function getNoteColorPreset(value) {
  return NOTE_COLOR_PRESETS.find(preset => preset.value === String(value || "").toUpperCase()) || null;
}

function setSelectedNoteColor(value, manual = false) {
  const input = document.getElementById("form-color");
  const category = String(document.getElementById("form-category")?.value || "academic");
  const categoryDefault = String(CATEGORY_COLORS[category]?.[0] || NOTE_COLOR_PRESETS[0].value).toUpperCase();
  const selected = getNoteColorPreset(value) || getNoteColorPreset(categoryDefault) || NOTE_COLOR_PRESETS[0];
  if (input) input.value = selected.value;
  document.querySelectorAll("[data-note-color]").forEach(button => {
    const isSelected = button.dataset.noteColor === selected.value;
    button.setAttribute("aria-checked", String(isSelected));
    button.tabIndex = isSelected ? 0 : -1;
  });
  if (manual) noteColorManuallySelected = true;
}

function ensureNoteColorPicker() {
  if (document.getElementById("note-color-picker")) return;
  const shapeRow = document.getElementById("form-shape")?.closest(".form-row");
  if (!shapeRow) return;
  const fieldset = document.createElement("fieldset");
  fieldset.id = "note-color-picker";
  fieldset.className = "form-group note-color-picker";
  fieldset.innerHTML = `<legend class="form-label">Note color</legend><input type="hidden" id="form-color" value="${NOTE_COLOR_PRESETS[0].value}" /><div class="note-color-options" role="radiogroup" aria-label="Note color">${NOTE_COLOR_PRESETS.map((preset, index) => `<button class="note-color-choice" type="button" role="radio" aria-checked="${index === 0}" aria-label="${preset.label}" title="${preset.label}" data-note-color="${preset.value}" style="--note-color-choice:${preset.value}" tabindex="${index === 0 ? 0 : -1}"><span aria-hidden="true">✓</span></button>`).join("")}</div>`;
  shapeRow.insertAdjacentElement("afterend", fieldset);
  fieldset.addEventListener("click", event => {
    const button = event.target.closest("[data-note-color]");
    if (!button) return;
    setSelectedNoteColor(button.dataset.noteColor, true);
    button.focus();
  });
  fieldset.addEventListener("keydown", event => {
    const button = event.target.closest("[data-note-color]");
    if (!button) return;
    const buttons = [...fieldset.querySelectorAll("[data-note-color]")];
    const direction = { ArrowRight:1, ArrowDown:1, ArrowLeft:-1, ArrowUp:-1 }[event.key];
    if (!direction && event.key !== "Home" && event.key !== "End") return;
    event.preventDefault();
    const currentIndex = Math.max(0, buttons.indexOf(button));
    const nextIndex = event.key === "Home" ? 0 : event.key === "End" ? buttons.length - 1 : (currentIndex + direction + buttons.length) % buttons.length;
    const nextButton = buttons[nextIndex];
    setSelectedNoteColor(nextButton.dataset.noteColor, true);
    nextButton.focus();
  });
  document.getElementById("form-category")?.addEventListener("change", event => {
    if (noteColorManuallySelected) return;
    const defaultColor = CATEGORY_COLORS[String(event.target.value || "academic")]?.[0];
    setSelectedNoteColor(defaultColor);
  });
}

function getNoteSelectParts(type) {
  const root = document.querySelector(`[data-note-select="${type}"]`);
  const trigger = root?.querySelector(".note-select-trigger");
  const menu = document.getElementById(trigger?.getAttribute("aria-controls") || "");
  const input = document.getElementById(`form-${type}`);
  return root && trigger && menu && input ? { root, trigger, menu, input } : null;
}

function syncNoteSelect(type, value) {
  const parts = getNoteSelectParts(type);
  if (!parts) return;
  const option = parts.menu.querySelector(`[role="option"][data-value="${value}"]`);
  if (!option) return;
  parts.input.value = value;
  parts.menu.querySelectorAll('[role="option"]').forEach(item => item.setAttribute("aria-selected", String(item === option)));
  const label = parts.trigger.querySelector("[data-note-select-label]");
  const key = option.dataset.i18nKey || "";
  if (label && key) {
    label.dataset.i18n = key;
    label.textContent = I18n.t(key);
  }
  const currentVisual = parts.trigger.querySelector(".category-choice-icon,.shape-swatch,.fit-swatch");
  const optionVisual = option.querySelector(".category-choice-icon,.shape-swatch,.fit-swatch");
  if (currentVisual && optionVisual) {
    currentVisual.className = optionVisual.className;
    currentVisual.innerHTML = optionVisual.innerHTML;
  }
  parts.input.dispatchEvent(new Event("change", { bubbles:true }));
}

function getNoteSelectEventPath(event) {
  return typeof event.composedPath === "function" ? event.composedPath() : [event.target];
}

function eventIsInsideActiveNoteSelect(event) {
  if (!activeNoteSelect) return false;
  const path = getNoteSelectEventPath(event);
  return path.includes(activeNoteSelect.trigger) ||
    path.includes(activeNoteSelect.menu) ||
    activeNoteSelect.trigger.contains(event.target) ||
    activeNoteSelect.menu.contains(event.target);
}

function getNoteSelectOptionFromEvent(event) {
  return getNoteSelectEventPath(event).find(node => node instanceof Element && node.matches?.('[role="option"]')) ||
    (event.target instanceof Element ? event.target.closest('[role="option"]') : null);
}

function closeNoteSelect(restoreFocus = false) {
  if (!activeNoteSelect) return;
  activeNoteSelect.menu.hidden = true;
  activeNoteSelect.trigger.setAttribute("aria-expanded", "false");
  if (restoreFocus) activeNoteSelect.trigger.focus();
  activeNoteSelect = null;
}

function positionNoteSelect(parts) {
  const rect = parts.trigger.getBoundingClientRect();
  const margin = 12;
  const width = Math.min(parts.root.dataset.noteSelect === "shape" ? 440 : Math.max(rect.width, 260), window.innerWidth - margin * 2);
  parts.menu.style.width = `${width}px`;
  parts.menu.style.maxHeight = `${Math.max(96, window.innerHeight - margin * 2)}px`;
  const height = parts.menu.getBoundingClientRect().height;
  const left = Math.min(Math.max(margin, rect.left), window.innerWidth - width - margin);
  const below = rect.bottom + 8;
  const top = below + height <= window.innerHeight - margin ? below : Math.max(margin, rect.top - height - 8);
  parts.menu.style.left = `${left}px`;
  parts.menu.style.top = `${top}px`;
}

function openNoteSelect(type, focusTarget = "selected") {
  const parts = getNoteSelectParts(type);
  if (!parts) return;
  if (activeNoteSelect?.type === type) {
    closeNoteSelect();
    return;
  }
  closeNoteSelect();
  parts.menu.hidden = false;
  parts.trigger.setAttribute("aria-expanded", "true");
  activeNoteSelect = { ...parts, type };
  positionNoteSelect(parts);
  const options = [...parts.menu.querySelectorAll('[role="option"]')];
  const target = focusTarget === "first" ? options[0] : focusTarget === "last" ? options.at(-1) : options.find(item => item.getAttribute("aria-selected") === "true");
  target?.focus();
}

function handleNoteSelectKeydown(event, type, option) {
  const parts = getNoteSelectParts(type);
  if (!parts) return;
  const options = [...parts.menu.querySelectorAll('[role="option"]')];
  if (option && (event.key === "Enter" || event.key === " ")) {
    event.preventDefault();
    syncNoteSelect(type, option.dataset.value || "");
    closeNoteSelect(true);
    return;
  }
  if (event.key === "Escape") {
    event.preventDefault();
    closeNoteSelect(true);
    return;
  }
  const navigation = { ArrowDown: 1, ArrowRight: 1, ArrowUp: -1, ArrowLeft: -1 };
  if (event.key in navigation || event.key === "Home" || event.key === "End") {
    event.preventDefault();
    if (!activeNoteSelect) {
      openNoteSelect(type, event.key === "End" || event.key === "ArrowUp" ? "last" : "first");
      return;
    }
    const currentIndex = Math.max(0, options.indexOf(option || document.activeElement));
    const nextIndex = event.key === "Home" ? 0 : event.key === "End" ? options.length - 1 : (currentIndex + navigation[event.key] + options.length) % options.length;
    options[nextIndex]?.focus();
  }
}

function initializeNoteCustomSelects() {
  if (noteSelectsInitialized) return;
  const overlay = document.getElementById("drawer-overlay");
  if (!overlay) return;
  document.querySelectorAll("[data-note-select]").forEach(root => {
    const type = root.dataset.noteSelect;
    const trigger = root.querySelector(".note-select-trigger");
    const menu = document.getElementById(trigger?.getAttribute("aria-controls") || "");
    if (!type || !trigger || !menu) return;
    overlay.appendChild(menu);
    trigger.addEventListener("click", () => openNoteSelect(type));
    trigger.addEventListener("keydown", event => {
      if (event.key === "Enter" || event.key === " ") {
        event.preventDefault();
        openNoteSelect(type);
      } else handleNoteSelectKeydown(event, type, null);
    });
    menu.addEventListener("click", event => {
      event.stopPropagation();
      const option = getNoteSelectOptionFromEvent(event);
      if (!option) return;
      syncNoteSelect(type, option.dataset.value || "");
      closeNoteSelect(true);
    });
    menu.addEventListener("keydown", event => handleNoteSelectKeydown(event, type, getNoteSelectOptionFromEvent(event)));
  });
  document.addEventListener("pointerdown", event => {
    if (activeNoteSelect && !eventIsInsideActiveNoteSelect(event)) closeNoteSelect();
  }, true);
  document.addEventListener("keydown", event => { if (event.key === "Escape" && activeNoteSelect) closeNoteSelect(true); });
  overlay.addEventListener("scroll", event => { if (!event.target.closest?.(".note-select-menu")) closeNoteSelect(); }, true);
  window.addEventListener("resize", () => closeNoteSelect());
  noteSelectsInitialized = true;
}

function openDrawer() {
  const currentUser = AuthService.getCurrentUser();
  if (!currentUser) {
    showToast(I18n.t("wall.authRequired"));
    AuthUI.open("login");
    return;
  }
  const overlay = document.getElementById("drawer-overlay");
  const form = document.getElementById("note-form");
  if (!overlay || !form) return;
  ensureNoteColorPicker();
  overlay.classList.remove("hidden"); document.body.classList.add("overlay-open"); form.reset();
  initializeNoteCustomSelects();
  selectedPhotoCropScale = 1; selectedImageFit = "cover";
  noteColorManuallySelected = false;
  syncNoteSelect("category", "academic");
  syncNoteSelect("shape", "rounded");
  syncNoteSelect("image-fit", "cover");
  setSelectedNoteColor(CATEGORY_COLORS.academic[0]);
  const crop = document.getElementById("form-crop-scale"); if (crop) crop.value = "1";
  document.getElementById("crop-scale-value").textContent = "100%";
  const displayName = document.getElementById("form-display-name");
  if (displayName) displayName.textContent = currentUser.displayName;
  document.getElementById("char-count").textContent = "0 / 500";
  pendingImageDataUrl = ""; pendingImageName = ""; setImageProcessing(false); setImageStatus(""); updateImagePreview();
  requestAnimationFrame(() => document.getElementById("form-content")?.focus());
}
function closeDrawer() { closeNoteSelect(); document.getElementById("drawer-overlay")?.classList.add("hidden"); document.body.classList.remove("overlay-open"); }
async function handleFormSubmit(event) {
  event.preventDefault();
  const currentUser = AuthService.getCurrentUser();
  if (!currentUser) { closeDrawer(); AuthUI.open("login"); return; }
  if (imageProcessing) { showToast("Please wait for the photo to finish processing."); return; }
  const currentForm = event.target;
  const content = String(currentForm.querySelector("#form-content")?.value || "").trim();
  const category = String(currentForm.querySelector("#form-category")?.value || "academic");
  const shape = String(currentForm.querySelector("#form-shape")?.value || "rounded");
  const selectedColor = String(currentForm.querySelector("#form-color")?.value || "").toUpperCase();
  const safeCategory = Object.prototype.hasOwnProperty.call(CATEGORY_COLORS, category) ? category : "academic";
  const color = getNoteColorPreset(selectedColor)?.value || randomColor(safeCategory);
  const anonymous = currentForm.querySelector('input[name="publish-identity"]:checked')?.value !== "named";
  const nickname = String(currentUser.displayName || "").trim();
  if (!content) { showToast("Write a message before pinning the note."); return; }
  if (!anonymous && !nickname) { showToast("Your account needs a display name before publishing."); return; }

  const submitButton = document.getElementById("note-submit");
  if (submitButton) { submitButton.disabled = true; submitButton.textContent = I18n.t("common.loading"); }
  try {
    const upload = pendingImageDataUrl ? await CloudinaryAdapter.uploadCompressedDataUrl(pendingImageDataUrl, { contextType: wallState.contextType, placeId: wallState.placeId || "" }) : null;
    const id = nextId++;
    const newNote = {
      id, schemaVersion: 2, contextType: wallState.contextType === "building" ? "building" : "community",
      orgId: wallState.contextType === "building" ? null : wallState.orgId,
      batchId: null,
      majorId: wallState.contextType === "building" ? null : wallState.majorId,
      placeId: wallState.contextType === "building" ? wallState.placeId : "",
      ...(wallState.contextType === "community" ? { wallKey:`community:${wallState.orgId}:${wallState.majorId}` } : {}),
      category: safeCategory,
      isAnonymous: anonymous, authorNickname: anonymous ? null : nickname, authorUserId: currentUser.id,
      shape: SHAPES.includes(shape) ? shape : "rounded", color, rotation: Math.floor(Math.random() * 5) - 2,
      upvotes: 0, downvotes: 0, score: 0, userVote: null, createdAt: new Date().toISOString(), content,
      imageDataUrl: upload?.mode === "local" ? safeImageDataUrl(upload.dataUrl) : "",
      imageUrl: upload?.mode === "cloudinary" ? upload.url : "",
      imagePublicId: upload?.mode === "cloudinary" ? upload.publicId : "",
      imageName: pendingImageName, imageCropScale: selectedPhotoCropScale, imageFit: selectedImageFit,
    };
    notes.unshift(newNote);
    if (!saveNotes()) { notes = notes.filter(note => Number(note.id) !== id); throw new Error("Browser storage is full."); }
    closeDrawer(); renderWallNotes(); showToast(newNote.imageUrl || newNote.imageDataUrl ? "📷 Photo note pinned to the wall!" : "📌 Note pinned to the wall!");
  } catch (error) {
    showToast(error instanceof Error ? error.message : I18n.t("common.error"));
  } finally {
    if (submitButton) { submitButton.disabled = false; submitButton.textContent = I18n.t("form.submit"); }
  }
}

function showToast(message) {
  const region = document.getElementById("toast-region") || document.body;
  const toast = document.createElement("div"); toast.className = "toast-item"; toast.textContent = message; region.appendChild(toast);
  setTimeout(() => { toast.classList.add("is-leaving"); setTimeout(() => toast.remove(), 260); }, 2800);
}
window.addEventListener("keydown", event => { if (event.key === "Escape") { closeModal(); closeDrawer(); } });
let wallResizeTimer;
window.addEventListener("resize", () => { clearTimeout(wallResizeTimer); wallResizeTimer = setTimeout(() => { if (document.getElementById("wall-canvas")) renderWallNotes(); }, 160); });
