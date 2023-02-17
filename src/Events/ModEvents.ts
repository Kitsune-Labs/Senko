import { fetchSuperGuild, updateSuperGuild } from "../API/super";
import type { SenkoClientTypes } from "../types/AllTypes";
import { Bitfield } from "bitfields";

export default class {
	async execute(senkoClient: SenkoClientTypes) {
		senkoClient.on("interactionCreate", async(interaction) => {
			if (interaction.isButton() && interaction.customId.startsWith("mod:")) {
				const split = interaction.customId.split(":");
				const guildData = await fetchSuperGuild(interaction.guild!);
				const guildFlags = Bitfield.fromHex(guildData!.flags);

				const flags = {
					bans: guildFlags.get(senkoClient.api.BitData.ActionLogs.BanActionDisabled),
					kicks: guildFlags.get(senkoClient.api.BitData.ActionLogs.KickActionDisabled),
					timeout: guildFlags.get(senkoClient.api.BitData.ActionLogs.TimeoutActionDisabled),
					mod_enabled: guildFlags.get(senkoClient.api.BitData.BETAs.ModCommands)
				};

				switch (split[1]) {
				case "ban_log":
					guildFlags.set(senkoClient.api.BitData.ActionLogs.BanActionDisabled, !flags.bans);
					flags.bans = guildFlags.get(senkoClient.api.BitData.ActionLogs.BanActionDisabled);

					await updateSuperGuild(interaction.guild!, {
						flags: guildFlags.toHex()
					});

					interaction.message.embeds[1]!.fields[0]!.value = flags.bans ? "```diff\n- Disabled```" : "```diff\n+ Enabled```";

					await interaction.update({ embeds: interaction.message.embeds });
					break;
				case "kick_log":
					guildFlags.set(senkoClient.api.BitData.ActionLogs.KickActionDisabled, !flags.kicks);
					flags.kicks = guildFlags.get(senkoClient.api.BitData.ActionLogs.KickActionDisabled);

					await updateSuperGuild(interaction.guild!, {
						flags: guildFlags.toHex()
					});

					interaction.message.embeds[1]!.fields[1]!.value = flags.kicks ? "```diff\n- Disabled```" : "```diff\n+ Enabled```";

					await interaction.update({ embeds: interaction.message.embeds });
					break;
				case "timeout_log":
					guildFlags.set(senkoClient.api.BitData.ActionLogs.TimeoutActionDisabled, !flags.timeout);
					flags.timeout = guildFlags.get(senkoClient.api.BitData.ActionLogs.TimeoutActionDisabled);

					await updateSuperGuild(interaction.guild!, {
						flags: guildFlags.toHex()
					});

					interaction.message.embeds[1]!.fields[2]!.value = flags.timeout ? "```diff\n- Disabled```" : "```diff\n+ Enabled```";

					await interaction.update({ embeds: interaction.message.embeds });
					break;
				case "mod_beta":
					guildFlags.set(senkoClient.api.BitData.BETAs.ModCommands, !flags.mod_enabled);
					flags.mod_enabled = guildFlags.get(senkoClient.api.BitData.BETAs.ModCommands);

					await updateSuperGuild(interaction.guild!, {
						flags: guildFlags.toHex()
					});

					interaction.message.embeds[0]!.fields[0]!.value = flags.mod_enabled ? "```diff\n+ Enabled```" : "```diff\n- Disabled```";

					await interaction.update({ embeds: interaction.message.embeds });
					break;
				}
			}
		});
	}
}