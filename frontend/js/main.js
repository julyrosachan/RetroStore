
const navTrigger = document.querySelector(".navTrigger");
const mainListDiv = document.querySelector("#mainListDiv");
const nav = document.querySelector(".nav");
const navLinks = document.querySelectorAll("#mainListDiv a");

navTrigger.addEventListener("click", () => {
    navTrigger.classList.toggle("active");
    mainListDiv.classList.toggle("show_list");
    document.body.classList.toggle("menu-open");
});

window.addEventListener("scroll", () => {
    if (window.scrollY > 30) {
        nav.classList.add("affix");
    } else {
        nav.classList.remove("affix");
    }
});

navLinks.forEach(link => {
    link.addEventListener("click", () => {
        navTrigger.classList.remove("active");
        mainListDiv.classList.remove("show_list");
        document.body.classList.remove("menu-open");
    });
});

   const letterbox = document.querySelector('#letterbox');
    const root = document.documentElement;

    function easeOutBack(x) {
      const c1 = 1.70158;
      const c3 = c1 + 1;
      return 1 + c3 * Math.pow(x - 1, 3) + c1 * Math.pow(x - 1, 2);
    }

    function updateLetterboxScroll() {
      if (!letterbox) return;

      const rect = letterbox.getBoundingClientRect();
      const sectionHeight = letterbox.offsetHeight - window.innerHeight;
      const passed = Math.min(Math.max(-rect.top, 0), sectionHeight);
      const progress = sectionHeight > 0 ? passed / sectionHeight : 0;
      const eased = easeOutBack(Math.min(progress * 1.08, 1));
      const bounce = Math.sin(progress * Math.PI) * -12;
      const rotate = 120 + progress * 760;
      const stretch = progress * 28;
      const copyReveal = Math.min(Math.max((progress - 0.18) / 0.32, 0), 1);
      const copyReveal2 = Math.min(Math.max((progress - 0.28) / 0.30, 0), 1);
      const copyReveal3 = Math.min(Math.max((progress - 0.40) / 0.28, 0), 1);

      root.style.setProperty('--letter-progress', progress.toFixed(4));
      root.style.setProperty('--letter-eased', eased.toFixed(4));
      root.style.setProperty('--vinyl-rotate', `${rotate.toFixed(1)}deg`);
      root.style.setProperty('--paper-bounce', `${bounce.toFixed(1)}px`);
      root.style.setProperty('--shadow-stretch', stretch.toFixed(1));
      root.style.setProperty('--copy-reveal', copyReveal.toFixed(4));
      root.style.setProperty('--copy-reveal-2', copyReveal2.toFixed(4));
      root.style.setProperty('--copy-reveal-3', copyReveal3.toFixed(4));
    }

    updateLetterboxScroll();
    window.addEventListener('scroll', updateLetterboxScroll, { passive: true });
    window.addEventListener('resize', updateLetterboxScroll);

    const revealElements = document.querySelectorAll('.reveal-left, .reveal-right');

const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
        if (entry.isIntersecting) {
            entry.target.classList.add('active');
        }
    });
}, {
    threshold: 0.2
});

revealElements.forEach((element) => {
    observer.observe(element);
});

const token = localStorage.getItem("token");
const user = JSON.parse(localStorage.getItem("user"));

const profileLink = document.getElementById("profileLink");
const profileName = document.getElementById("profileName");
const profileAvatar = document.getElementById("profileAvatar");

if (token && user) {
    profileName.textContent = user.name || "my account";

    if (user.role === "admin") {
        profileLink.href = "./admin.html";
    } else {
        profileLink.href = "./profile.html";
    }

    console.log("logged in as:", user.name);
} else {
    profileName.textContent = "sign in";
    profileLink.href = "./auth.html";
}