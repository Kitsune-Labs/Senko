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
	start: async ({ senkoClient, interaction, userData }) => {
		const OptionalUser = interaction.options.getUser("user");

		if (OptionalUser) {
			const Messages = [
				`${interaction.user} hugs ${OptionalUser}!`,
				`${OptionalUser} has been hugged by ${interaction.user}!`
			];

			if (OptionalUser.id === interaction.user.id) return interaction.followUp({
				embeds: [
					{
						description: `${Icons.heart}  It's okay dear, ill hug you...`,
						color: senkoClient.api.Theme.light,
						image: {
							url: randomArrayItem(hardLinks.media.hugs)
						}
					}
				]
			});

			return interaction.followUp({
				embeds: [
					{
						description: `${randomArrayItem(Messages)}`,
						image: {
							url: randomArrayItem(hardLinks.media.hugs)
						},
						color: senkoClient.api.Theme.light
					}
				]
			});
		}

		const MessageStruct = {
			embeds: [
				{
					title: "",
					description: randomArrayItem(Responses).replace("_USER_", interaction.user.username),
					color: senkoClient.api.Theme.light,
					thumbnail: {
						url: "https://cdn.senko.gg/public/senko/hug_tail.png"
					}
				}
			]
		};

		if (calcTimeLeft(userData.RateLimits.Hug_Rate.Date, config.cooldowns.daily)) {
			userData.RateLimits.Hug_Rate.Amount = 0;
			userData.RateLimits.Hug_Rate.Date = Date.now();

			await updateSuperUser(interaction.user, {
				RateLimits: {
					// eslint-disable-next-line camelcase
					Hug_Rate: {
						Amount: 0,
						Date: Date.now()
					}
				}
			});

			userData.RateLimits.Hug_Rate.Amount = 0;
		}

		if (userData.RateLimits.Hug_Rate.Amount >= 20) {
			MessageStruct.embeds[0]!.description = `${randomArrayItem(MoreResponses).replace("_TIMELEFT_", `<t:${Math.floor((userData.RateLimits.Hug_Rate.Date + config.cooldowns.daily) / 1000)}:R>`)}`;
			MessageStruct.embeds[0]!.thumbnail.url = "https://cdn.senko.gg/public/senko/bummed.png";

			return interaction.followUp(MessageStruct);
		}

		if (randomNumber(100) > 75) {
			addYen(interaction.user, 50);

			MessageStruct.embeds[0]!.description += `\n\n— ${Icons.yen}  50x added for interaction`;
		}

		MessageStruct.embeds[0]!.title = randomArrayItem(Sounds);

		userData.Stats.Hugs++;
		userData.RateLimits.Hug_Rate.Amount++;
		userData.RateLimits.Hug_Rate.Date = Date.now();

		await updateSuperUser(interaction.user, {
			Stats: userData.Stats,

			RateLimits: userData.RateLimits
		});

		if (userData.RateLimits.Hug_Rate.Amount >= 20) MessageStruct.embeds[0]!.description += `\n\n— ${Icons.bubble}  Senko-san says this should be our last hug for now`;

		interaction.followUp(MessageStruct);
	}
} as SenkoCommand;