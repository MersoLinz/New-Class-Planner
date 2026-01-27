const isLoggedIn = localStorage.getItem("isLoggedIn");

const authItems = document.querySelectorAll(".nav-auth");
const loginForm = document.getElementById("loginForm");
const logoutBtn = document.getElementById("logoutBtn");

// Sichtbarkeit setzen
if (isLoggedIn === "true") {
  authItems.forEach(el => el.style.display = "block");
  if (loginForm) loginForm.style.display = "none";
} else {
  authItems.forEach(el => el.style.display = "none");
  if (logoutBtn) logoutBtn.style.display = "none";
}

// Login
if (loginForm) {
  loginForm.addEventListener("submit", async (e) => {
    e.preventDefault();

    const username = loginForm.username.value;
    const password = loginForm.password.value;

    const response = await fetch("http://localhost:3000/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ username, password })
    });

    if (response.ok) {
      localStorage.setItem("isLoggedIn", "true");
      location.reload();
    } else {
      alert("Login fehlgeschlagen");
    }
  });
}

// Logout
if (logoutBtn) {
  logoutBtn.addEventListener("click", () => {
    localStorage.removeItem("isLoggedIn");
    location.reload();
  });
}
