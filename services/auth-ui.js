(function () {
  let mode = "login";
  let lastFocusedElement = null;

  function ensureDialog() {
    let overlay = document.getElementById("auth-overlay");
    if (overlay) return overlay;
    overlay = document.createElement("div");
    overlay.id = "auth-overlay";
    overlay.className = "auth-overlay hidden";
    overlay.setAttribute("aria-hidden", "true");
    overlay.innerHTML = `<section class="account-auth-shell" role="dialog" aria-modal="true" aria-labelledby="auth-title" aria-describedby="auth-description">
      <button class="account-auth-close" type="button">✕</button>
      <section class="account-auth-visual" aria-label="Echo Wall">
        <div class="account-auth-copy">
          <img src="assets/book-icon.png" alt="" />
          <p class="eyebrow account-auth-visual-eyebrow"></p>
          <h2 class="account-auth-visual-title"></h2>
          <p class="account-auth-visual-description"></p>
          <div class="account-auth-points">
            <span>✦ <b class="account-auth-point-one"></b></span>
            <span>✦ <b class="account-auth-point-two"></b></span>
            <span>✦ <b class="account-auth-point-three"></b></span>
          </div>
        </div>
      </section>
      <section class="account-auth-panel">
        <div class="account-auth-scroll">
          <div class="account-auth-card">
            <div class="account-auth-mark" aria-hidden="true">E</div>
            <p class="eyebrow account-auth-mode-label"></p>
            <h2 id="auth-title"></h2>
            <p id="auth-description" class="account-auth-description"></p>
            <p class="account-auth-local-notice"></p>
            <form id="auth-form" novalidate>
              <div class="form-group auth-display-name"><label class="form-label" for="auth-display-name"></label><input id="auth-display-name" class="form-input" maxlength="50" autocomplete="name" /></div>
              <div class="form-group"><label class="form-label" for="auth-email"></label><input id="auth-email" class="form-input" type="email" autocomplete="email" required /></div>
              <div class="form-group"><label class="form-label" for="auth-password"></label><input id="auth-password" class="form-input" type="password" autocomplete="current-password" minlength="8" required /></div>
              <div class="form-group auth-confirm"><label class="form-label" for="auth-confirm"></label><input id="auth-confirm" class="form-input" type="password" autocomplete="new-password" minlength="8" /></div>
              <p id="auth-error" class="auth-error" role="alert"></p>
              <button id="auth-submit" class="btn btn-primary btn-full btn-lg" type="submit"></button>
            </form>
            <button id="auth-switch" class="account-auth-switch" type="button"></button>
          </div>
        </div>
      </section>
    </section>`;
    document.body.appendChild(overlay);
    overlay.addEventListener("click", event => { if (event.target === overlay) close(); });
    overlay.querySelector(".account-auth-close").addEventListener("click", close);
    overlay.querySelector("#auth-switch").addEventListener("click", () => {
      setMode(mode === "login" ? "register" : "login");
      focusFirstField(overlay);
    });
    overlay.querySelector("#auth-form").addEventListener("submit", submit);
    document.addEventListener("keydown", event => {
      if (event.key === "Escape" && !overlay.classList.contains("hidden")) close();
    });
    return overlay;
  }

  function focusFirstField(overlay) {
    requestAnimationFrame(() => {
      overlay.querySelector(mode === "register" ? "#auth-display-name" : "#auth-email")?.focus();
    });
  }

  function setMode(nextMode) {
    mode = nextMode;
    const overlay = ensureDialog();
    const isRegister = mode === "register";
    overlay.querySelector(".auth-display-name").classList.toggle("hidden", !isRegister);
    overlay.querySelector(".auth-confirm").classList.toggle("hidden", !isRegister);
    overlay.querySelector("#auth-display-name").required = isRegister;
    overlay.querySelector("#auth-confirm").required = isRegister;
    overlay.querySelector("#auth-password").autocomplete = isRegister ? "new-password" : "current-password";
    overlay.querySelector(".account-auth-visual-eyebrow").textContent = I18n.t("auth.visualEyebrow");
    overlay.querySelector(".account-auth-visual-title").textContent = I18n.t("auth.visualTitle");
    overlay.querySelector(".account-auth-visual-description").textContent = I18n.t("auth.visualDescription");
    overlay.querySelector(".account-auth-point-one").textContent = I18n.t("auth.visualPoint1");
    overlay.querySelector(".account-auth-point-two").textContent = I18n.t("auth.visualPoint2");
    overlay.querySelector(".account-auth-point-three").textContent = I18n.t("auth.visualPoint3");
    overlay.querySelector(".account-auth-mode-label").textContent = I18n.t("auth.title");
    overlay.querySelector("#auth-title").textContent = I18n.t(isRegister ? "auth.registerTitle" : "auth.loginTitle");
    overlay.querySelector("#auth-description").textContent = I18n.t(isRegister ? "auth.registerDescription" : "auth.loginDescription");
    overlay.querySelector(".account-auth-local-notice").textContent = I18n.t("auth.localNotice");
    overlay.querySelector(".account-auth-close").setAttribute("aria-label", I18n.t("common.close"));
    overlay.querySelector("label[for='auth-display-name']").textContent = I18n.t("auth.displayName");
    overlay.querySelector("label[for='auth-email']").textContent = I18n.t("auth.email");
    overlay.querySelector("label[for='auth-password']").textContent = I18n.t("auth.password");
    overlay.querySelector("label[for='auth-confirm']").textContent = I18n.t("auth.confirmPassword");
    overlay.querySelector("#auth-submit").textContent = isRegister ? I18n.t("auth.register") : I18n.t("auth.signIn");
    overlay.querySelector("#auth-switch").textContent = isRegister ? I18n.t("auth.switchLogin") : I18n.t("auth.switchRegister");
    overlay.querySelector("#auth-error").textContent = "";
  }

  async function submit(event) {
    event.preventDefault();
    const form = event.currentTarget;
    const email = form.querySelector("#auth-email").value;
    const password = form.querySelector("#auth-password").value;
    const error = form.querySelector("#auth-error");
    const submitButton = form.querySelector("#auth-submit");
    submitButton.disabled = true;
    error.textContent = "";
    try {
      if (mode === "register") {
        const confirmPassword = form.querySelector("#auth-confirm").value;
        if (password !== confirmPassword) throw new Error("Passwords do not match.");
        await AuthService.register({ email, password, displayName: form.querySelector("#auth-display-name").value });
        showToast?.(I18n.t("auth.successRegister"));
      } else {
        await AuthService.signIn({ email, password });
        showToast?.(I18n.t("auth.successLogin"));
      }
      close();
    } catch (authError) {
      error.textContent = authError instanceof Error ? authError.message : I18n.t("common.error");
    } finally {
      submitButton.disabled = false;
    }
  }

  function open(nextMode = "login") {
    const overlay = ensureDialog();
    lastFocusedElement = document.activeElement;
    setMode(nextMode);
    overlay.classList.remove("hidden");
    overlay.setAttribute("aria-hidden", "false");
    document.body.classList.add("overlay-open");
    focusFirstField(overlay);
  }

  function close() {
    const overlay = document.getElementById("auth-overlay");
    if (!overlay || overlay.classList.contains("hidden")) return;
    overlay.classList.add("hidden");
    overlay.setAttribute("aria-hidden", "true");
    document.body.classList.remove("overlay-open");
    lastFocusedElement?.focus?.();
    lastFocusedElement = null;
  }

  function renderNavbar() {
    const target = document.getElementById("user-nav-actions");
    if (!target) return;
    const user = AuthService.getCurrentUser();
    target.innerHTML = user
      ? `<span class="user-chip">👤 ${escapeHtml(user.displayName)}</span><button class="btn btn-outline btn-sm" type="button" onclick="AuthUI.signOut()">${I18n.t("nav.signOut")}</button>`
      : `<button class="btn btn-ghost btn-sm" type="button" onclick="AuthUI.open('login')">${I18n.t("nav.signIn")}</button><button class="btn btn-primary btn-sm" type="button" onclick="AuthUI.open('register')">${I18n.t("nav.register")}</button>`;
  }

  function signOut() {
    AuthService.signOut();
    showToast?.(I18n.t("nav.signOut"));
  }

  window.AuthUI = { open, close, signOut, renderNavbar };
  window.addEventListener("echo:authchange", renderNavbar);
  window.addEventListener("echo:languagechange", () => { renderNavbar(); setMode(mode); });
  window.addEventListener("DOMContentLoaded", renderNavbar);
})();
