const isLoggedIn = localStorage.getItem("isLoggedIn");

const authItems = document.querySelectorAll(".nav-auth");
const loginForm = document.getElementById("loginForm");
const logoutBtn = document.getElementById("logoutBtn");
// Dynamische IDs aus dem Container auslesen
const container = document.getElementById("entriesContainer");
const subject_id = container.dataset.subjectId;
const page_id = container.dataset.pageId;


if (isLoggedIn === "true") {
  authItems.forEach(el => el.style.display = "block");
  loginForm.style.display = "none";
} else {
  authItems.forEach(el => el.style.display = "none");
  logoutBtn.style.display = "none";
}

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

logoutBtn.addEventListener("click", () => {
  localStorage.removeItem("isLoggedIn");
  location.reload();
});

postBtn.addEventListener("click", async () => {
  const text = document.getElementById("postText").value;
  const imageInput = document.getElementById("postImage");
  const file = imageInput.files[0];

  if (!text && !file) {
    alert("Bitte Text oder Bild eingeben");
    return;
  }

  const formData = new FormData();
  formData.append("text", text);
  if (file) formData.append("image", file);

  formData.append("subject_id", subject_id);
  formData.append("page_id", page_id);

  const response = await fetch("http://localhost:3000/entries", {
    method: "POST",
    body: formData,
  });

  if (response.ok) {
    alert("Beitrag gespeichert ✅");
    loadEntries();
    document.getElementById("postText").value = "";
    document.getElementById("postImage").value = "";
  } else {
    alert("Fehler beim Speichern ❌");
  }
});

async function loadEntries() {
  const res = await fetch(`http://localhost:3000/entries?subject_id=${subject_id}&page_id=${page_id}`);
  const entries = await res.json();

  container.innerHTML = ""; // vorher leeren

  entries.forEach(entry => {
    const div = document.createElement("div");
    div.className = "card mb-3";

    div.innerHTML = `
      <div class="card-body">
        <strong>${entry.username}</strong>
        <p>${entry.text}</p>
        ${entry.image_url ? `<img src="${entry.image_url}" class="img-fluid mt-2">` : ""}
      </div>
    `;

    container.appendChild(div);
  });
}

loadEntries();

