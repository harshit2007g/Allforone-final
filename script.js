document.addEventListener("DOMContentLoaded", () => {
 
  const revealEls = document.querySelectorAll(".reveal-on-scroll");

  if ("IntersectionObserver" in window) {
    const observer = new IntersectionObserver(
      entries => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            entry.target.classList.add("visible");
            observer.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.2 }
    );

    revealEls.forEach(el => observer.observe(el));
  } else {
    revealEls.forEach(el => el.classList.add("visible"));
  }
});

document.getElementById("openDonateBtn").addEventListener("click", () => {
  document.getElementById("donateOverlay").classList.remove("hidden");
});

document.getElementById("donateBtn").addEventListener("click", donate);


