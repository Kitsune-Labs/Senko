/* Not finished */
import { Colors, Guild, GuildMember } from "discord.js";
import { fetchSuperGuild, updateSuperGuild } from "./super";
import { GuildWarn } from "../types/SupabaseTypes";
import { v4 as uuidv4 } from "uuid";

export async function BanMember({ Guild, Moderator, User, Reason }: {
	Guild: Guild;
	Moderator: GuildMember;
	User: GuildMember;
	Reason?: string;
}) {
	Guild.members.ban(User, {
		reason: `${Moderator.user.tag} - ${Reason}` || `${Moderator.user.tag} - No reason provided.`
	}).then(() => {
		return {
			status: true,
			message: "Successfully banned the user."
		};
	}).catch((error: any) => {
		return {
			status: false,
			message: error
		};
	});
}

export async function KickMember({ GuildMember, Moderator, Reason }: {
	GuildMember: GuildMember;
	Moderator: GuildMember;
	Reason?: string;
}) {
	GuildMember.kick(`${Moderator.user.tag} - ${Reason}` || `${Moderator.user.tag} - No reason provided.`).then(() => {
		return {
			status: true,
			message: "Successfully kicked the user."
		};
	}).catch((error: any) => {
		return {
			status: false,
			message: error
		};
	});
}

export async function WarnMember({ Guild, Moderator, GuildMember, Reason, Note }: {
	Guild: Guild
	Moderator: GuildMember;
	GuildMember: GuildMember;
	Reason?: string;
	Note?: string;
}) {
	const guildData = await fetchSuperGuild(Guild);
	if (!guildData) return {
		status: false,
		message: "Failed to fetch guild data."
	};

	const guildWarns = guildData.warns;

	const warnStruct: GuildWarn = {
		userTag: GuildMember.user.tag,
		userId: GuildMember.user.id,
		reason: Reason || "No reason provided.",
		note: Note || "No note provided.",
		date: Date.now(),
		moderator: Moderator.user.tag,
		moderatorId: Moderator.user.id,
		uuid: uuidv4().slice(0, 8),
		userDmd: false
	};

	if (GuildMember.id in guildWarns) {
		guildWarns[GuildMember.id]!.push(warnStruct);
	} else {
		guildWarns[GuildMember.id] = [warnStruct];
	}

	await updateSuperGuild(Guild, {
		warns: guildWarns
	});

	GuildMember.send({
		embeds: [
			{
				title: `You have been warned in ${Guild!.name}`,
				description: `Your reason: ${warnStruct.reason}\nNote: ${warnStruct.note}`,
				color: Colors.Yellow
			}
		]
	}).then(() => {
		return {
			status: true,
			message: "Successfully warned the user."
		};
	}).catch((error: any) => {
		return {
			status: false,
			message: error
		};
	});
}