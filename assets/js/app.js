const fileInput = document.getElementById("fileInput");
const uploadBtn = document.getElementById("uploadBtn");
const resetBtn = document.getElementById("resetBtn");
const dropZone = document.getElementById("drop-zone");

const logoSelector = document.getElementById("logoSelector");
const backgroundSelector = document.getElementById("backgroundSelector");
const exportPresetSelector = document.getElementById("exportPresetSelector");
const headerLogo = document.getElementById("header-logo");
const exportLogo = document.getElementById("export-logo");
const activityTitle = document.getElementById("activity-title");
const activityDate = document.getElementById("activity-date");
const collageContainer = document.getElementById("collage-container");
const exportArea = document.getElementById("export-area");

function applyCollageBackground(value) {
  exportArea.style.backgroundColor = "transparent";
  exportArea.style.backgroundImage = `linear-gradient(rgba(255, 255, 255, 0.3), rgba(255, 255, 255, 0.3)), url("${value}")`;
  exportArea.style.backgroundSize = "100% 100%";
  exportArea.style.backgroundPosition = "center";
  exportArea.style.backgroundRepeat = "no-repeat";

  collageContainer.style.backgroundColor = "transparent";
  collageContainer.style.backgroundImage = "none";
}

function applyExportPreset(value) {
  exportArea.classList.remove("export-area-fixed12");

  if (value === "fixed12") {
    exportArea.classList.add("export-area-fixed12");
  }

  setExportPreset(value);
  updateCollage();
}

logoSelector.addEventListener("change", () => {
  headerLogo.src = logoSelector.value;
  exportLogo.src = logoSelector.value;
});

backgroundSelector.addEventListener("change", (event) => {
  applyCollageBackground(event.target.value);
});

exportPresetSelector.addEventListener("change", (event) => {
  applyExportPreset(event.target.value);
});

applyCollageBackground(backgroundSelector.value);
applyExportPreset(exportPresetSelector.value);

activityTitle.addEventListener("input", () => {
  document.getElementById("export-title").innerText =
    activityTitle.value || "Judul Kegiatan";
});

activityDate.addEventListener("change", () => {
  const selectedDate = new Date(activityDate.value);

  const formattedDate = selectedDate.toLocaleDateString("id-ID", {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
  });

  document.getElementById("export-date").innerText = formattedDate;
});

uploadBtn.addEventListener("click", () => {
  fileInput.click();
});

fileInput.addEventListener("change", handleFileUpload);

resetBtn.addEventListener("click", resetCollage);

window.addEventListener("paste", handlePaste);

registerDragDrop();
registerTemplateButtons();
registerDownloadButtons();

