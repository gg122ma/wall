# Echo Wall 主项目优化日志

版本：2026-07-11 Main UI Optimization  
主项目：Echo Wall 原生 HTML + CSS + JavaScript  
辅助资料：KMK Digital Twin 地图及建筑区域数据

## 0. 项目定位纠正

本轮已经将开发主次重新调整为：

1. **Echo Wall 留言墙代码是主项目**；
2. `KMK-DigitalTwin` 不再作为主网站框架；
3. 数字孪生项目只提供 KMK 地图、建筑分类与功能区域资料；
4. 没有把 Echo Wall 改写成 Next.js、React、TypeScript 或 Three.js；
5. 保留原有 Hash Router、HTML、CSS、JavaScript、Leaflet 和 localStorage 架构。

---

## 1. 首页 `app-router.js`、`style-core.css`

### 新增

- 使用上传的书本图片作为主视觉和导航 Logo；
- 新增 Hero 双栏结构；
- 新增浮动便签、书本轻浮动、背景轨道和鼠标轻微视差；
- 新增两项主要行动按钮：
  - Explore Communities
  - Open KMK Echo Map
- 新增首页统计数字递增动画；
- 新增 Communities 卡片滚动进入动画；
- 新增 How Echo Wall Works 三步说明；
- 新增 KMK Echo Map 宣传区；
- 新增更完整的网站页脚；
- 新增页面切换淡入动画；
- 新增导航栏滚动后阴影和背景变化；
- 新增 `prefers-reduced-motion` 动画降级支持。

### 修正

- 删除首页“100% Encrypted”误导描述；
- 改为准确显示当前原型数据、照片留言和最新留言；
- Community 卡片改为可键盘操作的 `button`；
- 修复不同学院之间沿用错误 Batch / Major 的问题；
- 增加无效 Hash Wall 路由检查；
- 改善手机端按钮、标题和视觉布局。

---

## 2. 学院、Batch 与 Major 选择页

### 新增

- Community 图标与上下文说明；
- 三阶段流程提示；
- Batch 与 Major 分组卡片；
- 选中状态动画；
- 选项依次进入动画；
- 更明确的 Enter Echo Wall 行动区；
- 键盘焦点视觉反馈。

### 修正

- 切换学院时自动验证并重置不属于当前学院的 Batch 和 Major；
- 进入留言墙前再次验证关系，避免错误路由。

---

## 3. 留言墙 `app-wall.js`、`style-wall.css`

### 工具栏

- 新增墙面上下文 Header；
- 显示学院、Batch、Major 和当前结果数量；
- 分类按钮重新设计；
- Hot / New 排序重新设计；
- 新增搜索清除按钮；
- 工具栏在手机端保持可用；
- Leave a Note 按钮视觉强化。

### 便签与动画

- 留言卡片改成错峰进入动画；
- 保留原有散落便签风格；
- 改善卡片位置算法，减少互相覆盖；
- 增加图钉、类别标签和照片过渡；
- Hover 时抬升、归正和加深阴影；
- 支持 Enter / Space 打开留言；
- 手机端自动切换为单栏卡片，不再使用绝对定位；
- 无结果时显示完整空状态和发布按钮；
- 自动计算墙面高度，避免底部留言无法滚动查看。

### 照片留言

- 保留并整合照片上传功能；
- 支持 JPG、PNG、WebP；
- 原图最大 8 MB；
- 浏览器压缩后目标约 450 KB；
- 上传前预览；
- 可移除照片；
- 留言卡片显示照片；
- 弹窗显示完整照片；
- Admin 页面显示缩略图；
- localStorage 满额时撤回失败记录并显示提示。

### 表单与弹窗

- 重做 Leave a Note 抽屉；
- 改善输入框、分类、形状、匿名开关和照片区域；
- 打开后自动聚焦留言输入；
- 弹窗和抽屉打开时锁定背景滚动；
- Toast 改为统一队列区域和退出动画；
- 增加 ARIA dialog、按钮说明和焦点状态。

---

## 4. Admin 页面 `app-admin.js`、`style-admin.css`

### 布局

- 改为桌面左侧栏 + 主工作区；
- 手机端左侧栏自动变成顶部快捷栏；
- 新增 Wall Notes、Map Pins、Echo Map、Export JSON 导航；
- 新增本地原型安全提示；
- 新增统一顶部标题和系统状态。

### Dashboard

- 新增动态统计卡：
  - Total Notes / Pins
  - Visible
  - Photo Notes / Hidden
  - Votes / Coverage
- 统计数字加入递增动画；
- 统计卡加入错峰进入和 Hover 动画。

### 内容审核

- 搜索和筛选栏重新排版；
- 留言行加入类别图标或图片缩略图；
- 显示学院、Batch、Major、作者、日期和分数；
- 改善 Visible / Hidden 标签；
- 改善 Hide、Show、Delete 按钮；
- Map Pin 显示颜色、图标、坐标和作者；
- 新增空数据状态；
- 保留 JSON 导出和原型数据重置。

### 登录页

- 改成双栏品牌介绍与登录表单；
- 明确标注当前是 local prototype authentication；
- 未更改现有登录方式，以免破坏当前原型运行。

### 上线前必须替换

以下代码仍然只适合本机演示：

```js
const ADMIN_USERNAME = "admin";
const ADMIN_PASSWORD = "abc67##";
```

正式上线必须改成 Supabase Auth，并用 RLS 限制管理员数据权限。

---

## 5. Echo Map `map.html`、`echomap.js`

### 主次关系

Echo Map 现在是 Echo Wall 的地点化辅助页面，不是主框架。

### 使用 KMK Digital Twin 辅助资料新增

- 6 个功能导览区：
  1. Learning & Teaching / 学习与教学区
  2. Student Life / 学生生活区
  3. Residence & Dining / 宿舍与餐饮区
  4. Sports & Activity / 体育与活动区
  5. Administration & Staff / 行政与教职员区
  6. Access & Parking / 出入口与停车区
- 根据辅助数据中 44 个建筑或结构的类别范围生成导览矩形；
- 每个区域显示图标、名称、中文名称、说明和数量；
- 点击区域卡片或地图区域可以平滑定位；
- 新增显示/隐藏功能区域按钮；
- 新增 Fit Campus 按钮；
- 优化桌面与手机地图布局。

### 数据声明

这些区域是根据建筑分组的范围生成的**功能导览范围**，不是 KMK 官方行政区域或测量边界。网站界面已明确显示此限制。

### 地图留言

- 重做地图留言发布弹窗；
- 新增字数统计；
- 保留颜色与图标选择；
- 加入存储失败提示；
- 加强 XSS 转义；
- 验证颜色、图标、坐标和日期；
- 隐藏的 Map Pin 不会显示在公开地图。

---

## 6. 全站细节

- 合并重复 Google Fonts 请求；
- 增加 `theme-color` 和页面描述；
- 增加 Skip to content；
- 加强按钮 `focus-visible`；
- 增加页面与卡片统一缓动曲线；
- 动画优先使用 `transform` 与 `opacity`；
- 手机端关闭复杂视差；
- 用户开启 Reduce Motion 时关闭非必要动画；
- 修复 favicon 路径为 `assets/book-icon.png`；
- 保持所有原有数据和功能兼容。

---

## 7. 未在本轮接入的部分

为了保持当前原型框架与本轮目标，以下尚未连接：

- Supabase 数据库；
- Supabase Auth；
- Supabase RLS；
- Cloudinary signed upload；
- 云端图片删除；
- 多用户实时同步；
- 正式审核状态工作流。

当前代码仍使用 localStorage，但图片字段和 UI 已经为后续 Cloudinary URL 替换保留清晰入口。

---

## 8. 检查结果

已执行：

- `node --check`：所有 JavaScript 文件通过；
- HTML 本地资源路径检查：通过；
- HTML ID 重复检查：通过；
- CSS 解析检查：3 个 CSS 文件均无语法错误；
- 首页与地图本地 HTTP 响应：HTTP 200。

当前运行环境的 Chromium 无头截图进程无法正常退出，因此没有把自动浏览器截图测试列为通过。此限制已如实保留，不代表已完成浏览器视觉回归测试。

---

## 9. 文件结构

```text
EchoWall-Main-Optimized/
├── assets/
│   └── book-icon.png
├── index.html
├── map.html
├── app-data.js
├── app-router.js
├── app-wall.js
├── app-admin.js
├── echomap.js
├── style-core.css
├── style-wall.css
├── style-admin.css
├── README.md
└── OPTIMIZATION_LOG.md
```

---

## 2026-07-12 23:48 +08:00 — UI Cleanup: Prototype Labels and Admin Sidebar

### Stage

Focused visual cleanup requested after screenshot review.

### Objective

Remove unnecessary prototype-facing labels and reduce duplicate branding in the logged-in admin workspace without changing authentication, data storage, routing, or moderation behaviour.

### Files inspected

- `index.html`
- `app-router.js`
- `app-admin.js`
- `style-admin.css`
- `style-core.css`
- `AGENTS.md`

### Design decision

Two feasible approaches were compared:

1. Hide the unwanted elements with CSS only.
2. Remove the unused markup and its dedicated CSS, then preserve the intended sidebar spacing.

Option 2 was selected because it avoids hidden duplicate content, removes dead presentation code, is easier to maintain, and has a straightforward rollback. The existing global Echo Wall navbar brand remains unchanged.

### Files modified

- `index.html`
- `app-router.js`
- `app-admin.js`
- `style-admin.css`

### Behaviour before

- The main navbar displayed `Local prototype` with a green status dot.
- The homepage footer displayed `© 2026 · Prototype build`.
- The admin sidebar repeated the Echo Wall brand beneath the global navbar.
- The admin sidebar displayed a `Local prototype auth` warning card.
- The warning card supplied the automatic spacer that kept `Sign out` at the bottom.

### Behaviour after

- The main navbar displays only the Echo Map KMK action on the right.
- The homepage footer displays `© 2026 Matriks EchoWall`.
- The duplicate sidebar `Echo Wall / Admin workspace` brand is removed.
- The logged-in admin sidebar no longer displays the `Local prototype auth` card.
- The admin navigation begins cleanly at the top of the sidebar.
- `Sign out` remains anchored at the bottom of the desktop sidebar.

### Reason for change

The removed labels were visually repetitive and made the prototype feel less polished. The admin workspace already has the global Echo Wall brand in the main navbar, so the second sidebar brand did not add useful context.

### Data migration performed

None. No LocalStorage keys, records, credentials, routes, or schemas were changed.

### Tests executed

- `node --check` on all JavaScript files.
- Duplicate HTML ID check for `index.html` and `map.html`.
- Local HTML asset-path check.
- CSS parse/structure check for all three stylesheets.
- Exact requested-text and removed-block assertions.
- Local HTTP smoke test for `index.html` and `map.html`.

### Test results

- All JavaScript syntax checks passed.
- No duplicate HTML IDs were found.
- No missing local assets were found.
- All CSS files parsed without structural errors.
- Requested labels and admin blocks were removed or replaced correctly.
- `index.html`: HTTP 200.
- `map.html`: HTTP 200.

A full interactive browser visual regression was not claimed in this environment.

### Remaining limitations

- The admin login remains prototype-only client-side authentication.
- `Prototype online` in the admin header and prototype wording on the login screen were not changed because they were outside the confirmed screenshot requests.
- Functional-zone label visibility and zone-boundary accuracy remain deferred for a later map-specific pass.

### Rollback guidance

Restore the four modified files from the previous archive, or re-add the removed navbar status, footer wording, admin sidebar brand, admin security note, and their associated CSS rules.

### Next recommended step

Review the updated desktop and mobile admin layouts visually, then handle the deferred Echo Map zone-label and zone-boundary work as a separate interaction/data stage.

---

## 2026-07-13 — Feature Foundation: Building Walls, Accounts, Language, Theme and Integration Adapters

### Stage

Focused feature foundation while preserving the existing static architecture. Map region redesign was explicitly deferred.

### Objective

Add building-specific profiles and walls, authenticated posting, flexible note placement, improved shapes, photo crop controls, three-language support, dark mode and safe integration boundaries for BISHENG and Cloudinary.

### Files inspected

- `index.html`
- `map.html`
- `app-data.js`
- `app-router.js`
- `app-wall.js`
- `app-admin.js`
- `echomap.js`
- all existing CSS files
- existing `AGENTS.md`, `README.md`, audit and optimization logs
- selective KMK Digital Twin building and metadata JSON as read-only source material

### Files added

- `app-place.js`
- `config/app-config.js`
- `data/campus-buildings.js`
- `i18n/index.js`
- `i18n/locales/en.js`
- `i18n/locales/ms.js`
- `i18n/locales/zh.js`
- `services/auth-service.js`
- `services/auth-ui.js`
- `services/theme-service.js`
- `services/translation-service.js`
- `services/cloudinary-adapter.js`
- `services/bisheng-adapter.js`
- `ROADMAP.md`
- `CONTRIBUTING.md`
- `CHANGELOG.md`
- `HANDOFF.md`
- documentation under `docs/`

### Files modified

- `AGENTS.md`
- `README.md`
- `index.html`
- `map.html`
- `app-data.js`
- `app-router.js`
- `app-wall.js`
- `app-admin.js`
- `echomap.js`
- `style-core.css`
- `style-wall.css`
- `OPTIMIZATION_LOG.md`
- `CODE_AUDIT.md`

### Behaviour before

- Only community walls existed.
- Users could post without registering or signing in.
- New notes used automatically generated positions.
- Five note shapes were available.
- Photo display had no user crop-scale control.
- No formal UI language system or user-note translation toggle existed.
- No light/dark preference existed.
- No explicit BISHENG or Cloudinary adapter contract existed.

### Behaviour after

- A 30-building Echo Wall-owned registry is available without runtime Digital Twin dependency.
- Every registered building has a profile route and a dedicated building wall route.
- Building profiles show localized descriptions and highest-scoring notes over a generated bird's-eye outline.
- Posting requires a signed-in local prototype user.
- Signed-in users may publish anonymously or with a display name.
- Users choose note positions on a preview board.
- Ten note shapes are available.
- Users choose photo crop scale from 100% to 180% and `cover` or `contain` display.
- UI language preference supports English, Bahasa Melayu and Chinese in a separate `i18n/` folder.
- User notes expose an original/translated toggle through a configurable translation endpoint.
- Light, dark and system themes persist locally.
- Cloudinary signed upload and BISHENG assistant bridges are prepared without exposing private secrets.
- Map-note posting now requires a signed-in user, while region redesign remains untouched.

### Data migration

Existing notes are normalized to schema version 2. Existing community notes become `contextType: "community"`. New building notes use `contextType: "building"` and `placeId`. Existing storage key remains `echo-wall-notes` for compatibility.

### Tests executed

- `node --check` on all root, service, configuration, locale and data JavaScript files.
- Static HTML duplicate-ID check.
- Local asset-path check.
- CSS brace-balance check.
- Local HTTP response checks.

### Test results

- JavaScript syntax: passed.
- Further static checks are recorded in the build report.
- Headless Chromium did not exit reliably in the container, so full visual and interactive browser regression is not claimed.

### Remaining limitations

- Local authentication is prototype-only.
- Live translation requires a backend endpoint.
- Cloudinary requires a signature endpoint and configured cloud name.
- BISHENG requires the group member's deployed endpoint and credentials strategy.
- Admin user-auth integration is still separate from the existing prototype admin login.
- Map region and building-click redesign are deferred.

### Rollback guidance

Restore the previous root files and remove `app-place.js`, `config/`, `data/`, `i18n/`, `services/` and the new documentation files. Existing note data remains readable by the previous build only after removing building notes or restoring a pre-migration LocalStorage backup.

### Next recommended step

Perform desktop and mobile visual QA. Then connect one production integration at a time, starting with production authentication or translation, not both in the same stage.
