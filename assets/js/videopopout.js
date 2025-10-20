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
