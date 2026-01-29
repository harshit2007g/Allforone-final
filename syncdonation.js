import admin from "firebase-admin";
import fs from "fs";
const serviceAccount = JSON.parse(
    fs.readFileSync("./serviceAccountKey.json", "utf8")
);
admin.initializeApp({
    credential: admin.credential.cert(serviceAccount),
});

const db = admin.firestore();


const ETHERSCAN_API_KEY = "5D3CEFGJ5FMWEJSFWUS7N5DZMD7BHMGS66";
const CHAIN_ID = 11155111;


async function fetchIncomingTransactions(address, lastProcessedBlock) {
    const url =
        "https://api.etherscan.io/v2/api" +
        `?module=account` +
        `&action=txlist` +
        `&chainid=${CHAIN_ID}` +
        `&address=${address}` +
        `&startblock=${lastProcessedBlock + 1}` +
        `&endblock=latest` +
        `&sort=asc` +
        `&page=1` +
        `&offset=100` +
        `&apikey=${ETHERSCAN_API_KEY}`;

    const res = await fetch(url);
    const data = await res.json();

    if (data.status !== "1") {
        return [];
    }

    return data.result;
}


/* ===============================
   4. Main sync logic
   =============================== */

async function syncDonations() {
    console.log("Starting donation sync...");

    // Step 2: Read all campaigns
    const campaignsSnap = await db.collection("INFORMATION").get();

    if (campaignsSnap.empty) {
        console.log("No campaigns found.");
        return;
    }

    for (const doc of campaignsSnap.docs) {
        const campaignId = doc.id;
        const { address } = doc.data();

        const wallet_address = `address`.toLowerCase();

        if (!wallet_address) continue;

        let { lastProcessedBlock } = doc.data();

        if (Number.isNaN(lastProcessedBlock)) {
            lastProcessedBlock = 9965000;
        }


        console.log(`\nChecking wallet: ${address} (Campaign: ${campaignId})`);
        console.log("Last processed block:", lastProcessedBlock);
        let highestBlock = lastProcessedBlock;
        // Step 4: Fetch blockchain transactions

        const transactions = await fetchIncomingTransactions(address, lastProcessedBlock);

        for (const tx of transactions) {
            // Step 5: Filter incoming + valid 


            if (
                tx.from.toLowerCase()===address.toLowerCase()||
                tx.isError !== "0" ||
                tx.value === "0"
            ) {
                continue;
            }
            const txHash = tx.hash;

            // Step 6: Deduplication
            const donationRef = db.collection(`DONATION-${campaignId}`).doc(txHash);
            const existing = await donationRef.get();
            const metaRef = db.collection("INFORMATION").doc(`${campaignId}`);


            if (existing.exists) {
                continue;
            }

            // Step 7: Log donation
            await donationRef.set({
                campaignId,
                campaignWallet: address,
                donorAddress: tx.from,
                amountWei: tx.value,
                amountEth: Number(tx.value) / 1e18,
                blockNumber: Number(tx.blockNumber),
                timestamp: new Date(Number(tx.timeStamp) * 1000),
                txHash,
            });
            highestBlock = Math.max(highestBlock, Number(tx.blockNumber));

            await metaRef.update({
                lastProcessedBlock: highestBlock,
            });

            console.log(`Updated last block :${highestBlock}`);
            console.log(`Logged donation: ${txHash}`);
        }

    }

    console.log("\nDonation sync completed.");
}

/* ===============================
   5. Run
   =============================== */

syncDonations();
