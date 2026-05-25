
let photoData = [];
let currentTemplate = "modern";

function handleFileUpload(event) {
  const files = Array.from(event.target.files || []);

  files.forEach((file) => {
    processFile(file);
  });
}

function handlePaste(e) {
  const items = (e.clipboardData || e.originalEvent.clipboardData).items;

  for (let index in items) {
    const item = items[index];

    if (item.kind === "file" && item.type.includes("image")) {
      processFile(item.getAsFile());
    }
  }
}

async function processFile(file) {
  if (!file || !file.type.includes("image")) {
    return;
  }

  const img = new Image();

  img.onload = async function () {
    const canvas = document.createElement("canvas");
    const ctx = canvas.getContext("2d");

    // ===== RESIZE =====
    const MAX_WIDTH = 1400;

    let width = img.width;
    let height = img.height;

    if (width > MAX_WIDTH) {
      height = height * (MAX_WIDTH / width);
      width = MAX_WIDTH;
    }

    canvas.width = width;
    canvas.height = height;

    ctx.drawImage(img, 0, 0, width, height);

    // ===== COMPRESS =====
    canvas.toBlob(
      (blob) => {
        const optimizedUrl = URL.createObjectURL(blob);

        photoData.push(optimizedUrl);

        updateCollage();
      },
      "image/jpeg",
      0.82
    );
  };

  img.src = URL.createObjectURL(file);
}

function updateCollage() {
  const container = document.getElementById("collage-container");
  const actionButtons = document.getElementById("action-buttons");

  container.innerHTML = "";
  container.className = "collage-base";

  if (photoData.length === 1) {
    container.classList.add("grid-1");
  } else if (photoData.length === 2) {
    container.classList.add("grid-2");
  } else if (photoData.length === 3) {
    container.classList.add("grid-3");
  } else if (photoData.length >= 4) {
    container.classList.add("grid-many");
  }

  photoData.forEach((src) => {
    const div = document.createElement("div");

    div.className = "img-wrapper";

    div.innerHTML = `
      <img 
        src="${src}" 
        alt="photo"
        loading="lazy"
        decoding="async"
      >
    `;

    container.appendChild(div);
  });

  container.classList.remove("hidden");
  actionButtons.classList.remove("hidden");

  updateCounter();
}

function resetCollage() {
  photoData.forEach((url) => {
    URL.revokeObjectURL(url);
  });

  photoData = [];

  document.getElementById("collage-container").innerHTML = "";

  document
    .getElementById("collage-container")
    .classList.add("hidden");

  document.getElementById("action-buttons").classList.add("hidden");

  updateCounter();
}

function registerDragDrop() {
  dropZone.addEventListener("dragover", (e) => {
    e.preventDefault();
    dropZone.classList.add("dragover");
  });

  dropZone.addEventListener("dragleave", () => {
    dropZone.classList.remove("dragover");
  });

  dropZone.addEventListener("drop", (e) => {
    e.preventDefault();

    dropZone.classList.remove("dragover");

    const files = Array.from(e.dataTransfer.files || []);

    files.forEach((file) => {
      processFile(file);
    });
  });
}

function registerTemplateButtons() {
  const buttons = document.querySelectorAll(".template-btn");

  buttons.forEach((button) => {
    button.addEventListener("click", () => {
      currentTemplate = button.dataset.template;

      applyTemplate(currentTemplate);
    });
  });
}

function applyTemplate(templateName) {
  const container = document.getElementById("collage-container");

  if (templateName === "instagram") {
    container.style.borderRadius = "0px";
  } else if (templateName === "tni") {
    container.style.border = "10px solid #166534";
  } else {
    container.style.borderRadius = "30px";
    container.style.border = "none";
  }
}
