function registerDownloadButtons() {
  document
    .getElementById("downloadPNG")
    .addEventListener("click", () => {
      downloadCollage("png");
    });

  document
    .getElementById("downloadJPG")
    .addEventListener("click", () => {
      downloadCollage("jpeg");
    });
}

async function waitForImages(container) {
  const images = container.querySelectorAll("img");

  const promises = Array.from(images).map((img) => {
    if (img.complete) {
      return Promise.resolve();
    }

    return new Promise((resolve) => {
      img.onload = resolve;
      img.onerror = resolve;
    });
  });

  return Promise.all(promises);
}

function waitForBackgroundImage(element) {
  return new Promise((resolve) => {
    const backgroundImage = window.getComputedStyle(element).backgroundImage;

    if (!backgroundImage || backgroundImage === "none") {
      resolve();
      return;
    }

    const imageUrl = backgroundImage.match(/url\(["']?([^"')]+)["']?\)/)?.[1];

    if (!imageUrl) {
      resolve();
      return;
    }

    const img = new Image();

    img.onload = () => resolve();
    img.onerror = () => resolve();
    img.src = imageUrl;
  });
}

async function downloadCollage(format) {
  const element = document.getElementById("export-area");

  toggleLoading(true);

  try {
    await waitForImages(element);
    await waitForBackgroundImage(element);

    await new Promise((resolve) => setTimeout(resolve, 300));

    const canvas = await html2canvas(element, {
      scale: 4,
      useCORS: false,
      backgroundColor: null,
      logging: false,
    });

    const extension = format === "jpeg" ? "jpg" : "png";

    const mimeType = `image/${format}`;

    const fileName = `Kolase-${Date.now()}.${extension}`;

    canvas.toBlob(
      (blob) => {
        const link = document.createElement("a");

        link.download = fileName;

        link.href = URL.createObjectURL(blob);

        document.body.appendChild(link);

        link.click();

        document.body.removeChild(link);

        URL.revokeObjectURL(link.href);

        showToast();
      },
      mimeType,
      1.0
    );
  } catch (error) {
    console.error("Download gagal:", error);

    alert("Terjadi kesalahan saat download.");
  }

  toggleLoading(false);
}