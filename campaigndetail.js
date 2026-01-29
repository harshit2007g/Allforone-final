// campaign.js
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-app.js";
import {
  getFirestore,
  doc,
  getDoc
} from "https://www.gstatic.com/firebasejs/10.7.1/firebase-firestore.js";

const firebaseConfig = {
  apiKey: "AIzaSyBxMhTmYG11-1SHBkbfasBccWWfIU4WSa4",
  authDomain: "cyber-labs-6f3a1.firebaseapp.com",
  projectId: "cyber-labs-6f3a1",
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

// get campaign id 
const params = new URLSearchParams(window.location.search);
const campaignId = params.get("id");
const donateBtn= document.getElementById("donate");

if (!campaignId) {
  document.body.innerHTML = "<h2>Invalid campaign link</h2>";
  throw new Error("No campaign ID");
}
// Load Campaign
async function loadCampaign() {
  try {
    const ref = doc(db, "INFORMATION", campaignId);
    const snap = await getDoc(ref);

    if (!snap.exists()) {
      document.body.innerHTML = "<h2>Campaign not found</h2>";
      return;
    }

    const data = snap.data();
    renderCampaign(data);

  } catch (err) {
    console.error(err);
    document.body.innerHTML = "<h2>Failed to load campaign</h2>";
  }
}

// Render Campaign
function renderCampaign(data) {
  // Basic info
  
  document.getElementById("campaignTitle").textContent =
    data.title || "Untitled Campaign";

  document.getElementById("campaignDescription").textContent =
    data.description || "";

  document.getElementById("campaignCategory").textContent =
    data.category || "";

  document.getElementById("campaignLocation").textContent =
    data.where || "";

  document.getElementById("campaignCreator").textContent =
    data.about || "Anonymous";

  document.getElementById("campaignWhy").textContent=
  data.important || "";

  

  // Image
  if (data.file) {
    document.getElementById("campaignImage").src = data.file;
  }

  // Amounts
  const raised = Number(data.raisedAmount || 0);
  const goal = Number(data.goalAmount || 1);

  document.getElementById("raisedAmount").textContent =
    `₹ ${raised.toLocaleString("en-IN")}`;

  document.getElementById("goalAmount").textContent =
    `₹ ${goal.toLocaleString("en-IN")}`;

  // Progress
  const percent = Math.min((raised / goal) * 100, 100);
  document.getElementById("progressFill").style.width = `${percent}%`;

  // Optional stats
  if (data.supporters || data.durationDays) {
    document.getElementById("campaignStats").textContent =
      `${data.supporters || 0} supporters · ${data.durationDays || 0} days left`;

  }
  document.getElementById("duration")  
}


loadCampaign();
donateBtn.addEventListener("click", () => {
  window.location.href = `donate.html?id=${campaignId}`;
});
const history =document.getElementById("history");

history.addEventListener("click",()=>{
   window.location.href =`transactionhistory.html?id=${campaignId}`;
});
