const form = document.getElementById("loginForm");
const msg = document.getElementById("message");

form.addEventListener("submit", async (e) => {
  e.preventDefault();
  msg.textContent = "";

  const email = form.email.value.trim();
  const password = form.password.value;

  const res = await fetch("https://<DEIN-BACKEND-URL>/api/auth/login", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email, password })
  });

  const data = await res.json();
  msg.textContent = data.msg || "Fehler beim Login";

  if (res.ok) {
    localStorage.setItem("token", data.token);
    window.location.href = "index.html";
  }
});
