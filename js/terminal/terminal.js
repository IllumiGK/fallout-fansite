const screenEl = document.getElementById("screen");
const input = document.getElementById("terminal-input");
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
        `Welcome to ${s.header.join("\n")}

${Object.keys(s.options || {}).map(x => `[ > ${capitaliseWords(x)}]`).join("\n")}

`;

    isTyping = true;

    typeText({
        element: screenEl,
        text: headerBlock,
        speed: 15,
        onComplete: () => {
            console.log(isTyping);
            isTyping = false;
            console.log(isTyping);
            makeOptionsClickable();

        
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

function capitaliseWords(str) {
    return String(str) // ensures it's a string
        .split(" ") // split into words
        .map(word => word.charAt(0).toUpperCase() + word.slice(1)) // capitalize first letter
        .join(" "); // join back into a string
}

function showHelp() {
    screenEl.textContent +=
        `
        \nCOMMANDS:
    > SELECT [option]
    > HELP`;
}

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

function makeOptionsClickable() {
    const s = screens[currentScreen];
    if (!s?.options) return;

    // Instead of clearing the screen, just find option lines
    const lines = screenEl.textContent.split("\n");

    screenEl.innerHTML = lines.map(line => {
        const trimmed = line.trim();
        // check if this line is one of the options
        if (s.options[trimmed.replace(/^\[ > |]$/g, '').toLowerCase()]) {
            return `<span class="option" data-option="${trimmed.replace(/^\[ > |]$/g, '').toLowerCase()}" style="cursor:pointer;display:block;">${line}</span>`;
        } else {
            return line + "\n"; // keep header lines exactly as typed
        }
    }).join("");

    document.querySelectorAll(".option").forEach(el => {
        el.addEventListener("click", () => {
            const next = s.options[el.dataset.option];
            if (next) renderScreen(next);
        });
    });
}


