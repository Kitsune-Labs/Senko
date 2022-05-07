const Icons = require("../../Data/Icons.json");
const ShopItems = require("../../Data/Shop/Items.json");
const { Bitfield } = require("bitfields");
const BitData = require("../../API/Bits.json");
const { stringEndsWithS, fetchData } = require("../../API/Master");

module.exports = {
    name: "profile",
    desc: "Your profile, or someone else's",
    options: [
        {
            name: "user",
            description: "Someone else",
            required: false,
            type: "USER"
        }
    ],
    /**
     * @param {CommandInteraction} interaction
     */
    start: async (SenkoClient, interaction, GuildData, AccountData) => {
        const User = interaction.options.getUser("user") || interaction.user;
        AccountData = await fetchData(User, 1);

        if (User.id === interaction.user.id) AccountData = await fetchData(User);

        if (!AccountData) return interaction.reply({ content: "This person doesn't have a profile!", ephemeral: true });

        const AccountFlags = Bitfield.fromHex(AccountData.LocalUser.config.flags);

        if (User.id !== interaction.user.id && AccountFlags.get(BitData.privacy)) return interaction.reply({
            content: "Sorry! This user has set their profile to private.",
            ephemeral: true
        });

        const MessageBuilt = {
            embeds: [
                {
                    description: `${AccountData.LocalUser.config.title || ""} **${stringEndsWithS(User.username || User.username)}** Profile\n\n${AccountData.LocalUser.AboutMe !== null ? `**__About Me__**\n${AccountData.LocalUser.AboutMe}\n\n` : ""}${Icons.yen}  **${AccountData.Currency.Yen}** yen\n${Icons.tofu}  **${AccountData.Currency.Tofu}** tofu\n${Icons.tail1}  **${AccountData.Stats.Fluffs}** fluffs\n${Icons.medal}  **${AccountData.Achievements.length}** achievements\n\n`,
                    image: {
                        url: `attachment://${(AccountData.LocalUser.Banner.endsWith(".png") ? "banner.png" : "banner.gif")}`
                    },
                    color: AccountData.LocalUser.config.color || SenkoClient.colors.light
                }
            ],
            files: [{ attachment: `src/Data/content/banners/${(ShopItems[AccountData.LocalUser.Banner] ? ShopItems[AccountData.LocalUser.Banner].banner : ShopItems.DefaultBanner.banner)}`, name: AccountData.LocalUser.Banner.endsWith(".png") ? "banner.png" : "banner.gif" }]
        };

        let BadgeString = "**__Badges__**\n";
        let BAmount = 0;

        for (var item of AccountData.Inventory) {
            const sItem = ShopItems[item.codename];

            if (sItem && sItem.badge !== undefined /*&& BAmount < 10*/) {
                BadgeString += `${sItem.badge || Icons.tick} `;

                BAmount++;
            }// else if (BAmount > 10) BAmount++;
        }

        if (BAmount != 0) MessageBuilt.embeds[0].description += BadgeString;

        interaction.reply(MessageBuilt);
    }
};