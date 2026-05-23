function updateCounter() {
  document.getElementById("photo-counter").innerText = photoData.length;
}

function toggleLoading(show) {
  const loading = document.getElementById("loading-text");

  if (show) {
    loading.classList.remove("hidden");
  } else {
    loading.classList.add("hidden");
  }
}

function showToast() {
  const toastElement = document.getElementById("successToast");

  const toast = new bootstrap.Toast(toastElement, {
    delay: 3000,
  });

  toast.show();
}