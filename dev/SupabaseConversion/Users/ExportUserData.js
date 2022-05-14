require("dotenv/config");
const fs = require("fs");
const Firebase = require("firebase-admin");

Firebase.initializeApp({
    credential: Firebase.credential.cert({
        "projectId": process.env.FIREBASE_PROJECT_ID,
        "private_key": process.env.FIREBASE_PRIVATE_KEY,
        "client_email": process.env.FIREBASE_CLIENT_EMAIL
    })
});

const Firestore = Firebase.firestore();


let amount = 0;

Firestore.collection("Users").get().then(async querySnapshot => {
    querySnapshot.docs.forEach(async doc => {
        const guildData = doc.data();

        // if (amount >= 3) return;

        amount++;

        fs.appendFileSync("./dev/SupabaseConversion/Users/users.json", JSON.stringify({ userId: [doc.id], ...guildData }) + ",\n");
    });
});