(function () {
  "use strict";

  const NOTES_KEY = "echo-wall-notes";
  const STYLE_ID = "echo-map-note-overlay-style";
  const MAX_PUBLIC_NOTES = 5;
  const CATEGORY_ICONS = Object.freeze({ academic:"📚", koko:"🎖️", campus_life:"🏫", emotional:"💛" });
  const state = {
    map:null, publicLayer:null, privateLayer:null, control:null, controlElement:null,
    toggleButton:null, visible:true, getFitCampusZoom:null, buildingZoom:null,
    hideAtZoom:null, listeners:[],
  };

  const copy = {
    en:{ show:"Show note labels", hide:"Hide note labels", hot:"Popular note", private:"Only visible to you", author:"Author", anonymous:"Anonymous", user:"User", category:"Category", heat:"Heat", view:"View note wall", closeZoom:"Labels are hidden at close building zoom.", categories:{ academic:"Academic Advice", koko:"Co-curricular Activity", campus_life:"Campus Life", emotional:"Emotional Support" } },
    ms:{ show:"Tunjuk label nota", hide:"Sembunyi label nota", hot:"Nota popular", private:"Hanya anda boleh lihat", author:"Penulis", anonymous:"Tanpa nama", user:"Pengguna", category:"Kategori", heat:"Populariti", view:"Lihat dinding nota", closeZoom:"Label disembunyikan pada zum dekat bangunan.", categories:{ academic:"Nasihat Akademik", koko:"Aktiviti Kokurikulum", campus_life:"Kehidupan Kampus", emotional:"Sokongan Emosi" } },
    zh:{ show:"显示留言标签", hide:"隐藏留言标签", hot:"热门留言", private:"仅自己可见", author:"作者", anonymous:"匿名", user:"用户", category:"类别", heat:"热度", view:"查看留言墙", closeZoom:"建筑近距离视图会自动隐藏标签。", categories:{ academic:"学术建议", koko:"课外活动", campus_life:"校园生活", emotional:"情绪支持" } },
  };
  function currentCopy() {
    const language = window.I18n?.getLanguage?.() || "en";
    return copy[language] || copy.en;
  }

  function text(key) {
    return currentCopy()[key] || copy.en[key] || key;
  }

  function categoryText(category) {
    const normalized = Object.prototype.hasOwnProperty.call(CATEGORY_ICONS, category) ? category : "academic";
    return currentCopy().categories[normalized] || copy.en.categories[normalized];
  }

  function truncate(value, length = 120) {
    const content = String(value || "").trim();
    return content.length > length ? content.slice(0, length - 1).trimEnd() + "…" : content;
  }

  function escapeHtml(value) {
    return String(value ?? '').replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;').split(String.fromCharCode(34)).join('&quot;').replace(/'/g,'&#039;');
  }

  function addListener(target, type, listener, options) {
    target?.addEventListener?.(type, listener, options);
    state.listeners.push(() => target?.removeEventListener?.(type, listener, options));
  }

  function addMapListener(type, listener) {
    state.map?.on?.(type, listener);
    state.listeners.push(() => state.map?.off?.(type, listener));
  }
  function injectStyles() {
    if (document.getElementById(STYLE_ID)) return;
    const style = document.createElement('style');
    style.id = STYLE_ID;
    style.textContent = `
      .echo-map-note-controls{margin:0 10px 10px 0;font-family:Inter,sans-serif}
      .echo-map-note-control{appearance:none;min-height:38px;display:flex;align-items:center;gap:8px;padding:8px 11px;border:1px solid var(--border,#e2d7cc);border-radius:12px;background:var(--card-bg,#fff);color:var(--text,#2c1f14);box-shadow:var(--shadow,0 8px 24px rgba(44,31,20,.12));cursor:pointer;font:inherit;font-size:12px;font-weight:800}
      .echo-map-note-control:hover,.echo-map-note-control:focus-visible{border-color:var(--primary,#8b5e3c);outline:3px solid color-mix(in srgb,var(--primary,#8b5e3c) 22%,transparent);outline-offset:2px;background:var(--secondary,#f4e8dc)}
      .echo-map-note-control[aria-pressed=true]{color:var(--primary,#8b5e3c)}
      .echo-map-note-label-icon{width:1px!important;height:1px!important;margin:0!important;border:0!important;background:transparent!important;overflow:visible!important}
      .echo-map-note-label{position:absolute;left:0;top:0;display:inline-flex;align-items:center;gap:5px;min-height:28px;padding:5px 8px;border:1px solid var(--border-strong,#c9b9a9);border-radius:999px;background:var(--card-bg,#fff);color:var(--text,#2c1f14);box-shadow:0 7px 18px rgba(44,31,20,.2);font-family:Inter,sans-serif;font-size:10px;font-weight:850;line-height:1;white-space:nowrap;text-decoration:none;transform:translate(-50%,-50%);pointer-events:auto}
      .echo-map-note-label:hover,.echo-map-note-label:focus-visible{z-index:2;border-color:var(--primary,#8b5e3c);outline:3px solid color-mix(in srgb,var(--primary,#8b5e3c) 24%,transparent);outline-offset:2px;color:var(--primary,#8b5e3c)}
      .echo-map-note-label.is-private{border-style:dashed;background:var(--secondary,#f4e8dc);transform:translate(-50%,calc(-50% + 32px))}
      .echo-map-note-detail{position:absolute;left:50%;bottom:calc(100% + 10px);width:248px;padding:13px;border:1px solid var(--border,#e2d7cc);border-radius:14px;background:var(--card-bg,#fff);color:var(--text,#2c1f14);box-shadow:0 18px 42px rgba(44,31,20,.25);font-size:11px;font-weight:500;line-height:1.45;white-space:normal;transform:translate(-50%,5px);opacity:0;visibility:hidden;pointer-events:none;transition:opacity .14s ease,transform .14s ease,visibility .14s ease}
      .echo-map-note-detail::after{content:'';position:absolute;left:50%;top:100%;width:10px;height:10px;border-right:1px solid var(--border,#e2d7cc);border-bottom:1px solid var(--border,#e2d7cc);background:var(--card-bg,#fff);transform:translate(-50%,-5px) rotate(45deg)}
      .echo-map-note-label:hover .echo-map-note-detail,.echo-map-note-label:focus .echo-map-note-detail{opacity:1;visibility:visible;transform:translate(-50%,0);pointer-events:auto}
      .echo-map-note-detail strong{display:block;margin:0 0 7px;color:var(--primary,#8b5e3c);font-size:11px}
      .echo-map-note-summary{display:-webkit-box;margin:0 0 10px;overflow:hidden;color:var(--text,#2c1f14);font-size:12px;font-weight:650;line-height:1.5;-webkit-box-orient:vertical;-webkit-line-clamp:3}
      .echo-map-note-meta{display:grid;grid-template-columns:auto minmax(0,1fr);gap:4px 8px;margin:0;color:var(--text-muted,#7a6657)}
      .echo-map-note-meta dt{font-weight:750}.echo-map-note-meta dd{min-width:0;margin:0;overflow-wrap:anywhere}
      .echo-map-note-link{display:block;margin-top:10px;padding-top:9px;border-top:1px solid var(--border,#e2d7cc);color:var(--primary,#8b5e3c);font-weight:850}
      :root[data-theme=dark] .echo-map-note-control,:root[data-theme=dark] .echo-map-note-label,:root[data-theme=dark] .echo-map-note-detail{border-color:var(--border-strong);background:var(--card-bg);color:var(--text);box-shadow:0 16px 34px rgba(0,0,0,.55)}
      :root[data-theme=dark] .echo-map-note-label.is-private{background:var(--secondary)}
      :root[data-theme=dark] .echo-map-note-detail::after{border-color:var(--border-strong);background:var(--card-bg)}
      @media(max-width:390px){.echo-map-note-control{max-width:170px;padding:7px 9px;font-size:11px}.echo-map-note-detail{width:min(224px,calc(100vw - 48px))}}`;
    document.head.appendChild(style);
  }
  function loadNotes() {
    try {
      const parsed = JSON.parse(localStorage.getItem(NOTES_KEY) || '[]');
      return Array.isArray(parsed) ? parsed : [];
    } catch (error) {
      console.warn('Map note overlay could not read wall notes:', error);
      return [];
    }
  }

  function getBuildings() {
    return new Map((window.CAMPUS_BUILDINGS || [])
      .filter(building => Number.isFinite(Number(building?.mapTarget?.lat)) && Number.isFinite(Number(building?.mapTarget?.lng)))
      .map(building => [building.id, building]));
  }

  function getPublicNotes(notes, buildings) {
    const seenBuildings = new Set();
    return notes
      .filter(note => note && !note.isHidden && note.contextType === 'building' && buildings.has(note.placeId))
      .sort((a,b) => Number(b.score || 0) - Number(a.score || 0))
      .filter(note => {
        if (seenBuildings.has(note.placeId)) return false;
        seenBuildings.add(note.placeId);
        return true;
      })
      .slice(0, MAX_PUBLIC_NOTES);
  }

  function getPrivateNotes(notes, buildings, publicNotes) {
    const userId = window.AuthService?.getCurrentUser?.()?.id;
    if (!userId) return [];
    const publicIds = new Set(publicNotes.map(note => String(note.id)));
    const seenBuildings = new Set();
    return notes
      .filter(note => note && !note.isHidden && note.contextType === 'building' && buildings.has(note.placeId) && note.authorUserId === userId && !publicIds.has(String(note.id)))
      .sort((a,b) => (Date.parse(b.createdAt || '') || 0) - (Date.parse(a.createdAt || '') || 0))
      .filter(note => {
        if (seenBuildings.has(note.placeId)) return false;
        seenBuildings.add(note.placeId);
        return true;
      });
  }

  function wallHref(placeId) {
    return 'index.html#/place/' + encodeURIComponent(placeId) + '/wall';
  }
  function detailHtml(note, labelTitle) {
    const category = Object.prototype.hasOwnProperty.call(CATEGORY_ICONS, note.category) ? note.category : 'academic';
    const score = Number(note.score || 0);
    const author = note.isAnonymous ? text('anonymous') : String(note.authorNickname || text('user'));
    return `<span class="echo-map-note-detail" role="tooltip">
      <strong>${escapeHtml(labelTitle)}</strong>
      <span class="echo-map-note-summary">${escapeHtml(truncate(note.content))}</span>
      <dl class="echo-map-note-meta">
        <dt>${escapeHtml(text('author'))}</dt><dd>${escapeHtml(author)}</dd>
        <dt>${escapeHtml(text('category'))}</dt><dd>${CATEGORY_ICONS[category]} ${escapeHtml(categoryText(category))}</dd>
        <dt>${escapeHtml(text('heat'))}</dt><dd>👍 ${escapeHtml(String(score))}</dd>
      </dl>
      <span class="echo-map-note-link">${escapeHtml(text('view'))} →</span>
    </span>`;
  }

  function createLabel(note, building, isPrivate) {
    const score = Number(note.score || 0);
    const labelTitle = isPrivate ? text('private') : text('hot');
    const ariaLabel = labelTitle + ': ' + truncate(note.content, 80) + '. ' + text('view');
    const html = `<a class="echo-map-note-label${isPrivate ? ' is-private' : ''}" href="${wallHref(building.id)}" aria-label="${escapeHtml(ariaLabel)}">
      <span aria-hidden="true">${isPrivate ? '🔒' : '🔥'}</span><span>${escapeHtml(String(score))}</span>
      ${detailHtml(note, labelTitle)}
    </a>`;
    const icon = L.divIcon({ className:'echo-map-note-label-icon', html, iconSize:[1,1], iconAnchor:[0,0] });
    return L.marker([Number(building.mapTarget.lat), Number(building.mapTarget.lng)], {
      icon, pane:'markerPane', keyboard:false, interactive:true,
    });
  }
  function getHideAtZoom() {
    const configured = state.hideAtZoom == null ? NaN : Number(state.hideAtZoom);
    if (Number.isFinite(configured)) return configured;
    const fitCampusZoom = Number(state.getFitCampusZoom?.());
    const buildingZoom = state.buildingZoom == null ? NaN : Number(state.buildingZoom);
    if (Number.isFinite(fitCampusZoom) && Number.isFinite(buildingZoom)) return Math.max(fitCampusZoom + 1, buildingZoom);
    if (Number.isFinite(buildingZoom)) return buildingZoom;
    if (Number.isFinite(fitCampusZoom)) return fitCampusZoom + 1;
    return Infinity;
  }

  function labelsAllowedAtCurrentZoom() {
    const zoom = Number(state.map?.getZoom?.());
    return !Number.isFinite(zoom) || zoom < getHideAtZoom();
  }

  function syncLayerVisibility() {
    if (!state.map) return;
    const allowedAtZoom = labelsAllowedAtCurrentZoom();
    const shouldShow = state.visible && allowedAtZoom;
    [state.publicLayer,state.privateLayer].forEach(layer => {
      if (!layer) return;
      if (shouldShow && !state.map.hasLayer(layer)) layer.addTo(state.map);
      if (!shouldShow && state.map.hasLayer(layer)) state.map.removeLayer(layer);
    });
    if (state.toggleButton) {
      state.toggleButton.setAttribute('aria-pressed', String(state.visible));
      state.toggleButton.setAttribute('title', allowedAtZoom ? '' : text('closeZoom'));
      state.toggleButton.innerHTML = '<span aria-hidden="true">🏷️</span>' + escapeHtml(text(state.visible ? 'hide' : 'show'));
    }
  }

  function createControl() {
    const control = L.control({ position:'topright' });
    control.onAdd = () => {
      const container = L.DomUtil.create('div','echo-map-note-controls');
      const toggle = L.DomUtil.create('button','echo-map-note-control',container);
      toggle.type = 'button';
      toggle.addEventListener('click', () => {
        state.visible = !state.visible;
        syncLayerVisibility();
      });
      L.DomEvent.disableClickPropagation(container);
      L.DomEvent.disableScrollPropagation(container);
      state.controlElement = container;
      state.toggleButton = toggle;
      return container;
    };
    control.addTo(state.map);
    state.control = control;
  }
  function refresh() {
    if (!state.map || !state.publicLayer || !state.privateLayer) return;
    const buildings = getBuildings();
    const notes = loadNotes();
    const publicNotes = getPublicNotes(notes, buildings);
    const privateNotes = getPrivateNotes(notes, buildings, publicNotes);
    state.publicLayer.clearLayers();
    state.privateLayer.clearLayers();
    publicNotes.forEach(note => state.publicLayer.addLayer(createLabel(note, buildings.get(note.placeId), false)));
    privateNotes.forEach(note => state.privateLayer.addLayer(createLabel(note, buildings.get(note.placeId), true)));
    syncLayerVisibility();
  }

  function init(options = {}) {
    if (!options.map || !window.L) return false;
    if (state.map) destroy();
    state.map = options.map;
    state.getFitCampusZoom = typeof options.getFitCampusZoom === 'function' ? options.getFitCampusZoom : null;
    state.buildingZoom = options.buildingZoom;
    state.hideAtZoom = options.hideAtZoom;
    injectStyles();
    state.publicLayer = L.layerGroup();
    state.privateLayer = L.layerGroup();
    createControl();
    addMapListener('zoomend', syncLayerVisibility);
    addListener(window,'pageshow',refresh);
    addListener(window,'storage',event => { if (event.key === NOTES_KEY) refresh(); });
    addListener(window,'echo:authchange',refresh);
    addListener(window,'echo:languagechange',refresh);
    refresh();
    return true;
  }

  function destroy() {
    state.listeners.splice(0).forEach(remove => remove());
    [state.publicLayer,state.privateLayer].forEach(layer => {
      if (layer && state.map?.hasLayer(layer)) state.map.removeLayer(layer);
      layer?.clearLayers?.();
    });
    state.control?.remove?.();
    state.controlElement?.remove?.();
    document.getElementById(STYLE_ID)?.remove();
    Object.assign(state,{
      map:null, publicLayer:null, privateLayer:null, control:null, controlElement:null,
      toggleButton:null, visible:true, getFitCampusZoom:null, buildingZoom:null, hideAtZoom:null,
    });
  }

  window.EchoMapNoteOverlay = { init, refresh, destroy };
})();
