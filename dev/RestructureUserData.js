//* it works no touchy!!!1!


require("dotenv/config");
const fs = require("fs");
const config = require("../src/Data/DataConfig.json");
const Firebase = require("firebase-admin");

Firebase.initializeApp({
	credential: Firebase.credential.cert({
		"projectId": process.env.FIREBASE_PROJECT_ID,
		"private_key": process.env.FIREBASE_PRIVATE_KEY,
		"client_email": process.env.FIREBASE_CLIENT_EMAIL
	})
});

const DataConfig = require("../src/Data/DataConfig.json");
const { Bitfield } = require("bitfields");

const Firestore = Firebase.firestore();

Firestore.collection("Users").get().then(async querySnapshot => {
	querySnapshot.docs.forEach(async doc => {
		const AccountData = doc.data();

		const DataStructure = {
			Profile: {
				Banner: AccountData.LocalUser.Banner || "DefaultBanner.png",
				Color: AccountData.LocalUser.config.color || "#FF9933",
				Title: AccountData.LocalUser.config.title || null,
				AboutMe: AccountData.LocalUser.AboutMe || null,
				Rank: {
					Level: 1,
					XP: 0
				}
			},
			Account: {
				flags: AccountData.LocalUser.config.flags || new Bitfield(100).toHex(),
				userId: AccountData.LocalUser.userID,
				joined: Date.now()
			},
			Inventory: {},
			Badges: [],
			Achievements: [],
			ActivePowers: [],
			Claimables: [],

			Stats: {
				Rests: AccountData.Stats.Rests || 0,
				Fluffs: AccountData.Stats.Fluffs || 0,
				Pats: AccountData.Stats.Pats || 0,
				Steps: AccountData.Stats.Steps || 0,
				Hugs: AccountData.Stats.Hugs || 0,
				Sleeps: AccountData.Stats.Sleeps || 0,
				Drinks: AccountData.Stats.Drinks || 0
			},

			Currency: {
				Yen: AccountData.Currency.Yen || 100,
				Tofu: AccountData.Currency.Tofu || 0
			},

			RateLimits: {
				Rest_Rate: {
					Date: AccountData.RateLimits.Rest_Rate.Date || 1627604493201,
					Amount: AccountData.RateLimits.Rest_Rate.Amount || 0
				},
				Fluff_Rate: {
					Date:  1627604493201,
					Amount: 0
				},
				Pat_Rate: {
					Date: 1627604493201,
					Amount: 0
				},
				Step_Rate: {
					Date: 1627604493201,
					Amount: 0
				},
				Hug_Rate: {
					Date: 1627604493201,
					Amount: 0
				},
				Sleep_Rate: {
					Date: 1627604493201,
					Amount: 0
				},
				Drink_Rate: {
					Date: 1627604493201,
					Amount: 0
				}
			},

			Rewards: {
				Daily: 1627604493201,
				Weekly: 1627604493201,
				Work: 1627604493201
			}
		};

		for (var key of AccountData.Inventory) {
			DataStructure.Inventory[key.codename] = key.amount;
		}



		// console.log("Done");

		fs.writeFileSync(`./dev/out/${DataStructure.Account.userId}.json`, JSON.stringify(DataStructure, null, 4));

		// return;
		// Firestore.collection("Users").doc(DataStructure.LocalUser.userID).update(DataStructure).then(() =>{
		//     console.log(`Finished ${DataStructure.LocalUser.userID}`);
		// }).catch(err => {
		//     throw new Error(`USER UPDATE: ${err}`);
		// });

	});
});