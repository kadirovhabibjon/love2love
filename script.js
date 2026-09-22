// ---------- PERSONALIZE ME ----------
const CONFIG = {
  herName: "My Honey",                     // e.g. "Name of girl" — leave empty to skip a name
  signatureName: "Habibjon",       // shown at the bottom + used in the final message
  // A single line shown before the question, to build anticipation.
  // Leave it "" to skip straight to the question.
  openingLine: "You are very beautiful. Your laugh is perfect. Just... you. All of it.",
  // Where her answer gets emailed to you.
  // 1) go to https://web3forms.com, enter your email, get a free "Access Key" (no password, 1 min).
  // 2) paste that key below.
  web3formsAccessKey: "016f4e7c-258a-411c-8a20-4de870ea1983",
  notifyEmail: "habibjonkadirovv@gmail.com",
};
// -------------------------------------

const state = { date: "", time: "", food: "", activity: "", movie: "", coffee: "", location: "" };

function showStep(id) {
  document.querySelectorAll("[data-step]").forEach((el) => (el.hidden = true));
  document.getElementById(id).hidden = false;
}

// ----- step 0: opening line -----
function startReasons() {
  if (!CONFIG.openingLine) {
    // nothing to go back to if this step is skipped entirely
    document.getElementById("btn-back-ask").style.display = "none";
    showStep("step-ask");
    return;
  }

  document.getElementById("reason-text").textContent = CONFIG.openingLine;

  document.getElementById("btn-reasons-next").addEventListener("click", () => {
    showStep("step-ask");
  });
}

// ----- back buttons -----
document.querySelectorAll("[data-back]").forEach((btn) => {
  btn.addEventListener("click", () => showStep(btn.dataset.back));
});

// ----- floating petals background -----
function spawnPetals() {
  const host = document.getElementById("petals");
  const emojis = ["🌸", "💮", "🌷", "♡"];
  const count = window.innerWidth < 480 ? 28 : 44;
  for (let i = 0; i < count; i++) {
    const p = document.createElement("span");
    p.className = "petal";
    p.textContent = emojis[Math.floor(Math.random() * emojis.length)];
    p.style.left = Math.random() * 100 + "vw";
    p.style.fontSize = 14 + Math.random() * 14 + "px";
    p.style.animationDuration = 3.5 + Math.random() * 4 + "s";
    p.style.animationDelay = Math.random() * 5 + "s";
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
  showStep("step-activity");
});

// ----- step 3: activity -----
const activityGrid = document.getElementById("activity-grid");
const btnActivityNext = document.getElementById("btn-activity-next");

activityGrid.addEventListener("click", (e) => {
  const opt = e.target.closest(".food-opt");
  if (!opt) return;
  activityGrid.querySelectorAll(".food-opt").forEach((b) => b.classList.remove("selected"));
  opt.classList.add("selected");
  state.activity = opt.dataset.activity;
  btnActivityNext.disabled = false;
});

btnActivityNext.addEventListener("click", () => {
  showDetailFor(state.activity);
});

// ----- step 4: activity detail (food / movie / coffee / location) -----
const detailFood = document.getElementById("detail-food");
const detailMovie = document.getElementById("detail-movie");
const detailCoffee = document.getElementById("detail-coffee");
const detailLocation = document.getElementById("detail-location");
const inputMovie = document.getElementById("input-movie");
const inputLocation = document.getElementById("input-location");
const inputCoffeeLocation = document.getElementById("input-coffee-location");
const inputFoodLocation = document.getElementById("input-food-location");
const btnDetailNext = document.getElementById("btn-detail-next");

function showDetailFor(activity) {
  detailFood.hidden = true;
  detailMovie.hidden = true;
  detailCoffee.hidden = true;
  detailLocation.hidden = true;

  if (activity === "Eating Out") {
    detailFood.hidden = false;
    btnDetailNext.disabled = !state.food;
  } else if (activity === "Movie") {
    detailMovie.hidden = false;
    btnDetailNext.disabled = !inputMovie.value.trim();
  } else if (activity === "Coffee") {
    detailCoffee.hidden = false;
    btnDetailNext.disabled = !state.coffee;
  } else {
    detailLocation.hidden = false;
    btnDetailNext.disabled = !inputLocation.value.trim();
  }
  showStep("step-detail");
}

inputMovie.addEventListener("input", () => {
  btnDetailNext.disabled = !inputMovie.value.trim();
});
inputLocation.addEventListener("input", () => {
  btnDetailNext.disabled = !inputLocation.value.trim();
});

// ----- coffee type (grid + custom text, same pattern as the food picker) -----
const coffeeGrid = document.getElementById("coffee-grid");
const inputCoffeeCustom = document.getElementById("input-coffee-custom");

coffeeGrid.addEventListener("click", (e) => {
  const opt = e.target.closest(".food-opt");
  if (!opt) return;
  coffeeGrid.querySelectorAll(".food-opt").forEach((b) => b.classList.remove("selected"));
  opt.classList.add("selected");
  inputCoffeeCustom.value = "";
  state.coffee = opt.dataset.coffee;
  btnDetailNext.disabled = false;
});

inputCoffeeCustom.addEventListener("input", () => {
  const custom = inputCoffeeCustom.value.trim();
  if (custom) {
    coffeeGrid.querySelectorAll(".food-opt").forEach((b) => b.classList.remove("selected"));
    state.coffee = custom;
    btnDetailNext.disabled = false;
  } else {
    const selected = coffeeGrid.querySelector(".food-opt.selected");
    state.coffee = selected ? selected.dataset.coffee : "";
    btnDetailNext.disabled = !state.coffee;
  }
});

btnDetailNext.addEventListener("click", () => {
  state.movie = inputMovie.value.trim();
  if (state.activity === "Coffee") {
    state.location = inputCoffeeLocation.value.trim();
  } else if (state.activity === "Eating Out") {
    state.location = inputFoodLocation.value.trim();
  } else {
    state.location = inputLocation.value.trim();
  }
  showStep("step-date");
});

// ----- step 5: date & time -----
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

  const dateLabel = state.date
    ? new Date(state.date + "T00:00:00").toLocaleDateString(undefined, {
        weekday: "long",
        month: "long",
        day: "numeric",
      })
    : "";
  document.getElementById("confirm-title").textContent =
    `glad you didn't say no. be ready by ${state.time || "then"} on ${dateLabel} 💕`;
  showStep("step-confirm");
});

const foodGrid = document.getElementById("food-grid");
const inputFoodCustom = document.getElementById("input-food-custom");

foodGrid.addEventListener("click", (e) => {
  const opt = e.target.closest(".food-opt");
  if (!opt) return;
  foodGrid.querySelectorAll(".food-opt").forEach((b) => b.classList.remove("selected"));
  opt.classList.add("selected");
  inputFoodCustom.value = "";
  state.food = opt.dataset.food;
  btnDetailNext.disabled = false;
});

inputFoodCustom.addEventListener("input", () => {
  const custom = inputFoodCustom.value.trim();
  if (custom) {
    foodGrid.querySelectorAll(".food-opt").forEach((b) => b.classList.remove("selected"));
    state.food = custom;
    btnDetailNext.disabled = false;
  } else {
    const selected = foodGrid.querySelector(".food-opt.selected");
    state.food = selected ? selected.dataset.food : "";
    btnDetailNext.disabled = !state.food;
  }
});

// ----- step 6: accept -----
function detailSummary() {
  if (state.activity === "Eating Out") return [state.food, state.location].filter(Boolean).join(" @ ");
  if (state.activity === "Movie") return state.movie;
  if (state.activity === "Coffee") return [state.coffee, state.location].filter(Boolean).join(" @ ");
  return state.location;
}

document.getElementById("btn-accept").addEventListener("click", async () => {
  burstConfetti();
  await sendNotification();
  const detail = detailSummary();
  const detailPart = detail ? `, ${detail}` : "";
  document.getElementById("sent-msg").textContent =
    `${state.activity || "our date"}${detailPart} — ${state.time || ""} on ${state.date || ""}. see you then 🤍`;
  showStep("step-sent");
});

// ----- send the answer to you -----
async function sendNotification() {
  if (!CONFIG.web3formsAccessKey || CONFIG.web3formsAccessKey === "YOUR_WEB3FORMS_ACCESS_KEY") {
    console.warn("Set CONFIG.web3formsAccessKey in script.js to receive her answer by email.");
    return;
  }
  try {
    const formData = new FormData();
    formData.append("access_key", CONFIG.web3formsAccessKey);
    formData.append("email", CONFIG.notifyEmail);
    formData.append("subject", "she said yes 💌");
    formData.append("name", CONFIG.herName || "her");
    formData.append(
      "message",
      `Date: ${state.date}\nTime: ${state.time}\nActivity: ${state.activity}\nDetail: ${detailSummary() || "-"}`
    );

    // plain FormData (not JSON) avoids a CORS preflight that web3forms doesn't answer
    const res = await fetch("https://api.web3forms.com/submit", {
      method: "POST",
      body: formData,
    });
    const data = await res.json();
    if (!data.success) console.error("Web3Forms rejected the submission:", data);
  } catch (err) {
    console.error("Could not send notification:", err);
  }
}

// ----- confetti (no external dependency) -----
function burstConfetti() {
  const hearts = ["❤️", "💗", "💕", "💖", "💘", "💝"];
  for (let i = 0; i < 50; i++) {
    const piece = document.createElement("div");
    piece.textContent = hearts[Math.floor(Math.random() * hearts.length)];
    piece.style.position = "fixed";
    piece.style.left = "50%";
    piece.style.top = "40%";
    piece.style.fontSize = 14 + Math.random() * 16 + "px";
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

// ----- add to calendar (.ics download) -----
function toICSDateTime(dateStr, timeStr, addHours = 0) {
  const [y, m, d] = dateStr.split("-").map(Number);
  const match = timeStr.match(/(\d+):(\d+)\s*(AM|PM)/i);
  let hour = 12;
  let min = 0;
  if (match) {
    hour = parseInt(match[1], 10) % 12;
    min = parseInt(match[2], 10);
    if (/PM/i.test(match[3])) hour += 12;
  }
  const dt = new Date(y, m - 1, d, hour, min);
  dt.setHours(dt.getHours() + addHours);
  const pad = (n) => String(n).padStart(2, "0");
  return `${dt.getFullYear()}${pad(dt.getMonth() + 1)}${pad(dt.getDate())}T${pad(dt.getHours())}${pad(dt.getMinutes())}00`;
}

function escapeICS(str) {
  return String(str)
    .replace(/\\/g, "\\\\")
    .replace(/;/g, "\\;")
    .replace(/,/g, "\\,")
    .replace(/\n/g, "\\n");
}

document.getElementById("btn-add-calendar").addEventListener("click", () => {
  if (!state.date || !state.time) return;

  const title = `${state.activity || "our date"} with ${CONFIG.signatureName}`;
  const detail = detailSummary();
  const lines = [
    "BEGIN:VCALENDAR",
    "VERSION:2.0",
    "PRODID:-//love2love//date//EN",
    "BEGIN:VEVENT",
    `UID:${Date.now()}@love2love`,
    `DTSTAMP:${toICSDateTime(new Date().toISOString().slice(0, 10), "12:00 PM")}`,
    `DTSTART:${toICSDateTime(state.date, state.time, 0)}`,
    `DTEND:${toICSDateTime(state.date, state.time, 2)}`,
    `SUMMARY:${escapeICS(title)}`,
    detail ? `DESCRIPTION:${escapeICS(detail)}` : "",
    state.location ? `LOCATION:${escapeICS(state.location)}` : "",
    "END:VEVENT",
    "END:VCALENDAR",
  ].filter(Boolean);

  const blob = new Blob([lines.join("\r\n")], { type: "text/calendar;charset=utf-8" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = "our-date.ics";
  document.body.appendChild(a);
  a.click();
  a.remove();
  URL.revokeObjectURL(url);
});

// ----- background music -----
const bgAudio = document.getElementById("bg-audio");
let musicPlaying = false;

function startMusic() {
  if (musicPlaying) return;
  bgAudio
    .play()
    .then(() => {
      musicPlaying = true;
    })
    .catch(() => {
      console.warn("Add a song.mp3 file next to index.html (or change #bg-audio's src) to enable music.");
    });
}

// browsers block audio-with-sound autoplay on page load, so start it on
// her very first tap/click anywhere on the page
document.addEventListener("pointerdown", startMusic, { once: true, capture: true });

// ----- init -----
document.getElementById("signature").textContent = CONFIG.signatureName;
if (CONFIG.herName) {
  const heading = document.querySelector("#step-ask h1");
  heading.textContent = `🌸 Will you go on a date with me, ${CONFIG.herName}? 🌸`;
}
spawnPetals();
startReasons();
