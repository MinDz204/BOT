const { EmbedBuilder, ActionRowBuilder, ButtonBuilder, ButtonStyle, Message, AttachmentBuilder } = require('discord.js');
const client = require('../bot');
module.exports = {
  name: "help",
  description: "Show bot command.",
  name_localizations: {
    "en-US": "help",
    "vi": "trợ-giúp",  // Vietnamese translation for "help"
    "ja": "ヘルプ",  // Japanese translation for "help"
    "ko": "도움",  // Korean translation for "help"
  },
  description_localizations: {
    "en-US": "Show bot command.",
    "vi": "Hiển thị các lệnh của bot.",  // Vietnamese translation
    "ja": "ボットのコマンドを表示します.",  // Japanese translation
    "ko": "봇 명령을 표시합니다.",  // Korean translation
  },
  options: [],
  cooldown: 3,
  dm_permission: true,
  integration_types: [0, 1],
  contexts: [0, 1, 2],
}

module.exports.run = async (lang, interaction) => {
  const commands = client.commands;
  const embed = new EmbedBuilder()
    .setColor(lang.COLOR || client.color)
    .setAuthor({ name: "Zi bot helps:", url: client.InviteBot, iconURL: client.user.displayAvatarURL({ size: 1024 }) })
    .setDescription(`
* **User install**
  * Translate language
  * Get Avartar
* **Server install**
  * Translate language
  * Multi-language support
  * ++ Music Player
* **Commands**
${commands.map(x => { if (x?.description) return `</${x?.name}:${x?.id}> | ${x?.description}\n` }).join("")}
▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬\n* **Music Player help**`)
    .addFields([
      { name: "◁", value: `Previous Track`, inline: true },
      { name: "❚❚ | ▶", value: `Pause / Play`, inline: true },
      { name: "▷", value: `Next Track`, inline: true },
      { name: "F5", value: `Refresh/Update player`, inline: true },
      { name: "<:sound:1150769215255625759>", value: `Control Volume`, inline: true },
      { name: "Seek", value: `Seek <[hh:mm]:ss>`, inline: true },
      { name: "↻", value: `Loop mode`, inline: true },
      { name: "⇩", value: `Save track to playlist`, inline: true },
      { name: "<:LOck:1167543711283019776>", value: `Lock/Unlock player control`, inline: true },
      { name: "Fx", value: `Fillter Nightcore, Lofi...`, inline: true },
      { name: "<:search:1150766173332443189>", value: `Search`, inline: true },
      { name: "A", value: `Auto Play mode`, inline: true },
      { name: "<:queue:1150639849901133894>", value: `Show Queue`, inline: true },
      { name: '\u200b', value: '\u200b', inline: true },
      { name: ":white_large_square:", value: `Stop Music`, inline: true },
      { name: "▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬", value: '* **QUEUE help**', inline: false, },
      { name: "Clear All", value: `Clear all queue`, inline: true },
      { name: '\u200b', value: '\u200b', inline: true },
      { name: "<:trash:1151572367961764000>", value: `Delete track(s)`, inline: true },
    ])
    .setTimestamp()
    .setFooter({ text: `${lang?.RequestBY} ${interaction.user.tag}`, iconURL: interaction.user.displayAvatarURL({ dynamic: true }) })
    .setImage(lang?.banner);
  //
  if (!interaction.guild) return interaction.reply({ content: "", embeds: [embed], ephemeral: true });
  return interaction.reply({
    content: "", embeds: [embed], components: [
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
        new ButtonBuilder()
          .setURL(client.InviteBot)
          .setEmoji(`<:verified:710970919736311942>`)
          .setLabel("Invite me!")
          .setStyle(ButtonStyle.Link),
      ),
      new ActionRowBuilder().addComponents(
        new ButtonBuilder()
          .setLabel("Statistics")
          .setEmoji(`💹`)
          .setCustomId("Statistics")
          .setStyle(ButtonStyle.Secondary),
        new ButtonBuilder()
          .setLabel("Support Sever")
          .setEmoji(`<:verified:710970919736311942>`)
          .setURL(`https://discord.gg/zaskhD7PTW`)
          .setStyle(ButtonStyle.Link),
        new ButtonBuilder()
          .setCustomId("SupportDeveloper")
          .setEmoji(`❤`)
          .setLabel("Support developer")
          .setStyle(ButtonStyle.Secondary),
        new ButtonBuilder()
          .setCustomId("cancel")
          .setLabel("❌")
          .setStyle(ButtonStyle.Secondary),
      )
    ]
  })
}
