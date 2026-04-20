// ====================
// DOM REFERENCES (HTML elements)
// ====================
const screenEl = document.getElementById("screen");
const input = document.getElementById("terminal-input");
const content = document.getElementById("content");
const statusBar = document.getElementById("terminal-status");
const output = document.getElementById("terminal-output");


// ====================
// STATE (data that changes during runtime)
// ====================
let currentScreen = "main";
let isTyping = false;

const state = {
    status: "ONLINE",
    entries: 0,
    mode: "CLI"
}


// ====================
// COMMAND SYSTEM
// ====================
const commands = {
    help : () => showHelp(),

    select : (arg) => {
        const next = screens[currentScreen]?.options?.[arg.toLowerCase()];

        if (!next) return;

        // if it's a command
        if (commands[next]) {
            commands[next]();
            return;
        }

        // otherwise treat as screen navigation
        renderScreen(next);
    },

    clear : () => {
        output.innerHTML = "";
    },

    boot : () => goTo("bootup.html", "boot"),

    play_radio: () => radio.play(radio.current || "diamond_city"),

    radio_diamond: () => radio.play("diamond_city"),

    radio_galaxy: () => radio.play("galaxy_news"),
}




// ====================
// RENDERING (controls what is shown on screen) (* = action flow)
// ====================
function renderScreen(id) {
    
    if (isTyping) return;

    const s = screens[id];  // Gets Screen Content*
    if (!s) return;

    currentScreen = id;
    screenEl.innerHTML = "";
    content.innerHTML = "";
    output.innerHTML = "";

    const headerBlock = buildHeader(s);  // Builds Header* (& Options)

    isTyping = true;

    screenEl.textContent = headerBlock; // Renders Header* (& Options)
    
    renderContent(s);  // Renders Content*

    renderStatus();  // Renders Status Bar*
    
                    
    isTyping = false;
    makeOptionsClickable();  // Adds GUI Navigation*

}

// Builds Header for ScreenEl
function buildHeader(screen) {
    return `${screen.header.join("\n")}

${Object.keys(screen.options || {})
        .map(x => `[ > ${capitaliseWords(x)}]`)
        .join("\n")}

`;
}

// Renders Content
function renderContent(screen) {
    let pageCont = contents[screen.contentKey];

    if (!screen.contentKey || !pageCont) return;
 
    const textBlock = pageCont.find(x => x.type === "text")
    const videoBlock = pageCont.find(x => x.type === "video")

    const videoText = videoBlock ? videoBlock.src : "";
    const mainText = textBlock ? textBlock.text : "";

    content.textContent = [
        videoBlock.src,
        textBlock.text
    ].filter(Boolean).join("\n\n"); // creates a line of space between video and text

    
}


// ====================
// NAVIGATION / INPUT (user interactions)
// ====================
// Sets Up Keyboard Input For CLI Navigation + Tracks Entries
function setupKeyboardInput() {
    input.addEventListener("keydown", (e) => {
    if (e.key !== "Enter" || isTyping) return;
    
    state.entries += 1;
    renderStatus();

    const raw = input.value.trim().toLowerCase();
    input.value = "";

    if (!raw) return;

    const [command, ...args] = raw.split(" ");
    const arg = args.join(" ");
    const fn = commands[command]
    const prev = output.textContent;

    if (!fn) {
        output.textContent = "error: unknown command";

        setTimeout(() => {
            output.textContent = prev;
        }, 2500);

        return;
    }
        


    if (typeof fn !== "function") return console.log("(not function) Unknown command:", command);

    fn(arg);
    });
}

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
            if (!next) return;

            if (commands[next]) {
                commands[next]();
            } else {
                renderScreen(next);
            }
        });
    });
}

// Navigate between webpages
function goTo(page, mode) {
    localStorage.setItem("mode", mode);
    window.location.href = page;
}


// ====================
// UI FUNCTIONS (small UI updates)
// ====================
// Renders Status Bar
function renderStatus() {
    statusBar.textContent =
    `STATUS: ${state.status} | ENTRIES: ${state.entries} | MODE: ${state.mode}`;
}
// Shows/Renders Help Prompts For CLI Navigation
function showHelp() {
    output.textContent +=
        `COMMANDS: > SELECT [option], > CLEAR`;
}


// ==================
// RADIO
// ==================
const radio = {
    current: null,
    isPlaying: false,

    stations: {
        diamond_city: "PLxprHD0XC6ct27PHzErvjgfExoHXaTr0s",
        galaxy_news: "PLxprHD0XC6cvYi0OQsn7Fbbv_vHWcCKye"
    },

    play(station) {
        if (!window.YT || !YT.Player) {
            console.error("YouTube API not ready yet");
            return;
        }

        this.current = station;
        this.isPlaying = true;

        createRadioOverlay(this.stations[station]);
    },

    stop() {
        this.isPlaying = false;
        removeRadioOverlay();
        radioPlayer = null;
    },

    setVolume(value) {
        if (radioPlayer) {
            radioPlayer.setVolume(value);
        }
    },

    pause() {
        if (radioPlayer) {
            radioPlayer.pauseVideo();
        }
    }
};


let radioPlayer;

function createRadioOverlay(playlistId) {
    removeRadioOverlay();

    const container = document.createElement("div");
    container.id = "radio-overlay";

    const playerDiv = document.createElement("div");
    playerDiv.id = "radio-player";

    const controls = document.createElement("div");
    controls.innerHTML = `
        <button id="radio-stop">Stop</button>
        <button id="radio-volume-down">Volume -</button>
    `;

    container.appendChild(playerDiv);
    container.appendChild(controls);
    document.body.appendChild(container);

    // bind AFTER creation (correct)
    document.getElementById("radio-stop").onclick = () => radio.stop();
    document.getElementById("radio-volume-down").onclick = () => radio.setVolume(20);

    radioPlayer = new YT.Player("radio-player", {
        height: "200",
        width: "320",
        playerVars: {
            listType: "playlist",
            list: playlistId,
            autoplay: 1
        },
        events: {
            onReady: (event) => {
                event.target.setVolume(30);
            }
        }
    });
}

function removeRadioOverlay() {
    const el = document.getElementById("radio-overlay");
    if (el) el.remove();
}

// ====================
// UTILITIES (reusable helpers)
// ====================
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



// ====================
// INIT (runs when page loads)
// ====================
function init() {
    setupKeyboardInput();
    input.focus();
    renderScreen("main");

}

init();





