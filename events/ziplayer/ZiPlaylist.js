const { EmbedBuilder, ActionRowBuilder, StringSelectMenuBuilder, StringSelectMenuOptionBuilder, ButtonBuilder,ButtonStyle } = require("discord.js");
const db = require("./../../mongoDB");
const client = require('../../bot');
const { extractId, ZiplayerOption } = require("../Zibot/ZiFunc");
const { deserialize } = require("discord-player");
async function PlayMusics({ interaction, message, queue, track, player }) {
  try {
    const user = await db.ZiUser.findOne({ userID: interaction?.user?.id || interaction?.author?.id }).catch(e => { });
    const queuez = player?.nodes?.create(interaction.guild, ZiplayerOption({ interaction, message, queue, user }));

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
  try {
      const userId = extractId(nameS?.replace(`<@${client.user.id}>`, "").trim());
      const listName = nameS?.replace(`<@${client.user.id}>`, "").replace(`<@${userId}>`, "").trim();

      if (listName) {
          const playlist = await db?.playlist?.findOne({ userID: userId, listname: listName }).catch(() => { });

          if (playlist) {
              const user = interaction?.user || interaction?.author;
              if (playlist.private && userId !== user.id) {
                  return message.edit(lang?.privatePlaylist);
              }
              const tracks = playlist.Song.map(song => deserialize(player, song));
              if (tracks) {
                const userr = await interaction?.guild?.members.fetch(userId) || interaction.user;
                tracks[0].playlist = {
                  title: listName,
                  url: client?.InviteBot
                }
                tracks.thumbnail = userr.displayAvatarURL({ size: 1024 })
                await PlayMusics({ interaction, message: message || interaction, queue, track: tracks, player });
                return;
              }
          }
      }

      const playlists = await db?.playlist?.find({ userID: userId }).catch(() => { });
      if (!playlists?.length) {
          return message.edit({
              content: ` `,
              embeds: [
                  new EmbedBuilder()
                      .setColor("#ff4500")
                      .setDescription(lang.NoPlaylist.replace("{USER}", `${userId}`))
              ],
              ephemeral: true
          }).catch(() => { });
      }

      const modalOptions = playlists.map((plist, index) => (
          new StringSelectMenuOptionBuilder()
              .setLabel(`${index + 1} - ${plist?.listname}: ${plist?.private ? "Private" : "Public"}`)
              .setDescription(`${plist?.private ? "??" : plist?.Song?.length} Songs`)
              .setValue(`${plist?.listname} <@${userId}>`)
              .setEmoji('<:Playbutton:1230129096160182322>')
      ));

      return message.edit({
          content: ` `,
          embeds: [
              new EmbedBuilder()
                  .setColor(lang?.COLOR || client?.color)
                  .setDescription(`**<@${userId}> playlist:**
                  ${playlists.map((plist, index) => (
                      `\n**${index + 1}** | **${plist?.listname}**: ${plist?.private ? "??" : plist?.Song?.length} Songs (${plist?.private ? "private" : "public"})`
                  )).join('')}`)
                  .setTimestamp()
                  .setFooter({ text: `${lang?.RequestBY} ${interaction.user?.tag}`, iconURL: interaction.user?.displayAvatarURL({ dynamic: true }) })
                  .setImage(lang?.banner)
          ],
          components: [
              new ActionRowBuilder().addComponents(
                  new StringSelectMenuBuilder()
                      .setCustomId('Ziselectmusix')
                      .setMinValues(1)
                      .setMaxValues(1)
                      .setPlaceholder('▶️ | Pick the playlist you want to add to queue.')
                      .addOptions(modalOptions)
              ),
              new ActionRowBuilder().addComponents(
                  new ButtonBuilder()
                      .setCustomId("cancel")
                      .setLabel("❌")
                      .setStyle(ButtonStyle.Secondary),
                  new ButtonBuilder()
                      .setCustomId("DelPlaylist")
                      .setEmoji("<:trash:1151572367961764000>")
                      .setStyle(ButtonStyle.Secondary)
              )
          ],
          ephemeral: true
      }).catch(() => { });

  } catch (error) {
      console.error(error);
      message.edit({ content: 'An error occurred while processing the request.', ephemeral: true }).catch(() => { });
  }
}
