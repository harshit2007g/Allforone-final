// Import from Firebase CDN (v10+ modular)
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.8.0/firebase-app.js";
import {
    getAuth,
    GoogleAuthProvider,
    signInWithPopup,
    signOut,
    onAuthStateChanged
} from "https://www.gstatic.com/firebasejs/10.8.0/firebase-auth.js";

// TODO: paste your config here
const firebaseConfig = {
    apiKey: "AIzaSyBxMhTmYG11-1SHBkbfasBccWWfIU4WSa4",
    authDomain: "cyber-labs-6f3a1.firebaseapp.com",
    databaseURL: "https://cyber-labs-6f3a1-default-rtdb.firebaseio.com",
    projectId: "cyber-labs-6f3a1",
    storageBucket: "cyber-labs-6f3a1.firebasestorage.app",
    messagingSenderId: "93943160178",
    appId: "1:93943160178:web:6cae531bf06189462e11eb"
};

// Initialize
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const provider = new GoogleAuthProvider();
const loginBtn = document.getElementById("googleLogin");
const logoutBtn = document.getElementById("logoutBtn");
const userInfo = document.getElementById("userInfo");
const start = document.getElementById("start");
if (loginBtn) {
    loginBtn.addEventListener("click", async () => {
        try {
            const result = await signInWithPopup(auth, provider);
            const user = result.user;
            console.log("Signed in:", user.displayName, user.email);

        } catch (err) {
            console.error("Google sign-in error:", err);
        }
    });

}
if (logoutBtn) {
    logoutBtn.addEventListener("click", async () => {
        try {
            await signOut(auth);
            console.log("Signed out");
        } catch (err) {
            console.error("Sign out error:", err);
        }
    });

}
let isloggedin = false;
onAuthStateChanged(auth, (user) => {
    if (user) {
        isloggedin = true;
        console.log("User logged in:", user);
        if (userInfo) {
            userInfo.innerHTML = `
        <p>Logged in as <strong>${user.displayName}</strong></p>
        <p>${user.email}</p>
      `;
        }
        if (loginBtn) loginBtn.style.display = "none";
        if (logoutBtn) logoutBtn.style.display = "inline-flex";
    } else {
        isloggedin = false;
        console.log("No user logged in");
        if (userInfo) userInfo.innerHTML = "<p>Not logged in</p>";
        if (loginBtn) loginBtn.style.display = "inline-flex";
        if (logoutBtn) logoutBtn.style.display = "none";
    }
});


start.addEventListener("click", () => {
    if (isloggedin) {
        window.location.href = "createcampaign.html";
    } else {
        alert("Please login first!");
    }
});


