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
