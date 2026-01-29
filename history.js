
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-app.js";
import {
    getFirestore,
    doc,
    getDocs,
    collection,
    getDoc,
    query,
    orderBy
} from "https://www.gstatic.com/firebasejs/10.7.1/firebase-firestore.js";

// Firebase Config
const firebaseConfig = {
    apiKey: "AIzaSyBxMhTmYG11-1SHBkbfasBccWWfIU4WSa4",
    authDomain: "cyber-labs-6f3a1.firebaseapp.com",
    projectId: "cyber-labs-6f3a1",
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);
// Get Campaign ID

const params = new URLSearchParams(window.location.search);
const campaignId = params.get("id");
console.log(`${campaignId}`);
async function loadCampaign() {
    try {
        const ref = doc(db, "INFORMATION", campaignId);
        const snap = await getDoc(ref);

        if (!snap.exists()) {
            document.body.innerHTML = "<h2>history not found</h2>";
            return;
        }

        const data = snap.data();
        transactions(data);

    } catch (err) {
        console.error(err);
        document.body.innerHTML = "<h2>Failed to load history</h2>";
    }
}

function transactions(data) {
    document.getElementById("campaign-name").textContent =
        `${campaignId}`;

    document.getElementById("raised").textContent =
        ((data.raisedAmount).toLocaleString()) || 0;

    document.getElementById("supporters").textContent =
        data.supporters || 0;

    document.getElementById("goal").textContent =
        ((data.goalAmount).toLocaleString()) || 0;

}

async function readAllDocuments() {
    const collectionName = `DONATION-${campaignId}`;
    const colRef = collection(db, collectionName);
    const q = query(
        colRef,
        orderBy("timestamp", "desc") // newest first
    );
    const snapshot = await getDocs(q);

    const container = document.getElementById("donationList");
    container.innerHTML = ""; // clear old data

    snapshot.forEach((docSnap) => {
        const data = docSnap.data();

        const txHash =
            data.txHash.slice(0, 6) + "..." + data.txHash.slice(-4);

        const address =
            data.donorAddress.slice(0, 6) + "..." + data.donorAddress.slice(-4);

        const amount = data.amountEth * Math.pow(10, 7);

        const ts = data.timestamp;
        const dateObj = new Date(ts.seconds * 1000);
        const formattedDateTime = dateObj.toLocaleString();
        const link = "https://sepolia.etherscan.io/tx/" + data.txHash;
        const row = document.createElement("div");
        row.className = "donation-row";

        row.innerHTML = `
      <table>  
                <tbody>
                    <tr>
                        <td id="hash" class="hash">
                        <a href="${link}" target="_blank" rel="noopener noreferrer" > ${txHash}  </a>
                        </td>
                        <td id="address" class="address">${address}</td>
                        <td id="amount" class="amount">${amount.toLocaleString()}</td>
                        <td id="date" class="date">${formattedDateTime}</td>
                    </tr>
                </tbody>
            </table>
    `;

        container.appendChild(row);
    });
}


readAllDocuments();

loadCampaign();

