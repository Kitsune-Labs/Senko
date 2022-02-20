const { MessageActionRow, MessageSelectMenu } = require("discord.js");
const Icons = require("../../Data/Icons.json");

const ShopItems = require("../../Data/Shop/Items.json");
const BannerList = require("../../Data/Banners.json");
const { Bitfield } = require("bitfields");
const BitData = require("../../API/Bits.json");


module.exports = {
    name: "config",
    desc: "Configure your profile and account settings",
    userData: true,
    options: [
        {
            name: "banner",
            description: "Change your Profile Card banner",
            type: 1
        },
        {
            name: "settings",
            description: "Change your account settings",
            type: 1
        },
        {
            name: "title",
            description: "Change your Profile Card title",
            type: 1
        },
        {
            name: "color",
            description: "Change your Profile Card color",
            type: 1
        }
    ],
    /**
     * @param {CommandInteraction} interaction
     */
    start: async (SenkoClient, interaction, GuildData, AccountData) => {
        const Command = interaction.options.getSubcommand();

        await interaction.deferReply({ ephemeral: true, fetchReply: true });

        switch (Command) {
            case "banner":
                if (!AccountData.Inventory[0]) return interaction.followUp({
                    content: "You don't have anything, you can find items to buy with /shop!",
                    ephemeral: true
                });

                var Banners = [
                    { label: "Default Banner", value: "banner_change_default", description: "The banner everyone gets" }
                ];

                new Promise((resolve) => {
                    for (var Item of AccountData.Inventory) {
                        const ShopItem = ShopItems[Item.codename];

                        if (ShopItem.type && ShopItem.type === "banner") {
                            Banners.push({ label: `${ShopItem.name}`, value: `banner_change_${ShopItem.id}`, description: `${ShopItem.desc}`});
                        }
                    }

                    resolve();
                }).then(() => {
                    if (!Banners[1]) return interaction.followUp({
                        content: "You don't own any banners, you can find them in the shop when they're onsale!",
                        ephemeral: true
                    });

                    interaction.followUp({
                        content: "Select a banner to equip in the dropdown menu! (Will equip on click)",
                        components: [ new MessageActionRow().addComponents([
                            new MessageSelectMenu()
                            .setCustomId("banner_set")
                            .setPlaceholder(`Currently ${BannerList[AccountData.LocalUser.Banner]}`)
                            .setOptions(Banners)
                        ])],
                        ephemeral: true
                    });
                });
            break;
            case "settings":
                var AccountFlags = Bitfield.fromHex(await AccountData.LocalUser.config.flags);

                var AccountEmbed = {
                    title: "Account Settings",
                    fields: [],
                    color: SenkoClient.colors.light
                };

                var Components = [
                    {
                        type: 1,
                        components: [
                            { type: 2, label: "Change Privacy", style: 3, custom_id: "user_privacy" }
                        ]
                    }
                ];

                if (AccountFlags.get(BitData.privacy)) {
                    AccountEmbed.fields.push({ name: "Private Profile", value: `${Icons.check} private. Only you can view your profile.` });
                } else {
                    AccountEmbed.fields.push({ name: "Private Profile", value: `${Icons.tick} not private. Everyone can view your profile.`, inline: true });
                }

                interaction.followUp({
                    embeds: [AccountEmbed],
                    ephemeral: true,
                    components: Components
                });
            break;

            case "title":
                if (!AccountData.Inventory[0]) return interaction.followUp({
                    content: "You don't have anything, you can find items to buy with /shop!",
                    ephemeral: true
                });

                var TitleColors = [
                    { label: "No Title", value: "title_none", description: "Default"}
                ];

                new Promise((resolve) => {
                    for (var Item of AccountData.Inventory) {
                        const ShopItem = ShopItems[Item.codename];

                        if (ShopItem.title) {
                            TitleColors.push({ label: `${ShopItem.name}`, value: `title_${ShopItem.id}`, description: `${ShopItem.desc}`});
                        }
                    }

                    resolve();
                }).then(() => {
                    if (!TitleColors[1]) return interaction.followUp({
                        content: "You don't own any titles, you can find them in the shop when they're onsale!",
                        ephemeral: true
                    });

                    interaction.followUp({
                        content: "Select a title to equip in the dropdown menu! (Will equip on click)",
                        components: [ new MessageActionRow().addComponents([
                            new MessageSelectMenu()
                            .setCustomId("title_equip")
                            .setPlaceholder(`Currently ${AccountData.LocalUser.config.title ? AccountData.LocalUser.config.title : "No Title"}`)
                            .setOptions(TitleColors)
                        ])],
                        ephemeral: true
                    });
                });
            break;

            case "color":
                if (!AccountData.Inventory[0]) return interaction.followUp({
                    content: "You don't have anything, you can find items to buy with /shop!",
                    ephemeral: true
                });

                var ColorColors = [
                    { label: "Default Color", value: "color_change_default", description: "The color everyone gets"}
                ];

                new Promise((resolve) => {
                    for (var Item of AccountData.Inventory) {
                        const ShopItem = ShopItems[Item.codename];

                        if (ShopItem.color) {
                            ColorColors.push({ label: `${ShopItem.name}`, value: `color_change_${ShopItem.id}`, description: `${ShopItem.desc}`});
                        }
                    }

                    resolve();
                }).then(() => {
                    if (!ColorColors[1]) return interaction.followUp({
                        content: "You don't own any colors, you can find them in the shop when they're onsale!",
                        ephemeral: true
                    });

                    interaction.followUp({
                        content: "Select a color to equip in the dropdown menu! (Will equip on click)",
                        components: [ new MessageActionRow().addComponents([
                            new MessageSelectMenu()
                            .setCustomId("banner_set")
                            .setPlaceholder(`Currently ${AccountData.LocalUser.config.color})`)
                            .setOptions(ColorColors)
                        ])],
                        ephemeral: true
                    });
                });
            break;
        }
    }
};