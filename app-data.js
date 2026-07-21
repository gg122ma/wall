/**
 * Global Campus Space Configuration Schema
 * Array containing all operational single-page spaces
 */
const organizations = [
  { id: 1, name: "KMK",  type: "college", emoji: "🌾" },
  { id: 2, name: "KMKK", type: "college", emoji: "⚙️" },
  { id: 3, name: "KMPP", type: "college", emoji: "🌉" },
  { id: 4, name: "KMPK", type: "college", emoji: "⛰️" },
  { id: 5, name: "KMP",  type: "college", emoji: "🥭" },
];

/**
 * Batches Mapping List
 * Links graduation timelines to their parent organizations
 */
const batches = [
  { id: 1,  year: 2024, label: "Batch 06", orgId: 1 },
  { id: 2,  year: 2025, label: "Batch 07", orgId: 1 },
  { id: 3,  year: 2026, label: "Batch 08", orgId: 1 },
  { id: 4,  year: 2024, label: "Batch 06", orgId: 2 },
  { id: 5,  year: 2025, label: "Batch 07", orgId: 2 },
  { id: 6,  year: 2026, label: "Batch 08", orgId: 2 },
  { id: 7,  year: 2024, label: "Batch 06", orgId: 3 },
  { id: 8,  year: 2025, label: "Batch 07", orgId: 3 },
  { id: 9,  year: 2026, label: "Batch 08", orgId: 3 },
  { id: 10, year: 2024, label: "Batch 06", orgId: 4 },
  { id: 11, year: 2025, label: "Batch 07", orgId: 4 },
  { id: 12, year: 2026, label: "Batch 08", orgId: 4 },
  { id: 13, year: 2024, label: "Batch 06", orgId: 5 },
  { id: 14, year: 2025, label: "Batch 07", orgId: 5 },
  { id: 15, year: 2026, label: "Batch 08", orgId: 5 },
];

/**
 * Academic Streams/Majors Database Schema
 * Distributes academic classifications across respective colleges
 */
const majors = [
  { id: 1, name: "Sains",                                   orgId: 1 },
  { id: 2, name: "Akaun",                                   orgId: 1 },
  { id: 3, name: "Sains Komputer",                          orgId: 1 },
  { id: 4, name: "Asas Kejuruteraan",                       orgId: 2 },
  { id: 5, name: "Kejuruteraan Awam",                       orgId: 2 },
  { id: 6, name: "Kejuruteraan Mekanikal",                  orgId: 2 },
  { id: 7, name: "Kejuruteraan Elektrik & Elektronik",     orgId: 2 },
  { id: 8, name: "Sains",                                   orgId: 3 },
  { id: 9, name: "Akaun",                                   orgId: 3 },
  { id: 10, name: "Sains",                                   orgId: 4 },
  { id: 11, name: "Akaun",                                   orgId: 4 },
  { id: 12, name: "Sains Komputer",                          orgId: 4 },
  { id: 13, name: "Sains",                                   orgId: 5 },
  { id: 14, name: "Akaun",                                   orgId: 5 },
  { id: 15, name: "Sains Komputer",                          orgId: 5 },
];

/**
 * Profile-only education directory.
 * This is intentionally independent from community wall organizations and majors.
 */
const educationInstitutions = Object.freeze([
  { id: 1,  name: "Kolej Matrikulasi Kedah" },
  { id: 2,  name: "Kolej Matrikulasi Kejuruteraan Kedah" },
  { id: 3,  name: "Kolej Matrikulasi Pulau Pinang" },
  { id: 4,  name: "Kolej Matrikulasi Perak" },
  { id: 5,  name: "Kolej Matrikulasi Perlis" },
  { id: 6,  name: "Kolej Matrikulasi Melaka" },
  { id: 7,  name: "Kolej Matrikulasi Negeri Sembilan" },
  { id: 8,  name: "Kolej Matrikulasi Labuan" },
  { id: 9,  name: "Kolej Matrikulasi Johor" },
  { id: 10, name: "Kolej Matrikulasi Pahang" },
  { id: 11, name: "Kolej Matrikulasi Kejuruteraan Pahang" },
  { id: 12, name: "Kolej Matrikulasi Kejuruteraan Johor" },
  { id: 13, name: "Kolej Matrikulasi Selangor" },
  { id: 14, name: "Kolej Matrikulasi Kelantan" },
  { id: 15, name: "Kolej Matrikulasi Sarawak" },
  { id: 16, name: "Kolej MARA Kulim" },
  { id: 17, name: "Kolej MARA Kuala Nerang" },
].map(item => Object.freeze(item)));

const educationPrograms = Object.freeze([
  Object.freeze({ id: 1,  name: "Sains", legacyIds: Object.freeze([1, 8, 10, 13]) }),
  Object.freeze({ id: 2,  name: "Akaun", legacyIds: Object.freeze([2, 9, 11, 14]) }),
  Object.freeze({ id: 3,  name: "Sains Komputer", legacyIds: Object.freeze([3, 12, 15]) }),
  Object.freeze({ id: 16, name: "Kejuruteraan", legacyIds: Object.freeze([4, 5, 6, 7]) }),
]);

window.educationInstitutions = educationInstitutions;
window.educationPrograms = educationPrograms;

/**
 * Default Content Database Records
 * Provides sample records to render if localStorage is empty
 */
const SEED_NOTES = [
  { id:1,  orgId:1, batchId:1, majorId:1, category:"academic",    isAnonymous:false, authorNickname:"Alice",  shape:"square",   color:"#BFDBFE", rotation:-3, positionX:12, positionY:15, upvotes:45, downvotes:1,  score:44, userVote:null, createdAt:"2024-06-01T10:00:00Z", content:"离散数学一定要做第三章的习题！那些题型在期末考试重复出现。Dr. Ahmad 出的题目跟课本习题几乎一模一样。" },
  { id:2,  orgId:1, batchId:1, majorId:1, category:"emotional",   isAnonymous:true,  authorNickname:null,     shape:"rect",     color:"#FEF08A", rotation: 4, positionX:35, positionY:10, upvotes:12, downvotes:2,  score:10, userVote:null, createdAt:"2024-06-02T11:00:00Z", content:"别怕 fail，我当年也在 DS 挂了。重考一次反而搞清楚了。失败不是终点，是重新开始的机会。" },
  { id:3,  orgId:1, batchId:1, majorId:1, category:"koko",         isAnonymous:false, authorNickname:"Sam",    shape:"torn",     color:"#BBF7D0", rotation:-6, positionX:62, positionY: 8, upvotes:30, downvotes:0,  score:30, userVote:null, createdAt:"2024-06-03T09:00:00Z", content:"辩论社的经历真的改变了我。学会了批判性思维，面试的时候比同学表现好很多。强烈推荐加入！" },
  { id:4,  orgId:1, batchId:1, majorId:1, category:"campus_life", isAnonymous:true,  authorNickname:null,     shape:"square",   color:"#FED7AA", rotation: 2, positionX:78, positionY:20, upvotes:18, downvotes:1,  score:17, userVote:null, createdAt:"2024-06-04T14:00:00Z", content:"Dr. Lim 的课期末给分都很高，只要你去上课打卡就行。食堂3号摊位的炒饭最好吃。" },
  { id:5,  orgId:1, batchId:1, majorId:1, category:"academic",    isAnonymous:false, authorNickname:"Ben",    shape:"circle",   color:"#93C5FD", rotation:-2, positionX:20, positionY:45, upvotes:22, downvotes:0,  score:22, userVote:null, createdAt:"2024-06-05T08:00:00Z", content:"Database Systems 推荐用 PostgreSQL 来练习，不要只靠 MySQL。大四实习的时候你会感谢自己的。" },
  { id:6,  orgId:1, batchId:1, majorId:1, category:"emotional",   isAnonymous:true,  authorNickname:null,     shape:"envelope", color:"#FCD34D", rotation: 5, positionX:48, positionY:38, upvotes:38, downvotes:2,  score:36, userVote:null, createdAt:"2024-06-06T16:00:00Z", content:"给后来者的一封信：不要拿自己和别人比。每个人的节奏不同。找到你的方式，然后坚持下去。你比你想象的更有能力。" },
  { id:7,  orgId:1, batchId:1, majorId:1, category:"academic",    isAnonymous:false, authorNickname:"Mei",    shape:"rect",     color:"#DBEAFE", rotation:-4, positionX:70, positionY:50, upvotes:27, downvotes:1,  score:26, userVote:null, createdAt:"2024-06-07T10:00:00Z", content:"Algorithm 课一开始很难，但坚持画图理解每个步骤之后就豁然开朗了。推荐 Visualgo.net 这个网站。" },
  { id:8,  orgId:1, batchId:1, majorId:1, category:"campus_life", isAnonymous:true,  authorNickname:null,     shape:"square",   color:"#FFF7ED", rotation: 3, positionX:15, positionY:68, upvotes:15, downvotes:0,  score:15, userVote:null, createdAt:"2024-06-08T09:00:00Z", content:"图书馆6楼有安静的自习室，平时没什么人。考试周记得早点去占位置，7点半就满了。" },
  { id:9,  orgId:1, batchId:2, majorId:2, category:"academic",    isAnonymous:true,  authorNickname:null,     shape:"rect",     color:"#BFDBFE", rotation:-5, positionX:30, positionY:60, upvotes:20, downvotes:3,  score:17, userVote:null, createdAt:"2024-06-09T11:00:00Z", content:"Software Engineering 课的 group project 选好队友比什么都重要。找主动的人，避免只会拍照打卡的。" },
  { id:10, orgId:1, batchId:2, majorId:2, category:"koko",        isAnonymous:false, authorNickname:"Razif",  shape:"torn",     color:"#86EFAC", rotation: 6, positionX:55, positionY:72, upvotes:25, downvotes:0,  score:25, userVote:null, createdAt:"2024-06-10T14:00:00Z", content:"参加了编程马拉松（Hackathon），没拿奖但认识了很多厉害的人。那次经历让我拿到了第一份实习。" },
  { id:11, orgId:2, batchId:4, majorId:4, category:"koko",        isAnonymous:false, authorNickname:"Zara",   shape:"square",   color:"#BBF7D0", rotation:-3, positionX:25, positionY:30, upvotes:33, downvotes:1,  score:32, userVote:null, createdAt:"2024-06-11T09:00:00Z", content:"参加辩论队的两年是大学最值得的 investment。思维、表达、压力管理都提升了。去吧，不要犹豫。" },
  { id:12, orgId:2, batchId:4, majorId:5, category:"koko",        isAnonymous:true,  authorNickname:null,     shape:"circle",   color:"#4ADE80", rotation: 4, positionX:60, positionY:40, upvotes:19, downvotes:0,  score:19, userVote:null, createdAt:"2024-06-12T15:00:00Z", content:"剧团的年度演出是人生难忘的经历。哪怕你不会演戏，幕后工作也很有意思。大胆去试！" },
  { id:13, orgId:3, batchId:8, majorId:8, category:"academic",    isAnonymous:true,  authorNickname:null,     shape:"rect",     color:"#93C5FD", rotation:-2, positionX:20, positionY:25, upvotes:41, downvotes:1,  score:40, userVote:null, createdAt:"2024-06-13T08:00:00Z", content:"解剖课一定要提前预习，不要等上课才第一次看到那些名词。Netter's Atlas 是必备。每天30分钟，比临时抱佛脚好太多。" },
  { id:14, orgId:3, batchId:8, majorId:8, category:"emotional",   isAnonymous:true,  authorNickname:null,     shape:"envelope", color:"#FEF08A", rotation: 5, positionX:65, positionY:35, upvotes:50, downvotes:2,  score:48, userVote:null, createdAt:"2024-06-14T10:00:00Z", content:"医学院压力很大，但你选择这条路是有理由的。记得照顾好自己，burnout 了帮不了任何人。" },
];


const SEED_BUILDING_NOTES = [
  { id:201, schemaVersion:2, contextType:"building", placeId:"B_PUSTAKA", category:"academic", isAnonymous:false, authorNickname:"Batch 08 Senior", authorUserId:"seed", shape:"polaroid", color:"#DBEAFE", rotation:-2, positionX:20, positionY:22, upvotes:31, downvotes:1, score:30, userVote:null, createdAt:"2026-06-01T09:00:00Z", content:"考试周建议早上七点前来，靠窗位置最快满。电脑实验室冷气很强，记得带外套。", imageDataUrl:"", imageUrl:"", imageName:"", imageCropScale:1, imageFit:"cover" },
  { id:202, schemaVersion:2, contextType:"building", placeId:"B_DEWAN_KULIAH", category:"academic", isAnonymous:true, authorNickname:null, authorUserId:"seed", shape:"speech", color:"#FEF08A", rotation:3, positionX:58, positionY:18, upvotes:24, downvotes:0, score:24, userVote:null, createdAt:"2026-06-03T11:30:00Z", content:"大型讲座前先确认 Dewan 编号，两个入口在高峰时段会非常拥挤。", imageDataUrl:"", imageUrl:"", imageName:"", imageCropScale:1, imageFit:"cover" },
  { id:203, schemaVersion:2, contextType:"building", placeId:"B_MASJID", category:"campus_life", isAnonymous:false, authorNickname:"Aiman", authorUserId:"seed", shape:"rounded", color:"#DCFCE7", rotation:-1, positionX:42, positionY:58, upvotes:19, downvotes:0, score:19, userVote:null, createdAt:"2026-06-05T13:15:00Z", content:"周五祈祷时人很多，建议提早到，并把鞋子放在容易记住的位置。", imageDataUrl:"", imageUrl:"", imageName:"", imageCropScale:1, imageFit:"cover" },
  { id:204, schemaVersion:2, contextType:"building", placeId:"B_KAFETERIA_A", category:"campus_life", isAnonymous:true, authorNickname:null, authorUserId:"seed", shape:"ticket", color:"#FED7AA", rotation:2, positionX:72, positionY:48, upvotes:16, downvotes:1, score:15, userVote:null, createdAt:"2026-06-07T07:45:00Z", content:"午餐十二点半后队伍最长，十一点四十五分左右来会轻松很多。", imageDataUrl:"", imageUrl:"", imageName:"", imageCropScale:1, imageFit:"cover" },
  { id:205, schemaVersion:2, contextType:"building", placeId:"B_ASTAKA", category:"koko", isAnonymous:false, authorNickname:"Sports Club", authorUserId:"seed", shape:"hexagon", color:"#BBF7D0", rotation:0, positionX:28, positionY:64, upvotes:14, downvotes:0, score:14, userVote:null, createdAt:"2026-06-09T17:20:00Z", content:"傍晚六点前后最适合训练，天气较凉，但下雨后跑道边缘会比较滑。", imageDataUrl:"", imageUrl:"", imageName:"", imageCropScale:1, imageFit:"cover" },
];

// Active State Cache
let notes = [];
let nextId = 100;
let noteStoreLoadError = null;
let noteStoreHasSuccessfulLoad = false;
const noteStoreListeners = new Set();
let wallState = { contextType: "community", orgId: 0, majorId: 0, placeId: "", category: "all", sort: "hot", search: "" };
let selectedMajor = null;

// Palette configurations mapped to specific categories
const CATEGORY_COLORS = {
  academic:    ["#BFDBFE","#93C5FD","#60A5FA","#DBEAFE"],
  koko:        ["#BBF7D0","#86EFAC","#4ADE80","#DCFCE7"],
  campus_life: ["#FED7AA","#FDBA74","#FB923C","#FFF7ED"],
  emotional:   ["#FEF08A","#FDE68A","#FCD34D","#FEF9C3"],
};
const SHAPES = ["rounded","square","rect","circle","envelope","torn","speech","polaroid","ticket","hexagon"];

/**
 * Generates a random background hex-code based on the selected category palette
 * @param {string} cat - The selected note category
 * @returns {string} HEX color code
 */
function randomColor(cat) {
  const pool = CATEGORY_COLORS[cat] || ["#E5E7EB"];
  return pool[Math.floor(Math.random() * pool.length)];
}
function randomShape() { return SHAPES[Math.floor(Math.random() * SHAPES.length)]; }
function noteCount(orgId) { return notes.filter(n => n.orgId === orgId && !n.isHidden).length; }

/**
 * Transforms an ISO timestamp into a user-friendly string format
 * @param {string} iso - The target timestamp string
 * @param {boolean} full - Whether to include detailed hours and minutes
 * @returns {string} Human readable formatted text
 */
function formatDate(iso, full) {
  const d = new Date(iso);
  if (Number.isNaN(d.getTime())) return "Unknown date";
  if (full) return d.toLocaleString("en-US", { year: "numeric", month: "long", day: "numeric", hour: "2-digit", minute: "2-digit" });
  return d.toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" });
}

/**
 * Safely encodes untrusted text strings to prevent Cross-Site Scripting (XSS)
 * @param {string} str - The target raw text string
 * @returns {string} The HTML-safe text output
 */
function escapeHtml(value) {
  if (value === null || value === undefined) return "";
  return String(value)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#039;");
}

/**
 * Only allows raster image data URLs created by the local photo compressor.
 * This prevents manually edited localStorage values from becoming arbitrary URLs.
 */
function safeImageDataUrl(value) {
  const dataUrl = String(value || "");
  return /^data:image\/(?:png|jpe?g|webp);base64,[a-z0-9+/=]+$/i.test(dataUrl) ? dataUrl : "";
}

const STORAGE_KEY = "echo-wall-notes";
const STORAGE_BACKUP_KEY = "echo-wall-notes-backup:v1";
const STORAGE_SCHEMA_KEY = "echo-wall-schema-version";
const BUILDING_SEED_KEY = "echo-wall-building-seed:v1";

function safeImageRemoteUrl(value) {
  try {
    const url = new URL(String(value || ""));
    return url.protocol === "https:" && url.hostname === "res.cloudinary.com" ? url.href : "";
  } catch {
    return "";
  }
}

function getNoteImageSource(note) {
  return safeImageRemoteUrl(note?.imageUrl) || safeImageDataUrl(note?.imageDataUrl);
}

function normalizeStoredNote(note) {
  if (!note || typeof note !== "object") return null;
  const contextType = note.contextType === "building" ? "building" : "community";
  if (contextType === "community") {
    const matchingMajor = majors.find(m => m.id === Number(note.majorId));
    const hasBatch = note.batchId !== null && note.batchId !== undefined && note.batchId !== "";
    const matchingBatch = hasBatch ? batches.find(b => b.id === Number(note.batchId)) : null;
    if (!matchingMajor || (hasBatch && !matchingBatch)) return null;
    if (matchingMajor.orgId !== Number(note.orgId) || (matchingBatch && matchingBatch.orgId !== Number(note.orgId))) return null;
  } else if (!window.getCampusBuilding?.(note.placeId)) {
    return null;
  }

  const normalized = {
    ...note,
    schemaVersion: 2,
    contextType,
    id: Number(note.id),
    orgId: contextType === "community" ? Number(note.orgId) : null,
    batchId: contextType === "community" && note.batchId !== null && note.batchId !== undefined && note.batchId !== "" ? Number(note.batchId) : null,
    majorId: contextType === "community" ? Number(note.majorId) : null,
    placeId: contextType === "building" ? String(note.placeId || "") : "",
    authorUserId: note.authorUserId ? String(note.authorUserId) : "",
    imageDataUrl: safeImageDataUrl(note.imageDataUrl),
    imageUrl: safeImageRemoteUrl(note.imageUrl),
    imagePublicId: note.imagePublicId ? String(note.imagePublicId).slice(0, 200) : "",
    imageName: note.imageName ? String(note.imageName).slice(0, 120) : "",
    imageCropScale: Math.max(1, Math.min(1.8, Number(note.imageCropScale || 1))),
    imageFit: note.imageFit === "contain" ? "contain" : "cover",
    positionX: Math.max(2, Math.min(86, Number(note.positionX || 10))),
    positionY: Math.max(4, Math.min(84, Number(note.positionY || 15))),
  };
  return Number.isFinite(normalized.id) ? normalized : null;
}

function createNoteStoreCorruptionError() {
  const error = new Error('Stored notes are corrupted. Repair or remove the saved data before writing.');
  error.code = 'NOTE_STORE_CORRUPTED';
  return error;
}

function inspectNoteStorage() {
  const saved = localStorage.getItem(STORAGE_KEY);
  if (saved === null) return null;
  if (saved === '') return createNoteStoreCorruptionError();
  try {
    return Array.isArray(JSON.parse(saved)) ? null : createNoteStoreCorruptionError();
  } catch {
    return createNoteStoreCorruptionError();
  }
}

function saveNotes() {
  const storageError = inspectNoteStorage();
  if (storageError) noteStoreLoadError = storageError;
  if (noteStoreLoadError) {
    console.warn('Note storage write blocked because the saved data is corrupted.');
    return false;
  }
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(notes));
    return true;
  } catch (e) {
    console.warn("localStorage save failed:", e);
    return false;
  }
}

function loadNotes() {
  let source = null;
  let loadedFromStorage = false;
  let originalSavedValue = "";
  try {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved !== null) {
      if (saved === '') throw createNoteStoreCorruptionError();
      originalSavedValue = saved;
      const parsed = JSON.parse(saved);
      if (!Array.isArray(parsed)) throw new TypeError("Saved notes must be an array.");
      source = parsed;
      loadedFromStorage = true;
    }
  } catch (e) {
    noteStoreLoadError = createNoteStoreCorruptionError();
    if (!noteStoreHasSuccessfulLoad) notes = [];
    return false;
    console.warn("localStorage load failed:", e);
  }

  if (loadedFromStorage && localStorage.getItem(STORAGE_SCHEMA_KEY) !== "2" && !localStorage.getItem(STORAGE_BACKUP_KEY)) {
    try { localStorage.setItem(STORAGE_BACKUP_KEY, originalSavedValue); } catch (error) { console.warn("Note backup could not be created:", error); }
  }

  if (!source) {
    source = [...JSON.parse(JSON.stringify(SEED_NOTES)), ...JSON.parse(JSON.stringify(SEED_BUILDING_NOTES))];
    try { localStorage.setItem(BUILDING_SEED_KEY, "true"); } catch {}
  }

  notes = source.map(normalizeStoredNote).filter(Boolean);

  const buildingSeedApplied = localStorage.getItem(BUILDING_SEED_KEY) === "true";
  if (loadedFromStorage && !buildingSeedApplied) {
    const buildingSeeds = JSON.parse(JSON.stringify(SEED_BUILDING_NOTES)).map(normalizeStoredNote).filter(Boolean);
    const existingIds = new Set(notes.map(note => Number(note.id)));
    notes.push(...buildingSeeds.filter(note => !existingIds.has(Number(note.id))));
    try { localStorage.setItem(BUILDING_SEED_KEY, "true"); } catch {}
  }

  const ids = notes.map(n => Number(n.id)).filter(Number.isFinite);
  nextId = (ids.length ? Math.max(...ids) : 99) + 1;
  noteStoreLoadError = null;
  noteStoreHasSuccessfulLoad = true;
  try { localStorage.setItem(STORAGE_SCHEMA_KEY, "2"); } catch {}
  saveNotes();
  console.info("Echo Wall note migration", {
    schemaVersion: 2,
    total: notes.length,
    community: notes.filter(note => note.contextType === "community").length,
    building: notes.filter(note => note.contextType === "building").length,
    backupCreated: Boolean(localStorage.getItem(STORAGE_BACKUP_KEY)),
  });
  return true;
}

function requireWritableNoteStore() {
  if (!loadNotes() || noteStoreLoadError) throw createNoteStoreCorruptionError();
}

function emitNoteStoreChange(change) {
  const snapshot = JSON.parse(JSON.stringify(change || { type:'change' }));
  noteStoreListeners.forEach(listener => {
    try { listener(JSON.parse(JSON.stringify(snapshot))); }
    catch { console.warn('A note store listener failed.'); }
  });
}

function createPlaceNote(input = {}, options = {}) {
  requireWritableNoteStore();
  const placeId = String(input.placeId || "");
  const building = window.getCampusBuilding?.(placeId);
  const wallKey = String(input.wallKey || "");
  const content = String(input.content || "").trim();
  const category = String(input.category || "");
  const shape = String(input.shape || "");
  const authorUserId = String(input.authorUserId || "");
  const isAnonymous = input.isAnonymous !== false;
  const authorNickname = isAnonymous ? null : String(input.authorNickname || "").trim();
  if (!building || wallKey !== building.wallKey || wallKey !== "building:" + placeId) throw new Error("This building wall is unavailable.");
  if (!content || content.length > 500) throw new Error("The note must contain between 1 and 500 characters.");
  if (!Object.prototype.hasOwnProperty.call(CATEGORY_COLORS, category)) throw new Error("Choose a valid category.");
  if (!SHAPES.includes(shape)) throw new Error("Choose a valid note shape.");
  if (!authorUserId) throw new Error("Sign in before publishing.");
  if (!isAnonymous && !authorNickname) throw new Error("Your account needs a display name before publishing.");

  const id = nextId++;
  const newNote = {
    id, schemaVersion:2, contextType:"building", orgId:null, batchId:null, majorId:null,
    placeId, wallKey, category, isAnonymous, authorNickname, authorUserId, shape,
    color:randomColor(category), rotation:Math.floor(Math.random() * 5) - 2,
    upvotes:0, downvotes:0, score:0, userVote:null, createdAt:new Date().toISOString(), content,
    imageDataUrl:"", imageUrl:"", imagePublicId:"", imageName:"", imageCropScale:1, imageFit:"cover",
  };
  notes.unshift(newNote);
  if (!saveNotes()) {
    notes = notes.filter(note => Number(note.id) !== id);
    const remainingIds = notes.map(note => Number(note.id)).filter(Number.isFinite);
    nextId = (remainingIds.length ? Math.max(...remainingIds) : 99) + 1;
    throw new Error("Browser storage is full.");
  }
  try {
    if (typeof options.afterSave === "function") options.afterSave({ ...newNote });
  } catch (error) {
    try {
      requireWritableNoteStore();
      const rollbackIndex = notes.findIndex(note => note.contextType === 'building' && Number(note.id) === id);
      if (rollbackIndex >= 0) {
        notes.splice(rollbackIndex, 1);
        if (!saveNotes()) throw new Error('The created note could not be rolled back.');
      }
    } catch (rollbackError) {
      const combined = new Error('Note creation failed and its rollback did not complete.');
      combined.cause = error;
      combined.rollbackError = rollbackError;
      throw combined;
    }
    throw error;
  }
  if (options.notify !== false) emitNoteStoreChange({ type:'create', noteId:id });
  return { ...newNote };
}

function listBuildingNotes() {
  if (!loadNotes() || noteStoreLoadError) throw createNoteStoreCorruptionError();
  return notes.filter(note => note.contextType === 'building').map(note => JSON.parse(JSON.stringify(note)));
}

function setPlaceNoteHidden(noteId, hidden, options = {}) {
  requireWritableNoteStore();
  const target = notes.find(note => note.contextType === 'building' && String(note.id) === String(noteId));
  if (!target) throw new Error('Building note was not found.');
  const previous = Boolean(target.isHidden);
  target.isHidden = Boolean(hidden);
  if (!saveNotes()) { target.isHidden = previous; throw new Error('Browser storage is full.'); }
  if (options.notify !== false) emitNoteStoreChange({ type:'visibility', noteId:target.id, hidden:target.isHidden });
  return JSON.parse(JSON.stringify(target));
}

function deletePlaceNote(noteId, options = {}) {
  requireWritableNoteStore();
  const index = notes.findIndex(note => note.contextType === 'building' && String(note.id) === String(noteId));
  if (index < 0) throw new Error('Building note was not found.');
  const removed = notes[index];
  notes.splice(index, 1);
  if (!saveNotes()) { notes.splice(index, 0, removed); throw new Error('Browser storage is full.'); }
  if (options.notify !== false) emitNoteStoreChange({ type:'delete', noteId:removed.id });
  return { note:JSON.parse(JSON.stringify(removed)), index };
}

function restorePlaceNote(snapshot, options = {}) {
  requireWritableNoteStore();
  const hasRollbackSnapshot = snapshot && typeof snapshot === 'object' && snapshot.note;
  const restored = normalizeStoredNote(hasRollbackSnapshot ? snapshot.note : snapshot);
  if (!restored || restored.contextType !== 'building') throw new Error('Building note snapshot is invalid.');
  if (notes.some(note => String(note.id) === String(restored.id))) throw new Error('Building note already exists.');
  const requestedIndex = hasRollbackSnapshot ? Number(snapshot.index) : 0;
  const restoreIndex = Number.isFinite(requestedIndex) ? Math.max(0, Math.min(notes.length, Math.trunc(requestedIndex))) : 0;
  notes.splice(restoreIndex, 0, restored);
  if (!saveNotes()) { notes = notes.filter(note => note !== restored); throw new Error('Browser storage is full.'); }
  nextId = Math.max(nextId, Number(restored.id) + 1);
  if (options.notify !== false) emitNoteStoreChange({ type:'restore', noteId:restored.id });
  return JSON.parse(JSON.stringify(restored));
}

function subscribeToPlaceNotes(listener) {
  if (typeof listener !== 'function') throw new Error('Note subscriber must be a function.');
  noteStoreListeners.add(listener);
  return () => noteStoreListeners.delete(listener);
}

window.EchoNoteStore = Object.freeze({
  createPlaceNote,
  listBuildingNotes,
  setPlaceNoteHidden,
  deletePlaceNote,
  restorePlaceNote,
  subscribe:subscribeToPlaceNotes,
  categories:Object.freeze(Object.keys(CATEGORY_COLORS)),
  shapes:Object.freeze([...SHAPES]),
});
