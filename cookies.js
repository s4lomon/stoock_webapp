// cookies.js

// Função utilitária (opcional) para criar um cookie tradicional
export function setCookie(name, value, days) {
  const expires = days
    ? "; expires=" + new Date(Date.now() + days * 864e5).toUTCString()
    : "";
  document.cookie = `${name}=${encodeURIComponent(value || "")}${expires}; path=/`;
}

// Função utilitária (opcional) para ler um cookie
export function getCookie(name) {
  const match = document.cookie.match(
    new RegExp("(^| )" + name + "=([^;]+)")
  );
  return match ? decodeURIComponent(match[2]) : null;
}

// Exibe o banner de consentimento (usa localStorage, mas você pode trocar para cookie se preferir)
export function checkCookieConsent() {
  // Se já aceitou, não faz nada
  if (localStorage.getItem("cookieAccepted")) return;

  const banner = document.createElement("div");
  banner.innerHTML = `
    <div style="
      position: fixed;
      bottom: 20px;
      left: 20px;
      background: white;
      padding: 12px 20px;
      border-radius: 12px;
      box-shadow: 0 0 10px rgba(0,0,0,0.2);
      font-family: sans-serif;
      z-index: 1000;
    ">
      🍪 Cookies? <br/>
      <button id="acceptCookies" style="
        margin-top: 10px;
        background: #007bff;
        color: white;
        border: none;
        padding: 6px 12px;
        border-radius: 6px;
        cursor: pointer;
      ">Accept ✓</button>
    </div>
  `;
  document.body.appendChild(banner);

  document.getElementById("acceptCookies").onclick = () => {
    // Marca consentimento (pode ser cookie ou localStorage)
    localStorage.setItem("cookieAccepted", "true");
    // — ou, se preferir: setCookie("cookieConsent", "true", 365);
    banner.remove();
  };
}

// Auto-inicializa quando o DOM estiver pronto
document.addEventListener("DOMContentLoaded", checkCookieConsent);
