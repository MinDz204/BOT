const { EmbedBuilder, ActionRowBuilder, ButtonBuilder, ButtonStyle, Message, AttachmentBuilder } = require('discord.js');
const client = require('../bot');
module.exports = {
  name: "help",
  description: "Show bot command.",
  options: [],
  cooldown: 3,
  dm_permission: true,
}

module.exports.run = async (lang, interaction) => {
    const commands = client.Zicomand;
    const embed = new EmbedBuilder()
      .setColor(lang.COLOR || client.color)
      .setTitle("Zi bot help:")
      .setURL("https://discord.com/api/oauth2/authorize?client_id=1005716197259612193&permissions=1067357395521&scope=applications.commands%20bot")
      .setThumbnail('https://cdn.discordapp.com/attachments/1064851388221358153/1155459269458665542/Untitled-1.png')
      .setDescription(`${commands.map(x => `</${x?.name}:${x?.id}> | ${x?.description} `).join('\n')}\n▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬\n**Music Player:**`)
      .addFields([
        { name: "◁", value: `Previous Track`, inline: true },
        { name: "❚❚ | ▶", value: `Pause / Play Track`, inline: true },
        { name: "▷", value: `Next Track`, inline: true },
        { name: "F5", value: `Refresh/Update Messenger`, inline: true },
        { name: "<:sound:1150769215255625759>", value: `Control Volume`, inline: true },
        { name: "<:lyric:1150770291941851187>", value: `Find Lyrics`, inline: true },
        { name: "↻", value: `Loop mode (track | queue)`, inline: true },
        { name: "⤮", value: `Shuffle Queue`, inline: true },
        { name: "✨", value: `Comming Func`, inline: true },
        { name: "Fx", value: `Fillter`, inline: true },
        { name: "<:search:1150766173332443189>", value: `Search`, inline: true },
        { name: "A", value: `Auto Play mode`, inline: true },
        { name: "<:queue:1150639849901133894>", value: `Show Queue`, inline: true },
        { name: '\u200b', value: '\u200b', inline: true },
        { name: ":white_large_square:", value: `Stop Music`, inline: true },
        { name:"▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬",value: '\u200b', inline: false, }
      ])
      .setTimestamp()
      .setFooter({ text: `${lang?.RequestBY} ${interaction.user.tag}`, iconURL: interaction.user.displayAvatarURL({ dynamic: true }) })
      .setImage('https://cdn.discordapp.com/attachments/1064851388221358153/1122054818425479248/okk.png');
    //
    return interaction.reply({ embeds: [embed], components: [
      new ActionRowBuilder().addComponents(
        new ButtonBuilder()
          .setCustomId("MesPiNJG")
          .setEmoji(`<a:ddev:850081111241785425>`)
          .setLabel("Help message @(ping)")
          .setStyle(ButtonStyle.Secondary),
        new ButtonBuilder()
          .setLabel("Statistics")
          .setEmoji(`💹`)
          .setCustomId("Statistics")
          .setStyle(ButtonStyle.Secondary),
      ),
      new ActionRowBuilder().addComponents(
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
