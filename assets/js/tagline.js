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
