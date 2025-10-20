// Get the element
const statusEl = document.querySelector('.availability-status');

// Set working hours (9am - 6pm WAT, Monday to Friday)
const now = new Date();
const day = now.getDay(); // 0 = Sunday, 1 = Monday
const hour = now.getHours(); // 0-23 in local time

// WAT is GMT+1, adjust if your browser is in different timezone
const utcHour = now.getUTCHours();
const watHour = (utcHour + 1 + 24) % 24;

let online = false;

// Check if today is Monday(1) to Friday(5) and between 9am - 6pm
if (day >= 1 && day <= 5 && watHour >= 9 && watHour < 18) {
  online = true;
}

// Set status text and color
if (online) {
  statusEl.innerHTML = '<span class="text-success">● Currently Online</span>';
} else {
  statusEl.innerHTML = '<span class="text-danger">● Currently Offline</span>';
}
