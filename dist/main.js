const data = window.nossaHistoria;
const photoSrc = number => `./fotos/foto-${String(number).padStart(2, "0")}.jpeg`;
const allPhotos = [];
const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

document.querySelector("#hero-description").textContent = data.hero;
document.querySelector("#intro-message").textContent = data.introducao[0];
document.querySelector("#intro-message-two").textContent = data.introducao[1];
document.querySelector("#big-quote").textContent = data.fraseGrande;
document.querySelector("#letter-signature").textContent = data.assinatura;

for (const paragraph of data.carta) {
  const p = document.createElement("p");
  p.textContent = paragraph;
  document.querySelector("#letter-body").append(p);
}

function makePhoto(number, caption, className, index) {
  const button = document.createElement("button");
  button.className = `photo-frame ${className}`;
  button.type = "button";
  button.setAttribute("aria-label", `Ampliar foto ${number}: ${caption}`);
  const img = document.createElement("img");
  img.src = photoSrc(number);
  img.alt = caption;
  img.loading = "lazy";
  button.append(img);
  button.addEventListener("click", () => openPhoto(index));
  return button;
}

for (const [chapterIndex, chapter] of data.capitulos.entries()) {
  const row = document.createElement("article");
  row.className = `memory-row ${chapterIndex % 2 ? "reverse" : ""}`;
  const visual = document.createElement("div");
  visual.className = "memory-visual";
  const classes = ["memory-photo-main", "memory-photo-small", "memory-photo-tiny"];
  for (const [photoIndex, number] of chapter.fotos.entries()) {
    const caption = `${chapter.etiqueta.toLowerCase()}: ${chapter.titulo}`;
    const index = allPhotos.push({ number, caption }) - 1;
    visual.append(makePhoto(number, caption, classes[photoIndex], index));
  }
  const copy = document.createElement("div");
  copy.className = "memory-copy reveal";
  const number = document.createElement("span");
  number.className = "chapter-number";
  number.textContent = chapter.numero;
  const label = document.createElement("span");
  label.className = "chapter-label";
  label.textContent = chapter.etiqueta;
  const title = document.createElement("h3");
  title.textContent = chapter.titulo;
  const message = document.createElement("p");
  message.textContent = chapter.mensagem;
  const rule = document.createElement("div");
  rule.className = "chapter-rule";
  copy.append(number, label, title, message, rule);
  row.append(visual, copy);
  document.querySelector("#memory-list").append(row);
}

const boxPhotoCards = [];
for (const [i, item] of data.galeria.entries()) {
  const index = allPhotos.push({ number: item.foto, caption: item.legenda }) - 1;
  const boxCard = document.createElement("button");
  boxCard.className = "box-photo";
  boxCard.type = "button";
  boxCard.tabIndex = -1;
  boxCard.setAttribute("aria-label", `Ampliar foto ${i + 1}: ${item.legenda}`);
  const boxImage = document.createElement("img");
  boxImage.src = photoSrc(item.foto);
  boxImage.alt = item.legenda;
  boxImage.loading = "lazy";
  const boxMark = document.createElement("span");
  boxMark.textContent = `${String(i + 1).padStart(2, "0")} ♡`;
  boxCard.append(boxImage, boxMark);
  boxCard.addEventListener("click", () => openPhoto(index));
  document.querySelector("#box-photo-layer").append(boxCard);
  boxPhotoCards.push(boxCard);
  const button = document.createElement("button");
  button.className = "gallery-item reveal";
  button.type = "button";
  button.setAttribute("aria-label", `Ampliar foto: ${item.legenda}`);
  const frame = document.createElement("span");
  frame.className = "photo-frame";
  const img = document.createElement("img");
  img.src = photoSrc(item.foto);
  img.alt = item.legenda;
  img.loading = "lazy";
  frame.append(img);
  const label = document.createElement("span");
  label.className = "gallery-number";
  label.textContent = String(i + 1).padStart(2, "0") + " ♡";
  button.append(frame, label);
  button.addEventListener("click", () => openPhoto(index));
  document.querySelector("#gallery-grid").append(button);
}

const boxScroll = document.querySelector("#box-scroll");
const boxCount = document.querySelector("#box-count");
const boxCaption = document.querySelector("#box-caption");
let boxActiveIndex = -1;
function updateBoxScroll() {
  if (reducedMotion) return;
  const rect = boxScroll.getBoundingClientRect();
  const travel = Math.max(1, rect.height - window.innerHeight);
  const position = Math.max(0, Math.min(1, -rect.top / travel));
  const timeline = position * boxPhotoCards.length;
  const active = Math.min(boxPhotoCards.length - 1, Math.max(0, Math.floor(timeline - .7)));
  const mobile = window.innerWidth <= 760;
  const stageWidth = window.innerWidth;
  const stageHeight = window.innerHeight;
  const originX = mobile ? 0 : -stageWidth * .39;
  const originY = mobile ? stageHeight * .37 : stageHeight * .25;
  boxPhotoCards.forEach((card, index) => {
    const local = timeline - index;
    const entering = Math.max(0, Math.min(1, local));
    const eased = entering * entering * (3 - 2 * entering);
    const leaving = index === boxPhotoCards.length - 1 ? 0 : Math.max(0, Math.min(1, local - 1));
    const outDirection = index % 2 ? -1 : 1;
    const x = originX * (1 - eased) + outDirection * stageWidth * .28 * leaving;
    const y = originY * (1 - eased) - stageHeight * .16 * leaving;
    const scale = .27 + .73 * eased - .24 * leaving;
    card.style.transform = `translate(-50%, -50%) translate3d(${x.toFixed(1)}px, ${y.toFixed(1)}px, ${(90 * eased).toFixed(1)}px) rotateX(${(-67 * (1 - eased) + 12 * leaving).toFixed(1)}deg) rotateY(${(18 * (1 - eased)).toFixed(1)}deg) rotateZ(${((-1 + (index % 5)) * 2 * eased + outDirection * 12 * leaving).toFixed(1)}deg) scale(${scale.toFixed(3)})`;
    const fadeIn = Math.max(0, Math.min(1, (entering - .35) * 2.5));
    const fadeOut = Math.max(0, Math.min(1, (leaving - .42) * 3));
    card.style.opacity = String(fadeIn * (1 - fadeOut));
    card.style.zIndex = String(index === active ? 5 : 3);
    card.tabIndex = index === active && entering > .7 && leaving < .3 ? 0 : -1;
    card.style.pointerEvents = card.tabIndex === 0 ? "auto" : "none";
  });
  if (active !== boxActiveIndex) {
    boxActiveIndex = active;
    boxCount.textContent = `${String(active + 1).padStart(2, "0")} / ${String(boxPhotoCards.length).padStart(2, "0")}`;
    boxCaption.textContent = data.galeria[active].legenda;
  }
  document.querySelector("#box-progress-fill").style.width = `${position * 100}%`;
}
function sizeBoxScroll() {
  if (!reducedMotion) boxScroll.style.height = `${Math.round(window.innerHeight * (1 + boxPhotoCards.length * (window.innerWidth <= 760 ? .43 : .37)))}px`;
  updateBoxScroll();
}
window.addEventListener("resize", sizeBoxScroll);
window.addEventListener("scroll", updateBoxScroll, { passive: true });
sizeBoxScroll();

const orbitScene = document.querySelector("#orbit-scene");
const orbitTrack = document.querySelector("#orbit-track");
const orbitCards = data.carrossel.map((item, index) => {
  const button = document.createElement("button");
  button.className = "orbit-card";
  button.type = "button";
  button.setAttribute("aria-label", `Foto ${index + 1}: ${item.legenda}`);
  const img = document.createElement("img");
  img.src = photoSrc(item.foto);
  img.alt = item.legenda;
  img.loading = "lazy";
  const mark = document.createElement("span");
  mark.className = "orbit-card-mark";
  mark.textContent = "♡";
  button.append(img, mark);
  orbitTrack.append(button);
  return button;
});

let activeOrbit = 0;
let ignoreOrbitClickUntil = 0;
function renderOrbit() {
  const count = orbitCards.length;
  const step = window.innerWidth < 500 ? 139 : window.innerWidth < 760 ? 172 : 270;
  orbitCards.forEach((card, index) => {
    const slot = ((index - activeOrbit + count + Math.floor(count / 2)) % count) - Math.floor(count / 2);
    const distance = Math.abs(slot);
    card.style.transform = reducedMotion
      ? `translate(-50%, -50%) translateX(${slot * step}px) scale(${1 - distance * .14})`
      : `translate(-50%, -50%) translate3d(${slot * step}px, ${distance * 17}px, ${-distance * 115}px) rotateY(${-slot * 29}deg) rotateZ(${slot * 3}deg) scale(${1 - distance * .11})`;
    card.style.opacity = String(distance === 0 ? 1 : distance === 1 ? .82 : .4);
    card.style.zIndex = String(10 - distance);
    card.dataset.active = String(distance === 0);
    card.setAttribute("aria-current", distance === 0 ? "true" : "false");
  });
  document.querySelector("#orbit-count").textContent = `${String(activeOrbit + 1).padStart(2, "0")} / ${String(count).padStart(2, "0")}`;
  document.querySelector("#orbit-caption").textContent = data.carrossel[activeOrbit].legenda;
}
function moveOrbit(delta) {
  activeOrbit = (activeOrbit + delta + orbitCards.length) % orbitCards.length;
  renderOrbit();
}
orbitCards.forEach((card, index) => card.addEventListener("click", () => {
  if (Date.now() < ignoreOrbitClickUntil) return;
  if (index !== activeOrbit) {
    activeOrbit = index;
    renderOrbit();
    return;
  }
  const photoIndex = allPhotos.findIndex(photo => photo.number === data.carrossel[index].foto);
  if (photoIndex >= 0) openPhoto(photoIndex);
}));
document.querySelector("#orbit-prev").addEventListener("click", () => moveOrbit(-1));
document.querySelector("#orbit-next").addEventListener("click", () => moveOrbit(1));
orbitScene.addEventListener("keydown", event => {
  if (event.key === "ArrowLeft" || event.key === "ArrowRight") {
    event.preventDefault();
    moveOrbit(event.key === "ArrowLeft" ? -1 : 1);
  }
});
let dragStartX = null;
orbitScene.addEventListener("pointerdown", event => { dragStartX = event.clientX; });
orbitScene.addEventListener("pointerup", event => {
  if (dragStartX === null) return;
  const distance = event.clientX - dragStartX;
  dragStartX = null;
  if (Math.abs(distance) > 35) {
    ignoreOrbitClickUntil = Date.now() + 350;
    moveOrbit(distance < 0 ? 1 : -1);
  }
});
orbitScene.addEventListener("pointercancel", () => { dragStartX = null; });
window.addEventListener("resize", renderOrbit);
renderOrbit();

if (!reducedMotion && "IntersectionObserver" in window) {
  let orbitVisible = false;
  let orbitPaused = false;
  let orbitTimer;
  const syncOrbitTimer = () => {
    clearInterval(orbitTimer);
    if (orbitVisible && !orbitPaused && !document.hidden) {
      orbitTimer = setInterval(() => moveOrbit(1), 5200);
    }
  };
  new IntersectionObserver(entries => {
    orbitVisible = entries[0].isIntersecting;
    syncOrbitTimer();
  }, { threshold: .35 }).observe(document.querySelector(".orbit-section"));
  orbitScene.addEventListener("pointerenter", () => { orbitPaused = true; syncOrbitTimer(); });
  orbitScene.addEventListener("pointerleave", () => { orbitPaused = false; syncOrbitTimer(); });
  orbitScene.addEventListener("focusin", () => { orbitPaused = true; syncOrbitTimer(); });
  orbitScene.addEventListener("focusout", event => {
    if (!orbitScene.contains(event.relatedTarget)) { orbitPaused = false; syncOrbitTimer(); }
  });
  document.addEventListener("visibilitychange", syncOrbitTimer);
}

const photoDialog = document.querySelector("#photo-dialog");
let activePhoto = 0;
function showPhoto(index) {
  activePhoto = (index + allPhotos.length) % allPhotos.length;
  const photo = allPhotos[activePhoto];
  const img = document.querySelector("#dialog-image");
  img.src = photoSrc(photo.number);
  img.alt = photo.caption;
  document.querySelector("#dialog-caption").textContent = photo.caption;
}
function openPhoto(index) {
  showPhoto(index);
  photoDialog.showModal();
  document.body.classList.add("dialog-open");
}
document.querySelector(".photo-prev").addEventListener("click", () => showPhoto(activePhoto - 1));
document.querySelector(".photo-next").addEventListener("click", () => showPhoto(activePhoto + 1));
photoDialog.querySelector(".dialog-close").addEventListener("click", () => photoDialog.close());
photoDialog.addEventListener("close", () => document.body.classList.remove("dialog-open"));
photoDialog.addEventListener("click", event => { if (event.target === photoDialog) photoDialog.close(); });
photoDialog.addEventListener("keydown", event => {
  if (event.key === "ArrowLeft") showPhoto(activePhoto - 1);
  if (event.key === "ArrowRight") showPhoto(activePhoto + 1);
});

const letterDialog = document.querySelector("#letter-dialog");
document.querySelector("#open-letter").addEventListener("click", () => {
  letterDialog.showModal();
  document.body.classList.add("dialog-open");
});
letterDialog.querySelector(".dialog-close").addEventListener("click", () => letterDialog.close());
letterDialog.addEventListener("close", () => document.body.classList.remove("dialog-open"));
letterDialog.addEventListener("click", event => { if (event.target === letterDialog) letterDialog.close(); });

if ("IntersectionObserver" in window && !reducedMotion) {
  const observer = new IntersectionObserver(entries => {
    for (const entry of entries) {
      if (entry.isIntersecting) {
        entry.target.classList.add("visible");
        observer.unobserve(entry.target);
      }
    }
  }, { threshold: 0.12, rootMargin: "0px 0px -30px 0px" });
  document.querySelectorAll(".reveal,.memory-row").forEach(el => observer.observe(el));
} else {
  document.querySelectorAll(".reveal,.memory-row").forEach(el => el.classList.add("visible"));
}

let scrollQueued = false;
function onScroll() {
  if (scrollQueued) return;
  scrollQueued = true;
  requestAnimationFrame(() => {
    const scrollable = document.documentElement.scrollHeight - window.innerHeight;
    document.querySelector(".scroll-progress").style.width = `${scrollable > 0 ? (window.scrollY / scrollable) * 100 : 0}%`;
    if (!reducedMotion && window.scrollY < window.innerHeight * 1.5) {
      const offset = Math.min(window.scrollY, 700);
      document.querySelector(".hero-photo-front").style.translate = `0 ${offset * -0.11}px`;
      document.querySelector(".hero-photo-back").style.translate = `0 ${offset * 0.07}px`;
    }
    scrollQueued = false;
  });
}
window.addEventListener("scroll", onScroll, { passive: true });
onScroll();

const depthCards = [...document.querySelectorAll(
  ".hero-photo,.intro-main,.intro-small,.memory-photo-main,.memory-photo-small,.memory-photo-tiny,.gallery-item .photo-frame"
)];
depthCards.forEach((card, index) => {
  card.classList.add("depth-card");
  card.dataset.depth = card.classList.contains("hero-photo") ? "1.35" :
    card.classList.contains("memory-photo-main") ? "1.1" :
    card.classList.contains("gallery-item") ? ".7" :
    index % 2 ? ".85" : "1";
  card.dataset.stack = card.classList.contains("hero-photo-front") ? "55" :
    card.classList.contains("hero-photo-back") ? "-15" :
    card.classList.contains("intro-small") ? "40" :
    card.classList.contains("memory-photo-tiny") ? "45" :
    card.classList.contains("memory-photo-small") ? "25" : "0";
});

if (!reducedMotion) {
  let depthQueued = false;
  const moveDepthCards = () => {
    if (depthQueued) return;
    depthQueued = true;
    requestAnimationFrame(() => {
      const viewport = window.innerHeight;
      for (const [index, card] of depthCards.entries()) {
        const rect = card.getBoundingClientRect();
        if (rect.bottom < -100 || rect.top > viewport + 100) continue;
        const progress = Math.max(-1, Math.min(1,
          (rect.top + rect.height / 2 - viewport / 2) / (viewport / 2 + rect.height / 2)
        ));
        const depth = Number(card.dataset.depth);
        const direction = index % 2 ? -1 : 1;
        card.style.setProperty("--scroll-y", `${(-progress * 27 * depth).toFixed(1)}px`);
        const stack = Number(card.dataset.stack);
        card.style.setProperty("--scroll-z", `${(stack + (1 - Math.abs(progress)) * 12 * depth).toFixed(1)}px`);
        card.style.setProperty("--scroll-rx", `${(-progress * 10 * depth).toFixed(1)}deg`);
        card.style.setProperty("--scroll-ry", `${(progress * 9 * depth * direction).toFixed(1)}deg`);
      }
      depthQueued = false;
    });
  };
  window.addEventListener("scroll", moveDepthCards, { passive: true });
  window.addEventListener("resize", moveDepthCards);
  moveDepthCards();

  if (window.matchMedia("(hover: hover) and (pointer: fine)").matches) {
    depthCards.forEach(card => {
      card.addEventListener("pointermove", event => {
        const rect = card.getBoundingClientRect();
        const x = (event.clientX - rect.left) / rect.width - .5;
        const y = (event.clientY - rect.top) / rect.height - .5;
        card.style.setProperty("--pointer-rx", `${(-y * 17).toFixed(1)}deg`);
        card.style.setProperty("--pointer-ry", `${(x * 17).toFixed(1)}deg`);
      });
      card.addEventListener("pointerleave", () => {
        card.style.setProperty("--pointer-rx", "0deg");
        card.style.setProperty("--pointer-ry", "0deg");
      });
    });
  }
}
