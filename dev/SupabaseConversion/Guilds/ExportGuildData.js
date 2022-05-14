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


Firestore.collection("Guilds").get().then(async querySnapshot => {
    querySnapshot.docs.forEach(async doc => {
        const guildData = doc.data();

        fs.appendFileSync("./dev/SupabaseConversion/guilds.json", JSON.stringify(guildData) + ",\n");
    });
});