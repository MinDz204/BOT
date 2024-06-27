const client = require("../bot");
const { ZifetchInteraction, timeToSeconds } = require("../events/Zibot/ZiFunc");
const { EmbedBuilder, ButtonStyle, ActionRowBuilder, ButtonBuilder } = require("discord.js");


module.exports = {
  name: "timecode",
  description: "export timecode",
  integration_types: [0 ,1],
  contexts: [0, 1, 2],
  options: [{
        name: "time",
        description: "time mm:ss",
        type: 3,
        required: false,
    }],
  cooldown: 3,
  dm_permission: true,

  run: async (lang, interaction) => {
    const timeInput  = interaction.options.getString("time") || 0;
    await ZifetchInteraction(interaction);
    const timecode = Math.round((Date.now() + timeToSeconds(timeInput) * 1000) / 1000)
    const embed = new EmbedBuilder()
    .setTitle("Timecode")
    .setColor(lang?.COLOR || client.color)
    .setTimestamp()
    .setFooter({ text: `${lang?.RequestBY} ${interaction.user.username}`, iconURL: interaction.user.displayAvatarURL({ dynamic: true }) })
    .setDescription(
        `* <t:${timecode}:t>\n\`\`\`<t:${timecode}:t>\`\`\`\n` +
        `* <t:${timecode}:T>\n\`\`\`<t:${timecode}:T>\`\`\`\n` +
        `* <t:${timecode}:d>\n\`\`\`<t:${timecode}:d>\`\`\`\n` +
        `* <t:${timecode}:D>\n\`\`\`<t:${timecode}:D>\`\`\`\n` +
        `* <t:${timecode}:f>\n\`\`\`<t:${timecode}:f>\`\`\`\n` +
        `* <t:${timecode}:F>\n\`\`\`<t:${timecode}:F>\`\`\`\n` +
        `* <t:${timecode}:R>\n\`\`\`<t:${timecode}:R>\`\`\`\n`
      )
    const row = new ActionRowBuilder().addComponents(
        new ButtonBuilder()
            .setCustomId("cancel")
            .setLabel("❌")
            .setStyle(ButtonStyle.Secondary),
    )
    if(!interaction.guild) return interaction.editReply({ content:"", embeds: [ embed ] });
    return interaction.editReply({ content:"", embeds:[ embed ], components:[ row ] })
  },
};
