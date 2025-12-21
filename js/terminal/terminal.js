const screenEl = document.getElementById("screen");
const input = document.getElementById("cmd");
const content = document.getElementById("content");

let currentScreen = "main";
let isTyping = false;

function renderScreen(id) {
  if (isTyping) return;

  const s = screens[id];
  if (!s) return;

  currentScreen = id;
  content.innerHTML = "";

  const headerBlock =
`---------------------------------------------------
${s.header.map(h => `> ${h}`).join("\n")}
---------------------------------------------------
${Object.keys(s.options || {})
  .map(o => `> ${o}`)
  .join("\n")}
---------------------------------------------------`;

  isTyping = true;

  typeText({
    element: screenEl,
    text: headerBlock,
    speed: 15,
    onComplete: () => {
      isTyping = false;

      if (contentRenderers[id]) {
        content.innerHTML = contentRenderers[id]();
        makeOptionsClickable();
      }
    }
  });
}

renderScreen("main");
input.focus();

input.addEventListener("keydown", (e) => {
  if (e.key !== "Enter" || isTyping) return;

  const raw = input.value.trim().toLowerCase();
  input.value = "";

  if (!raw) return;

  if (raw === "help") return showHelp();

  if (raw.startsWith("select ")) {
    const choice = raw.replace("select ", "");
    const next = screens[currentScreen]?.options?.[choice];
    if (next) renderScreen(next);
  }
});


function showHelp() {
  screenEl.textContent +=
`\nCOMMANDS:
> select [option]
> help`;
}

function typeText({
  element,
  text,
  speed = 20,
  onComplete = () => {},
  onChar = () => {}
}) {
  let i = 0;
  element.textContent = "";

  function tick() {
    if (i < text.length) {
      element.textContent += text[i];
      onChar(text[i]); // ← sound hook lives here later
      i++;
      setTimeout(tick, speed);
    } else {
      onComplete();
    }
  }

  tick();
}

function makeOptionsClickable() {
  const lines = screenEl.textContent.split("\n");

  screenEl.innerHTML = lines.map(line => {
    if (line.startsWith("> ") && screens[currentScreen]?.options?.[line.slice(2).toLowerCase()]) {
      return `<span class="option" data-option="${line.slice(2).toLowerCase()}">${line}</span>`;
    }
    return line;
  }).join("\n");

  document.querySelectorAll(".option").forEach(el => {
    el.addEventListener("click", () => {
      const next = screens[currentScreen].options[el.dataset.option];
      renderScreen(next);
    });
  });
}

