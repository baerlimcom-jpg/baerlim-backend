const form = document.getElementById("registerForm");
const msg = document.getElementById("message");

form.addEventListener("submit", async (e) => {
  e.preventDefault();
  msg.textContent = "";

  const username = form.username.value.trim();
  const email = form.email.value.trim();
  const pass = form.password.value;
  const rep = form.repeat.value;

  if (pass !== rep) return msg.textContent = "Passwörter stimmen nicht überein.";

  const res = await fetch("https://<DEIN-BACKEND-URL>/api/auth/register", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ username, email, password: pass })
  });

  const data = await res.json();
  msg.textContent = data.msg || "Fehler bei Registrierung";
});
