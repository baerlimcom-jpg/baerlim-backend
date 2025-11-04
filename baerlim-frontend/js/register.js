const form = document.getElementById("registerForm");
const msg = document.getElementById("message");

form.addEventListener("submit", async (e) => {
  e.preventDefault();
  msg.textContent = "";

  const username = form.username.value.trim();
  const email = form.email.value.trim();
  const pass = form.password.value;
  const rep = form.repeat.value;

  // Prüfen ob Passwörter gleich sind
  if (pass !== rep) {
    msg.textContent = "⚠️ Passwörter stimmen nicht überein.";
    msg.style.color = "red";
    return;
  }

  try {
    // Anfrage ans Backend
    const res = await fetch("https://baerlim-backend.onrender.com/auth/register", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ username, email, password: pass }),
    });

    // Antwort als JSON lesen
    const data = await res.json();

    if (!res.ok) {
      // Wenn der Server einen Fehlerstatus zurückgibt
      msg.textContent = data.msg || "❌ Fehler bei der Registrierung.";
      msg.style.color = "red";
      console.error("Serverfehler:", data);
    } else {
      msg.textContent = data.msg || "✅ Registrierung erfolgreich! Bitte E-Mail prüfen.";
      msg.style.color = "green";
      form.reset(); // Formular leeren
    }
  } catch (err) {
    // Wenn Render oder das Netz nicht erreichbar ist
    msg.textContent = "❌ Server nicht erreichbar. Bitte später erneut versuchen.";
    msg.style.color = "red";
    console.error("Fetch-Fehler:", err);
  }
});
