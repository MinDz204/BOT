const { useQueue } = require('discord-player');
const { ApplicationCommandOptionType, EmbedBuilder } = require('discord.js')
const db = require("./../mongoDB");
const { ZifetchInteraction } = require('../events/Zibot/ZiFunc');

module.exports = {
    name: "disconnect",
    description: "Disconnects and clear the server queue.",
    integration_types: [0],
    contexts: [0, 1, 2],
    options: [],
    voiceC: true,
    NODMPer: true,
    dm_permission: false,
    cooldown: 3,
    run: async (lang, interaction) => {
        await ZifetchInteraction(interaction);
        const queue = useQueue(interaction?.guildId);
        await db?.ZiUserLock.deleteOne({ guildID: queue?.guild?.id, channelID: queue?.metadata?.channel?.id }).catch(e => { });
        if (queue) {
            await queue?.metadata?.Zimess?.edit({ components: [] }).catch(e => { })
            queue?.delete();
        } else {
            interaction.guild.members.me.voice.disconnect();
        }
        return interaction.editReply({
            content: "",
            embeds: [
                new EmbedBuilder()
                    .setColor("Red")
                    .setDescription("**✅ | Đã ngắt kết nối, Hẹn gặp lại bạn lần sau!**\n(╯°□°)╯︵ ┻━┻")
                    .setTimestamp()
                    .setFooter({ text: `${lang?.RequestBY} ${interaction.user?.tag}`, iconURL: interaction.user?.displayAvatarURL({ dynamic: true }) })
            ]
        }).catch(e => { })
    },
};
