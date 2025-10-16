// Modal Utils
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
  [ 'reportModal'].forEach(id => {
    const modal = document.getElementById(id);
    if (modal  === modal) modal.style.display = "none";
  });
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
  if (!toast) return;
  toast.innerText = message;
  toast.style.backgroundColor = color;
  toast.style.display = "block";
  setTimeout(() => { toast.style.display = "none"; }, 3000);
}

// Registration - Call backend API to save user to MongoDB
document.getElementById('registerBtn').addEventListener('click', () => {
  const fullName = document.querySelector('#registerModal input[placeholder="Full Name"]').value.trim();
  const email = document.querySelector('#registerModal input[placeholder="Email"]').value.trim();
  const password = document.querySelector('#registerModal input[placeholder="Password"]').value.trim();
  const confirmPassword = document.querySelector('#registerModal input[placeholder="Confirm Password"]').value.trim();
  const contact = document.getElementById('registerContact')?.value.trim() || "";
  const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[^A-Za-z0-9]).{8,}$/;

  if (!fullName || !email || !password || !confirmPassword || !contact) {
    showToast("Please fill all fields", "#f44336");
    return;
  }
  if (!email.includes('@')) {
    showToast("Please enter a valid email address", "#f44336");
    return;
  }
  if (!/^\d{10}$/.test(contact)) {
    showToast("Contact number must be exactly 10 digits", "#f44336");
    return;
  }
  if (password !== confirmPassword) {
    showToast("Passwords do not match", "#f44336");
    return;
  }
  if (!passwordRegex.test(password)) {
    showToast("Password must be at least 8 characters and contain uppercase, lowercase, number, and special character.", "#f44336");
    return;
  }

  fetch('/api/register', {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ name: fullName, email, password, contact })
  })
  .then(res => res.json())
  .then(data => {
    if (data.success) {
      showToast("Registration successful! Please log in.");
      closeModal('registerModal');
      setTimeout(() => openModal('loginModal'), 300);
    } else {
      showToast("Registration failed: " + (data.error || "Unknown error"), "#f44336");
    }
  })
  .catch(err => {
    showToast("Server error: " + err.message, "#f44336");
  });
});

// Login - Call backend API to authenticate
document.getElementById('loginBtn').addEventListener('click', () => {
  const email = document.getElementById('loginEmail').value.trim();
  const password = document.getElementById('loginPassword').value.trim();

  if (!email || !password) {
    showToast('Please enter both email and password', "#f44336");
    return;
  }

  fetch('/api/login', {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email, password })
  })
  .then(res => res.json())
  .then(data => {
    if (data.success && data.user) {
      closeModal('loginModal');
      setUserLoggedIn(data.user.name);
      showToast(`Welcome, ${data.user.name}!`);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    } else {
      showToast('Invalid email or password', "#f44336");
    }
  })
  .catch(err => {
    showToast("Server error: " + err.message, "#f44336");
  });
});

// Set logged-in user UI and session
function setUserLoggedIn(username) {
  const authArea = document.getElementById('authArea');
  if (!authArea) return;
  authArea.innerHTML = `
    Welcome, ${username} <button onclick="logoutUser()">Logout</button>
  `;
  localStorage.setItem('currentUser', username);
}

// Logout user and clear session
function logoutUser() {
  const authArea = document.getElementById('authArea');
  if (authArea) authArea.innerHTML = `Login / Signup`;
  localStorage.removeItem('currentUser');
  showToast("You have been logged out.", "#f44336");
}

// Restore session on page load
window.onload = () => {
  const username = localStorage.getItem('currentUser');
  if (username) setUserLoggedIn(username);
  loadLostItems();
};


// Variables for container and modal
const modal = document.getElementById("reportModal");
const container = document.getElementById("cardContainer");
const successMsg = document.getElementById("successMsg");

// Open form modal
function openForm() {
  if (modal) modal.style.display = "flex";
}

// Generate random report ID (not directly used since backend generates)
function generateReportID() {
  return 'LST' + Math.floor(1000 + Math.random() * 9000);
}

// Attach event listener for submit button
document.getElementById("submitReportBtn").addEventListener("click", submitReport);

// Submit report function
function submitReport() {
  const name = document.getElementById("itemName").value.trim();
  const category = document.getElementById("itemCategory").value.trim();
  const location = document.getElementById("itemLocation").value.trim();
  const date = document.getElementById("itemDate").value.trim();
  const image = document.getElementById("itemImage").value.trim() || "https://via.placeholder.com/300x180";
  const contact = document.getElementById("itemContact").value.trim();

  if (!name || !category || !location || !date || !contact) {
    showToast("Please fill in all required fields.", "#f44336");
    return;
  }
  if (!/^\d{10}$/.test(contact)) {
    showToast("Contact number must be exactly 10 digits", "#f44336");
    return;
  }

  fetch('/api/lost', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ name, category, location, date, image, contact })
  })
  .then(res => res.json())
  .then(data => {
    if (data.success) {
      alert(`Your report has been successfully submitted.\nYour Lost Item Report ID is: ${data.id}`);
      renderLostCard({ name, category, location, date, image, contact, id: data.id });
      closeModal('reportModal');
    } else {
      alert("Failed to submit report: " + (data.error || "Unknown error"));
    }
  })
  .catch(err => {
    alert("Error submitting report: " + err.message);
  });

  // Clear fields
  document.getElementById("itemName").value = '';
  document.getElementById("itemCategory").value = '';
  document.getElementById("itemLocation").value = '';
  document.getElementById("itemDate").value = '';
  document.getElementById("itemImage").value = '';
  document.getElementById("itemContact").value = '';
}

// Render lost item card
function renderLostCard(item) {
  if (!container) return;
  const card = document.createElement("div");
  card.className = "card";
  card.innerHTML = `
    <img src="${item.image || 'https://via.placeholder.com/300x180'}" alt="Lost Item" />
    <h3>${item.name || ''}</h3>
    <p><strong>Category:</strong> ${item.category || ''}</p>
    <p><strong>Location:</strong> ${item.location || ''}</p>
    <p><strong>Date:</strong> ${item.date ? new Date(item.date).toLocaleDateString() : ''}</p>
    <p><strong>Contact:</strong> ${item.contact || ''}</p>
    <p><strong>Report ID:</strong> ${item.id || ''}</p>
  `;
  container.appendChild(card);
}

// Load lost items from API
function loadLostItems() {
  if (!container) return;
  fetch('/api/lost')
    .then(res => res.json())
    .then(data => {
      if (data.success) {
        container.innerHTML = ""; // Clear previous cards
        data.items.forEach(renderLostCard);
      }
    }).catch(() => {
      showToast("Failed to load lost items.", "#f44336");
    });
}
