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
