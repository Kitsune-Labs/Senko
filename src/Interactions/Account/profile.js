const Icons = require("../../Data/Icons.json");
const { getData } = require("../../API/v2/FireData.js");
const ShopItems = require("../../Data/Shop/Items.json");
const { Bitfield } = require("bitfields");
const BitData = require("../../API/Bits.json");

module.exports = {
    name: "profile",
    desc: "View yours or someone's profile",
    /**
     * @param {CommandInteraction} interaction
     */
    start: async (SenkoClient, interaction, GuildData, AccountData) => {
        const User = interaction.options.getUser("user") || interaction.member;
        if (User.id !== interaction.user.id) AccountData = await getData(User, 1);

        const AccountFlags = Bitfield.fromHex(AccountData.LocalUser.config.flags);
        if (User.id !== interaction.user.id && AccountFlags.get(BitData.privacy)) return interaction.reply({
            content: "Sorry! This user has set their profile to private.",
            ephemeral: true
        });

        const MessageBuilt = {
            embeds: [
                {
                    description: `${AccountData.LocalUser.config.title || ""} **${User.user.username.endsWith("s") ? User.user.username : User.user.username + "'s"}** Profile\n${Icons.yen}  ${AccountData.Currency.Yen}x\n${Icons.tofu}  ${AccountData.Currency.Tofu}x`,
                    fields: [
                        { name: "About Me", value: `${AccountData.LocalUser.AboutMe || "** **"}` },
                        { name: "Stats", value: `${Icons.tail1}  **${AccountData.Stats.Fluffs}**x fluffs\n${Icons.medal}  **${AccountData.Achievements.length}** awards`, inline: true }

                    ],
                    image: {
                        url: `attachment://${(AccountData.LocalUser.Banner.endsWith(".png") ? "banner.png" : "banner.gif")}`
                    },
                    color: AccountData.LocalUser.config.color || SenkoClient.colors.light
                }
            ],
            files: [ { attachment: `src/Data/content/banners/${AccountData.LocalUser.Banner}`, name: AccountData.LocalUser.Banner.endsWith(".png") ? "banner.png" : "banner.gif"} ]
        };

        let BadgeString = "";
        let BAmount = 0;

        for (var item of AccountData.Inventory) {
            const sItem = ShopItems[item.codename];

            if (sItem && sItem.badge !== undefined && BAmount < 10) {
                BadgeString += `${sItem.badge || Icons.tick} `;

                BAmount++;
            } else if (BAmount > 10) BAmount++;
        }

        if (BAmount > 10) BadgeString += `\n+${BAmount}`;

        if (BadgeString.length === 0) BadgeString = "** **";
        MessageBuilt.embeds[0].fields.push({ name: "Badges", value: BadgeString, inline: true });

        interaction.reply(MessageBuilt);
    }
};