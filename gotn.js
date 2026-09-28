document.addEventListener("DOMContentLoaded", () => {
  const inviteButtons = document.querySelectorAll(".btn-invite");
  const questionModal = document.getElementById("questionModal");
  const successModal = document.getElementById("successModal");

  const btnYes = document.getElementById("btnYes");
  const btnNo = document.getElementById("btnNo");
  const closeSuccess = document.getElementById("closeSuccess");
  const choiceBox = document.getElementById("choiceBox");
  const modalText = document.getElementById("modalText");
  const modalContent = questionModal.querySelector(".modal-content");

  const DEFAULT_TEXT = "Выбери один из вариантов ответа ниже:";
  const TEASES = [
    "Ой, промахнулась 🙈",
    "Не так быстро 🐾",
    "Кнопка «Нет» сломалась 🥺",
    "Ну пожалуйста… 🥹",
    "Может, всё-таки «Да»? 🥰",
    "Она не хочет, чтобы её нажимали ✨",
    "Я буду очень грустить 🥺",
    "Ты же знаешь, что нужно нажать 🤍"
  ];
  let dodges = 0;

  // ---------- Таймер до концерта ----------
  function plural(n, a, b, c) {
    const m = n % 10, h = n % 100;
    if (h > 10 && h < 20) return c;
    if (m === 1) return a;
    if (m > 1 && m < 5) return b;
    return c;
  }

  function updateCountdowns() {
    document.querySelectorAll(".countdown").forEach(el => {
      const diff = new Date(el.dataset.date) - new Date();
      if (diff <= 0) {
        el.textContent = "🎶 уже идёт или прошёл";
        return;
      }
      const d = Math.floor(diff / 864e5);
      const h = Math.floor((diff % 864e5) / 36e5);
      const m = Math.floor((diff % 36e5) / 6e4);
      el.textContent = `⏳ через ${d} ${plural(d, "день", "дня", "дней")} ${h} ч ${m} мин`;
    });
  }
  updateCountdowns();
  setInterval(updateCountdowns, 30000);

  // ---------- Возврат кнопки «Нет» на место ----------
  function resetNo() {
    btnNo.classList.remove("runaway");
    btnNo.style.position = "";
    btnNo.style.left = "";
    btnNo.style.top = "";
    btnNo.style.zIndex = "";
    btnNo.style.display = "";
    if (btnNo.parentElement !== choiceBox) choiceBox.appendChild(btnNo);
    dodges = 0;
    modalText.textContent = DEFAULT_TEXT;
  }

  // 1. Открытие первого окна
  inviteButtons.forEach(btn => {
    btn.addEventListener("click", () => {
      resetNo();
      questionModal.classList.add("active");
    });
  });

  // 2. Побег кнопки «Нет»
  function moveButton(button) {
    if (!button.classList.contains("runaway")) {
      const r = button.getBoundingClientRect();
      button.classList.add("runaway");
      button.style.position = "fixed";
      button.style.zIndex = "10005";
      button.style.left = r.left + "px";
      button.style.top = r.top + "px";
      // Выносим в body, иначе fixed считается от окна с transform
      document.body.appendChild(button);
      void button.offsetWidth;
    }

    const pad = 30;
    const maxX = window.innerWidth - button.offsetWidth - pad;
    const maxY = window.innerHeight - button.offsetHeight - pad;

    button.style.left = `${Math.random() * (maxX - pad) + pad}px`;
    button.style.top = `${Math.random() * (maxY - pad) + pad}px`;

    modalText.textContent = TEASES[dodges % TEASES.length];
    dodges++;

    modalContent.classList.remove("shake");
    void modalContent.offsetWidth;
    modalContent.classList.add("shake");
  }

  btnNo.addEventListener("mouseenter", () => moveButton(btnNo));
  btnNo.addEventListener("touchstart", (e) => {
    e.preventDefault();
    moveButton(btnNo);
  });
  btnNo.addEventListener("click", () => moveButton(btnNo));

  // 3. «Да»
  btnYes.addEventListener("click", () => {
    resetNo(); // «Нет» возвращается в окно и не висит на экране
    questionModal.classList.remove("active");
    successModal.classList.add("active");
    confetti();
    setTimeout(confetti, 500);
  });

  // 4. Закрытие финального окна
  closeSuccess.addEventListener("click", () => {
    successModal.classList.remove("active");
  });

  // ---------- Салют из эмодзи ----------
  const canvas = document.getElementById("fx");
  const ctx = canvas.getContext("2d");
  let W, H, dpr;

  function resize() {
    dpr = Math.min(window.devicePixelRatio || 1, 2);
    W = window.innerWidth;
    H = window.innerHeight;
    canvas.width = W * dpr;
    canvas.height = H * dpr;
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
  }
  resize();
  window.addEventListener("resize", resize);

  const EMOJI = ["🎉", "🤍", "✨", "🐾", "🎶", "🌸"];
  const parts = [];
  let running = false;

  function confetti() {
    for (let i = 0; i < 20; i++) {
      const a = Math.random() * Math.PI * 2;
      const s = 5 + Math.random() * 11;
      parts.push({
        x: W / 2,
        y: H / 2,
        vx: Math.cos(a) * s,
        vy: Math.sin(a) * s - 6,
        size: 18 + Math.random() * 20,
        rot: Math.random() * 6.28,
        vr: (Math.random() - 0.5) * 0.3,
        e: EMOJI[Math.floor(Math.random() * EMOJI.length)],
        life: 1
      });
    }
    if (!running) {
      running = true;
      requestAnimationFrame(loop);
    }
  }

  function loop() {
    ctx.clearRect(0, 0, W, H);
    for (let i = parts.length - 1; i >= 0; i--) {
      const p = parts[i];
      p.vy += 0.22;
      p.vx *= 0.99;
      p.x += p.vx;
      p.y += p.vy;
      p.rot += p.vr;
      p.life -= 0.009;
      if (p.life <= 0 || p.y > H + 50) {
        parts.splice(i, 1);
        continue;
      }
      ctx.save();
      ctx.globalAlpha = Math.min(p.life * 1.5, 1);
      ctx.translate(p.x, p.y);
      ctx.rotate(p.rot);
      ctx.font = p.size + 'px "Apple Color Emoji","Segoe UI Emoji",sans-serif';
      ctx.textAlign = "center";
      ctx.textBaseline = "middle";
      ctx.fillText(p.e, 0, 0);
      ctx.restore();
    }
    if (parts.length) {
      requestAnimationFrame(loop);
    } else {
      running = false;
      ctx.clearRect(0, 0, W, H);
    }
  }
});