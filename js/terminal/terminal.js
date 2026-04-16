const screenEl = document.getElementById("screen");
const input = document.getElementById("terminal-input");
const content = document.getElementById("content");
const statusBar = document.getElementById("terminal-status");

let currentScreen = "main";
let isTyping = false;

const state = {
    status: "ONLINE",
    entries: 0,
    mode: "CLI"
}


// RENDERING LAYER + NAVIGATION LAYER:
function renderScreen(id) {
    if (state.entries !== 0) state.entries = 0;
    if (isTyping) return;

    const s = screens[id];
    if (!s) return;

    currentScreen = id;
    screenEl.innerHTML = "";
    content.innerHTML = "";

    const headerBlock =
        `${s.header.join("\n")}

${Object.keys(s.options || {}).map(x => `[ > ${capitaliseWords(x)}]`).join("\n")}

`;

    isTyping = true;

    screenEl.textContent = headerBlock;
    
    pageCont = contents[s.contentKey];

    if (s.contentKey && pageCont) {
        textBlock = pageCont.find(x => x.type === "text")
        content.textContent = textBlock.text;
    
    }

    renderStatus();
    
                    
    isTyping = false;
    makeOptionsClickable();

}

// NAVIGATION LAYER:
// Makes CLI Navigation + Tracks Entries
input.addEventListener("keydown", (e) => {
    if (e.key !== "Enter" || isTyping) return;
    
    state.entries += 1;
    renderStatus();

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

// Makes Click Navigation
function makeOptionsClickable() {
    const s = screens[currentScreen];
    if (!s?.options) return;

    // Instead of clearing the screen, just find option lines
    const lines = screenEl.textContent.split("\n");

   screenEl.innerHTML = lines.map(line => {
        const trimmed = line.trim();

        const newLine = trimmed
            .replace("[ > ", "")
            .replace("]", "");

        const key = trimmed
            .replace("[ > ", "")
            .replace("]", "")
            .toLowerCase();

        if (s.options[key]) {
            return `<span class="option" data-option="${key}" style="cursor:pointer;display:block;">${newLine}</span>`;
        } else {
            return line + "\n";
        }
    }).join("");




    document.querySelectorAll(".option").forEach(el => {
        el.addEventListener("click", () => {
            const next = s.options[el.dataset.option];
            if (next) renderScreen(next);
        });
    });
}

// Shows Help Prompts For CLI Navigation
function showHelp() {
    screenEl.textContent +=
        `
        \nCOMMANDS:
    > SELECT [option]
    > HELP`;
}

// TYPING ENGINE:
// Types text out letter by letter
function typeText({element, text, speed, onComplete = () => { }, onChar = () => { }}) {
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

// Capitalises Words
function capitaliseWords(str) {
    return String(str) // ensures it's a string
        .split(" ") // split into words
        .map(word => word.charAt(0).toUpperCase() + word.slice(1)) // capitalize first letter
        .join(" "); // join back into a string
}

// STATUS BAR:
function renderStatus() {
    statusBar.textContent =
    `STATUS: ${state.status} | ENTRIES: ${state.entries} | MODE: ${state.mode}`;
}

// RUN:
renderScreen("main");
input.focus();






