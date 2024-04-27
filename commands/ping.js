const { EmbedBuilder } = require("discord.js");
const client = require('../bot');
const { ZifetchInteraction } = require("../events/Zibot/ZiFunc");

module.exports = {
  name: "ping",
  description: "View bot ping.",
  options: [],
  cooldown: 3,
  dm_permission: true,
  run: async (lang, interaction) => {

    let messages = await ZifetchInteraction(interaction);

    const start = Date.now();
    await interaction?.channel?.send("Pong!").then(async Message => { Message.delete() });
      const end = Date.now();
      const embed = new EmbedBuilder()
        .setColor(lang.COLOR || client.color)
        .setTitle(client?.user?.username + " - Pong!")
        .setThumbnail(client.user.displayAvatarURL())
        .addFields([
          { name: `Message Ping`, value: `\`${end - start}ms\` 🛰️` },
          { name: `Message Latency`, value: `\`${Date.now() - start}ms\` 🛰️` },
          { name: `API Latency`, value: `\`${Math.round(client.ws.ping)}ms\` 🛰️` }
        ])
        .setTimestamp()
        .setFooter({ text: `${lang?.RequestBY} ${interaction.user?.tag}`, iconURL: interaction.user?.displayAvatarURL({ dynamic: true }) })
      return messages?.edit({ embeds: [ embed ] }).catch(e => interaction?.user?.send({ embeds: [ embed ] }))

  },
};
