(function () {
  const USERS_KEY = "echo-wall-users:v1";
  const SESSION_KEY = "echo-wall-user-session:v1";

  function readUsers() {
    try {
      const parsed = JSON.parse(localStorage.getItem(USERS_KEY) || "[]");
      return Array.isArray(parsed) ? parsed : [];
    } catch {
      return [];
    }
  }

  function writeUsers(users) {
    localStorage.setItem(USERS_KEY, JSON.stringify(users));
  }

  async function digest(value) {
    const bytes = new TextEncoder().encode(value);
    const hash = await crypto.subtle.digest("SHA-256", bytes);
    return Array.from(new Uint8Array(hash), byte => byte.toString(16).padStart(2, "0")).join("");
  }

  function sanitizeUser(user) {
    if (!user) return null;
    return {
      id: String(user.id),
      email: String(user.email),
      displayName: String(user.displayName),
      createdAt: String(user.createdAt),
    };
  }

  function getCurrentUser() {
    try {
      const session = JSON.parse(localStorage.getItem(SESSION_KEY) || "null");
      if (!session?.userId) return null;
      const user = readUsers().find(item => item.id === session.userId);
      return sanitizeUser(user);
    } catch {
      return null;
    }
  }

  async function register({ email, displayName, password }) {
    const normalizedEmail = String(email || "").trim().toLowerCase();
    const cleanName = String(displayName || "").trim().slice(0, 50);
    if (!/^\S+@\S+\.\S+$/.test(normalizedEmail)) throw new Error("Enter a valid email address.");
    if (cleanName.length < 2) throw new Error("Display name must contain at least 2 characters.");
    if (String(password || "").length < 8) throw new Error("Password must contain at least 8 characters.");

    const users = readUsers();
    if (users.some(user => user.email === normalizedEmail)) throw new Error("An account with this email already exists.");
    const user = {
      id: `user_${Date.now()}_${Math.random().toString(36).slice(2, 8)}`,
      email: normalizedEmail,
      displayName: cleanName,
      passwordHash: await digest(String(password)),
      createdAt: new Date().toISOString(),
    };
    users.push(user);
    writeUsers(users);
    localStorage.setItem(SESSION_KEY, JSON.stringify({ userId: user.id, createdAt: new Date().toISOString() }));
    notify();
    return sanitizeUser(user);
  }

  async function signIn({ email, password }) {
    const normalizedEmail = String(email || "").trim().toLowerCase();
    const passwordHash = await digest(String(password || ""));
    const user = readUsers().find(item => item.email === normalizedEmail && item.passwordHash === passwordHash);
    if (!user) throw new Error("Incorrect email or password.");
    localStorage.setItem(SESSION_KEY, JSON.stringify({ userId: user.id, createdAt: new Date().toISOString() }));
    notify();
    return sanitizeUser(user);
  }

  function signOut() {
    localStorage.removeItem(SESSION_KEY);
    notify();
  }

  function notify() {
    window.dispatchEvent(new CustomEvent("echo:authchange", { detail: { user: getCurrentUser() } }));
  }

  window.AuthService = {
    provider: "local-prototype",
    register,
    signIn,
    signOut,
    getCurrentUser,
    isAuthenticated: () => Boolean(getCurrentUser()),
  };
})();
