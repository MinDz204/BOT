const { EmbedBuilder, ActionRowBuilder, StringSelectMenuBuilder, StringSelectMenuOptionBuilder, ButtonBuilder,ButtonStyle } = require("discord.js");
const db = require("./../../mongoDB");
const client = require('../../bot');
const { extractId, Zitrim } = require("../Zibot/ZiFunc");
const { deserialize } = require("discord-player");
async function PlayMusics({ interaction, message, queue, track, player }) {
  try {
    const userId = interaction?.user?.id || interaction?.author?.id;
    const user = await db.ZiUser.findOne({ userID: userId }).catch(e => { });
    const queueMetadata = queue?.metadata || {};

    const queueOptions = {
      metadata: {
        channel: interaction.channel,
        requestby: interaction?.user || interaction?.author,
        embedCOLOR: user?.color || client.color,
        Zimess: queueMetadata.Zimess || message,
        ZsyncedLyrics: {
          messages: queueMetadata.ZsyncedLyrics?.messages,
          Status: queueMetadata.ZsyncedLyrics?.Status || false
        }
      },
      requestedBy: interaction?.user || interaction?.author,
      selfDeaf: true,
      volume: user?.vol || 50,
      maxSize: 200,
      maxHistorySize: 20,
      leaveOnEmpty: true,
      leaveOnEmptyCooldown: 2000,
      leaveOnEnd: true,
      leaveOnEndCooldown: 300000,
      skipOnNoStream: true
    };

    const queuez = player?.nodes?.create(interaction.guild, queueOptions);

    if (!queuez.connection) {
      try {
        await queuez.connect(interaction?.member.voice.channelId, { deaf: true });
      } catch (e) {
        await sendErrorMessage(interaction, lang?.PlayerSearchErr);
        return;
      }
    }

    const entry = queuez.tasksQueue.acquire();
    await entry.getTask();
    queuez.addTrack(track);

    if (!queuez.isPlaying()) {
      await queuez.node.play();
    }

    queuez.tasksQueue.release();

    if (queuez?.metadata && queuez?.metadata?.Zimess.id !== message.id) {
      message?.delete();
    }
  } catch (e) {
    console.error(e);
    const lang = await rank({ user: interaction?.user || interaction?.author });
    await sendErrorMessage(message, lang?.PlayerSearchErr);
  }
}

async function sendErrorMessage(target, errorMessage) {
  return target?.channel.send(errorMessage).then(async m => {
    setTimeout(() => {
      m?.delete().catch(e => { });
    }, 10000);
  }).catch(e => {
    console.error(e);
  });
}

module.exports = async ({ interaction, message, nameS, player, queue, lang }) => {
const idss = extractId(nameS?.replace(`<@${client.user.id}>`, "").trim());
const listname = nameS?.replace(`<@${client.user.id}>`, "").replace(`<@${idss}>`, "").trim()
if (listname){
    const playlist = await db?.playlist?.findOne({ userID: idss, listname }).catch(e => { })

    if (playlist){
      const userss = interaction?.user || interaction?.author;
      if(playlist.private && idss !== userss.id) return message.edit(lang?.privatePlaylist);
        const track = playlist.Song.map((song) => deserialize(player, song));
        if(track){
          await PlayMusics({ interaction, message: message || interaction, queue, track, player });
          return;
        }
    }
}
const playlist = await db?.playlist?.find({ userID: idss }).catch(e => { })
if (!playlist?.length > 0) return message.edit({
  content: ` `,
  embeds: [
    new EmbedBuilder()
    .setColor("#ff4500")
    .setDescription(lang.NoPlaylist.replace("{USER}",`${idss}`))
  ],
 ephemeral: true }).catch(e => { })

 const modal_creator = playlist.map((plist, index) => {
  return new StringSelectMenuOptionBuilder()
    .setLabel(`${index + 1} - ${ plist?.listname }: ${plist?.private? "Private":"Public"}`)
    .setDescription(`${plist?.private?"??":plist?.Song?.length} Songs`)
    .setValue(`${plist?.listname} <@${idss}>`)
    .setEmoji('<:Playbutton:1230129096160182322>')
})
 return message.edit({
  content: ` `,
  embeds: [
    new EmbedBuilder()
    .setColor(lang?.COLOR || client?.color)
    .setDescription(`**<@${idss}> playlist:**
      ${playlist.map((plist, index) => {
        return `\n**${index + 1}** | **${plist?.listname}**: ${plist?.private?"??":plist?.Song?.length} Songs (${plist?.private? "private":"public"})` })}`)
    .setTimestamp()
    .setFooter({ text: `${lang?.RequestBY} ${interaction.user?.tag}`, iconURL: interaction.user?.displayAvatarURL({ dynamic: true }) })
    .setImage(lang?.banner)
  ],
  components:[
    new ActionRowBuilder().addComponents(
      new StringSelectMenuBuilder()
      .setCustomId('Ziselectmusix')
      .setMinValues(1)
      .setMaxValues(1)
      .setPlaceholder('▶️ | Pick the playlist u want to add to queue.')
      .addOptions( modal_creator )
    ),
    new ActionRowBuilder().addComponents(
      new ButtonBuilder()
        .setCustomId("cancel")
        .setLabel("❌")
        .setStyle(ButtonStyle.Secondary),
      new ButtonBuilder()
        .setCustomId("DelPlaylist")
        .setEmoji("<:trash:1151572367961764000>")
        .setStyle(ButtonStyle.Secondary),
    )
  ],
 ephemeral: true }).catch(e => { })
}