const MAX_IMAGE_SOURCE_BYTES = 8 * 1024 * 1024;
const MAX_STORED_IMAGE_BYTES = 450 * 1024;
const ALLOWED_IMAGE_TYPES = new Set(["image/jpeg", "image/png", "image/webp"]);

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


let selectedPlacementX = 18;
let selectedPlacementY = 18;
let selectedPhotoCropScale = 1;
let selectedImageFit = "cover";
const noteTranslationState = new Map();

function renderWall(container, orgId, batchId, majorId) {
  const org = organizations.find(item => item.id === orgId);
  const batch = batches.find(item => item.id === batchId);
  const major = majors.find(item => item.id === majorId);
  renderContextWall(container, {
    contextType: "community",
    orgId,
    batchId,
    majorId,
    title: `${batch?.label || ""} · ${major?.name || ""}`,
    kicker: `${org?.name || ""} community`,
    icon: org?.emoji || "🏛️",
    backPath: `#/org/${orgId}`,
  });
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
  });
}

function renderContextWall(container, context) {
  wallState.contextType = context.contextType;
  wallState.orgId = context.orgId || 0;
  wallState.batchId = context.batchId || 0;
  wallState.majorId = context.majorId || 0;
  wallState.placeId = context.placeId || "";
  const visibleCount = getContextNotes().length;

  container.innerHTML = `
    <div class="wall-page page-reveal">
      <header class="wall-context-bar">
        <div class="wall-context-main">
          <button class="wall-back-btn" onclick="navigate('${escapeHtml(context.backPath)}')" aria-label="Leave this wall">←</button>
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

      <div class="wall-canvas-wrap"><div class="wall-canvas-grid" aria-hidden="true"></div><div class="wall-canvas" id="wall-canvas" aria-live="polite"></div></div>
    </div>`;
  renderWallNotes();
}

function getContextNotes() {
  return notes.filter(note => {
    if (note.isHidden) return false;
    if (wallState.contextType === "building") return note.contextType === "building" && note.placeId === wallState.placeId;
    return note.contextType !== "building" && Number(note.orgId) === wallState.orgId && Number(note.batchId) === wallState.batchId && Number(note.majorId) === wallState.majorId;
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

function renderWallNotes() {
  const canvas = document.getElementById("wall-canvas");
  if (!canvas) return;
  const filtered = getFilteredNotes();
  const resultCount = document.getElementById("wall-result-count");
  if (resultCount) resultCount.textContent = String(filtered.length);

  if (!filtered.length) {
    canvas.style.minHeight = "560px";
    canvas.innerHTML = `<div class="wall-empty-state"><div class="wall-empty-icon">🍃</div><h2>${I18n.t("wall.empty.title")}</h2><p>${I18n.t("wall.empty.body")}</p><button class="btn btn-primary" onclick="openDrawer()">${I18n.t("wall.leaveNote")}</button></div>`;
    return;
  }

  const maxY = Math.max(...filtered.map(note => Number(note.positionY || 15)));
  canvas.style.minHeight = `${Math.max(760, 250 + maxY * 9)}px`;
  canvas.innerHTML = "";
  filtered.forEach((note, index) => canvas.appendChild(buildNoteDOM(note, index)));
}

function buildNoteDOM(note, index) {
  const element = document.createElement("article");
  const category = Object.prototype.hasOwnProperty.call(CATEGORY_COLORS, note.category) ? note.category : "academic";
  const shape = SHAPES.includes(note.shape) ? note.shape : "rounded";
  const imageSource = getNoteImageSource(note);
  element.className = `note-item shape-${shape} cat-${category}${imageSource ? " has-photo" : ""}`;
  element.style.setProperty("--note-delay", `${Math.min(index * 35, 350)}ms`);
  element.style.setProperty("--photo-scale", String(Math.max(1, Math.min(1.8, Number(note.imageCropScale || 1)))));
  element.style.setProperty("--photo-fit", note.imageFit === "contain" ? "contain" : "cover");

  const positionX = Math.max(2, Math.min(86, Number(note.positionX || 10)));
  const positionY = Math.max(4, Math.min(84, Number(note.positionY || 15)));
  const rotation = Number.isFinite(Number(note.rotation)) ? Number(note.rotation) : 0;
  if (window.innerWidth < 760) {
    element.style.position = "relative";
    element.style.left = "auto";
    element.style.top = "auto";
    element.style.transform = "none";
  } else {
    element.style.left = `${positionX}%`;
    element.style.top = `${45 + positionY * 8}px`;
    element.style.transform = `rotate(${Math.max(-6, Math.min(6, rotation))}deg)`;
  }

  element.style.zIndex = String(index + 1);
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
  const content = document.getElementById("modal-content");
  if (!overlay || !content) return;
  const name = note.isAnonymous ? "Anonymous" : (note.authorNickname || "User");
  const imageSource = getNoteImageSource(note);
  const category = Object.prototype.hasOwnProperty.call(CATEGORY_COLORS, note.category) ? note.category : "academic";
  const categoryLabel = { academic: "ACADEMIC", koko: "ACTIVITIES", campus_life: "CAMPUS LIFE", emotional: "SUPPORT" }[category];
  const translation = noteTranslationState.get(Number(id));
  const visibleText = translation?.showTranslated ? translation.translatedText : note.content;

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

function updatePlacementPreview() {
  const marker = document.getElementById("placement-marker");
  if (!marker) return;
  marker.style.left = `${selectedPlacementX}%`;
  marker.style.top = `${selectedPlacementY}%`;
  const value = document.getElementById("placement-value");
  if (value) value.textContent = `${Math.round(selectedPlacementX)}%, ${Math.round(selectedPlacementY)}%`;
}
function handlePlacementSelection(event) {
  const rect = event.currentTarget.getBoundingClientRect();
  selectedPlacementX = Math.max(2, Math.min(86, ((event.clientX - rect.left) / rect.width) * 100));
  selectedPlacementY = Math.max(4, Math.min(84, ((event.clientY - rect.top) / rect.height) * 100));
  updatePlacementPreview();
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

function openDrawer() {
  if (!AuthService.isAuthenticated()) {
    showToast(I18n.t("wall.authRequired"));
    AuthUI.open("login");
    return;
  }
  const overlay = document.getElementById("drawer-overlay");
  const form = document.getElementById("note-form");
  if (!overlay || !form) return;
  overlay.classList.remove("hidden"); document.body.classList.add("overlay-open"); form.reset();
  selectedPlacementX = 18 + Math.random() * 52; selectedPlacementY = 12 + Math.random() * 48;
  selectedPhotoCropScale = 1; selectedImageFit = "cover";
  const crop = document.getElementById("form-crop-scale"); if (crop) crop.value = "1";
  const fit = document.getElementById("form-image-fit"); if (fit) fit.value = "cover";
  document.getElementById("crop-scale-value").textContent = "100%";
  document.getElementById("nickname-group").style.display = "none";
  document.getElementById("char-count").textContent = "0 / 500";
  pendingImageDataUrl = ""; pendingImageName = ""; setImageProcessing(false); setImageStatus(""); updateImagePreview(); updatePlacementPreview();
  requestAnimationFrame(() => document.getElementById("form-content")?.focus());
}
function closeDrawer() { document.getElementById("drawer-overlay")?.classList.add("hidden"); document.body.classList.remove("overlay-open"); }
function toggleNickname() {
  const group = document.getElementById("nickname-group");
  const anonymous = document.getElementById("form-anonymous");
  if (!group || !anonymous) return;
  group.style.display = anonymous.checked ? "none" : "block";
  if (!anonymous.checked) {
    const nickname = document.getElementById("form-nickname");
    if (nickname && !nickname.value) nickname.value = AuthService.getCurrentUser()?.displayName || "";
  }
}

async function handleFormSubmit(event) {
  event.preventDefault();
  const currentUser = AuthService.getCurrentUser();
  if (!currentUser) { closeDrawer(); AuthUI.open("login"); return; }
  if (imageProcessing) { showToast("Please wait for the photo to finish processing."); return; }
  const currentForm = event.target;
  const content = String(currentForm.querySelector("#form-content")?.value || "").trim();
  const category = String(currentForm.querySelector("#form-category")?.value || "academic");
  const shape = String(currentForm.querySelector("#form-shape")?.value || "rounded");
  const anonymous = Boolean(currentForm.querySelector("#form-anonymous")?.checked);
  const nickname = String(currentForm.querySelector("#form-nickname")?.value || currentUser.displayName).trim();
  if (!content) { showToast("Write a message before pinning the note."); return; }
  if (!anonymous && !nickname) { showToast("Add a nickname or post anonymously."); return; }

  const submitButton = document.getElementById("note-submit");
  if (submitButton) { submitButton.disabled = true; submitButton.textContent = I18n.t("common.loading"); }
  try {
    const upload = pendingImageDataUrl ? await CloudinaryAdapter.uploadCompressedDataUrl(pendingImageDataUrl, { contextType: wallState.contextType, placeId: wallState.placeId || "" }) : null;
    const id = nextId++;
    const newNote = {
      id, schemaVersion: 2, contextType: wallState.contextType === "building" ? "building" : "community",
      orgId: wallState.contextType === "building" ? null : wallState.orgId,
      batchId: wallState.contextType === "building" ? null : wallState.batchId,
      majorId: wallState.contextType === "building" ? null : wallState.majorId,
      placeId: wallState.contextType === "building" ? wallState.placeId : "",
      category: Object.prototype.hasOwnProperty.call(CATEGORY_COLORS, category) ? category : "academic",
      isAnonymous: anonymous, authorNickname: anonymous ? null : nickname, authorUserId: currentUser.id,
      shape: SHAPES.includes(shape) ? shape : "rounded", color: randomColor(category), rotation: Math.floor(Math.random() * 9) - 4,
      positionX: selectedPlacementX, positionY: selectedPlacementY,
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
