(function () {
  let mode = "login";

  function ensureDialog() {
    let overlay = document.getElementById("auth-overlay");
    if (overlay) return overlay;
    overlay = document.createElement("div");
    overlay.id = "auth-overlay";
    overlay.className = "auth-overlay hidden";
    overlay.innerHTML = `<section class="auth-card" role="dialog" aria-modal="true" aria-labelledby="auth-title">
      <button class="auth-close" type="button" aria-label="Close">✕</button>
      <p class="eyebrow">Echo Wall</p>
      <h2 id="auth-title"></h2>
      <p class="auth-notice"></p>
      <form id="auth-form" novalidate>
        <div class="form-group auth-display-name"><label class="form-label" for="auth-display-name"></label><input id="auth-display-name" class="form-input" maxlength="50" autocomplete="name" /></div>
        <div class="form-group"><label class="form-label" for="auth-email"></label><input id="auth-email" class="form-input" type="email" autocomplete="email" required /></div>
        <div class="form-group"><label class="form-label" for="auth-password"></label><input id="auth-password" class="form-input" type="password" autocomplete="current-password" minlength="8" required /></div>
        <div class="form-group auth-confirm"><label class="form-label" for="auth-confirm"></label><input id="auth-confirm" class="form-input" type="password" autocomplete="new-password" minlength="8" /></div>
        <p id="auth-error" class="auth-error" role="alert"></p>
        <button id="auth-submit" class="btn btn-primary btn-full btn-lg" type="submit"></button>
      </form>
      <button id="auth-switch" class="btn btn-ghost btn-full" type="button"></button>
    </section>`;
    document.body.appendChild(overlay);
    overlay.addEventListener("click", event => { if (event.target === overlay) close(); });
    overlay.querySelector(".auth-close").addEventListener("click", close);
    overlay.querySelector("#auth-switch").addEventListener("click", () => setMode(mode === "login" ? "register" : "login"));
    overlay.querySelector("#auth-form").addEventListener("submit", submit);
    return overlay;
  }

  function setMode(nextMode) {
    mode = nextMode;
    const overlay = ensureDialog();
    const isRegister = mode === "register";
    overlay.querySelector(".auth-display-name").classList.toggle("hidden", !isRegister);
    overlay.querySelector(".auth-confirm").classList.toggle("hidden", !isRegister);
    overlay.querySelector("#auth-title").textContent = I18n.t("auth.title");
    overlay.querySelector(".auth-notice").textContent = I18n.t("auth.localNotice");
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
    setMode(nextMode);
    overlay.classList.remove("hidden");
    document.body.classList.add("overlay-open");
    requestAnimationFrame(() => overlay.querySelector(mode === "register" ? "#auth-display-name" : "#auth-email")?.focus());
  }

  function close() {
    document.getElementById("auth-overlay")?.classList.add("hidden");
    document.body.classList.remove("overlay-open");
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
