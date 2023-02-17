import { fetchConfig } from "../API/super";
import type { SenkoClientTypes } from "../types/AllTypes";

export default class {
	async execute(senkoClient: SenkoClientTypes) {
		async function switchActivity() {
			const data = await fetchConfig();

			senkoClient.user!.setPresence(data.activity[Math.floor(Math.random() * data.activity.length)]);
		}

		switchActivity();

		setInterval(switchActivity, 3600000);
	}
}