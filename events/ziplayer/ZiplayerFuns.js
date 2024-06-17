const { useQueue, QueueRepeatMode, useHistory, Util } = require("discord-player");
const { zistart } = require("./ziStartTrack");
const { ModalBuilder, TextInputStyle, ActionRowBuilder, TextInputBuilder, ButtonBuilder, ButtonStyle, EmbedBuilder  } = require("discord.js");
const { SEEKfunc } = require("./ZiSeek");
const { handleVolumeChange } = require("./Zivolume");
const db = require("./../../mongoDB");
const { ZiPlayerFillter } = require("./Zifillter");
const config = require("../../config");
const { timeToSeconds, Zitrim, ZifetchInteraction } = require("../Zibot/ZiFunc");
const client = require("../../bot");
//#region Funcs
const deleteAfterTimeout = (message, timeout = 10000) => {
  setTimeout(() => {
    message?.delete().catch(e => { /* Handle error if needed */ });
  }, timeout);
};
const sendTemporaryReply = async (interaction, content) => {
  const message = await interaction?.reply({ content, fetchReply: true });
  deleteAfterTimeout(message);
};

const Ziseek = async(interaction, queue, lang, str)=> {
  if (!queue) return;
  const timestamp = queue.node.getTimestamp();
  if (timestamp.progress == 'Forever') return sendTemporaryReply(interaction, `❌ | Can't seek in a live stream.`);
  let targetTime  = 0;
  if(str !== "BEGIN"){
    targetTime  = timeToSeconds(str) + timeToSeconds(timestamp?.current.label);
    targetTime = Math.max(targetTime, 0);
    }else{
      targetTime  = timeToSeconds(`0:01`)
    } 
  const musicLength = timeToSeconds(timestamp?.total.label);
  if(!targetTime ) return sendTemporaryReply( interaction,
    '❌ | Invalid format for the target time.\n(**`ex: 3m20s, 1m 50s, 1:20:55, 5:20`**)'
  );
  if (targetTime  >= musicLength) return sendTemporaryReply(
    interaction,
    `❌ | Target time exceeds music duration. (\`${total?.label}\`)`
  );
  const success = queue.node.seek(targetTime  * 1000);
  if (success) {
    try {
      interaction.deferUpdate().catch(e => { /* Handle error */ });
      await Util.wait(1000);
      await interaction.message.edit(await SEEKfunc(queue?.currentTrack, interaction?.user, lang, queue));
      await queue?.metadata?.Zimess.edit(await zistart(queue, lang)).catch(e => { });
      return;
    } catch (e) {
      return sendTemporaryReply(interaction, '❌ | Something went wrong.');
    }
  } else {
    return sendTemporaryReply(interaction, '❌ | Something went wrong.');
  }
}
//#endregion
module.exports = async (interaction, lang) => {
if(!config.ZiFuncs.PlayMusic) return;
  try {
    const queue = useQueue(interaction?.guildId);
    switch(interaction.customId) {
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
    }
//#region Lock
    let ZiUserLock = await db.ZiUserLock.findOne({ guildID: queue?.guild?.id, channelID: queue?.metadata?.channel?.id }).catch(e => { });
    let requestby = ZiUserLock?.userID || queue?.metadata.requestby?.id;
    if (!!ZiUserLock?.status && requestby !== interaction.user?.id) return  interaction.reply({ content: `${lang?.StopFail.replace(`{uerrr}`, `<@${requestby}>`)}`, ephemeral: true }).catch(e => { })
//#endregion

//#region func
      switch (interaction.customId) {
      case 'ZiplayerControll':{
        if (!!requestby && requestby !== interaction.user?.id) return  interaction.reply({ content: `${lang?.StopFail.replace(`{uerrr}`, `<@${requestby}>`)}`, ephemeral: true }).catch(e => { })
        await db.ZiUserLock.updateOne({ guildID: queue?.guild?.id, channelID: queue?.metadata?.channel?.id }, {
          $set: {
            status: !(ZiUserLock?.status ?? true),
          }
        }, { upsert: true })
        interaction.deferUpdate();
        return interaction?.message.edit(await zistart(queue, lang)).catch(e => { });
      }
      case "ZiplayerLyrics": {
        if( !queue ) return;
        return require("./../../commands/lyrics").run( lang, interaction );
      }
      break;
      case "Ziplayerf5":
        await interaction?.deferUpdate().catch(e => { });
        return interaction?.message.edit(await zistart(queue, lang)).catch(e => { });
      case "ZiplayerStop":
        interaction.message.edit({ components: [] })
        await db?.ZiUserLock.deleteOne({ guildID: queue?.guild?.id, channelID: queue?.metadata?.channel?.id }).catch(e => { });
        return queue?.delete()
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
        queue?.tracks?.clear();
        await queue?.metadata?.Zimess.edit(await zistart(queue, lang)).catch(e => { });
        return interaction?.message.edit({ content: `${lang?.queueclear} `, embeds: [], components: [] }).then(setTimeout(
          function() {
            interaction?.message.delete().catch(e => { });
          }, 10000)).catch(e => { });
      case "ZiplayerQueueF5":
        await interaction?.deferUpdate().catch(e => { });
        await require("./Ziqueue")(interaction, queue, lang, true);
        return;
      case "ZiplayerFillter":
        await interaction?.reply(await ZiPlayerFillter(interaction?.user, queue, lang))
        return interaction?.message.edit(await zistart(queue, lang)).catch(e => { });
    }
//#region PLAYER
    if( !queue ) return;
    let ZiisPlaying = !!queue?.node?.isPlaying() || !queue?.isEmpty();
    if (!ZiisPlaying) return interaction?.reply({ content: `${lang?.NoPlaying}`, ephemeral: true })

    //::::::::::::::::::::::::::::::::::::::: PLAYER ::::::::::::::::::::::::::::::::::::::::::::::::::://
    switch (interaction.customId) {
      case "ZiplayerNext":
        if (queue.repeatMode == 1) queue.setRepeatMode(QueueRepeatMode.QUEUE)
        queue.node.skip()
        return interaction?.deferUpdate().catch(e => { });
      case "ZiplayerSeek":
        return interaction.reply(await SEEKfunc(queue?.currentTrack, interaction?.user, lang, queue))
      case "ZiplayerVol":
        return handleVolumeChange(interaction,queue,lang);
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
//#endregion
//#region QUEUE
      case "ZiplayerQueuE":
        return require("./Ziqueue")(await ZifetchInteraction(interaction), queue, lang, true);
      case "ZiplayerQueueShuffl":
        queue.tracks.shuffle();
        await interaction?.deferUpdate().catch(e => { });
        return require("./Ziqueue")(interaction, queue, lang, true);
      case "ZiplayerQueuereRev":
        await interaction?.deferUpdate().catch(e => { });
        return require("./Ziqueue")(interaction, queue, lang, false, false);
      case "ZiplayerQueueNext":
        await interaction?.deferUpdate().catch(e => { });
        return require("./Ziqueue")(interaction, queue, lang, false, true);
//#endregion
//#region SEEK
      case "ZiplayerSEEK0":
        return Ziseek(interaction, queue, lang, "BEGIN");
      case "ZiplayerSEEKP30":
        return Ziseek(interaction, queue, lang, "-30s");
      case "ZiplayerSEEKP10":
        return Ziseek(interaction, queue, lang, "-10s");
      case "ZiplayerSEEK10":
        return Ziseek(interaction, queue, lang, "10s");
      case "ZiplayerSEEK30":
        return Ziseek(interaction, queue, lang, "30s");
      case "ZiplayerSEEKINP": {
        const { progress, current, total } = queue.node.getTimestamp();
        if (progress === 'Forever') {
          const messagesd = await interaction.reply({ content: `❌ | Can't seek in a live stream.`, fetchReply: true });
          deleteAfterTimeout(messagesd);
        }
    
        interaction.reply({ content: 'time (ex: 3m20s, 1:20:55):', fetchReply: true });
    
        const collectorFilter = (i) => i.author.id === interaction.user.id;
        const collector = interaction.channel.createMessageCollector({ filter: collectorFilter, time: 60000 });
    
        collector.on('collect', async (i) => {
          const str = i.content;
          let targetTime = timeToSeconds(str);
          targetTime = Math.max(targetTime, 0);
          const musicLength = timeToSeconds(total.label);

          if (targetTime >= musicLength) {
            return sendTemporaryReply(i, `❌ | Target time exceeds music duration. (\`${total?.label}\`)`);
          }
    
          const success = queue.node.seek(targetTime * 1000);
          if (success) {
            try {
              await i.react("<a:likee:1210193685501706260>");
              await collector.stop(); // stop collector explicitly
              await interaction.deleteReply().catch(e => { console.error('Error deleting reply:', e); });
              await Util.wait(1000);
              await queue?.metadata?.Zimess.edit(await zistart(queue, lang)).catch(e => { });
              await interaction.message.edit(await SEEKfunc(queue?.currentTrack, interaction?.user, lang, queue));
              return;
            } catch (e) {
              sendTemporaryReply(i, '❌ | Something went wrong.');
            }
          } else {
            sendTemporaryReply(i, '❌ | Something went wrong.');
          }
        });
    
        collector.on('end',async () => {
          const messagesd = await interaction.editReply({ content: '❌ | End seek 1m.', fetchReply: true }).catch(e => { });
          deleteAfterTimeout(messagesd);

        });
        return;
      }
      //#endregion
      case "ZiplayersaVetrack":{
        const modal = new ModalBuilder()
          .setCustomId('saVetrackmodal')
          .setTitle(`Save track ${Zitrim(queue?.currentTrack?.title,29)} to:`)
          .addComponents(
            new ActionRowBuilder().addComponents(
              new TextInputBuilder()
                .setCustomId('listname')
                .setLabel(`Playlist name:`)
                .setStyle(TextInputStyle.Short)
                .setRequired(true)
            )
          )
      return interaction?.showModal(modal);
      }
      default:
        return client?.errorLog?.send(`**${config?.Zmodule}** <t:${Math.floor(Date.now() / 1000)}:R>\nButton:${interaction?.customId}`)
    }
  } catch (e) {
    console.log(e)
  }
}
