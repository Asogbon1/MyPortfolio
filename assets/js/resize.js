
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

