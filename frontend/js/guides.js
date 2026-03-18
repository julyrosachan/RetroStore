const heroSection = document.getElementById("guidesHero");
const heroTitle = document.getElementById("heroTitle");
const heroText = document.getElementById("heroText");
const stickyQuoteWrap = document.getElementById("stickyQuoteWrap");
const stickyQuote = document.getElementById("stickyQuote");

function updateGuidesScrollEffects() {
    if (heroSection && heroTitle && heroText) {
        const rect = heroSection.getBoundingClientRect();
        const progress = Math.min(Math.max((window.innerHeight - rect.top) / (window.innerHeight * 1.2), 0), 1);

        heroTitle.style.transform = `translateY(${progress * -18}px)`;
        heroTitle.style.opacity = `${1 - progress * 0.15}`;

        heroText.style.transform = `translateY(${progress * -10}px)`;
        heroText.style.opacity = `${1 - progress * 0.1}`;
    }

    if (stickyQuoteWrap && stickyQuote) {
        const rect = stickyQuoteWrap.getBoundingClientRect();
        const maxScroll = stickyQuoteWrap.offsetHeight - window.innerHeight;
        const passed = Math.min(Math.max(-rect.top, 0), maxScroll);
        const progress = maxScroll > 0 ? passed / maxScroll : 0;

        stickyQuote.style.transform = `translateY(${40 - progress * 40}px)`;
        stickyQuote.style.opacity = `${0.4 + progress * 0.6}`;
    }
}

window.addEventListener("scroll", updateGuidesScrollEffects, { passive: true });
window.addEventListener("resize", updateGuidesScrollEffects);
updateGuidesScrollEffects();

const revealTargets = document.querySelectorAll(".reveal-up, .reveal-left, .reveal-right, .reveal-card");

const guideObserver = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
        if (entry.isIntersecting) {
            entry.target.classList.add("active");
        }
    });
}, {
    threshold: 0.18
});

revealTargets.forEach((item) => {
    guideObserver.observe(item);
});