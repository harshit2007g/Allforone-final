import { initializeApp } from
"https://www.gstatic.com/firebasejs/9.23.0/firebase-app.js";

const firebaseConfig = {
 apiKey: "AIzaSyBxMhTmYG11-1SHBkbfasBccWWfIU4WSa4",
  authDomain: "cyber-labs-6f3a1.firebaseapp.com",
  projectId: "cyber-labs-6f3a1",
  storageBucket: "cyber-labs-6f3a1.firebasestorage.app",
  messagingSenderId: "93943160178",
  appId: "1:93943160178:web:6cae531bf06189462e11eb"
};


export const app = initializeApp(firebaseConfig);

 import { getFirestore, doc, serverTimestamp,setDoc } 
from "https://www.gstatic.com/firebasejs/9.23.0/firebase-firestore.js";

const db = getFirestore();

const submitBtn = document.getElementById("submitCampaign");

submitBtn.addEventListener("click", async () => {
  try {
    
    // Collect form data
    const title = document.getElementById("title").value.trim();
    const category = document.getElementById("category").value;
    const description = document.getElementById("description").value.trim();
    const importance = document.getElementById("importance").value.trim();
    const goalAmount = Number(document.getElementById("goalAmount").value);
    const duration = Number(document.getElementById("duration").value);
    const file = document.getElementById("campaignImage").files[0];
    const about =document.getElementById("about").value.trim();
    const where =document.getElementById("where").value;
    const summary=document.getElementById("summary").value.trim();
    const address = document.getElementById("walletAddressInput").value;
    const email =document.getElementById("email").value;
    // Basic validation
    if (!title || !description || !importance || !goalAmount || !duration) {
      alert("Please fill all required fields.");
      return;
    }

    if (goalAmount < 10000) {
      alert("Minimum goal amount is ₹10,000.");
      return;
    }
      // this is to send image to cloudinary
    const formData = new FormData();
  formData.append("file", file);
  formData.append("upload_preset", "allforone");
   const response = await fetch(
    "https://api.cloudinary.com/v1_1/dem97mnka/image/upload",
    { method: "POST", body: formData }
  );
    const result = await response.json();
    const imageUrl = result.secure_url;

    // Create campaign object
    const campaignData = {
      about:about,
      email:email,
      where:where,
      title: title,
      category: category,
      description: description,
      address:address,
      important: importance,
      summary:summary,
      goalAmount: goalAmount,
      durationDays: duration,
      raisedAmount: 0,
      supporters:0,
      createdAt: serverTimestamp(),
      status: "active",
      file:imageUrl
    };

    // Send to Firestore
 await setDoc(
  doc(db, "INFORMATION", title),
  campaignData
);
    alert("Campaign created successfully!");


    // Optional: reset form
    document.querySelectorAll("input, textarea").forEach(el => el.value = "");

  } catch (error) {
    console.error("Error creating campaign:", error);
    alert("Something went wrong. Please try again.");
  }
});

