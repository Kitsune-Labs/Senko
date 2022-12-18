// eslint-disable-next-line no-unused-vars
const { Client } = require("discord.js");
// eslint-disable-next-line no-unused-vars
const { print } = require("@kitsune-labs/utilities");
const SuperAPI = require("../API/super.js");
const supabase = SuperAPI.fetchSupabaseApi();

module.exports = {
	/**
     * @param {Client} senkoClient
     */
	// eslint-disable-next-line no-unused-vars
	execute: async (senkoClient) => {
		supabase.channel("timeban-channel")
			.on("postgres_changes", { event: "*", schema: "public", table: "TimeBans" }, (payload) => {
				console.log("Change received!", payload);
			}).subscribe();
	}
};