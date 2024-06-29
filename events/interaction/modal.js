const { useQueue, Util } = require("discord-player");
const db = require("./../../mongoDB");
const { zistart } = require("./../ziplayer/ziStartTrack");
const { rank } = require("../Zibot/ZilvlSys");
const { validURL, timeToSeconds, Zitrim, ZifetchInteraction } = require("../Zibot/ZiFunc");
const { SEEKfunc } = require("../ziplayer/ZiSeek");
const config = require("../../config");
const { EmbedBuilder, ActionRowBuilder, ButtonStyle, ButtonBuilder } = require("discord.js");

const HEX_COLOR_REGEX = /^#[0-9A-F]{6}$/i;
const MAX_VOLUME = 100;
const DELETE_REPLY_DELAY = 1000;

function isNumber(str) {
  return /^[0-9]+$/.test(str);
}

function removeDuplicates(array) {
  const seen = new Set();
  return array.filter(item => {
    if (!isNumber(item) || seen.has(item)) return false;
    seen.add(item);
    return true;
  });
}

module.exports = async (client, interaction) => {
  try {
    let lang = await rank({ user: interaction?.user });

    switch (interaction.customId) {
      case "ZiCompSearch": {
        const nameS = interaction.fields.getTextInputValue("resu");
        return require("./../ziplayer/ziSearch")(interaction, nameS);
      }

      case "ZiplayerSEEKINPmodal": {
        const message = await ZifetchInteraction(interaction);
        const queue = useQueue(interaction?.guildId);
        if (!queue || !queue.isPlaying()) return;

        const { progress, total } = queue.node.getTimestamp();
        if (progress === 'Forever') {
          return message.edit({ content: `❌ | Can't seek in a live stream.` });
        }

        let targetTime = Math.max(timeToSeconds(interaction.fields.getTextInputValue("Time")), 0);
        const musicLength = timeToSeconds(total.label);

        if (targetTime >= musicLength) {
          return message.edit(`❌ | Target time exceeds music duration. (${total.label})`);
        }

        const success = queue.node.seek(targetTime * 1000);
        if (success) {
          await message.delete();
          await Util.wait(DELETE_REPLY_DELAY);
          await queue.metadata.Zimess.edit(await zistart(queue, lang));
          await interaction.message.edit(await SEEKfunc(queue.currentTrack, interaction.user, lang, queue));
        } else {
          message.edit('❌ | Something went wrong.');
        }
        break;
      }

      case "ZiVolchangeModal": {
        const message = await ZifetchInteraction(interaction);
        const queue = useQueue(interaction?.guildId);
        const volInput = interaction.fields.getTextInputValue("vol");
        const volMatch = volInput.match(/\d+/);
        const vol = volMatch?.[0];

        if (!isNumber(vol)) {
          return message.edit({ content: lang.volumeErr, ephemeral: true });
        }

        const newVolume = Math.min(Math.abs(vol), MAX_VOLUME);
        queue.node.setVolume(newVolume);
        await db.ZiUser.updateOne(
          { userID: interaction.user.id },
          { $set: { vol: newVolume } },
          { upsert: true }
        );

        message.delete();
        return queue.metadata.Zimess.edit(await zistart(queue, lang));
      }

      case "DelTrackmodal": {
        const message = await ZifetchInteraction(interaction);
        const input = interaction.fields.getTextInputValue("number");
        const queue = useQueue(interaction?.guildId);
        const trackIndices = removeDuplicates(input.split(/[\s,;.+-]+/));

        if (!trackIndices.length || !queue || queue.isEmpty()) {
          return message.edit({ content: lang.DeltrackErr, ephemeral: true });
        }

        let tracldel = [];
        const validIndices = trackIndices.map(index => Math.abs(Number(index)) - 1).filter(index => index >= 0);

        validIndices.sort((a, b) => b - a).forEach(index => {
          tracldel.push(queue.tracks.toArray()[index].title);
          queue.removeTrack(index);
        });

        await message.edit({
          content: "",
          embeds: [
            new EmbedBuilder()
              .setColor(lang.COLOR || client.color)
              .setAuthor({ name: "Deleted track:", iconURL: client.user.displayAvatarURL({ size: 1024 }) })
              .setDescription(`${Zitrim(tracldel.map(t => `\n* ${Zitrim(t, 50)}`), 2000)
                } `)
              .setTimestamp()
              .setFooter({ text: `${lang.RequestBY} ${interaction.user.tag} `, iconURL: interaction.user.displayAvatarURL({ dynamic: true }) })
              .setImage(lang.banner)
          ],
          components: [
            new ActionRowBuilder().addComponents(
              new ButtonBuilder()
                .setCustomId("cancel")
                .setLabel("❌")
                .setStyle(ButtonStyle.Secondary)
            )
          ]
        });

        return require("./../ziplayer/Ziqueue")(interaction, queue, lang, true);
      }

      case "editProfilemodal": {
        const message = await ZifetchInteraction(interaction);
        let hexColor = interaction.fields.getTextInputValue("Probcolor");
        let img = interaction.fields.getTextInputValue("Probimage");

        await db.ZiUser.updateOne(
          { userID: interaction.user.id },
          {
            $set: {
              color: HEX_COLOR_REGEX.test(hexColor) ? hexColor : "",
              image: validURL(img) ? img : ""
            }
          },
          { upsert: true }
        );

        return message.edit({ content: lang.profilesuss, ephemeral: true });
      }

      case "DelPlaylistmodal": {
        const listname = interaction.fields.getTextInputValue("listname");
        const playlist = await db.playlist.findOne({ userID: interaction.user.id, listname });

        if (!playlist) {
          return interaction.reply({ content: lang.NoPlaylist.replace("{USER}", `${interaction.user.id}`), ephemeral: true });
        }

        const message = await ZifetchInteraction(interaction);
        await message.edit({
          content: "",
          embeds: [
            new EmbedBuilder()
              .setColor(lang.COLOR || client.color)
              .setDescription(`** Playlist:** ${Zitrim(playlist.Song?.map((song, index) => `\n${index}.${Zitrim(song.title, 30)}`), 4000)} `)
              .setTimestamp()
              .setFooter({ text: `${lang.RequestBY} ${interaction.user.tag} `, iconURL: interaction.user.displayAvatarURL({ dynamic: true }) })
              .setImage(lang.banner)
          ],
          components: [
            new ActionRowBuilder().addComponents(
              new ButtonBuilder()
                .setCustomId(`ZiPlaylistDel_${listname}_${interaction.user.id}`)
                .setLabel("DELETE")
                .setStyle(ButtonStyle.Danger),
              new ButtonBuilder()
                .setCustomId("cancel")
                .setLabel("❌")
                .setStyle(ButtonStyle.Secondary)
            )
          ]
        });

        return;
      }

      case "saVetrackmodal": {
        return require("./../../commands/save").run(lang, interaction);
      }

      default:
        console.log(interaction.customId);
    }
  } catch (e) {
    console.error(e);
    return client.errorLog.send(`** ${config.Zmodule}** <t:${Math.floor(Date.now() / 1000)}: R>\nmodal:${e.stack}`);
  }
};
