// ---------- PERSONALIZE ME ----------
const CONFIG = {
  herName: "",                     // e.g. "Name of girl" — leave empty to skip a name
  signatureName: "Habibjon",       // shown at the bottom + used in the final message
  pickupHint: "I'm coming to get you 🚗",
  // Where her answer gets emailed to you.
  // 1) go to https://web3forms.com, enter your email, get a free "Access Key" (no password, 1 min).
  // 2) paste that key below.
  web3formsAccessKey: "016f4e7c-258a-411c-8a20-4de870ea1983",
  notifyEmail: "habibjonkadirovv@gmail.com",
};
// -------------------------------------

const state = { date: "", time: "", food: "" };

function showStep(id) {
  document.querySelectorAll("[data-step]").forEach((el) => (el.hidden = true));
  document.getElementById(id).hidden = false;
}

// ----- floating petals background -----
function spawnPetals() {
  const host = document.getElementById("petals");
  const emojis = ["🌸", "💮", "🌷", "♡"];
  const count = window.innerWidth < 480 ? 14 : 22;
  for (let i = 0; i < count; i++) {
    const p = document.createElement("span");
    p.className = "petal";
    p.textContent = emojis[Math.floor(Math.random() * emojis.length)];
    p.style.left = Math.random() * 100 + "vw";
    p.style.fontSize = 14 + Math.random() * 14 + "px";
    p.style.animationDuration = 8 + Math.random() * 10 + "s";
    p.style.animationDelay = Math.random() * 10 + "s";
    host.appendChild(p);
  }
}

// ----- step 1: the ask -----
const btnNo = document.getElementById("btn-no");
let noOrigin = null; // btn-no's natural (untransformed) position within the card

function dodge(e) {
  if (e) e.preventDefault();
  const stage = document.getElementById("step-ask");
  const stageRect = stage.getBoundingClientRect();

  if (!noOrigin) {
    btnNo.style.transform = "none";
    const rect = btnNo.getBoundingClientRect();
    noOrigin = {
      x: rect.left - stageRect.left,
      y: rect.top - stageRect.top,
      w: rect.width,
      h: rect.height,
    };
  }

  const maxX = stage.clientWidth - noOrigin.w - 16;
  const maxY = stage.clientHeight - noOrigin.h - 16;
  const targetX = 16 + Math.random() * Math.max(0, maxX - 16);
  const targetY = 16 + Math.random() * Math.max(0, maxY - 16);

  btnNo.style.transform = `translate(${targetX - noOrigin.x}px, ${targetY - noOrigin.y}px)`;
}

// dodge before a click can ever land: pointerdown fires first on both touch and mouse
btnNo.addEventListener("pointerdown", dodge);
btnNo.addEventListener("pointerenter", dodge); // desktop: also dodge on hover, before the press
btnNo.addEventListener("click", dodge); // belt-and-suspenders fallback

document.getElementById("btn-yes").addEventListener("click", () => {
  showStep("step-reaction");
});

// ----- step 2: reaction -----
document.getElementById("btn-reaction-next").addEventListener("click", () => {
  showStep("step-date");
});

// ----- step 3: date & time -----
const inputDate = document.getElementById("input-date");
const inputTime = document.getElementById("input-time");
const btnDateNext = document.getElementById("btn-date-next");

(function fillTimeOptions() {
  for (let h = 10; h <= 21; h++) {
    for (const m of [0, 30]) {
      if (h === 21 && m === 30) continue;
      const period = h < 12 ? "AM" : "PM";
      const hour12 = h % 12 === 0 ? 12 : h % 12;
      const label = `${hour12}:${m === 0 ? "00" : "30"} ${period}`;
      const opt = document.createElement("option");
      opt.value = label;
      opt.textContent = label;
      inputTime.appendChild(opt);
    }
  }
})();

inputDate.min = new Date().toISOString().split("T")[0];

function checkDateReady() {
  btnDateNext.disabled = !(inputDate.value && inputTime.value);
}
inputDate.addEventListener("change", checkDateReady);
inputTime.addEventListener("change", checkDateReady);

btnDateNext.addEventListener("click", () => {
  state.date = inputDate.value;
  state.time = inputTime.value;
  showStep("step-food");
});

// ----- step 4: food -----
const foodGrid = document.getElementById("food-grid");
const btnFoodNext = document.getElementById("btn-food-next");

foodGrid.addEventListener("click", (e) => {
  const opt = e.target.closest(".food-opt");
  if (!opt) return;
  foodGrid.querySelectorAll(".food-opt").forEach((b) => b.classList.remove("selected"));
  opt.classList.add("selected");
  state.food = opt.dataset.food;
  btnFoodNext.disabled = false;
});

btnFoodNext.addEventListener("click", () => {
  const dateLabel = state.date
    ? new Date(state.date + "T00:00:00").toLocaleDateString(undefined, {
        weekday: "long",
        month: "long",
        day: "numeric",
      })
    : "";
  document.getElementById("confirm-title").textContent =
    `glad you didn't say no. be ready by ${state.time || "then"} on ${dateLabel}, ${CONFIG.pickupHint}`;
  showStep("step-confirm");
});

// ----- step 5: accept -----
document.getElementById("btn-accept").addEventListener("click", async () => {
  burstConfetti();
  await sendNotification();
  document.getElementById("sent-msg").textContent =
    `${state.food || "food"}, ${state.time || ""} on ${state.date || ""} — see you then 🤍`;
  showStep("step-sent");
});

// ----- send the answer to you -----
async function sendNotification() {
  if (!CONFIG.web3formsAccessKey || CONFIG.web3formsAccessKey === "YOUR_WEB3FORMS_ACCESS_KEY") {
    console.warn("Set CONFIG.web3formsAccessKey in script.js to receive her answer by email.");
    return;
  }
  try {
    await fetch("https://api.web3forms.com/submit", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        access_key: CONFIG.web3formsAccessKey,
        email: CONFIG.notifyEmail,
        subject: "she said yes 💌",
        from_name: CONFIG.herName || "her",
        message: `Date: ${state.date}\nTime: ${state.time}\nFood: ${state.food}`,
      }),
    });
  } catch (err) {
    console.error("Could not send notification:", err);
  }
}

// ----- confetti (no external dependency) -----
function burstConfetti() {
  const colors = ["#ec4899", "#f9a8d4", "#c9a6e0", "#fecdd3"];
  for (let i = 0; i < 60; i++) {
    const piece = document.createElement("div");
    piece.style.position = "fixed";
    piece.style.left = "50%";
    piece.style.top = "40%";
    piece.style.width = "8px";
    piece.style.height = "8px";
    piece.style.borderRadius = Math.random() > 0.5 ? "50%" : "2px";
    piece.style.background = colors[Math.floor(Math.random() * colors.length)];
    piece.style.zIndex = 999;
    piece.style.pointerEvents = "none";
    document.body.appendChild(piece);

    const angle = Math.random() * Math.PI * 2;
    const distance = 120 + Math.random() * 200;
    const dx = Math.cos(angle) * distance;
    const dy = Math.sin(angle) * distance - 100;

    piece.animate(
      [
        { transform: "translate(0,0) rotate(0deg)", opacity: 1 },
        { transform: `translate(${dx}px, ${dy}px) rotate(${Math.random() * 720}deg)`, opacity: 0 },
      ],
      { duration: 900 + Math.random() * 600, easing: "cubic-bezier(.2,.7,.3,1)" }
    ).onfinish = () => piece.remove();
  }
}

// ----- init -----
document.getElementById("signature").textContent = CONFIG.signatureName;
if (CONFIG.herName) {
  const heading = document.querySelector("#step-ask h1");
  heading.textContent = `🌸 Will you go on a date with me, ${CONFIG.herName}? 🌸`;
}
spawnPetals();
