// DEMO ONLY: client-side credentials are not secure for a public deployment.
const ADMIN_USERNAME = "admin";
const ADMIN_PASSWORD = "abc67##";
const ADMIN_SESSION_KEY = "echo-wall-admin-session";

let adminState = {
  search: "",
  category: "all",
  visibility: "all",
  orgId: "all",
  sort: "new",
  currentTab: "notes", // Track whether viewing Note Wall or Map Pins
};

function isAdminLoggedIn() {
  return localStorage.getItem(ADMIN_SESSION_KEY) === "true";
}

function renderAdmin(container) {
  if (!isAdminLoggedIn()) {
    renderAdminLogin(container);
    return;
  }

  let mapNotes = [];
  try {
    const parsed = JSON.parse(localStorage.getItem("echowall_map_notes") || "[]");
    mapNotes = Array.isArray(parsed) ? parsed : [];
  } catch {
    mapNotes = [];
  }

  const visibleNotes = notes.filter(note => !note.isHidden).length;
  const hiddenNotes = notes.filter(note => note.isHidden).length;
  const photoNotes = notes.filter(note => getNoteImageSource(note)).length;
  const totalVotes = notes.reduce((sum, note) => sum + Number(note.upvotes || 0) + Number(note.downvotes || 0), 0);
  const visibleMap = mapNotes.filter(note => !note.isHidden).length;
  const hiddenMap = mapNotes.filter(note => note.isHidden).length;
  const latestNote = notes.slice().sort((a, b) => String(b.createdAt || "").localeCompare(String(a.createdAt || "")))[0];
  const activeIsMap = adminState.currentTab === "map";
  const filteredItems = activeIsMap ? getAdminFilteredMapNotes() : getAdminFilteredNotes();
  const orgOptions = organizations.map(org => `<option value="${org.id}" ${String(adminState.orgId) === String(org.id) ? "selected" : ""}>${escapeHtml(org.name)}</option>`).join("");

  const stats = activeIsMap
    ? [
        ["🗺️", "Total pins", mapNotes.length, "All saved map notes"],
        ["👁️", "Visible", visibleMap, "Displayed on Echo Map"],
        ["🔒", "Hidden", hiddenMap, "Removed from public view"],
        ["📍", "Coverage", "KMK", "Location-based records"],
      ]
    : [
        ["📝", "Total notes", notes.length, "All wall records"],
        ["👁️", "Visible", visibleNotes, "Publicly readable"],
        ["📷", "Photo notes", photoNotes, "Notes with attached media"],
        ["👍", "Votes", totalVotes, "All up and down votes"],
      ];

  container.innerHTML = `
    <div class="admin-shell page-reveal">
      <aside class="admin-sidebar">
        <nav class="admin-nav" aria-label="Admin sections">
          <button class="admin-nav-item ${!activeIsMap ? "active" : ""}" onclick="adminSetTab('notes')"><span>📝</span><span>Wall notes</span><b>${notes.length}</b></button>
          <button class="admin-nav-item ${activeIsMap ? "active" : ""}" onclick="adminSetTab('map')"><span>🗺️</span><span>Map pins</span><b>${mapNotes.length}</b></button>
          <a class="admin-nav-item" href="map.html"><span>📍</span><span>Open Echo Map</span><b>↗</b></a>
          <button class="admin-nav-item" onclick="adminExportNotes()"><span>⇩</span><span>Export JSON</span><b></b></button>
        </nav>
        <button class="admin-logout" onclick="adminLogout()"><span>↪</span> Sign out</button>
      </aside>

      <main class="admin-main">
        <header class="admin-header">
          <div><p class="eyebrow">Moderation centre</p><h1>${activeIsMap ? "Map Pin Management" : "Content Management"}</h1><p>${activeIsMap ? "Review location-based notes placed around KMK campus." : "Review text and photo notes shared across communities."}</p></div>
          <div class="admin-header-actions"><span class="admin-system-status"><i></i> Prototype online</span><button class="btn btn-outline btn-sm" onclick="navigate('#/')">View website ↗</button></div>
        </header>

        <section class="admin-stats">
          ${stats.map((stat, index) => `<article class="admin-stat" style="--admin-delay:${index * 70}ms"><span class="admin-stat-icon">${stat[0]}</span><div><span>${stat[1]}</span><strong data-admin-count="${typeof stat[2] === "number" ? stat[2] : ""}">${stat[2]}</strong><small>${stat[3]}</small></div></article>`).join("")}
        </section>

        <section class="admin-panel">
          <div class="admin-panel-header">
            <div><p class="eyebrow">${activeIsMap ? "Location moderation" : "Note moderation"}</p><h2>${activeIsMap ? "KMK map pins" : "Community notes"}</h2><p><span class="match-count">${filteredItems.length}</span> matching records${latestNote && !activeIsMap ? ` · latest ${formatDate(latestNote.createdAt, false)}` : ""}</p></div>
            <div class="admin-actions">
              <button class="btn btn-outline btn-sm" onclick="adminExportNotes()">Export JSON</button>
              ${!activeIsMap ? `<button class="btn btn-outline btn-sm admin-danger" onclick="adminResetNotes()">Reset demo data</button>` : ""}
            </div>
          </div>

          <div class="admin-filters ${activeIsMap ? "admin-filters-map" : ""}">
            <label class="admin-search"><span>⌕</span><input type="search" placeholder="${activeIsMap ? "Search map pins or authors" : "Search notes or authors"}" value="${escapeHtml(adminState.search)}" oninput="adminSetSearch(event)" /><i class="filter-indicator ${adminState.search ? "active" : ""}">Filtering</i></label>
            ${!activeIsMap ? `
              <select class="form-select" onchange="adminSetFilter('orgId', event.target.value)"><option value="all">All communities</option>${orgOptions}</select>
              <select class="form-select" onchange="adminSetFilter('category', event.target.value)"><option value="all" ${adminState.category === "all" ? "selected" : ""}>All categories</option><option value="academic" ${adminState.category === "academic" ? "selected" : ""}>Academic</option><option value="koko" ${adminState.category === "koko" ? "selected" : ""}>Activities</option><option value="campus_life" ${adminState.category === "campus_life" ? "selected" : ""}>Campus life</option><option value="emotional" ${adminState.category === "emotional" ? "selected" : ""}>Support</option></select>
              <select class="form-select" onchange="adminSetFilter('visibility', event.target.value)"><option value="all" ${adminState.visibility === "all" ? "selected" : ""}>All visibility</option><option value="visible" ${adminState.visibility === "visible" ? "selected" : ""}>Visible only</option><option value="hidden" ${adminState.visibility === "hidden" ? "selected" : ""}>Hidden only</option></select>
              <select class="form-select" onchange="adminSetFilter('sort', event.target.value)"><option value="new" ${adminState.sort === "new" ? "selected" : ""}>Newest first</option><option value="hot" ${adminState.sort === "hot" ? "selected" : ""}>Highest score</option><option value="low" ${adminState.sort === "low" ? "selected" : ""}>Lowest score</option></select>` : ""}
          </div>

          <div class="admin-note-list">
            ${filteredItems.length ? filteredItems.map(activeIsMap ? renderAdminMapNoteRow : renderAdminNoteRow).join("") : `<div class="admin-empty"><span>🗂️</span><h3>No matching records</h3><p>Try clearing the search or changing a filter.</p></div>`}
          </div>
        </section>
      </main>
    </div>`;
}

function renderAdminLogin(container) {
  container.innerHTML = `
    <div class="admin-login-page page-reveal">
      <section class="admin-login-visual">
        <div class="admin-login-copy"><img src="assets/book-icon.png" alt="Echo Wall" /><p class="eyebrow">Echo Wall moderation</p><h1>Protect the quality of shared experience.</h1><p>Review notes, manage place-based pins, check attached media and keep public content useful.</p></div>
        <div class="admin-login-preview"><span>📝 Note review</span><span>📷 Media check</span><span>🗺️ Map pin control</span></div>
      </section>
      <section class="admin-login-panel">
        <form class="admin-login-card" onsubmit="handleAdminLogin(event)">
          <div class="admin-login-mark">A</div>
          <p class="eyebrow">Restricted area</p>
          <h2>Admin sign in</h2>
          <p class="admin-login-description">This is the current local prototype login. Supabase Auth will replace it for deployment.</p>
          <div class="form-group"><label class="form-label" for="admin-username">Username</label><input class="form-input" id="admin-username" autocomplete="username" required /></div>
          <div class="form-group"><label class="form-label" for="admin-password">Password</label><input class="form-input" id="admin-password" type="password" autocomplete="current-password" required /></div>
          <div class="admin-login-error" id="admin-login-error" role="alert"></div>
          <button class="btn btn-primary btn-full btn-lg" type="submit">Enter dashboard →</button>
          <button class="btn btn-ghost btn-full" type="button" onclick="navigate('#/')">← Back to website</button>
        </form>
      </section>
    </div>`;
}

function renderAdminNoteRow(note, index = 0) {
  const isBuildingNote = note.contextType === "building";
  const building = isBuildingNote ? getCampusBuilding(note.placeId) : null;
  const org = organizations.find(item => String(item.id) === String(note.orgId));
  const batch = batches.find(item => String(item.id) === String(note.batchId));
  const major = majors.find(item => String(item.id) === String(note.majorId));
  const author = note.isAnonymous ? "Anonymous" : (note.authorNickname || "User");
  const statusClass = note.isHidden ? "admin-status-hidden" : "admin-status-visible";
  const statusText = note.isHidden ? "Hidden" : "Visible";
  const imageSource = getNoteImageSource(note);
  const noteId = Number(note.id);
  const categoryLabel = { academic: "Academic", koko: "Activities", campus_life: "Campus life", emotional: "Support" }[note.category] || "Other";

  return `
    <article class="admin-note-row" style="--admin-row-delay:${Math.min(index * 30, 300)}ms">
      <div class="admin-note-thumb ${imageSource ? "has-image" : ""}">${imageSource ? `<img src="${imageSource}" alt="${escapeHtml(note.imageName || "Attached note photo")}" loading="lazy" />` : `<span>${{ academic:"📚",koko:"🎖️",campus_life:"🏫",emotional:"💛" }[note.category] || "📝"}</span>`}</div>
      <div class="admin-note-main">
        <div class="admin-note-meta"><span class="admin-status ${statusClass}">${statusText}</span><span class="admin-meta-badge">${categoryLabel}</span><span>${isBuildingNote ? `🏢 ${escapeHtml(building?.name || note.placeId || "Unknown building")}` : escapeHtml(org?.name || "Unknown")}</span>${!isBuildingNote && batch ? `<span>· ${escapeHtml(batch.label)}</span>` : ""}${!isBuildingNote && major ? `<span>· ${escapeHtml(major.name)}</span>` : ""}</div>
        <p class="admin-note-content">${escapeHtml(note.content || "")}</p>
        <div class="admin-note-foot"><span>By <b>${escapeHtml(author)}</b></span><span>${formatDate(note.createdAt, true)}</span><span>Score <b>${Number(note.score || 0)}</b></span></div>
      </div>
      <div class="admin-note-actions"><button class="btn btn-outline btn-sm" onclick="adminToggleHidden(${noteId})">${note.isHidden ? "Show" : "Hide"}</button><button class="btn btn-outline btn-sm admin-danger" onclick="adminDeleteNote(${noteId})">Delete</button></div>
    </article>`;
}

function renderAdminMapNoteRow(note, index = 0) {
  const author = note.author || "Anonymous";
  const statusClass = note.isHidden ? "admin-status-hidden" : "admin-status-visible";
  const statusText = note.isHidden ? "Hidden" : "Visible";
  const markerColor = /^#[0-9a-f]{6}$/i.test(String(note.color || "")) ? note.color : "#8b5e3c";
  const allowedIcons = new Set(["📌", "💬", "❤️", "💡", "🌟"]);
  const markerIcon = allowedIcons.has(note.icon) ? note.icon : "📌";
  const latitude = Number(note.lat);
  const longitude = Number(note.lng);
  const timestamp = Number(note.timestamp);
  const coordinateText = Number.isFinite(latitude) && Number.isFinite(longitude) ? `${latitude.toFixed(5)}, ${longitude.toFixed(5)}` : "Invalid coordinates";

  return `
    <article class="admin-note-row" style="--admin-row-delay:${Math.min(index * 30, 300)}ms">
      <div class="admin-note-thumb map-pin-thumb" style="--pin-color:${markerColor}"><span>${markerIcon}</span></div>
      <div class="admin-note-main">
        <div class="admin-note-meta"><span class="admin-status ${statusClass}">${statusText}</span><span class="admin-meta-badge">Map pin</span><span>${coordinateText}</span></div>
        <p class="admin-note-content">${escapeHtml(note.text || "")}</p>
        <div class="admin-note-foot"><span>By <b>${escapeHtml(author)}</b></span><span>${Number.isFinite(timestamp) ? new Date(timestamp).toLocaleString() : "Unknown date"}</span></div>
      </div>
      <div class="admin-note-actions"><button class="btn btn-outline btn-sm" onclick="adminToggleMapHidden(${timestamp})">${note.isHidden ? "Show" : "Hide"}</button><button class="btn btn-outline btn-sm admin-danger" onclick="adminDeleteMapNote(${timestamp})">Delete</button></div>
    </article>`;
}

function initializeAdminAnimations() {
  const counters = document.querySelectorAll("[data-admin-count]");
  counters.forEach(counter => {
    const target = Number(counter.dataset.adminCount || 0);
    if (!Number.isFinite(target) || window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const start = performance.now();
    const tick = now => {
      const progress = Math.min(1, (now - start) / 650);
      counter.textContent = String(Math.round(target * (1 - Math.pow(1 - progress, 3))));
      if (progress < 1) requestAnimationFrame(tick);
    };
    counter.textContent = "0";
    requestAnimationFrame(tick);
  });
}

function handleAdminLogin(e) {
  e.preventDefault();
  const username = document.getElementById("admin-username").value.trim();
  const password = document.getElementById("admin-password").value;
  const error = document.getElementById("admin-login-error");

  if (username === ADMIN_USERNAME && password === ADMIN_PASSWORD) {
    localStorage.setItem(ADMIN_SESSION_KEY, "true");
    render();
    return;
  }
  error.textContent = "Incorrect username or password.";
}

function adminLogout() {
  localStorage.removeItem(ADMIN_SESSION_KEY);
  render();
}

function adminSetTab(tab) {
  adminState.currentTab = tab;
  adminState.search = ""; // Clear active search keywords upon view switching
  render();
}

function adminSetSearch(e) {
  adminState.search = e.target.value;

  if (adminState.search) {
    e.target.style.borderColor = "#e67e22";
    e.target.style.backgroundColor = "rgba(255,165,0,0.01)";
  } else {
    e.target.style.borderColor = "";
    e.target.style.backgroundColor = "";
  }

  const listContainer = document.querySelector(".admin-note-list");
  const countLabel = document.querySelector(".match-count");
  const indicator = document.querySelector(".filter-indicator");

  if (adminState.currentTab === "map") {
    if (listContainer) {
      const filteredMapNotes = getAdminFilteredMapNotes();
      if (countLabel) countLabel.textContent = filteredMapNotes.length;
      if (indicator) indicator.style.display = adminState.search ? "inline-block" : "none";
      listContainer.innerHTML = filteredMapNotes.length 
        ? filteredMapNotes.map(renderAdminMapNoteRow).join("") 
        : `<div class="empty-state">No map pins match these filters.</div>`;
    } else {
      render();
    }
    return;
  }

  if (listContainer) {
    const filteredNotes = getAdminFilteredNotes();
    
    if (countLabel) countLabel.textContent = filteredNotes.length;
    if (indicator) indicator.style.display = adminState.search ? "inline-block" : "none";
    
    listContainer.innerHTML = filteredNotes.length 
      ? filteredNotes.map(renderAdminNoteRow).join("") 
      : `<div class="empty-state">No notes match these filters.</div>`;
  } else {
    render();
  }
}

function adminSetFilter(key, value) {
  adminState[key] = value;
  render();
}

function getAdminFilteredNotes() {
  let result = notes.slice();
  const q = adminState.search.trim().toLowerCase();

  if (q) {
    result = result.filter(note => {
      const author = note.isAnonymous ? "anonymous" : String(note.authorNickname || "user").toLowerCase();
      const content = String(note.content || "").toLowerCase();
      return content.includes(q) || author.includes(q);
    });
  }
  if (adminState.orgId !== "all") result = result.filter(note => String(note.orgId) === String(adminState.orgId));
  if (adminState.category !== "all") result = result.filter(note => note.category === adminState.category);
  if (adminState.visibility === "visible") result = result.filter(note => !note.isHidden);
  if (adminState.visibility === "hidden") result = result.filter(note => note.isHidden);

  if (adminState.sort === "hot") result.sort((a, b) => (b.score || 0) - (a.score || 0));
  else if (adminState.sort === "low") result.sort((a, b) => (a.score || 0) - (b.score || 0));
  else result.sort((a, b) => new Date(b.createdAt || 0) - new Date(a.createdAt || 0));

  return result;
}

function getAdminFilteredMapNotes() {
  let mapNotes = [];
  try { mapNotes = JSON.parse(localStorage.getItem('echowall_map_notes')) || []; } catch {}
  const q = adminState.search.trim().toLowerCase();

  if (q) {
    mapNotes = mapNotes.filter(note => {
      const author = String(note.author || "anonymous").toLowerCase();
      const text = String(note.text || "").toLowerCase();
      return text.includes(q) || author.includes(q);
    });
  }
  mapNotes.sort((a, b) => b.timestamp - a.timestamp);
  return mapNotes;
}

function adminToggleHidden(id) {
  const note = notes.find(n => n.id === id);
  if (!note) return;
  note.isHidden = !note.isHidden;
  saveNotes();
  render();
  showToast(note.isHidden ? "Note hidden from public wall." : "Note is visible again.");
}

function adminToggleMapHidden(timestamp) {
  let mapNotes = [];
  try { mapNotes = JSON.parse(localStorage.getItem('echowall_map_notes')) || []; } catch {}
  const note = mapNotes.find(n => n.timestamp === timestamp);
  if (!note) return;
  note.isHidden = !note.isHidden;
  localStorage.setItem('echowall_map_notes', JSON.stringify(mapNotes));
  render();
  if (typeof showToast !== 'undefined') {
    showToast(note.isHidden ? "Map pin hidden from public map." : "Map pin is visible again.");
  }
}

function adminDeleteNote(id) {
  if (!confirm("Delete this note permanently?")) return;
  notes = notes.filter(n => n.id !== id);
  saveNotes();
  render();
  showToast("Note deleted.");
}

function adminDeleteMapNote(timestamp) {
  if (!confirm("Delete this map pin permanently?")) return;
  let mapNotes = [];
  try { mapNotes = JSON.parse(localStorage.getItem('echowall_map_notes')) || []; } catch {}
  mapNotes = mapNotes.filter(n => n.timestamp !== timestamp);
  localStorage.setItem('echowall_map_notes', JSON.stringify(mapNotes));
  render();
  if (typeof showToast !== 'undefined') {
    showToast("Map pin permanently deleted.");
  }
}

function adminResetNotes() {
  if (!confirm("Are you sure you want to clear your local storage changes?")) return;
  localStorage.removeItem("echo-wall-notes");
  location.reload();
}

function adminExportNotes() {
  const data = JSON.stringify(notes, null, 2);
  const blob = new Blob([data], { type: "application/json" });
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.download = "echo-wall-notes.json";
  document.body.appendChild(link);
  link.click();
  link.remove();
  setTimeout(() => URL.revokeObjectURL(url), 0);
}