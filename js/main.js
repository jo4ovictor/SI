// Atualiza ano do rodapé
const yearEl = document.getElementById('year');
if (yearEl) yearEl.textContent = new Date().getFullYear();

// Registra Service Worker (Disponibilidade)
if ('serviceWorker' in navigator) {
  window.addEventListener('load', () => {
    navigator.serviceWorker.register('/js/sw.js').catch(err => console.warn('ServiceWorker failed:', err));
  });
}

// Gera token simples anti-CSRF (simulação didática)
function generateCSRFToken() {
  const arr = new Uint8Array(16);
  crypto.getRandomValues(arr);
  return Array.from(arr, b => b.toString(16).padStart(2, '0')).join('');
}

// Preenche campo CSRF se existir
const csrfInput = document.getElementById('csrf');
if (csrfInput) csrfInput.value = generateCSRFToken();

// Funções de Web Crypto (usadas na versão avançada — mantemos helpers)
async function getKeyMaterial(password) {
  const enc = new TextEncoder();
  return crypto.subtle.importKey('raw', enc.encode(password), 'PBKDF2', false, ['deriveBits', 'deriveKey']);
}
async function getKey(keyMaterial, salt) {
  return crypto.subtle.deriveKey(
    { name: 'PBKDF2', salt: new TextEncoder().encode(salt), iterations: 100000, hash: 'SHA-256' },
    keyMaterial,
    { name: 'AES-GCM', length: 256 },
    false,
    ['encrypt', 'decrypt']
  );
}

// Manipula formulário de contato com criptografia no cliente (Confidencialidade — simulação)
const form = document.getElementById('contactForm');
if (form) {
  form.addEventListener('submit', async (e) => {
    e.preventDefault();

    // Honeypot: se preenchido, provavelmente é bot
    const honeypot = document.getElementById('company');
    if (honeypot && honeypot.value.trim() !== '') {
      showStatus('Requisição bloqueada (honeypot).', true);
      return;
    }

    // Validação básica 
    const name = document.getElementById('name').value.trim();
    const email = document.getElementById('email').value.trim();
    const message = document.getElementById('message').value.trim();
    if (name.length < 3 || message.length < 10 || !/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(email)) {
      showStatus('Por favor, preencha os campos corretamente.', true);
      return;
    }

    try {
      // --- Versão demonstrativa: AES-GCM com chave derivada localmente (NÃO usar em produção) ---
      const keyMaterial = await getKeyMaterial('chave-demo-nao-usar-em-producao');
      const key = await getKey(keyMaterial, 'salt-demo');

      const iv = crypto.getRandomValues(new Uint8Array(12));
      const encoder = new TextEncoder();
      const payload = JSON.stringify({ name, email, message });
      const ciphertext = await crypto.subtle.encrypt(
        { name: 'AES-GCM', iv },
        key,
        encoder.encode(payload)
      );

      // Converte para base64 para envio/armazenamento (exibição parcial apenas)
      const ctBase64 = btoa(String.fromCharCode(...new Uint8Array(ciphertext)));
      const ivHex = Array.from(iv, b => b.toString(16).padStart(2, '0')).join('');

      // Em produção, enviar via fetch() para endpoint HTTPS que aceite o iv+data e faça a decriptação segura no servidor
      // Exemplo (comentado):
      // await fetch('/api/contact', {
      //   method: 'POST',
      //   headers: { 'Content-Type': 'application/json' },
      //   body: JSON.stringify({ iv: ivHex, data: ctBase64, csrf: csrfInput?.value })
      // });

      showStatus('Mensagem criptografada localmente (simulação). IV=' + ivHex + ' • Dados=' + ctBase64.slice(0, 32) + '...', false);
      form.reset();
      if (csrfInput) csrfInput.value = generateCSRFToken();
    } catch (err) {
      console.error(err);
      showStatus('Erro ao criptografar a mensagem.', true);
    }
  });
}

function showStatus(text, isError) {
  const el = document.getElementById('status');
  if (!el) return;
  el.textContent = text;
  el.style.color = isError ? '#ff6b6b' : '#9fb3c8';
}