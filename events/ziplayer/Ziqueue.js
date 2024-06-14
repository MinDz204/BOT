const { EmbedBuilder, ActionRowBuilder, ButtonBuilder, ButtonStyle } = require("discord.js");
const db = require("./../../mongoDB");
const client = require('../../bot');


module.exports = async (interaction, queue, lang, NOnextpage, PageNext = true) => {
  const tracl = [];
  queue?.tracks?.map(async (track, i) => {
    tracl.push({
      title: track.title,
      author: track.author,
      url: track.url,
      duration: track.duration
    })
  })
  let ziQueue = await db?.Ziqueue?.findOne({ guildID: interaction?.guild?.id, channelID: interaction?.channel?.id }).catch(() => {});
  let page = ziQueue?.page || 0;
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
      .setCustomId("QueueCancel"),
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
    let nowww = page === 1 ? 1 : page * 20 - 20;
    const current = tracl.slice(start, start + 20)
    if (!current || !current?.length > 0) return interaction?.channel.send({ content: ` `, ephemeral: true }).catch(e => { });
    return new EmbedBuilder()
      .setColor(lang?.COLOR || client.color)
      .setTitle(`<:queue:1150639849901133894> ${lang?.Queue}: ${interaction?.guild?.name}`)
      .setDescription(`${current.map(data =>
        `\n${nowww++} | [${data.title.substr(0, 25).replace(/\[|\]|\(|\)/g, '') + "..."}](${data.url}) | ${data.author.substr(0, 15) + "..."}`)}
            `)
      .setFooter({ text: `${page}/${totalPages}` })
      .setTimestamp()
  }
  //send messenger::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::
  if (!ziQueue) {
    await interaction.channel.send({ embeds: [await embed(currentIndex)], components: [row,rowpage] }).then(async Message => {
      await db.Ziqueue.updateOne({ guildID: interaction?.guild?.id, channelID: interaction?.channel?.id }, {
        $set: {
          messageID: Message.id,
          page: page,
          totalPages: totalPages
        }
      }, { upsert: true }).catch(e => { })
    }).catch(e => { })
  } else {
    await db.Ziqueue.updateOne({ guildID: interaction?.guild?.id, channelID: interaction?.channel?.id }, {
      $set: {
        page: page,
        totalPages: totalPages
      }
    }, { upsert: true }).catch(e => { })
    await interaction.channel?.messages.fetch({ message: ziQueue?.messageID, cache: false, force: true })
      .then(async msg => msg.edit({ embeds: [await embed(currentIndex)] })).catch(async e => {
        await interaction.channel.send({ embeds: [await embed(currentIndex)], components: [row,rowpage] }).then(async Message => {
          await db.Ziqueue.updateOne({ guildID: interaction?.guild?.id, channelID: interaction?.channel?.id }, {
            $set: {
              messageID: Message.id,
              page: page,
              totalPages: totalPages
            }
          }, { upsert: true }).catch(e => { })
        }).catch(e => { })
      })
  }
  return;
}