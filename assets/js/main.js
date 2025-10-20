// AVAILABITY.JS
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


// COUNTER.JS
document.addEventListener("DOMContentLoaded", () => {
  const counters = document.querySelectorAll('.counter');

  counters.forEach(counter => {
    const target = +counter.getAttribute('data-target');
    let count = 0;
    const increment = Math.ceil(target / 100); // increment based on target
    const delay = 30; // smaller delay for smoothness

    const updateCount = () => {
      count += increment;

      if (count < target) {
        counter.innerText = count + '+';
        setTimeout(updateCount, delay);
      } else {
        counter.innerText = target + '+';
      }
    };

    updateCount();
  });
});


document.addEventListener("DOMContentLoaded", () => {
  const counters = document.querySelectorAll('.counter');
  const sections = document.querySelectorAll('.animate-on-scroll');

  // Counter Animation
  const animateCounter = (counter) => {
    const target = +counter.getAttribute('data-target');
    let count = 0;
    const increment = Math.ceil(target / 100);
    const delay = 30;

    const updateCount = () => {
      count += increment;
      if (count < target) {
        counter.innerText = count + '+';
        setTimeout(updateCount, delay);
      } else {
        counter.innerText = target + '+';
      }
    };

    updateCount();
  };

  // Intersection Observer for counters and other sections
  const observer = new IntersectionObserver((entries, observer) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        // Animate counters inside this section
        entry.target.querySelectorAll('.counter').forEach(animateCounter);

        // Add animation class for other content
        entry.target.classList.add('visible');

        // Stop observing once animated
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.2 });

  sections.forEach(section => observer.observe(section));
});


// FILTER.JS
const filterButtons = document.querySelectorAll('.filter-btn');
const projectItems = document.querySelectorAll('.project-item');

filterButtons.forEach(btn => {
  btn.addEventListener('click', () => {
    filterButtons.forEach(b => b.classList.remove('active'));
    btn.classList.add('active');

    const filter = btn.dataset.filter;

    projectItems.forEach(item => {
      if (filter === 'all' || item.dataset.category === filter) {
        // show with animation
        item.classList.remove('d-none');
        setTimeout(() => item.classList.remove('hidden'), 20);
      } else {
        // start hide animation
        item.classList.add('hidden');
        setTimeout(() => {
          if (item.classList.contains('hidden')) {
            item.classList.add('d-none'); // fully hide after animation
          }
        }, 400); // match your CSS transition time
      }
    });
  });
});


// TAGLINE.JS
document.addEventListener("DOMContentLoaded", () => {
  const taglines = [
    "React Developer",
    "PHP & MySQL Expert",
    "UI/UX Designer",
    "TypeScript & NodeJS Dev",
    "Machine Learning Enthusiast"
  ];

  const taglineEl = document.querySelector(".dynamic-tagline");
  let index = 0;
  const displayTime = 2000; // 2 seconds per tagline
  const fadeTime = 500; // 0.5 seconds fade in/out

  function showNextTagline() {
    // fade out
    taglineEl.style.opacity = 0;

    setTimeout(() => {
      // change text
      taglineEl.textContent = taglines[index];
      index = (index + 1) % taglines.length;

      // fade in
      taglineEl.style.transition = `opacity ${fadeTime}ms`;
      taglineEl.style.opacity = 1;
    }, fadeTime);
  }

  showNextTagline(); // show first tagline immediately
  setInterval(showNextTagline, displayTime + fadeTime); // next tagline
});


//THEME.JS
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

// VIDEOPOPOUT.JS
document.addEventListener("DOMContentLoaded", () => {
  const openBtn = document.getElementById("open-video");
  const videoBox = document.getElementById("video-box");
  const closeBtn = document.getElementById("close-video");

  openBtn.addEventListener("click", () => {
    openBtn.style.display = "none";
    videoBox.style.display = "block";
  });

  closeBtn.addEventListener("click", () => {
    videoBox.style.display = "none";
    openBtn.style.display = "flex";
  });
});


// NAVBAR SPACER — push content down when the mobile navbar opens (fast 0.3s)
document.addEventListener('DOMContentLoaded', () => {
  const nav = document.querySelector('.navbar');
  const collapseEl = document.getElementById('navMenu');
  let spacer = document.getElementById('nav-spacer');

  // If spacer doesn't exist (defensive), create it and insert after nav
  if (!spacer) {
    spacer = document.createElement('div');
    spacer.id = 'nav-spacer';
    spacer.setAttribute('aria-hidden', 'true');
    nav.insertAdjacentElement('afterend', spacer);
  }

  const setSpacerToNavHeight = () => {
    const navHeight = Math.ceil(nav.getBoundingClientRect().height);
    spacer.style.height = `${navHeight}px`;
  };

  // initial set
  setSpacerToNavHeight();

  // update on resize (debounced)
  let resizeTimer;
  window.addEventListener('resize', () => {
    clearTimeout(resizeTimer);
    resizeTimer = setTimeout(() => {
      setSpacerToNavHeight();
    }, 80);
  });


  if (!collapseEl) return;

  collapseEl.addEventListener('show.bs.collapse', () => {
    if (window.innerWidth < 992) {
      const dropdownHeight = collapseEl.scrollHeight;
      spacer.style.transition = 'height 0.25s ease-out';
      spacer.style.height = `${dropdownHeight + nav.offsetHeight * 0.2}px`;
    }
  });

  collapseEl.addEventListener('shown.bs.collapse', () => {
    if (window.innerWidth < 992) {
      const dropdownHeight = collapseEl.scrollHeight;
      spacer.style.height = `${dropdownHeight + nav.offsetHeight * 0.2}px`;
    }
  });

  collapseEl.addEventListener('hide.bs.collapse', () => {
    if (window.innerWidth < 992) {
      // start shrinking a bit faster
      spacer.style.transition = 'height 0.2s ease-in';
      spacer.style.height = `${nav.offsetHeight}px`;

      // sync faster with the collapsing element
      const interval = setInterval(() => {
        const currentHeight = collapseEl.offsetHeight;

        // stop once fully closed
        if (currentHeight <= 0) {
          clearInterval(interval);
          spacer.style.height = `${nav.offsetHeight}px`;
        } else {
          // tighter sync — smaller multiplier, quicker follow
          spacer.style.height = `${nav.offsetHeight + currentHeight * 0.1}px`;
        }
      }, 10); // faster refresh for tighter tracking
    }
  });

  collapseEl.addEventListener('hidden.bs.collapse', () => {
    spacer.style.transition = 'height 0.25s ease-in-out';
    spacer.style.height = `${nav.offsetHeight}px`;
  });

});

