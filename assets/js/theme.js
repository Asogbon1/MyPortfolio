const toggleBtn = document.getElementById('theme-toggle');
const body = document.body;
const icon = toggleBtn.querySelector('i');

// Check local storage for theme preference
if (localStorage.getItem('theme') === 'dark') {
  body.classList.add('dark-mode');
  icon.classList.replace('fa-moon', 'fa-sun');
}

toggleBtn.addEventListener('click', () => {
  body.classList.toggle('dark-mode');

  if (body.classList.contains('dark-mode')) {
    icon.classList.replace('fa-moon', 'fa-sun');
    localStorage.setItem('theme', 'dark');
  } else {
    icon.classList.replace('fa-sun', 'fa-moon');
    localStorage.setItem('theme', 'light');
  }
});
