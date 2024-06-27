const { EmbedBuilder, ActionRowBuilder, ButtonBuilder, ButtonStyle } = require("discord.js");
const db = require("./../../mongoDB");
const client = require('../../bot');
const { Zitrim } = require("../Zibot/ZiFunc");


module.exports = async (interaction, queue, lang, NOnextpage, PageNext = true) => {
  const firstFieldName = interaction?.message?.embeds[0]?.data?.fields?.[0]?.name;
  const firstFielddata = firstFieldName?.replace("Page: ", "").trim().split('/');
  const tracl = [];
  queue?.tracks?.map(async (track, i) => {
    tracl.push({
      title: track.title,
      author: track.author,
      url: track.url,
      duration: track.duration
    })
  })
  if (!tracl?.length > 0) return interaction?.message?.delete();
  let page = eval(firstFielddata?.[0] || 1);
  const totalPages = Math.ceil(tracl.length / 20);

  if (!NOnextpage) {
    if (PageNext) {
      page = (page % totalPages) + 1;
    } else {
      page -= 1;
      if (page < 1) {
        page = totalPages;
      }
    }
  }

  let currentIndex = (page - 1) * 20;
  const row = new ActionRowBuilder().addComponents(
    new ButtonBuilder()
      .setEmoji("❌")
      .setStyle(ButtonStyle.Secondary)
      .setCustomId("cancel"),
    new ButtonBuilder()
      .setLabel("⤮")
      .setStyle(ButtonStyle.Secondary)
      .setCustomId("ZiplayerQueueShuffl"),
    new ButtonBuilder()
      .setLabel("Clear All")
      .setStyle(ButtonStyle.Secondary)
      .setCustomId("ZiplayerQueueClear"),
    new ButtonBuilder()
      .setEmoji("<:trash:1151572367961764000>")
      .setCustomId("DelTrack")
      .setStyle(ButtonStyle.Secondary)
  )
  const rowpage = new ActionRowBuilder().addComponents(
    new ButtonBuilder()
      .setLabel("Page: ")
      .setCustomId("QueuePage")
      .setStyle(ButtonStyle.Secondary)
      .setDisabled(true),
    new ButtonBuilder()
      .setLabel("←")
      .setCustomId("ZiplayerQueuereRev")
      .setStyle(ButtonStyle.Secondary),
    new ButtonBuilder()
      .setLabel("↻")
      .setStyle(ButtonStyle.Secondary)
      .setCustomId("ZiplayerQueueF5"),
    new ButtonBuilder()
      .setLabel("→")
      .setCustomId("ZiplayerQueueNext")
      .setStyle(ButtonStyle.Secondary),
  )

  const embed = async (start) => {
    let nowww = page == 1 ? 1 : page * 20 - 20;
    const current = tracl.slice(start, start + 20)
    if (!current || !current?.length > 0) return;
    return new EmbedBuilder()
      .setColor(lang?.COLOR || client.color)
      .setTitle(`<:queue:1150639849901133894> ${lang?.Queue}: ${interaction?.guild?.name}`)
      .setDescription(`${current.map(data =>
        `\n${nowww++} | [${Zitrim(data.title.replace(/\[|\]|\(|\)/g, ''), 25)}](${data.url}) | ${Zitrim(data.author, 15)}`)}`)
      .setFooter({ text: `${lang?.RequestBY} ${interaction?.user?.tag}`, iconURL: interaction?.user?.displayAvatarURL({ dynamic: true }) })
      .addFields(
        { name: `Page: ${page}/${totalPages}`, value: ' ' }
      )
      .setTimestamp()
  }
  //send messenger::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::
  if (firstFieldName?.includes("Page: ")) {
    return interaction?.message.edit({ content: ``, embeds: [await embed(currentIndex)], components: [row, rowpage] })
  }
  return interaction?.edit({ content: ``, embeds: [await embed(currentIndex)], components: [row, rowpage] })
}