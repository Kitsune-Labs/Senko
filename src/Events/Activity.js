const { fetchSupabaseApi } = require("../API/super.js");
const Supabase = fetchSupabaseApi();

module.exports = {
	/**
     * @param {Client} SenkoClient
     */
	execute: async (SenkoClient) => {
		async function switchActivity() {
			const { data } = await Supabase.from("config").select("*").eq("id", "all");

			SenkoClient.user.setPresence(data[0].activity[Math.floor(Math.random() * data[0].activity.length)]);
		}

		switchActivity();

		setInterval(switchActivity, 3600000);
	}
};
