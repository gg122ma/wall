window.addEventListener("DOMContentLoaded", () => {
  const MAP_KEY = "echowall_map_notes";
  const DEFAULT_VIEW = [6.42559, 100.41959];
  const CAMPUS_BOUNDS = L.latLngBounds([6.42175, 100.41585], [6.42805, 100.42265]);
  const ALLOWED_ICONS = new Set(["📌", "💬", "❤️", "💡", "🌟"]);

  // Functional areas are derived from the auxiliary KMK Digital Twin building groups.
  // They are prototype navigation extents, not official campus administrative borders.
  const CAMPUS_ZONES = [
    { id:"learning", icon:"📚", label:"Learning & Teaching", zh:"学习与教学区", color:"#5f74d6", count:7, description:"Academic buildings, library, laboratories and main halls.", bounds:[[6.422897,100.416501],[6.427963,100.418732]] },
    { id:"student-life", icon:"✨", label:"Student Life", zh:"学生生活区", color:"#9b70cf", count:4, description:"Student hub, worship, cooperative and everyday services.", bounds:[[6.422766,100.416892],[6.425883,100.419269]] },
    { id:"residence", icon:"🏠", label:"Residence & Dining", zh:"宿舍与餐饮区", color:"#dc5b83", count:6, description:"Student residence areas and the main dining facilities.", bounds:[[6.422732,100.417379],[6.425169,100.421042]] },
    { id:"sports", icon:"🏃", label:"Sports & Activity", zh:"体育与活动区", color:"#4ba874", count:2, description:"Fields, courts and outdoor activity facilities.", bounds:[[6.426675,100.416859],[6.427716,100.417754]] },
    { id:"services", icon:"🏢", label:"Administration & Staff", zh:"行政与教职员区", color:"#65748d", count:9, description:"Administration, campus operations and staff residences.", bounds:[[6.422892,100.416196],[6.425410,100.422570]] },
    { id:"mobility", icon:"🚗", label:"Access & Parking", zh:"出入口与停车区", color:"#8b7867", count:16, description:"Guard posts, main access points and mapped parking areas.", bounds:[[6.421796,100.415901],[6.426692,100.421424]] },
  ];

  function escapeHtml(value) {
    return String(value ?? "")
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;")
      .replace(/"/g, "&quot;")
      .replace(/'/g, "&#039;");
  }

  function safeColor(value) {
    return /^#[0-9a-f]{6}$/i.test(String(value || "")) ? value : "#8b5e3c";
  }

  function loadMapNotes() {
    try {
      const parsed = JSON.parse(localStorage.getItem(MAP_KEY) || "[]");
      return Array.isArray(parsed) ? parsed.filter(note => note && typeof note === "object") : [];
    } catch (error) {
      console.warn("Map notes could not be loaded:", error);
      return [];
    }
  }

  function saveMapNotes(data) {
    try {
      localStorage.setItem(MAP_KEY, JSON.stringify(data));
      return true;
    } catch (error) {
      console.warn("Map notes could not be saved:", error);
      return false;
    }
  }

  function showMapToast(message) {
    const toast = document.createElement("div");
    toast.textContent = message;
    toast.style.cssText = "position:fixed;left:50%;bottom:22px;transform:translateX(-50%);z-index:10000;background:#2c1f14;color:#fff;border-radius:999px;padding:10px 16px;font:700 12px Inter,sans-serif;box-shadow:0 14px 35px rgba(44,31,20,.22);animation:fadeIn .2s ease;max-width:90vw;text-align:center;";
    document.body.appendChild(toast);
    setTimeout(() => toast.remove(), 2600);
  }

  const map = L.map("map", { zoomControl: false, preferCanvas: true }).setView(DEFAULT_VIEW, 17);
  L.control.zoom({ position: "bottomright" }).addTo(map);
  L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
    attribution: "© OpenStreetMap contributors",
    maxZoom: 20,
  }).addTo(map);

  const zoneLayer = L.layerGroup().addTo(map);
  const noteLayer = L.layerGroup().addTo(map);
  let zonesVisible = true;
  let activeZoneId = "";
  let pendingMarker = null;

  const panelBackdrop = document.createElement("div");
  panelBackdrop.id = "echo-panel-backdrop";
  panelBackdrop.style.cssText = "display:none;position:fixed;inset:0;z-index:9998;background:rgba(44,31,20,.38);backdrop-filter:blur(5px);";
  document.body.appendChild(panelBackdrop);

  const panel = document.createElement("section");
  panel.id = "echo-panel";
  panel.setAttribute("role", "dialog");
  panel.setAttribute("aria-modal", "true");
  panel.setAttribute("aria-label", "Leave a map note");
  panel.style.cssText = "display:none;position:fixed;top:50%;left:50%;transform:translate(-50%,-50%);z-index:9999;background:#fff;border:1px solid #e5ddd0;border-radius:20px;box-shadow:0 24px 70px rgba(44,31,20,.22);padding:22px;width:min(92vw,390px);font-family:Inter,sans-serif;animation:modalIn .32s cubic-bezier(.16,1,.3,1);";
  document.body.appendChild(panel);

  function closePanel() {
    panel.style.display = "none";
    panelBackdrop.style.display = "none";
    document.body.classList.remove("overlay-open");
    if (pendingMarker) {
      map.removeLayer(pendingMarker);
      pendingMarker = null;
    }
  }

  function openPanel(lat, lng) {
    panel.innerHTML = `
      <div style="display:flex;justify-content:space-between;align-items:flex-start;gap:14px;margin-bottom:15px;">
        <div><p style="margin:0 0 4px;color:#8b5e3c;text-transform:uppercase;letter-spacing:.1em;font-size:10px;font-weight:800;">Place-based voice</p><h2 style="margin:0;color:#2c1f14;font-size:20px;letter-spacing:-.03em;">Leave a note here</h2><p style="margin:5px 0 0;font-size:10px;color:#7a6657;">${lat.toFixed(5)}, ${lng.toFixed(5)}</p></div>
        <button id="echo-close-btn" type="button" aria-label="Close" style="border:0;width:32px;height:32px;border-radius:50%;background:#f0e8dc;color:#7a6657;cursor:pointer;">✕</button>
      </div>
      <label style="display:block;font-size:11px;font-weight:800;color:#2c1f14;margin-bottom:5px;" for="echo-author">Name <span style="font-weight:500;color:#7a6657;">optional</span></label>
      <input id="echo-author" type="text" placeholder="Anonymous by default" maxlength="40" style="width:100%;box-sizing:border-box;padding:10px 11px;margin-bottom:12px;border:1px solid #e5ddd0;border-radius:10px;font-size:12px;font-family:inherit;outline:none;background:#faf7f2;" />
      <label style="display:block;font-size:11px;font-weight:800;color:#2c1f14;margin-bottom:5px;" for="echo-text">Your note</label>
      <textarea id="echo-text" placeholder="What should students remember about this place?" maxlength="280" rows="4" style="width:100%;box-sizing:border-box;padding:10px 11px;margin-bottom:4px;border:1px solid #e5ddd0;border-radius:10px;font-size:13px;font-family:inherit;resize:none;outline:none;background:#faf7f2;"></textarea>
      <p id="echo-char-count" style="margin:0 0 14px;text-align:right;font-size:10px;color:#7a6657;">0 / 280</p>
      <div style="display:grid;grid-template-columns:1fr 1fr;gap:15px;margin-bottom:17px;">
        <fieldset style="border:0;"><legend style="margin-bottom:7px;font-weight:800;color:#2c1f14;font-size:11px;">Marker colour</legend><div style="display:flex;gap:8px;flex-wrap:wrap;">${["#8b5e3c","#ef4444","#3b82f6","#10b981","#f59e0b"].map((color,index) => `<label style="cursor:pointer;"><input type="radio" name="echo-color" value="${color}" ${index===0?"checked":""} style="display:none;"/><span class="echo-color-dot" style="display:inline-block;width:22px;height:22px;background:${color};border-radius:50%;border:2px solid #fff;box-shadow:0 0 0 1.5px #e5ddd0;transition:.2s;"></span></label>`).join("")}</div></fieldset>
        <fieldset style="border:0;"><legend style="margin-bottom:7px;font-weight:800;color:#2c1f14;font-size:11px;">Marker icon</legend><div style="display:flex;gap:6px;flex-wrap:wrap;">${["📌","💬","❤️","💡","🌟"].map((icon,index) => `<label style="cursor:pointer;"><input type="radio" name="echo-icon" value="${icon}" ${index===0?"checked":""} style="display:none;"/><span class="echo-icon-box" style="display:grid;place-items:center;width:28px;height:28px;background:#fbf6e9;border-radius:7px;font-size:13px;border:1px solid #e5ddd0;transition:.2s;">${icon}</span></label>`).join("")}</div></fieldset>
      </div>
      <div style="display:flex;gap:8px;"><button id="echo-save-btn" type="button" style="flex:1;padding:10px;background:#8b5e3c;color:#fff;border:0;border-radius:10px;font-size:12px;font-weight:800;cursor:pointer;font-family:inherit;">Save place note</button><button id="echo-cancel-btn" type="button" style="padding:10px 15px;background:#f0e8dc;color:#2c1f14;border:1px solid #e5ddd0;border-radius:10px;font-size:12px;font-weight:700;cursor:pointer;font-family:inherit;">Cancel</button></div>`;

    panel.style.display = "block";
    panelBackdrop.style.display = "block";
    document.body.classList.add("overlay-open");

    const text = panel.querySelector("#echo-text");
    const counter = panel.querySelector("#echo-char-count");
    text.addEventListener("input", () => { counter.textContent = `${text.value.length} / 280`; text.style.borderColor = "#e5ddd0"; });
    panel.querySelector("#echo-close-btn").onclick = closePanel;
    panel.querySelector("#echo-cancel-btn").onclick = closePanel;
    panel.querySelector("#echo-save-btn").onclick = () => {
      const noteText = text.value.trim();
      const author = panel.querySelector("#echo-author").value.trim();
      if (!noteText) {
        text.style.borderColor = "#ef4444";
        text.focus();
        return;
      }

      const color = safeColor(panel.querySelector('input[name="echo-color"]:checked')?.value);
      const selectedIcon = panel.querySelector('input[name="echo-icon"]:checked')?.value;
      const icon = ALLOWED_ICONS.has(selectedIcon) ? selectedIcon : "📌";
      const note = { lat, lng, text: noteText, author, color, icon, timestamp: Date.now(), isHidden: false };
      const all = loadMapNotes();
      all.push(note);
      if (!saveMapNotes(all)) {
        showMapToast("Browser storage is full. This pin was not saved.");
        return;
      }
      closePanel();
      placeNoteMarker(note);
      showMapToast("📍 Place note added to Echo Map.");
    };
    requestAnimationFrame(() => text.focus());
  }

  panelBackdrop.addEventListener("click", closePanel);
  window.addEventListener("keydown", event => { if (event.key === "Escape") closePanel(); });

  function createPinIcon(color, icon, isDraft = false) {
    const markerColor = safeColor(color);
    const markerIcon = ALLOWED_ICONS.has(icon) ? icon : "📌";
    return L.divIcon({
      className: "echo-map-pin",
      html: `<div style="width:34px;height:34px;background:${markerColor};border:2px solid #fff;border-radius:50% 50% 50% 0;transform:rotate(-45deg);box-shadow:0 7px 16px rgba(44,31,20,.28);position:relative;opacity:${isDraft?.72:1};"><div style="transform:rotate(45deg);font-size:14px;position:absolute;inset:0;display:grid;place-items:center;line-height:1;">${isDraft?"＋":escapeHtml(markerIcon)}</div></div>`,
      iconSize: [34, 34], iconAnchor: [17, 41], popupAnchor: [0, -42],
    });
  }

  function placeNoteMarker(note) {
    const lat = Number(note.lat);
    const lng = Number(note.lng);
    if (!Number.isFinite(lat) || !Number.isFinite(lng)) return;
    const author = escapeHtml(note.author || "Anonymous");
    const text = escapeHtml(note.text || "");
    const timestamp = Number(note.timestamp);
    const dateText = Number.isFinite(timestamp) ? new Date(timestamp).toLocaleString() : "Unknown date";
    const content = `<article style="min-width:190px;max-width:270px;font-family:Inter,sans-serif;"><p style="margin:0 0 5px;font-weight:800;color:#2c1f14;font-size:13px;">${author}</p><p style="margin:0 0 9px;font-size:12px;color:#5a4a3a;line-height:1.55;overflow-wrap:anywhere;">${text}</p><p style="margin:0;font-size:9px;color:#7a6657;">${escapeHtml(dateText)}</p></article>`;
    L.marker([lat, lng], { icon: createPinIcon(note.color, note.icon) }).addTo(noteLayer).bindPopup(content, { maxWidth: 290 });
  }

  loadMapNotes().filter(note => !note.isHidden).forEach(placeNoteMarker);

  const zoneList = document.getElementById("zone-list");
  const zoneLayers = new Map();

  function setActiveZone(id) {
    activeZoneId = id;
    document.querySelectorAll(".zone-card").forEach(card => card.classList.toggle("active", card.dataset.zoneId === id));
    zoneLayers.forEach((layer, zoneId) => layer.setStyle({ fillOpacity: zoneId === id ? .16 : .07, weight: zoneId === id ? 3 : 1.5 }));
  }

  CAMPUS_ZONES.forEach(zone => {
    const bounds = L.latLngBounds(zone.bounds);
    const rectangle = L.rectangle(bounds, { color:zone.color, weight:1.5, fillColor:zone.color, fillOpacity:.07, dashArray:"7 6", interactive:true }).addTo(zoneLayer);
    rectangle.bindTooltip(`${zone.icon} ${zone.label}`, { permanent:true, direction:"center", className:"zone-label" });
    rectangle.on("click", event => {
      if (event.originalEvent) L.DomEvent.stopPropagation(event.originalEvent);
      setActiveZone(zone.id);
      map.flyToBounds(bounds, { padding:[36,36], duration:.75, maxZoom:18 });
    });
    zoneLayers.set(zone.id, rectangle);

    const card = document.createElement("button");
    card.type = "button";
    card.className = "zone-card";
    card.dataset.zoneId = zone.id;
    card.style.setProperty("--zone-color", zone.color);
    card.innerHTML = `<span class="zone-icon">${zone.icon}</span><span><strong>${zone.label}</strong><small>${zone.zh} · ${zone.description}</small></span><span class="zone-count">${zone.count}</span>`;
    card.onclick = () => {
      setActiveZone(zone.id);
      map.flyToBounds(bounds, { padding:[38,38], duration:.75, maxZoom:18 });
      if (window.innerWidth < 980) document.querySelector(".map-frame")?.scrollIntoView({ behavior:"smooth", block:"start" });
    };
    zoneList.appendChild(card);
  });

  document.getElementById("toggle-zones").addEventListener("click", event => {
    zonesVisible = !zonesVisible;
    event.currentTarget.classList.toggle("active", zonesVisible);
    if (zonesVisible) zoneLayer.addTo(map);
    else map.removeLayer(zoneLayer);
  });

  document.getElementById("fit-campus").addEventListener("click", () => {
    setActiveZone("");
    map.flyToBounds(CAMPUS_BOUNDS, { padding:[30,30], duration:.75 });
  });

  map.fitBounds(CAMPUS_BOUNDS, { padding:[24,24] });
  map.on("click", event => {
    if (!window.AuthService?.isAuthenticated?.()) {
      showMapToast("Please sign in on Echo Wall before leaving a map note.");
      return;
    }
    const { lat, lng } = event.latlng;
    if (pendingMarker) map.removeLayer(pendingMarker);
    pendingMarker = L.marker([lat, lng], { icon:createPinIcon("#c8956c", "📌", true) }).addTo(map);
    openPanel(lat, lng);
  });
});
