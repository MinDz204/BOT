const { useQueue, QueueRepeatMode, useHistory } = require("discord-player");
const { zistart } = require("./ziStartTrack");
const { ModalBuilder, TextInputStyle } = require("discord.js");
const { ActionRowBuilder, TextInputBuilder } = require("@discordjs/builders");
const { lyricFind } = require("./Zilyric");
const db = require("./../../mongoDB");
const { ZiPlayerFillter, ZiPlayerFillterRow } = require("./Zifillter");

module.exports = async (interaction, lang) => {
  try {
    const queue = useQueue(interaction?.guildId);
    switch (interaction.customId) {
      case "Ziplayercommingfunc": {
        try { await queue?.node?.play() } catch (e) { console.log() }
      }
      case "Ziplayerf5":
        await interaction?.deferUpdate().catch(e => { });
        return interaction?.message.edit(await zistart(queue, lang)).catch(e => { });
      case "ZiplayerStop":
        let requestby = queue?.currentTrack?.requestby || queue?.metadata.requestby;
        if (!!requestby && requestby?.id !== interaction.user?.id) return interaction.reply({ content: `${lang?.StopFail.replace(`{uerrr}`, `<@${queue?.metadata.requestby.id}>`)}`, ephemeral: true }).catch(e => { })
        interaction.message.edit({ components: [] })
        return queue?.delete()
      case "ZiplayerSeach":
        const modal = new ModalBuilder()
          .setCustomId("ZiCompSearch")
          .setTitle(`${lang?.SearchTrack}:`)
          .addComponents(
            new ActionRowBuilder().addComponents(
              new TextInputBuilder()
                .setMaxLength(100)
                .setCustomId("resu")
                .setLabel(`${lang?.SearchTrackDEs}:`)
                .setStyle(TextInputStyle.Short)
            )
          )
        return interaction.showModal(modal);
      case "ZiplayerPrew":
        try {
          const history = useHistory(interaction.guild.id)
          await history.previous();
          interaction.deferUpdate();
        } catch (e) {
          interaction.reply(`${lang?.Err} ${e}`)
        }
        break;
      case "ZiplayerPause":
        queue?.node.setPaused(!queue?.node.isPaused());
        interaction.deferUpdate();
        return interaction?.message.edit(await zistart(queue, lang)).catch(e => { });
      case "ZiplayerQueueClear":
        await db.Ziqueue.deleteOne({ guildID: interaction?.guild?.id, channelID: interaction?.channel?.id }).catch(e => { });
        queue?.tracks?.clear();
        await queue?.metadata?.Zimess.edit(await zistart(queue, lang)).catch(e => { });
        return interaction?.message.edit({ content: `${lang?.queueclear} `, embeds: [], components: [] }).then(setTimeout(
          function() {
            interaction?.message.delete().catch(e => { });
          }, 10000)).catch(e => { });
      //:::::::::::::::::::::::::::: Fillter ::::::::::::::::::::::::::::::::::::::::::::::::::::://
      case "ZiplayerFillter":
        await interaction?.reply(await ZiPlayerFillter(interaction?.user, queue, lang))
        return interaction?.message.edit(await zistart(queue, lang)).catch(e => { });
      case "Ziplayerfillteroff":
        await queue?.filters?.ffmpeg?.setFilters(false);
        await queue?.metadata?.Zimess.edit(await zistart(queue, lang)).catch(e => { });
        return interaction?.message?.delete().catch(e => { })
      case "Ziplayerbassboost":
        await interaction?.deferUpdate().catch(e => { })
        await queue.filters.ffmpeg.toggle('bassboost');
        await queue?.metadata?.Zimess.edit(await zistart(queue, lang)).catch(e => { });
        return interaction?.message.edit({ components: [await ZiPlayerFillterRow(queue)] }).catch(e => { });
      case "Ziplayerlofi":
        await interaction?.deferUpdate().catch(e => { })
        await queue.filters.ffmpeg.toggle('lofi');
        await queue?.metadata?.Zimess.edit(await zistart(queue, lang)).catch(e => { });
        return interaction?.message.edit({ components: [await ZiPlayerFillterRow(queue)] }).catch(e => { });
      case "Ziplayernightcore":
        await interaction?.deferUpdate().catch(e => { })
        await queue.filters.ffmpeg.toggle('nightcore');
        await queue?.metadata?.Zimess.edit(await zistart(queue, lang)).catch(e => { });
        return interaction?.message.edit({ components: [await ZiPlayerFillterRow(queue)] }).catch(e => { });
      case "Ziplayerkaraoke":
        await interaction?.deferUpdate().catch(e => { })
        await queue.filters.ffmpeg.toggle('karaoke');
        await queue?.metadata?.Zimess.edit(await zistart(queue, lang)).catch(e => { });
        return interaction?.message.edit({ components: [await ZiPlayerFillterRow(queue)] }).catch(e => { });
    }
    //--------------------------------------------------------------------------------------------------//
    let ZiisPlaying = !!queue?.node?.isPlaying() || !queue?.isEmpty();
    if (!ZiisPlaying) return interaction?.reply({ content: `${lang?.NoPlaying}`, ephemeral: true })
    switch (interaction.customId) {
      case "ZiplayerNext":
        if (queue.repeatMode == 1) queue.setRepeatMode(QueueRepeatMode.QUEUE)
        queue.node.skip()
        return interaction?.deferUpdate().catch(e => { });
      case "ZiplayerLyric":
        return interaction.reply(await lyricFind(queue?.currentTrack, interaction?.user, lang))
      case "ZiplayerQueuE":
        await require("./Ziqueue")(interaction, queue, lang, false);
        return interaction?.message.edit(await zistart(queue, lang)).catch(e => { });


      case "ZiplayerVol":
        const modal = new ModalBuilder()
          .setCustomId("ZiModalVol")
          .setTitle(`${lang?.volume}`)
          .addComponents(
            new ActionRowBuilder()
              .addComponents(
                new TextInputBuilder()
                  .setMinLength(1)
                  .setMaxLength(2)
                  .setCustomId("resu")
                  .setLabel(`${lang?.volumedes}`)
                  .setValue(`${queue?.node.volume}`)
                  .setStyle(TextInputStyle.Short)
                  .setRequired(true)
              )
          )
        return interaction?.showModal(modal)
      case "ZiplayerAutoPlay":
        queue.repeatMode === 3 ? queue.setRepeatMode(QueueRepeatMode.OFF) : queue.setRepeatMode(QueueRepeatMode.AUTOPLAY);
        await interaction?.deferUpdate().catch(e => { });
        return interaction?.message.edit(await zistart(queue, lang)).catch(e => { });
      case "ZiplayerLoopA":
        queue.repeatMode == 0 ? queue.setRepeatMode(QueueRepeatMode.TRACK) :
          queue.repeatMode == 1 ? queue.setRepeatMode(QueueRepeatMode.QUEUE) :
            queue.setRepeatMode(QueueRepeatMode.OFF)
        await interaction?.deferUpdate().catch(e => { });
        return interaction?.message.edit(await zistart(queue, lang)).catch(e => { });
      case "ZiplayerShuffl":
        queue.tracks.shuffle();
        await interaction?.deferUpdate().catch(e => { });
        return interaction?.message.edit(await zistart(queue, lang)).catch(e => { });


    }

  } catch (e) {
    console.log(e)
  }
}
