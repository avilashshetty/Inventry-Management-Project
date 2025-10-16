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

// Save user to localStorage with validation
function saveUser(fullName, email, password, contact) {
  const users = JSON.parse(localStorage.getItem('users')) || [];
  if (users.some(u => u.email === email)) {
    return false;
  }
  users.push({ fullName, email, password, contact });
  localStorage.setItem('users', JSON.stringify(users));
  return true;
}

// Find user in localStorage
function findUser(email, password) {
  const users = JSON.parse(localStorage.getItem('users')) || [];
  return users.find(u => u.email === email && u.password === password);
}

// Registration with validation
document.getElementById('registerBtn')?.addEventListener('click', () => {
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
    showToast("Password must be at least 8 chars with uppercase, lowercase, number & special char.", "#f44336");
    return;
  }

  if (saveUser(fullName, email, password, contact)) {
    showToast("Registration successful! Please log in.");
    closeModal('registerModal');
    setTimeout(() => openModal('loginModal'), 300);
  } else {
    showToast("Email already registered", "#f44336");
  }
});

// Login handling
document.getElementById('loginBtn')?.addEventListener('click', () => {
  const email = document.getElementById('loginEmail').value.trim();
  const password = document.getElementById('loginPassword').value.trim();

  const user = findUser(email, password);
  if (user) {
    closeModal('loginModal');
    setUserLoggedIn(user.fullName);
    showToast(`Welcome, ${user.fullName}!`);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  } else {
    showToast('Invalid email or password', "#f44336");
  }
});

// Set logged-in user UI and store in localStorage
function setUserLoggedIn(username) {
  const authArea = document.getElementById('authArea');
  if (authArea) {
    authArea.innerHTML = `
      <span style="color: #fff;">Welcome, <strong>${username}</strong></span>
      <span class="nav-btn" onclick="logoutUser()" style="margin-left: 10px; color: #ff9800; cursor:pointer;">Logout</span>
    `;
  }
  localStorage.setItem('currentUser', username);
}

// Logout user and clear session
function logoutUser() {
  const authArea = document.getElementById('authArea');
  if (authArea) {
    authArea.innerHTML = `<span class="nav-btn" onclick="openModal('loginModal')" style="cursor:pointer;">Login / Signup</span>`;
  }
  localStorage.removeItem('currentUser');
  showToast("You have been logged out.", "#f44336");
}

// Restore login session on page load
window.onload = () => {
  const username = localStorage.getItem('currentUser');
  if (username) setUserLoggedIn(username);
};

// Variables for modals and container
const reportModal = document.getElementById("reportModal");
const claimModal = document.getElementById("claimModal");
const cardContainer = document.getElementById("cardContainer");

// Open and close modals functions
function openReportForm() {
  reportModal.style.display = "flex";
}

function closeModals() {
  reportModal.style.display = "none";
  claimModal.style.display = "none";
}

// Generate random IDs
function generateID(prefix) {
  return prefix + Math.floor(1000 + Math.random() * 9000);
}

// Submit Found Item with validation and API call
function submitFoundItem() {
  const name = document.getElementById("foundItemName").value.trim();
  const category = document.getElementById("foundItemCategory").value.trim();
  const location = document.getElementById("foundItemLocation").value.trim();
  const date = document.getElementById("foundItemDate").value.trim();
  const image = document.getElementById("foundItemImage").value.trim();
  const contact = document.querySelector('input[name="foundContact"]')?.value.trim() || "";
  const gmail = document.getElementById("foundGmail")?.value.trim() || "";

  if (!name || !category || !location || !date) {
    alert("Please fill in all required fields.");
    return;
  }

  if (!/^\d{10}$/.test(contact)) {
    alert("Contact number must be exactly 10 digits.");
    return;
  }

  // if (image && !image.endsWith('.com')) {
  //   alert("Image URL must end with .com");
  //   return;
  // }

  if (gmail && !gmail.endsWith('@gmail.com')) {
    alert("Gmail must end with @gmail.com");
    return;
  }

  fetch('/api/found', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ name, category, location, date, image, contact, gmail })
  })
  .then(res => res.json())
  .then(data => {
    if (data.success) {
      alert(`Found item submitted! Report ID: ${data.id}`);
      document.getElementById('reportModal').style.display = 'none';
      // Optionally reload or update UI here
    } else {
      alert("Failed to submit found item: " + data.error);
    }
  })
  .catch(err => {
    alert("Error submitting found item: " + err.message);
  });
}

// Submit Claim with validation and API call
function submitClaim() {
  const name = document.getElementById("claimName").value.trim();
  const category = document.getElementById("claimCategory").value.trim();
  const location = document.getElementById("claimLocation").value.trim();
  const date = document.getElementById("claimDate").value.trim();
  const image = document.getElementById("claimImage").value.trim();
  const contact = document.querySelector('input[name="claimContact"]')?.value.trim() || "";
  const gmail = document.getElementById("claimGmail")?.value.trim() || "";

  if (!name || !category || !location || !date) {
    alert("Please fill in all required fields.");
    return;
  }

  if (!/^\d{10}$/.test(contact)) {
    alert("Contact number must be exactly 10 digits.");
    return;
  }

  // if (image && !image.endsWith('.com')) {
  //   alert("Image URL must end with .com");
  //   return;
  // }

  if (gmail && !gmail.endsWith('@gmail.com')) {
    alert("Gmail must end with @gmail.com");
    return;
  }

  fetch('/api/claim', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ name, category, location, date, image, contact, gmail })
  })
  .then(res => res.json())
  .then(data => {
    if (data.success) {
      alert(`Claim submitted! Claim ID: ${data.id}`);
      document.getElementById('claimModal').style.display = 'none';
      // Optionally reload or update UI here
    } else {
      alert("Failed to submit claim: " + data.error);
    }
  })
  .catch(err => {
    alert("Error submitting claim: " + err.message);
  });
}

// Render a found item card in the UI
function renderFoundCard(item) {
  const card = document.createElement("div");
  card.className = "card";
  card.innerHTML = `
    <img src="${item.image || 'https://via.placeholder.com/300x180'}" alt="Found Item" />
    <h3>${item.name}</h3>
    <p><strong>Category:</strong> ${item.category}</p>
    <p><strong>Location:</strong> ${item.location}</p>
    <p><strong>Date:</strong> ${item.date ? new Date(item.date).toLocaleDateString() : ''}</p>
    <button class="connect-btn">Connect</button>
    <p><strong>Report ID:</strong> ${item.id || ''}</p>
  `;
  cardContainer.appendChild(card);
}

// Load found items on page ready
document.addEventListener('DOMContentLoaded', () => {
  fetch('/api/found')
    .then(res => res.json())
    .then(data => {
      if (data.success) {
        cardContainer.innerHTML = ""; // Clear previous cards
        data.items.forEach(renderFoundCard);
      }
    });
});

// Event listeners for buttons
document.getElementById('submitClaimBtn')?.addEventListener('click', submitClaim);
document.getElementById('submitFoundBtn')?.addEventListener('click', submitFoundItem);

// Open claim modal when clicking Connect button on a card
cardContainer.addEventListener("click", function(e) {
  if (e.target.classList.contains("connect-btn")) {
    claimModal.style.display = "flex";
  }
});
