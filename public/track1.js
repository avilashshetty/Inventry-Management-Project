function checkStatus() {
      const id = document.getElementById("reportIdInput").value.trim().toUpperCase();
      const statusDisplay = document.getElementById("statusMessage");

      if (!id) {
        statusDisplay.innerText = "Please enter a valid Report ID.";
        return;
      }

      // Simulated Status Lookup
      if (id.startsWith("LST")) {
        statusDisplay.innerText = `Report ID: ${id} - Lost item is under review.`;
      } else if (id.startsWith("FND")) {
        statusDisplay.innerText = `Report ID: ${id} - Found item has been added to the listing.`;
      } else if (id.startsWith("CLM")) {
        statusDisplay.innerText = `Report ID: ${id} - Claim is being processed.`;
      }
      else {
        statusDisplay.innerText = "Invalid Report ID. Please check and try again.";
      }
    }
    // Modal handling
function openModal(id) {
  document.getElementById(id).style.display = 'flex';
}

function closeModal(id) {
  document.getElementById(id).style.display = 'none';
}

function switchModal() {
  closeModal('loginModal');
  openModal('registerModal');
}

window.onclick = function(e) {
  ['loginModal', 'registerModal'].forEach(id => {
    const modal = document.getElementById(id);
    if (e.target == modal) modal.style.display = "none";
  });
};

// Toast Notification
function showToast(message, color = "#4caf50") {
  const toast = document.getElementById("toast");
  toast.innerText = message;
  toast.style.backgroundColor = color;
  toast.style.display = "block";
  setTimeout(() => {
    toast.style.display = "none";
  }, 3000);
}

