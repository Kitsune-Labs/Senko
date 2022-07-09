const ShopItems = require("../../src/Data/Shop/Items.jsonson");

require("dotenv/config");

const Firebase = require("firebase-admin");

Firebase.initializeApp({
	credential: Firebase.credential.cert({
		"projectId": process.env.NIGHTLY_FIREBASE_PROJECT_ID,
		"private_key": process.env.NIGHTLY_FIREBASE_PRIVATE_KEY,
		"client_email": process.env.NIGHTLY_FIREBASE_CLIENT_EMAIL
	})
});

const Firestore = Firebase.firestore();

const Items = [];

new Promise((res) => {
	for (var Item of Object.keys(ShopItems)) {
		Items.push({ codename: Item, amount: 777 });
	}

	res();
}).then(async () => {
	await Firestore.collection("Users").doc("609097445825052701").update({
		Inventory: Items
	});

	console.log("Done");
});
