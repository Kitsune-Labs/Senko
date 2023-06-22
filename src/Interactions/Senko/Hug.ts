import Icons from "../../Data/Icons.json";
import hardLinks from "../../Data/HardLinks.json";
import { addYen, calcTimeLeft } from "../../API/Master";
import { randomNumber, randomArrayItem } from "@kitsune-labs/utilities";
import config from "../../Data/DataConfig.json";
import { updateSuperUser } from "../../API/super";
import type { SenkoCommand } from "../../types/AllTypes";

const Responses = [
	"_USER_ hugs Senko-san"
];

const Sounds = [
	"Umu~",
	"Umu Umu"
];

const MoreResponses = [
	`${Icons.heart}  We can hug more _TIMELEFT_`,
	`${Icons.exclamation}  We can hug more _TIMELEFT_! Geez, you're so spoiled!`,
	`${Icons.heart}  I'll be pampering you more _TIMELEFT_, look forward to it!`
];

export default {
	name: "hug",
	desc: "Hug Senko-san or another kitsune in your guild!",
	options: [
		{
			name: "user",
			description: "Hug someone",
			type: 6
		}
	],
	defer: true,
	category: "fun",
	start: async ({ Senko, Interaction, MemberData }) => {
		const OptionalUser = Interaction.options.getUser("user");

		if (OptionalUser) {
			const Messages = [
				`${Interaction.user} hugs ${OptionalUser}!`,
				`${OptionalUser} has been hugged by ${Interaction.user}!`
			];

			if (OptionalUser.id === Interaction.user.id) return Interaction.followUp({
				embeds: [
					{
						description: `${Icons.heart}  It's okay dear, ill hug you...`,
						color: Senko.Theme.light,
						image: {
							url: randomArrayItem(hardLinks.media.hugs)
						}
					}
				]
			});

			return Interaction.followUp({
				embeds: [
					{
						description: `${randomArrayItem(Messages)}`,
						image: {
							url: randomArrayItem(hardLinks.media.hugs)
						},
						color: Senko.Theme.light
					}
				]
			});
		}

		const MessageStruct = {
			embeds: [
				{
					title: "",
					description: randomArrayItem(Responses).replace("_USER_", Interaction.user.username),
					color: Senko.Theme.light,
					thumbnail: {
						url: "https://cdn.senko.gg/public/senko/hug_tail.png"
					}
				}
			]
		};

		if (calcTimeLeft(MemberData.RateLimits.Hug_Rate.Date, config.cooldowns.daily)) {
			MemberData.RateLimits.Hug_Rate.Amount = 0;
			MemberData.RateLimits.Hug_Rate.Date = Date.now();

			await updateSuperUser(Interaction.user, {
				RateLimits: {
					// eslint-disable-next-line camelcase
					Hug_Rate: {
						Amount: 0,
						Date: Date.now()
					}
				}
			});

			MemberData.RateLimits.Hug_Rate.Amount = 0;
		}

		if (MemberData.RateLimits.Hug_Rate.Amount >= 20) {
			MessageStruct.embeds[0]!.description = `${randomArrayItem(MoreResponses).replace("_TIMELEFT_", `<t:${Math.floor((MemberData.RateLimits.Hug_Rate.Date + config.cooldowns.daily) / 1000)}:R>`)}`;
			MessageStruct.embeds[0]!.thumbnail.url = "https://cdn.senko.gg/public/senko/bummed.png";

			return Interaction.followUp(MessageStruct);
		}

		if (randomNumber(100) > 75) {
			addYen(Interaction.user, 50);

			MessageStruct.embeds[0]!.description += `\n\n— ${Icons.yen}  50x added for Interaction`;
		}

		MessageStruct.embeds[0]!.title = randomArrayItem(Sounds);

		MemberData.Stats.Hugs++;
		MemberData.RateLimits.Hug_Rate.Amount++;
		MemberData.RateLimits.Hug_Rate.Date = Date.now();

		await updateSuperUser(Interaction.user, {
			Stats: MemberData.Stats,

			RateLimits: MemberData.RateLimits
		});

		if (MemberData.RateLimits.Hug_Rate.Amount >= 20) MessageStruct.embeds[0]!.description += `\n\n— ${Icons.bubble}  Senko-san says this should be our last hug for now`;

		Interaction.followUp(MessageStruct);
	}
} as SenkoCommand;