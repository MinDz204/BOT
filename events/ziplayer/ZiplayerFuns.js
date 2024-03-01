const { useQueue, QueueRepeatMode, useHistory } = require("discord-player");
const { zistart } = require("./ziStartTrack");
const { ModalBuilder, TextInputStyle, ActionRowBuilder, TextInputBuilder, ButtonBuilder, ButtonStyle, EmbedBuilder  } = require("discord.js");
const { lyricFind } = require("./Zilyric");
const db = require("./../../mongoDB");
const { ZiPlayerFillter, ZiPlayerFillterRow } = require("./Zifillter");
const config = require("../../config");
const { drawBarChart, timeToSeconds } = require("../Zibot/ZiFunc");
const client = require("../../bot");
const Ziseek = async(interaction, queue, lang, str)=> {
  if (!queue) return;
  const timestamp = queue.node.getTimestamp();
  if (timestamp.progress == 'Forever') return interaction.reply({ content: `❌ | Can't seek in a live stream.`});
  let tragetTime = 0;
  if(str !== "BEGIN"){
    tragetTime = timeToSeconds(str) + timeToSeconds(timestamp?.current.label);}
  const musicLength = timeToSeconds(timestamp?.total.label);
  if(!tragetTime) return interaction.reply({ content: `❌ | Invalid format for the target time.\n(**\`ex: 3m20s, 1m 50s, 1:20:55, 5:20\`**)`});
  if (tragetTime >= musicLength) return interaction.reply({ content: `❌ | Target time exceeds music duration. (\`${timestamp?.total.label}\`)`});
  const success = queue.node.seek(tragetTime * 1000);
  if (success){
    await interaction?.message.edit(await lyricFind(queue?.currentTrack, interaction?.user, lang, queue)).catch(e => { });
    return interaction.deferUpdate().catch(e => { });
  }else{
    return interaction.reply({ content: `❌ | Something went wrong.`});
  }
}
module.exports = async (interaction, lang) => {
if(!config.messCreate.PlayMusic) return;
  try {
    const queue = useQueue(interaction?.guildId);
    switch (interaction.customId) {
      case "ZiplayerEq": {
        if( !queue ) return;
        let defband = [
          { band: 0, gain: 0 },
          { band: 1, gain: 0 },
          { band: 2, gain: 0 },
          { band: 3, gain: 0 },
          { band: 4, gain: 0 },
          { band: 5, gain: 0 },
          { band: 6, gain: 0 },
          { band: 7, gain: 0 },
          { band: 8, gain: 0 },
          { band: 9, gain: 0 },
          { band: 10, gain: 0 },
          { band: 11, gain: 0 },
          { band: 12, gain: 0 },
          { band: 13, gain: 0 },
        ]

        let user = await db?.ZiUser.findOne({ userID: interaction?.user?.id });
        let userAR = Array.isArray( user.EQband ) &&  user.EQband.length === 0;
        let banstoUP = !userAR ? user.EQband : defband;

      // Hàm tạo ButtonBuilder
        const createButton = (index) => new ButtonBuilder()
        .setCustomId(`ZiplayerEQ${index}`)
        .setLabel(`Band ${index + 1}`)
        .setStyle(ButtonStyle.Secondary);

        // Chia nhỏ bands thành các dãy nhỏ 15/5 => 15 bands
        const rows = Array.from({ length: Math.ceil(14 / 5) }, (_, i) => {
        const buttonsInRow = Array.from({ length: Math.min(5, 14 - i * 5) }, (_, j) =>
            createButton(i * 5 + j)
        );

        if (i === Math.ceil(14 / 5) - 1) {

            // Nếu là hàng cuối cùng, thêm nút "Cancel"
            buttonsInRow.push(
                new ButtonBuilder()
                    .setCustomId("ZiplayercancelEQ")
                    .setLabel("❌")
                    .setStyle(ButtonStyle.Secondary)
            );
        }

        return new ActionRowBuilder().addComponents(...buttonsInRow);
        });
        const embed = new EmbedBuilder()
        .setColor(lang?.COLOR || client.color )
        .setDescription(`**EQ:**
        ${drawBarChart(banstoUP)}`)
        .setTimestamp()
        .setImage(lang?.banner)
        .setFooter({ text: `${lang?.RequestBY} ${interaction.user.tag}`, iconURL: interaction.user.displayAvatarURL({ dynamic: true }) })
        .setThumbnail('https://cdn.discordapp.com/attachments/1064851388221358153/1172944748294709268/iu.png')
        queue.filters.equalizer.setEQ(banstoUP);
        return interaction?.reply({ embeds:[embed], components:  rows })
      }
      case "ZiplayercancelEQ":
        try { queue.filters.equalizer.resetEQ() }catch{console.error}
        return interaction?.message.delete();
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

    //::::::::::::::::::::::::::::::::::::::: PLAYER ::::::::::::::::::::::::::::::::::::::::::::::::::://
    switch (interaction.customId) {
      case "ZiplayerNext":
        if (queue.repeatMode == 1) queue.setRepeatMode(QueueRepeatMode.QUEUE)
        queue.node.skip()
        return interaction?.deferUpdate().catch(e => { });
      case "ZiplayerLyric":
        return interaction.reply(await lyricFind(queue?.currentTrack, interaction?.user, lang, queue))
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
    //::::::::::::::::::::::::::::::::::::::: SEEK ::::::::::::::::::::::::::::::::::::::::::::::::::::://
      case "ZiplayerSEEK0":
      return Ziseek(interaction, queue, lang, "BEGIN")
      case "ZiplayerSEEKP30":
        return Ziseek(interaction, queue, lang, "-30s")
      case "ZiplayerSEEKP10":
        return Ziseek(interaction, queue, lang, "-10s")
      case "ZiplayerSEEK10":
        return Ziseek(interaction, queue, lang, "10s")
      case "ZiplayerSEEK30":
        return Ziseek(interaction, queue, lang, "30s")
      case "ZiplayerSEEKINP": 
        return interaction?.showModal(
        new ModalBuilder()
          .setCustomId(`ZiSEEKK`)
          .setTitle(`Seek custom Update`)
          .addComponents(
            new ActionRowBuilder()
              .addComponents(
                new TextInputBuilder()
                  .setMinLength(1)
                  .setCustomId("Time")
                  .setLabel(`<[hhmm]ss/[hh:mm]:ss> (ex: 3m20s, 1:20:55)`)
                  .setStyle(TextInputStyle.Short)
                  .setRequired(true)
              )
          )
        )
    }

 if (interaction?.customId.includes("EQ")){
      return interaction?.showModal(  
    new ModalBuilder()
      .setCustomId(`ZiModalEQ${interaction?.customId}`)
      .setTitle(`Band ${lang?.volume} Update`)
      .addComponents(
        new ActionRowBuilder()
          .addComponents(
            new TextInputBuilder()
              .setMinLength(1)
              .setMaxLength(5)
              .setCustomId("Gain")
              .setLabel(`Gain`)
              .setStyle(TextInputStyle.Short)
              .setRequired(true)
          )
      )
    )
    }
  } catch (e) {
    console.log(e)
  }
}
