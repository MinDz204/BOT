const { EmbedBuilder, ActionRowBuilder, ButtonBuilder, ButtonStyle, Message, AttachmentBuilder } = require('discord.js');
const client = require('../bot');
module.exports = {
  name: "help",
  description: "Show bot command.",
  options: [],
  cooldown: 3,
  dm_permission: true,
  integration_types: [0 ,1],
  contexts: [0, 1, 2],
}

module.exports.run = async (lang, interaction) => {
    const commands = client.Zicomand;
    const embed = new EmbedBuilder()
      .setColor(lang.COLOR || client.color)
      .setTitle("Zi bot helps:")
      .setURL(`${client.InviteBot}`)
      .setThumbnail('https://cdn.discordapp.com/attachments/1064851388221358153/1155459269458665542/Untitled-1.png')
      .setDescription(`${commands.map(x => `</${x?.name}:${x?.id}> | ${x?.description} `).join('\n')}\n▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬\n**Music Player:**`)
      .addFields([
        { name: "◁", value: `Previous Track`, inline: true },
        { name: "❚❚ | ▶", value: `Pause / Play Track`, inline: true },
        { name: "▷", value: `Next Track`, inline: true },
        { name: "F5", value: `Refresh/Update Messenger`, inline: true },
        { name: "<:sound:1150769215255625759>", value: `Control Volume`, inline: true },
        { name: "Seek", value: `Seek <[hhmm]ss/[hh:mm]:ss>`, inline: true },
        { name: "↻", value: `Loop mode (track | queue)`, inline: true },
        { name: "⤮", value: `Shuffle Queue`, inline: true },
        { name: "<:LOck:1167543711283019776>", value: `Lock/Unlock player control`, inline: true },
        { name: "Fx", value: `Fillter Nightcore, Lofi...`, inline: true },
        { name: "<:search:1150766173332443189>", value: `Search`, inline: true },
        { name: "A", value: `Auto Play mode`, inline: true },
        { name: "<:queue:1150639849901133894>", value: `Show Queue`, inline: true },
        { name: '\u200b', value: '\u200b', inline: true },
        { name: ":white_large_square:", value: `Stop Music`, inline: true },
        { name:"▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬",value: '\u200b', inline: false, }
      ])
      .setTimestamp()
      .setFooter({ text: `${lang?.RequestBY} ${interaction.user.tag}`, iconURL: interaction.user.displayAvatarURL({ dynamic: true }) })
      .setImage(lang?.banner);
    //
    return interaction.reply({ embeds: [embed], components: [
      new ActionRowBuilder().addComponents(
        new ButtonBuilder()
          .setCustomId("MesPiNJG")
          .setEmoji(`<a:ddev:850081111241785425>`)
          .setLabel("Help message @(ping)")
          .setStyle(ButtonStyle.Secondary),
        new ButtonBuilder()
          .setCustomId("ContextMenu")
          .setEmoji(`<a:ddev:850081111241785425>`)
          .setLabel("Help Context Menu")
          .setStyle(ButtonStyle.Secondary),
      ),
      new ActionRowBuilder().addComponents(
        new ButtonBuilder()
          .setLabel("Statistics")
          .setEmoji(`💹`)
          .setCustomId("Statistics")
          .setStyle(ButtonStyle.Secondary),
        new ButtonBuilder()
          .setLabel("DEV Discord")
          .setEmoji(`<:verified:710970919736311942>`)
          .setURL(`https://discord.gg/zaskhD7PTW`)
          .setStyle(ButtonStyle.Link),
        new ButtonBuilder()
          .setCustomId("cancel")
          .setLabel("❌")
          .setStyle(ButtonStyle.Secondary)
      )
    ] })
  }
