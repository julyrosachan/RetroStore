const tabs = document.querySelectorAll(".profile-tab");
const panels = document.querySelectorAll(".profile-panel");
const logoutBtn = document.getElementById("logoutBtn");

const user = JSON.parse(localStorage.getItem("user"));

if (!user) {
    window.location.href = "./auth.html";
}

const profileName = document.getElementById("profileName");
const profileEmail = document.getElementById("profileEmail");

if (profileName) {
    profileName.value = user.name || "";
}

if (profileEmail) {
    profileEmail.value = user.email || "";
}

tabs.forEach((tab) => {
    tab.addEventListener("click", () => {
        tabs.forEach(item => item.classList.remove("active"));
        panels.forEach(panel => panel.classList.remove("active"));

        tab.classList.add("active");
        document.getElementById(`${tab.dataset.tab}Panel`)?.classList.add("active");
    });
});

logoutBtn?.addEventListener("click", () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    window.location.href = "./auth.html";
});