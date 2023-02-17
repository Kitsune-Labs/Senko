import { ButtonStyle } from "discord.js";
import { fetchSupabaseApi, updateSuperUser } from "../API/super";
import type { SenkoClientTypes } from "../types/AllTypes";
const Supabase = fetchSupabaseApi();

export default class {
	async execute(senkoClient: SenkoClientTypes) {
		senkoClient.on("interactionCreate", async Interaction => {
			if (Interaction.isButton()) {
				if (Interaction.customId.startsWith("removal:")) {
					switch (Interaction.customId.split(":")[1]) {
					case "30":
						await updateSuperUser(Interaction.user, {
							DeletionDays: 30
						});

						for (var a of Interaction.message.components[1]!.components) {
							// @ts-expect-error
							a.data.style = ButtonStyle.Primary;
							// @ts-expect-error
							a.data.disabled = false;
						}

						// @ts-expect-error
						Interaction.message.components[1]!.components[0]!.data.style = ButtonStyle.Success;
						// @ts-expect-error
						Interaction.message.components[1]!.components[0]!.data.disabled = true;

						Interaction.update({
							embeds: [
								// @ts-ignore
								Interaction.message.embeds[0],
								{
									title: "Data Settings",
									description: "Your data will be deleted in **__30__** days without use.",
									color: senkoClient.api.Theme.light
								}
							],
							components: Interaction.message.components
						});
						break;
					case "60":
						await updateSuperUser(Interaction.user, {
							DeletionDays: 60
						});

						for (var a2 of Interaction.message.components[1]!.components) {
							// @ts-expect-error
							a2.data.style = ButtonStyle.Primary;
							// @ts-expect-error
							a2.data.disabled = false;
						}

						// @ts-expect-error
						Interaction.message.components[1]!.components[1]!.data.style = ButtonStyle.Success;
						// @ts-expect-error
						Interaction.message.components[1]!.components[1]!.data.disabled = true;

						Interaction.update({
							embeds: [
								// @ts-ignore
								Interaction.message.embeds[0],
								{
									title: "Data Settings",
									description: "Your data will be deleted in **__60__** days without use.",
									color: senkoClient.api.Theme.light
								}
							],
							components: Interaction.message.components
						});
						break;
					case "365":
						await updateSuperUser(Interaction.user, {
							DeletionDays: 365
						});

						for (var a3 of Interaction.message.components[1]!.components) {
							// @ts-expect-error
							a3.data.style = ButtonStyle.Primary;
							// @ts-expect-error
							a3.data.disabled = false;
						}

						// @ts-expect-error
						Interaction.message.components[1]!.components[2]!.data.style = ButtonStyle.Success;
						// @ts-expect-error
						Interaction.message.components[1]!.components[2]!.data.disabled = true;

						Interaction.update({
							embeds: [
								// @ts-ignore
								Interaction.message.embeds[0],
								{
									title: "Data Settings",
									description: "Your data will be deleted in **__365__** days without use.",
									color: senkoClient.api.Theme.light
								}
							],
							components: Interaction.message.components
						});
						break;
					case "7777777":
						await updateSuperUser(Interaction.user, {
							DeletionDays: 7777777
						});

						for (var a4 of Interaction.message.components[1]!.components) {
							// @ts-expect-error
							a4.data.style = ButtonStyle.Primary;
							// @ts-expect-error
							a4.data.disabled = false;
						}

						// @ts-expect-error
						Interaction.message.components[1]!.components[3]!.data.style = ButtonStyle.Success;
						// @ts-expect-error
						Interaction.message.components[1]!.components[3]!.data.disabled = true;

						Interaction.update({
							embeds: [
								// @ts-ignore
								Interaction.message.embeds[0],
								{
									title: "Data Settings",
									description: "Your data will be deleted in **__7777777__** days without use.",
									color: senkoClient.api.Theme.light
								}
							],
							components: Interaction.message.components
						});
						break;
					}
				} else {
					switch (Interaction.customId) {
					case "B0BB293E-C99E-467C-84DA-663BE1F5EF85":
						// @ts-expect-error
						await Supabase.from("Users").delete().eq("id", Interaction.member!.id);

						Interaction.update({
							embeds: [
								{
									title: "Data Removal",
									description: "🗑️  Your data has been removed",
									color: senkoClient.api.Theme.dark,
									thumbnail: { url: "attachment://image.png" }
								}
							],
							components: [],
							// @ts-ignore
							ephemeral: true
						});
						break;
					}
				}
			}
		});
	}
}