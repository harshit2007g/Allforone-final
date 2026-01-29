import { initializeApp } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-app.js";
import {
    getFirestore,
    collection,
    onSnapshot
} from "https://www.gstatic.com/firebasejs/10.7.1/firebase-firestore.js";

/* ---------- firebase ---------- */

const firebaseConfig = {
    apiKey: "AIzaSyBxMhTmYG11-1SHBkbfasBccWWfIU4WSa4",
    authDomain: "cyber-labs-6f3a1.firebaseapp.com",
    projectId: "cyber-labs-6f3a1",
    storageBucket: "cyber-labs-6f3a1.firebasestorage.app",
    messagingSenderId: "93943160178",
    appId: "1:93943160178:web:6cae531bf06189462e11eb"
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);
const campaignContainer = document.getElementById("campaignList");

/* ---------- render ---------- */

function createCampaignCard(docSnap) {
  const data = docSnap.data();
    const card = document.createElement("div");
    card.className = "campaign-card";
 const raised = Number(data.raisedAmount);
const total = Number(data.goalAmount);


const percentage = Math.round(total > 0 
  ? Math.min((raised / total) *100, 100)
  : 0);




    card.innerHTML = `
   
    <img class="campaign-image-wrap" src="${data.file}" alt="Campaign Image">
    <div class="campaign-card-body">
      <div class="campaign-tag">${data.category}</div>
      <div ><h2>${data.title}</h3></div>
         <div class="campaign-snippet">${data.summary}</div>
    
     <div class="progress-bar">
       <div class="progress-fill" style="width:${percentage}%;"></div></div>
     <div class="progress-info"><span>₹${data.goalAmount} raised</span>
     <span>${percentage}% funded</span>
     </div>
     <button class="nav-cta">View details &amp donate</button>
  `;
const viewBtn = card.querySelector(".nav-cta");
  viewBtn.addEventListener("click", (e) => {
    e.stopPropagation();
    window.location.href = `campaign.html?id=${docSnap.id}`;
  });

    return card;
}


/* ---------- receive data  ---------- */
onSnapshot(collection(db, "INFORMATION"), (snapshot) => {
  campaignContainer.innerHTML = "";

  snapshot.forEach((docSnap) => {
    const card = createCampaignCard(docSnap); 
    campaignContainer.appendChild(card);
  });
});
