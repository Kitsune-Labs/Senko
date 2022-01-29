/* eslint-disable */

module.exports = {
    /**
     * @param {Client} SenkoClient
     */
    execute: async (SenkoClient) => {
        const Status = [
            { activities: [{ name: "do you think Nakano wants to engulf in my tail again?" }] },
            { activities: [{ name: "/fluff" }] },
            { activities: [{ name: "Uya!" }] },
            { activities: [{ name: "Umu~ Umu~" }] },
            { activities: [{ name: "nom nom" }] },
            { activities: [{ name: "poof!" }] },
            { activities: [{ name: "/pat" }] },
            { activities: [{ name: "what is Nakano thinking?" }] },
            { activities: [{ name: "how much is fried tofu?" }] },
            { activities: [{ name: "ヾ(•ω•`)o" }] },
        ];

        switchActivity = () => {
            SenkoClient.user.setPresence(Status[Math.floor(Math.random() * Status.length)]);
        };

        switchActivity();

        setInterval(switchActivity, 120 * 1000 * 60);
    }
};
