---
name: Command Request
about: Request a new command
title: ''
labels: Feature Request
assignees: ''

---

## What is it that you want added (or modified)?


## If you want to make it yourself here is a template

```js
const { CommandInteraction } = require("discord.js");
const Icons = require("../../Data/Icons.json");

/**
 * Avaliable Icons (Case Sensitive)

 * Icons.exp
 * Icons.yen
 * Icons.tofu
 * Icons.medal
 * Icons.powerup
 * Icons.hojicha
 * Icons.beta

 * Icons.check
 * Icons.tick
 * Icons.package

 * Icons.exclamation
 * Icons.tail1
 * Icons.ThinkCloud
 * Icons.zzz
 * Icons.heart
 */

module.exports = {
    name: "", // Command name (No spaces)
    desc: "",
    options: [], // https://discord.js.org/#/docs/discord.js/stable/typedef/CommandInteractionOption
    no_data: true, // Enable the use of GuildData and AccountData (true = no data)
    /**
     * @param {CommandInteraction} interaction
     */
    start: async (SenkoClient, interaction, GuildData, AccountData) => {

    }
};
```