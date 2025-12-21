const bootText = document.getElementById("boot-text");
const input = document.getElementById("boot-input");
const modeSelect = document.getElementById("mode-select");

const lines = [
  "ROBCO INDUSTRIES UNIFIED OPERATING SYSTEM",
  "COPYRIGHT 2075-2077 ROBCO",
  "----------------------------------------",
  "INITIALIZING ARCHIVE TERMINAL...",
  "MEMORY CHECK: OK",
  "NETWORK STATUS: ONLINE",
  "",
];

let i = 0;

function typeLine() {
  if (i < lines.length) {
    bootText.textContent += lines[i] + "\n";
    i++;
    setTimeout(typeLine, 300);
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

