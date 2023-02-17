import type { SenkoClientTypes } from "../types/AllTypes";
import { fetchSupabaseApi } from "../API/super";
const supabase = fetchSupabaseApi();

export default class {
	// @ts-ignore
	// eslint-disable-next-line @typescript-eslint/no-unused-vars
	async execute(senkoClient: SenkoClientTypes) {
		supabase.channel("timeban-channel")
			.on("postgres_changes", { event: "*", schema: "public", table: "TimeBans" }, (payload) => {
				console.log("Change received!", payload);
			}).subscribe();
	}
}