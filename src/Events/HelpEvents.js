// eslint-disable-next-line no-unused-vars
const { Client, CommandInteraction } = require("discord.js");
// eslint-disable-next-line no-unused-vars
const { print } = require("../API/Master.js");
// eslint-disable-next-line no-unused-vars
const Icons = require("../Data/Icons.json");


module.exports = {
    /**
     * @param {Client} SenkoClient
     */
    // eslint-disable-next-line no-unused-vars
    execute: async (SenkoClient) => {
        /**
         * @param {CommandInteraction} interaction
         */
        SenkoClient.on("interactionCreate", (interaction) => {
            if (!interaction.isButton()) return;

            switch (interaction.customId) {
                case "help_home":
                    interaction.update({
                        embeds: [
                            {
                                author: {
                                    name: "Index",
                                },
                                title: "📄 Messenger Index (Help)",
                                description: "If you find an issue or want to suggest something please find us\n[in our community server!](https://discord.gg/senko)\n\n≻ **Fun**\n≻ **Economy**\n≻ **Social**\n≻ **Administration**\n≻ **Blank**",
                                color: SenkoClient.colors.random(),
                            }
                        ],
                        components: [
                            {
                                type: 1,
                                components: [
                                    { type: 2, label: "Home", style: 1, custom_id: "help_home", disabled: true },
                                    { type: 2, label: "Fun", style: 2, custom_id: "help_fun" },
                                    { type: 2, label: "Economy", style: 2, custom_id: "help_economy" },
                                    { type: 2, label: "Social", style: 2, custom_id: "help_social" },
                                    { type: 2, label: "Administration", style: 2, custom_id: "help_admin" }
                                ]
                            },
                            {
                                type: 1,
                                components: [
                                    { type: 2, label: "Account", style: 2, custom_id: "help_account" }
                                ]
                            }
                        ]
                    });
                    break;
                case "help_fun":
                    interaction.update({
                        embeds: [
                            {
                                author: {
                                    name: "Index ≻ Fun",
                                },
                                title: "📑 Fun Commands",
                                description: "≻ **Fluff** — Mofumofu!\n≻ **Pat** — Pat Senko's Head (Don't touch her ears!)\n≻ **Hug** — Hug Senko-san or another kitsune in your guild!\n≻ **Cuddle** — Cuddle with Senko-san!\n≻ **Drink** — Have Senko-san prepare you a drink\n≻ **Eat** — Eat something with Senko\n≻ **Rest** — Rest on Senkos lap\n≻ **Sleep** — Sleep on Senko's lap\n≻ **Smile** — :>",
                                color: SenkoClient.colors.random(),
                            }
                        ],
                        components: [
                            {
                                type: 1,
                                components: [
                                    { type: 2, label: "Home", style: 4, custom_id: "help_home", disabled: false },
                                    { type: 2, label: "Fun", style: 1, custom_id: "help_fun", disabled: true  },
                                    { type: 2, label: "Economy", style: 2, custom_id: "help_economy", disabled: false  },
                                    { type: 2, label: "Social", style: 2, custom_id: "help_social", disabled: false  },
                                    { type: 2, label: "Administration", style: 2, custom_id: "help_admin", disabled: false  }
                                ]
                            },
                            {
                                type: 1,
                                components: [
                                    { type: 2, label: "Account", style: 2, custom_id: "help_account" }
                                ]
                            }
                        ]
                    });
                    break;
                case "help_economy":
                    interaction.update({
                        embeds: [
                            {
                                author: {
                                    name: "Index ≻ Economy",
                                },
                                title: "📑 Economy Commands",
                                description: "≻ **Shop** — Buy item's from Senko's Market\n≻ **Preview** — Preview an item from Senko's Market\n≻ **Inventory** — View the items you have collected\n≻ **Claim** — Claim rewards from Senko\n≻ **Funds** — View the amount of currency you have saved\n≻ **Stats** — View your account stats\n≻ **Work** — Have Nakano go to work to provide us with income",
                                color: SenkoClient.colors.random(),
                            }
                        ],
                        components: [
                            {
                                type: 1,
                                components: [
                                    { type: 2, label: "Home", style: 4, custom_id: "help_home", disabled: false },
                                    { type: 2, label: "Fun", style: 2, custom_id: "help_fun", disabled: false  },
                                    { type: 2, label: "Economy", style: 1, custom_id: "help_economy", disabled: true  },
                                    { type: 2, label: "Social", style: 2, custom_id: "help_social", disabled: false  },
                                    { type: 2, label: "Administration", style: 2, custom_id: "help_admin", disabled: false  }
                                ]
                            },
                            {
                                type: 1,
                                components: [
                                    { type: 2, label: "Account", style: 2, custom_id: "help_account" }
                                ]
                            }
                        ]
                    });
                    break;
                case "help_social":
                    interaction.update({
                        embeds: [
                            {
                                author: {
                                    name: "Index ≻ Social",
                                },
                                title: "📑 Social Commands",
                                description: "≻ **OwOify** — UwU OwO\n≻ **Rate** — Rate something\n≻ **Read** — Read the manga chapters you get from the market!\n≻ **Poll** — Create a poll",
                                color: SenkoClient.colors.random(),
                            }
                        ],
                        components: [
                            {
                                type: 1,
                                components: [
                                    { type: 2, label: "Home", style: 4, custom_id: "help_home", disabled: false },
                                    { type: 2, label: "Fun", style: 2, custom_id: "help_fun", disabled: false  },
                                    { type: 2, label: "Economy", style: 2, custom_id: "help_economy", disabled: false  },
                                    { type: 2, label: "Social", style: 1, custom_id: "help_social", disabled: true  },
                                    { type: 2, label: "Administration", style: 2, custom_id: "help_admin", disabled: false  }
                                ]
                            },
                            {
                                type: 1,
                                components: [
                                    { type: 2, label: "Account", style: 2, custom_id: "help_account" }
                                ]
                            }
                        ]
                    });
                    break;
                case "help_admin":
                    interaction.update({
                        embeds: [
                            {
                                author: {
                                    name: "Index ≻ Administration",
                                },
                                title: "📑 Administration Commands",
                                description: "≻ **channel** — Add/Remove channels where Senko can be used in; Member must be able to Manage Channels for use\n≻ **avatar** — View someone's avatar, and banner if they have one\n≻ **whois** — Public account information\n≻ **server** — Server configuration; Member must be an Administrator to edit\n≻ **warn** — Warn a user; Member must be able to Moderate Members\n≻ **clean** — Clean a channel of it's messages; Member must be able to Manage Messages",
                                color: SenkoClient.colors.random(),
                            }
                        ],
                        components: [
                            {
                                type: 1,
                                components: [
                                    { type: 2, label: "Home", style: 4, custom_id: "help_home", disabled: false },
                                    { type: 2, label: "Fun", style: 2, custom_id: "help_fun", disabled: false  },
                                    { type: 2, label: "Economy", style: 2, custom_id: "help_economy", disabled: false  },
                                    { type: 2, label: "Social", style: 2, custom_id: "help_social", disabled: false  },
                                    { type: 2, label: "Administration", style: 1, custom_id: "help_admin", disabled: true  }
                                ]
                            },
                            {
                                type: 1,
                                components: [
                                    { type: 2, label: "Account", style: 2, custom_id: "help_account" }
                                ]
                            }
                        ]
                    });
                    break;
                case "help_account":
                    interaction.update({
                        embeds: [
                            {
                                author: {
                                    name: "Index ≻ Account",
                                },
                                title: "📑 Account Commands",
                                description: "≻ **delete data** — Delete all your Account data\n≻ **AboutMe** — Modify your about me message!\n≻ **config** — Configure your profile and account settings\n≻ **Profile** — View yours or someone's profile",
                                color: SenkoClient.colors.random(),
                            }
                        ],
                        components: [
                            {
                                type: 1,
                                components: [
                                    { type: 2, label: "Home", style: 4, custom_id: "help_home", disabled: false },
                                    { type: 2, label: "Fun", style: 2, custom_id: "help_fun", disabled: false  },
                                    { type: 2, label: "Economy", style: 2, custom_id: "help_economy", disabled: false  },
                                    { type: 2, label: "Social", style: 2, custom_id: "help_social", disabled: false  },
                                    { type: 2, label: "Administration", style: 2, custom_id: "help_admin", disabled: false  }
                                ]
                            },
                            {
                                type: 1,
                                components: [
                                    { type: 2, label: "Account", style: 1, custom_id: "help_account", disabled: true  }
                                ]
                            }
                        ]
                    });
                    break;
            }
        });
    }
};