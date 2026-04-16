const bootText = document.getElementById("boot-text");
const input = document.getElementById("boot-input");
const modeSelect = document.getElementById("mode-select");

const lines = [
    "ROBCO Industries (TM) Unified Operating System",
    "Copyright 2075-2077 ROBCO",
    "",
    "Inititalising Archive Terminal...",
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

let i = 0;

function typeLine() {
    text = lines.join("\n");
    if (i < text.length) {
        bootText.textContent += text[i];
        i++;
        setTimeout(typeLine, 15);
    } else {
        modeSelect.hidden = false;
        input.focus();
    }
}

typeLine();

input.addEventListener("keydown", (e) => {
    if (e.key === "Enter") {
        const value = input.value.trim();
        if (value === "1") {
            localStorage.setItem("mode", "cli");
            window.location.href = "terminal.html";
        }
        else if (value === "2") {
            localStorage.setItem("mode", "gui");
            window.location.href = "pipboy.html";
        }
        // else: just ignore invalid input
        input.value = "";
    }
});