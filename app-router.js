/**
 * Echo Wall hash router and page-level UI controller.
 * The original static HTML + CSS + vanilla JavaScript architecture is preserved.
 */
function getRoute() {
  const hash = location.hash.replace(/^#\/?/, "") || "";
  const parts = hash.split("/").filter(Boolean);
  const toId = value => {
    const id = Number(value);
    return Number.isInteger(id) && id > 0 ? id : null;
  };

  if (!parts.length) return { page: "home" };
  if (parts[0] === "admin") return { page: "home" };
  if (parts[0] === "places") return { page: "places" };
  if (parts[0] === "place" && parts[1] && parts[2] === "wall") return { page: "place-wall", placeId: decodeURIComponent(parts[1]) };
  if (parts[0] === "place" && parts[1]) return { page: "place", placeId: decodeURIComponent(parts[1]) };
  if (parts[0] === "org" && parts[1]) return { page: "org", orgId: toId(parts[1]) };
  if (parts[0] === "wall" && parts.length === 4) {
    return { page: "wall", legacy: true, orgId: toId(parts[1]), majorId: toId(parts[3]) };
  }
  if (parts[0] === "wall" && parts.length === 3) {
    return { page: "wall", orgId: toId(parts[1]), majorId: toId(parts[2]) };
  }
  return { page: "home" };
}

let pendingRouteScrollReset = false;

function navigate(path) {
  pendingRouteScrollReset = true;
  if (location.hash === path) {
    render();
    return;
  }
  location.hash = path;
}

function replaceRoute(path) {
  pendingRouteScrollReset = true;
  history.replaceState(null, "", `${location.pathname}${location.search}${path}`);
  render();
}

function setRouteDocumentState(page) {
  document.body.dataset.page = page;
  document.body.classList.toggle('wall-route-active', page === 'wall' || page === 'place-wall');
  const titles = {
    home: "留声墙 Echo Wall",
    org: "Choose Your Space — Echo Wall",
    wall: "Student Notes — Echo Wall",
    places: "KMK Buildings — Echo Wall",
    place: "Building Profile — Echo Wall",
    "place-wall": "Building Wall — Echo Wall",
  };
  document.title = titles[page] || titles.home;
}

function render() {
  const route = getRoute();
  const app = document.getElementById("app");
  if (!app) return;
  if (route.page === "wall" && route.legacy && route.orgId && route.majorId) {
    replaceRoute(`#/wall/${route.orgId}/${route.majorId}`);
    return;
  }

  setRouteDocumentState(route.page);
  app.classList.remove("route-ready");
  app.classList.add("route-changing");

  if (route.page === "home") renderHome(app);
  else if (route.page === "places") renderPlaceDirectory(app);
  else if (route.page === "place") renderPlaceProfile(app, route.placeId);
  else if (route.page === "place-wall") renderBuildingWall(app, route.placeId);
  else if (route.page === "org") renderOrgDetails(app, route.orgId);
  else if (route.page === "wall") {
    const org = organizations.find(item => item.id === route.orgId);
    const major = majors.find(item => item.id === route.majorId && item.orgId === route.orgId);
    if (!org || !major) {
      app.innerHTML = `
        <section class="container error-page page-reveal">
          <div class="error-illustration">🧭</div>
          <p class="eyebrow">Route mismatch</p>
          <h1>Wall not found</h1>
          <p>The organization and stream in this link do not belong together.</p>
          <button class="btn btn-primary" onclick="navigate('#/')">${I18n.t("org.back")}</button>
        </section>`;
    } else {
      renderWall(app, route.orgId, route.majorId);
    }
  }

  requestAnimationFrame(() => {
    app.classList.remove("route-changing");
    app.classList.add("route-ready");
    initializeRenderedPage(route.page);
    if (pendingRouteScrollReset) {
      window.scrollTo({
        top: 0,
        left: 0,
        behavior: "auto",
      });
      pendingRouteScrollReset = false;
    }
  });
}

function initializeRenderedPage(page) {
  initializeRevealElements();
  if (page === "home") {
    animateHomeCounters();
    initializeHomeParallax();
  }
}

function initializeRevealElements() {
  const elements = document.querySelectorAll("[data-reveal]");
  if (!elements.length) return;

  if (window.matchMedia("(prefers-reduced-motion: reduce)").matches || !("IntersectionObserver" in window)) {
    elements.forEach(element => element.classList.add("is-visible"));
    return;
  }

  const observer = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (!entry.isIntersecting) return;
      entry.target.classList.add("is-visible");
      observer.unobserve(entry.target);
    });
  }, { threshold: 0.12, rootMargin: "0px 0px -30px" });

  elements.forEach(element => observer.observe(element));
}

function animateHomeCounters() {
  const counters = document.querySelectorAll("[data-count]");
  const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  counters.forEach(counter => {
    const target = Number(counter.dataset.count || 0);
    if (!Number.isFinite(target)) return;
    if (reduceMotion) {
      counter.textContent = String(target);
      return;
    }

    const startedAt = performance.now();
    const duration = 850;
    const tick = now => {
      const progress = Math.min(1, (now - startedAt) / duration);
      const eased = 1 - Math.pow(1 - progress, 3);
      counter.textContent = String(Math.round(target * eased));
      if (progress < 1) requestAnimationFrame(tick);
    };
    requestAnimationFrame(tick);
  });
}

function initializeHomeParallax() {
  const stage = document.querySelector(".hero-visual");
  if (!stage || window.matchMedia("(prefers-reduced-motion: reduce)").matches || window.matchMedia("(pointer: coarse)").matches) return;

  const handleMove = event => {
    const rect = stage.getBoundingClientRect();
    const x = ((event.clientX - rect.left) / rect.width - 0.5) * 2;
    const y = ((event.clientY - rect.top) / rect.height - 0.5) * 2;
    stage.style.setProperty("--parallax-x", `${x * 7}px`);
    stage.style.setProperty("--parallax-y", `${y * 5}px`);
  };
  const reset = () => {
    stage.style.setProperty("--parallax-x", "0px");
    stage.style.setProperty("--parallax-y", "0px");
  };
  stage.addEventListener("pointermove", handleMove);
  stage.addEventListener("pointerleave", reset);
}

function getLatestVisibleNote() {
  return notes
    .filter(note => !note.isHidden)
    .slice()
    .sort((a, b) => String(b.createdAt || "").localeCompare(String(a.createdAt || "")))[0] || null;
}

function renderHome(container) {
  const visibleNotes = notes.filter(note => !note.isHidden);
  const totalNotes = visibleNotes.length;
  const photoNotes = visibleNotes.filter(note => safeImageDataUrl(note.imageDataUrl)).length;
  const latestNote = getLatestVisibleNote();

  const orgCards = organizations.map((org, index) => `
    <button class="org-card reveal-card" data-reveal style="--reveal-delay:${index * 70}ms" onclick="navigate('#/org/${org.id}')" aria-label="Open ${escapeHtml(org.name)} community">
      <div class="org-card-glow" aria-hidden="true"></div>
      <div class="org-card-header">
        <span class="org-emoji">${org.emoji}</span>
        <span class="note-count">📖 <strong>${noteCount(org.id)}</strong></span>
      </div>
      <div>
        <span class="org-card-kicker">${I18n.t("community.kicker")}</span>
        <h3 class="org-card-title">${escapeHtml(org.name)}</h3>
        <p class="org-card-desc">${I18n.t("community.desc")}</p>
      </div>
      <span class="org-card-link">${I18n.t("community.enter")} <span aria-hidden="true">→</span></span>
    </button>
  `).join("");

  container.innerHTML = `
    <div class="home-page">
      <section class="hero container">
        <div class="hero-copy page-reveal">
          <span class="badge badge-orange hero-badge">🎓 ${I18n.t("home.badge")}</span>
          <p class="eyebrow">${I18n.t("home.eyebrow")}</p>
          <h1>${I18n.t("home.title1")}<br><span>${I18n.t("home.title2")}</span></h1>
          <p class="hero-description">${I18n.t("home.description")}</p>
          <div class="hero-actions">
            <button class="btn btn-primary btn-lg" onclick="document.getElementById('communities')?.scrollIntoView({behavior:'smooth'})">${I18n.t("home.explore")}</button>
            <a class="btn btn-outline btn-lg" href="map.html">🗺️ ${I18n.t("home.openMap")}</a>
          </div>
          <div class="hero-trust-row">
            <span><b>Text + photo</b> memories</span>
            <span><b>${I18n.t("home.majorBrowsing")}</b></span>
            <span><b>Admin</b> moderation</span>
          </div>
        </div>

        <div class="hero-visual page-reveal" aria-label="Animated Echo Wall book illustration">
          <div class="hero-orbit hero-orbit-one"></div>
          <div class="hero-orbit hero-orbit-two"></div>
          <article class="floating-note floating-note-a"><span>📚</span> “Revise a little every day.”</article>
          <article class="floating-note floating-note-b"><span>💛</span> “You are not behind.”</article>
          <article class="floating-note floating-note-c"><span>🏫</span> “Remember this place.”</article>
          <div class="hero-book-halo"></div>
          <img class="hero-book" src="assets/book-icon.png" alt="Open book, the Echo Wall symbol" />
          <div class="hero-visual-caption"><span class="pulse-dot"></span> Every note keeps an experience alive</div>
        </div>
      </section>

      <section class="container stats-section" aria-label="Echo Wall statistics">
        <div class="stats-grid">
          <article class="stat-card reveal-card" data-reveal style="--reveal-delay:0ms"><span class="stat-icon">✏️</span><span class="stat-value" data-count="${totalNotes}">0</span><span class="stat-label">${I18n.t("home.visibleNotes")}</span></article>
          <article class="stat-card reveal-card" data-reveal style="--reveal-delay:70ms"><span class="stat-icon">🏛️</span><span class="stat-value" data-count="${organizations.length}">0</span><span class="stat-label">${I18n.t("home.communities")}</span></article>
          <article class="stat-card reveal-card" data-reveal style="--reveal-delay:140ms"><span class="stat-icon">📷</span><span class="stat-value" data-count="${photoNotes}">0</span><span class="stat-label">${I18n.t("home.photoNotes")}</span></article>
          <article class="stat-card reveal-card" data-reveal style="--reveal-delay:210ms"><span class="stat-icon">🕒</span><span class="stat-value stat-value-text">${latestNote ? formatDate(latestNote.createdAt, false) : "No posts"}</span><span class="stat-label">${I18n.t("home.latestMemory")}</span></article>
        </div>
      </section>

      <section class="container section-block" id="communities">
        <div class="section-heading" data-reveal>
          <div><p class="eyebrow">${I18n.t("home.chooseSpace")}</p><h2>${I18n.t("home.communities")}</h2></div>
          <p>${I18n.t("home.communitiesDesc")}</p>
        </div>
        <div class="org-grid">${orgCards}</div>
      </section>

      <section class="container section-block how-section">
        <div class="section-heading centered" data-reveal>
          <div><p class="eyebrow">${I18n.t("home.howEyebrow")}</p><h2>${I18n.t("home.howTitle")}</h2></div>
          <p>${I18n.t("home.howDesc")}</p>
        </div>
        <div class="how-grid">
          <article class="how-card reveal-card" data-reveal style="--reveal-delay:0ms"><span class="how-number">01</span><div class="how-icon">🏛️</div><h3>${I18n.t("home.step1Title")}</h3><p>${I18n.t("home.step1Desc")}</p></article>
          <article class="how-card reveal-card" data-reveal style="--reveal-delay:90ms"><span class="how-number">02</span><div class="how-icon">📖</div><h3>${I18n.t("home.step2Title")}</h3><p>${I18n.t("home.step2Desc")}</p></article>
          <article class="how-card reveal-card" data-reveal style="--reveal-delay:180ms"><span class="how-number">03</span><div class="how-icon">📌</div><h3>${I18n.t("home.step3Title")}</h3><p>${I18n.t("home.step3Desc")}</p></article>
        </div>
      </section>

      <section class="container section-block building-home-section">
        <div class="section-heading" data-reveal><div><p class="eyebrow">${I18n.t("places.eyebrow")}</p><h2>${I18n.t("home.buildings.title")}</h2></div><p>${I18n.t("home.buildings.description")}</p></div>
        <div class="building-home-grid">${CAMPUS_BUILDINGS.slice(0,6).map((building,index) => `<button class="building-home-card reveal-card" data-reveal style="--reveal-delay:${index*55}ms" onclick="navigate('#/place/${encodeURIComponent(building.id)}')"><span>${escapeHtml(building.emoji)}</span><div><strong>${escapeHtml(building.name)}</strong><small>${getBuildingNotes(building.id).length} notes · ${escapeHtml(getBuildingZoneName(building))}</small></div><b>→</b></button>`).join("")}</div>
        <div class="building-home-more"><button class="btn btn-outline btn-lg" onclick="navigate('#/places')">${I18n.t("places.title")} →</button></div>
      </section>

      <section class="container map-promo reveal-card" data-reveal>
        <div>
          <p class="eyebrow">${I18n.t("home.mapEyebrow")}</p>
          <h2>${I18n.t("home.mapTitle")}</h2>
          <p>${I18n.t("home.mapDesc")}</p>
        </div>
        <a class="btn btn-primary btn-lg" href="map.html">${I18n.t("home.mapAction")} →</a>
      </section>

      <footer class="container site-footer">
        <div class="footer-brand"><img src="assets/book-icon.png" alt="" /><div><strong>Echo Wall</strong><span>Experience worth passing on.</span></div></div>
        <div class="footer-actions"><span>© 2026 Matriks EchoWall</span></div>
      </footer>
    </div>`;
}

function renderOrgDetails(container, orgId) {
  const org = organizations.find(item => item.id === orgId);
  if (!org) {
    container.innerHTML = `<section class="container error-page"><h1>Community not found</h1><button class="btn btn-primary" onclick="navigate('#/')">Back home</button></section>`;
    return;
  }

  const orgMajors = majors.filter(item => item.orgId === orgId);
  if (!orgMajors.some(item => item.id === selectedMajor)) selectedMajor = orgMajors[0]?.id || null;

  const majorItems = orgMajors.map((major, index) => `
    <button class="selection-item ${selectedMajor === major.id ? "selected" : ""}" style="--item-delay:${index * 55}ms" onclick="selectMajorItem(${major.id})" aria-pressed="${selectedMajor === major.id}">
      <span class="selection-icon">🌿</span><span><strong>${escapeHtml(major.name)}</strong><small>Stream / programme</small></span><span class="selection-check">✓</span>
    </button>`).join("") || `<div class="empty-state">${I18n.t("org.noMajors")}</div>`;

  container.innerHTML = `
    <div class="container org-page page-reveal">
      <button class="page-back" onclick="navigate('#/')">← ${I18n.t("org.back")}</button>
      <header class="org-header">
        <div class="org-header-icon">${org.emoji}</div>
        <div><p class="eyebrow">${I18n.t("org.workspace")}</p><h1>${escapeHtml(org.name)}</h1><div class="org-header-meta"><span class="org-meta-tag">${escapeHtml(org.type)}</span><span>${noteCount(org.id)} visible notes</span></div></div>
      </header>
      <section class="selection-shell">
        <div class="selection-grid" style="grid-template-columns:minmax(0,1fr)">
          <div class="selection-col"><div class="selection-heading"><span>01</span><div><h2>${I18n.t("org.selectMajor")}</h2><p>${I18n.t("org.selectMajorDesc")}</p></div></div><div class="selection-list">${majorItems}</div></div>
        </div>
      </section>
      <div class="enter-wall-box">
        <div><span class="enter-wall-icon">📖</span><h3>${I18n.t("org.ready")}</h3><p>${I18n.t("org.readyDesc")}</p></div>
        <button class="btn btn-primary btn-lg btn-round" onclick="enterWallCanvas(${orgId})">${I18n.t("org.enter")} →</button>
      </div>
    </div>`;
}

function selectMajorItem(id) {
  selectedMajor = id;
  render();
}

function enterWallCanvas(orgId) {
  const majorIsValid = majors.some(item => item.id === selectedMajor && item.orgId === orgId);
  if (!majorIsValid) {
    showToast("Please select a valid stream.");
    return;
  }
  navigate(`#/wall/${orgId}/${selectedMajor}`);
}

function initializeGlobalUi() {
  const navbar = document.querySelector(".navbar");
  const updateNavbar = () => navbar?.classList.toggle("is-scrolled", window.scrollY > 8);
  updateNavbar();
  window.addEventListener("scroll", updateNavbar, { passive: true });
}

window.addEventListener("hashchange", render);
window.addEventListener("echo:languagechange", () => { I18n.apply(); render(); AuthUI?.renderNavbar?.(); });
window.addEventListener("DOMContentLoaded", () => {
  loadNotes();
  initializeGlobalUi();
  I18n.apply();
  ThemeService.apply();
  render();
});
