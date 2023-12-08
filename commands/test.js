const { ApplicationCommandOptionType } = require('discord.js')
const { createHook } = require('discord-player');
module.exports = {
  name: "test",
  description: "Play/add music.",
  options: [ ],
  voiceC: true,
  NODMPer: true,
  dm_permission: false,
  cooldown: 3,
};
const useStats = createHook((context) => {
    return (node) => {
        const queue = context.getQueue(node);
        if (!queue) return null;

        return queue.stats.generate();
    };
});
module.exports.run = async (lang, interaction) => {

    const stats = useStats(interaction.guild);
    if (!stats) {
        console.log('no stats available');
    } else {
        console.log(stats); // {...}
    }
};