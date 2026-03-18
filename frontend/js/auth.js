const authTitle = document.getElementById("authTitle");
const nameField = document.getElementById("nameField");
const confirmField = document.getElementById("confirmField");
const loginExtras = document.getElementById("loginExtras");
const submitBtn = document.getElementById("submitBtn");
const switchText = document.getElementById("switchText");
const authForm = document.getElementById("authForm");

const fullNameInput = document.getElementById("fullNameInput");
const emailInput = document.getElementById("emailInput");
const passwordInput = document.getElementById("passwordInput");
const confirmPasswordInput = document.getElementById("confirmPasswordInput");

let mode = "login";

function showToast(message) {
    const toast = document.getElementById("toast");
    if (!toast) return;

    toast.textContent = message;
    toast.classList.add("show");

    setTimeout(() => {
        toast.classList.remove("show");
    }, 2500);
}

function saveAuth(data) {
    localStorage.setItem("token", data.token);
    localStorage.setItem("user", JSON.stringify({
        userId: data.userId,
        name: data.name,
        email: data.email,
        role: data.role
    }));
}

function updateAuthMode() {
    if (mode === "register") {
        authTitle.textContent = "create your account";
        nameField.style.display = "block";
        confirmField.style.display = "block";
        loginExtras.style.display = "none";
        submitBtn.textContent = "create account";

        switchText.innerHTML = `
            already have an account?
            <a href="#" id="switchModeBtn">sign in</a>
        `;
    } else {
        authTitle.textContent = "sign in to your account";
        nameField.style.display = "none";
        confirmField.style.display = "none";
        loginExtras.style.display = "flex";
        submitBtn.textContent = "sign in";

        switchText.innerHTML = `
            not a member?
            <a href="#" id="switchModeBtn">create an account</a>
        `;
    }

    bindSwitchButton();
}

function bindSwitchButton() {
    const newSwitchBtn = document.getElementById("switchModeBtn");
    if (!newSwitchBtn) return;

    newSwitchBtn.addEventListener("click", (e) => {
        e.preventDefault();
        mode = mode === "login" ? "register" : "login";
        updateAuthMode();
    });
}

async function handleLogin() {
    try {
        const response = await fetch("http://localhost:5242/api/auth/login", {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                email: emailInput.value,
                password: passwordInput.value
            })
        });

        const data = await response.json();

        if (!response.ok) {
            showToast(data.message || "login failed");
            return;
        }

        saveAuth(data);
        showToast("signed in successfully");

        setTimeout(() => {
            if (data.role === "admin") {
                window.location.href = "./admin.html";
            } else {
                window.location.href = "./index.html";
            }
        }, 800);
    } catch (error) {
        console.error(error);
        showToast("could not sign in");
    }
}

async function handleRegister() {
    if (passwordInput.value !== confirmPasswordInput.value) {
        showToast("passwords do not match");
        return;
    }

    try {
        const response = await fetch("http://localhost:5242/api/auth/register", {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                name: fullNameInput.value,
                email: emailInput.value,
                password: passwordInput.value
            })
        });

        const data = await response.json();

        if (!response.ok) {
            showToast(data.message || "register failed");
            return;
        }

        saveAuth(data);
        showToast("account created");

        setTimeout(() => {
            window.location.href = "./index.html";
        }, 800);
    } catch (error) {
        console.error(error);
        showToast("register failed");
    }
}

authForm.addEventListener("submit", async (e) => {
    e.preventDefault();

    if (mode === "register") {
        await handleRegister();
    } else {
        await handleLogin();
    }
});

updateAuthMode();