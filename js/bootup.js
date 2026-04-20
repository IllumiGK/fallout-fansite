
// ====================
// DOM REFERENCES
// ====================
const bootText = document.getElementById("boot-text");
const input = document.getElementById("boot-input");


// ====================
// STATE
// ====================
let i = 0;

const lines = [
    "ROBCO Industries (TM) Unified Operating System",
    "Copyright 2075-2077 ROBCO",
    "",
    "Initialising Archive Terminal...",
    "MEMORY CHECK: OK",
    "NETWORK STATUS: Online",
    "",
    "Welcome, User.",
    "",
    "Select Interface Mode:",
    "[1] Terminal (Classic)",
    "[2] Visual (PIP-BOY)",
    "",
];


// ====================
// BOOT SEQUENCE
// ====================
function typeBootSequence() {
    const text = lines.join("\n");

    if (i < text.length) {
        bootText.textContent += text[i];
        i++;
        setTimeout(typeBootSequence, 15);
    } else {
        input.focus();
    }
}


// ====================
// INPUT HANDLING
// ====================
function setupBootInput() {
    input.addEventListener("keydown", (e) => {
        if (e.key !== "Enter") return;

        const value = input.value.trim();

        if (value === "1") {
            navigateTo("terminal.html", "cli");
        }

        if (value === "2") {
            navigateTo("pipboy.html", "gui");
        }

        input.value = "";
    });
}


// ====================
// NAVIGATION
// ====================
function navigateTo(page, mode) {
    localStorage.setItem("mode", mode);
    window.location.href = page;
}


// ====================
// INIT
// ====================
function init() {
    setupBootInput();
    typeBootSequence();
    input.focus();
}

init();