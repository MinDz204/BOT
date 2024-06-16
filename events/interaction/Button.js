const { ModalBuilder, ActionRowBuilder, TextInputStyle, TextInputBuilder, EmbedBuilder, ButtonBuilder, ButtonStyle, AttachmentBuilder } = require("discord.js");
const db = require("./../../mongoDB");
const { rank } = require("../Zibot/ZilvlSys");
const { validURL } = require("../Zibot/ZiFunc");
const config = require("../../config");

module.exports = async (client, interaction) => {
  try {
    let lang;
    //#region SEARCH MUSIC
    //------------------------------------------------//
    if(config.ZiFuncs.PlayMusic){
      if (validURL(interaction.customId)) {
        return require("./../ziplayer/ziSearch")(interaction, interaction.customId);
      }
      if (interaction?.customId.includes("Ziselectmusix")) {
        return require("./../ziplayer/ziSearch")(interaction, interaction?.values[0]);
      }
      if (interaction?.customId.includes("Zsearch")) {
        return require("./../ziplayer/ziSearch")(interaction, interaction.message.embeds[0].description.replaceAll("*", "").replace(/ + /g, " "), interaction?.customId.replace(`Zsearch`, ""));
      }
      //Zi module------------------------------------------------//
      if (interaction?.customId.includes("Ziplayer")){
        lang = await rank({ user: interaction?.user });
        return require("./../ziplayer/ZiplayerFuns")(interaction, lang)
      }
      //ZiFillter ------------------------------------------------//
      if (interaction?.customId.includes("ZiFillter")){
        lang = await rank({ user: interaction?.user });
        return require("./../ziplayer/Zifillter").ZiFillter(interaction, interaction?.values[0] ,lang)
      }
   }
      if (interaction?.customId.includes("ZiDelPlaylist")){
        return require("./../ziplayer/ZiDelPlaylist")(interaction, lang)
      } 
//#endregion
    
    //ZiVc---------------------------------------------------------//
    if (interaction?.customId.includes("ZiVC")){
      if(!config.EnableJOINTOCREATE) return;
      lang = await rank({ user: interaction?.user });
      return require("./../Zibot/Zivc")(interaction, lang)
    } 
    if ( !config.interactionCreate.MessageComponentInside ) return;
    //rank sys----------------------------------------------------------//
        lang = await rank({ user: interaction?.user });
    //#region Game
    //game--------------------------------------------------------------//
    if (interaction?.customId.includes("ZtttR")){
      return require("../Zibot/game/ZitttR")(interaction, lang)
    } 
    if (interaction?.customId.includes("Zttt")){
      return require("../Zibot/game/Zittt")(interaction, lang)
    } 
    if (interaction?.customId.includes("Zrps")){
      return require("../Zibot/game/Zrps")(interaction, lang)
    }
    if (interaction?.customId.includes("Z8ball")){
      return require("../Zibot/game/Z8Ball")(interaction, lang)
    }
    if (interaction?.customId.includes("Zblackjack")){
      return require("../Zibot/game/ZblackJack")(interaction, lang)
    }
//#endregion
    //cooldows-------------------------------------------------//
    const expirationTime = lang?.cooldowns + 3 * 1000;
    if (Date.now() < expirationTime) {
      const expiredTimestamp = Math.round(expirationTime / 1000);
      return interaction.reply({ content: `${lang?.cooldownsMESS.replace(`{expiredTimestamp}`, expiredTimestamp).replace(`{interaction.commandName}`, `'.'`)}`, ephemeral: true });
    }
    //#region Button Func
    switch (interaction.customId) {
      case "cancel":
        return interaction?.message?.delete();
      case "cancelXcancel":
        return interaction?.message.edit({components: [ ]})
      case "QueueCancel":
        await db.Ziqueue.deleteOne({ guildID: interaction?.guild?.id, channelID: interaction?.channel?.id }).catch(e => { });
        return interaction?.message.delete();
      case "DelTrack": {
        const modal = new ModalBuilder()
          .setCustomId('DelTrackmodal')
          .setTitle(`Delete Track ${interaction?.guild?.name} `)
          .addComponents(
            new ActionRowBuilder().addComponents(
              new TextInputBuilder()
                .setCustomId('number')
                .setLabel(`Track Number ex: 1,3,4...`)
                .setPlaceholder(`${lang?.Deltrack}`)
                .setStyle(TextInputStyle.Short)
                .setRequired(true)
            )
          )
        return interaction?.showModal(modal);
      }
      case "TicTacToeRReroll":{
        return require("./../../commands/game").run(lang ,interaction,"ZtttR");
      }
      case "TicTacToeReroll":{
        return require("./../../commands/game").run(lang ,interaction,"Zttt");
      }
      case "ZcoinflipReroll":{
        return require("./../../commands/game").run(lang ,interaction,"Zcoinflip");
      }
      case "8ballReroll": {
        return require("./../../commands/game").run(lang ,interaction,"Z8ball");
      }
      case "Guills": {
        const rowC = new ActionRowBuilder().addComponents(
          new ButtonBuilder()
            .setCustomId("cancel")
            .setLabel("❌")
            .setStyle(ButtonStyle.Secondary)
        )
        let Index = 1;
        const embed = new EmbedBuilder()
          .setColor(lang.COLOR || client.color)
          .setTitle("Zi bot Guild:")
          .setTimestamp()
          .setDescription(`${client.guilds.cache.map((guild) => `${Index++} |\`${guild.name}\``).join('\n')}`)
          .setFooter({ text: `${lang?.RequestBY} ${interaction.user.tag}`, iconURL: interaction.user.displayAvatarURL({ dynamic: true }) })
          .setImage(lang?.banner);
        return interaction.reply({ embeds: [embed], components: [rowC] }).catch(e => { })
      }
      case "MesPiNJG":{
        return interaction.reply("https://cdn.discordapp.com/attachments/1162041451895599154/1162047498572009493/image.png")
      }
      case "ContextMenu":{
        const rowC = new ActionRowBuilder().addComponents(
          new ButtonBuilder()
            .setCustomId("cancel")
            .setLabel("❌")
            .setStyle(ButtonStyle.Secondary)
        )
        let linkvis = "https://cdn.discordapp.com/attachments/1162041451895599154/1216835730630774814/context.mp4?ex=6601d595&is=65ef6095&hm=595a96cfbca9e10f76522f98589f70d60000ef3c246317819f3e584edda03618&"
      return interaction.reply({content: linkvis, components: [rowC] })//.catch(e => { })
      }

      case "Statistics":{
        const rowC = new ActionRowBuilder().addComponents(
          new ButtonBuilder()
            .setCustomId("cancel")
            .setLabel("❌")
            .setStyle(ButtonStyle.Secondary)
        )
        let totalGuilds
        let totalMembers
        let totalChannels
        let shardSize
        let voiceConnections
        const promises = [
          client.shard.fetchClientValues('guilds.cache.size'),
          client.shard.broadcastEval(c => c.guilds.cache.reduce((acc, guild) => acc + guild.memberCount, 0)),
          client.shard.broadcastEval(c => c.guilds.cache.reduce((acc, guild) => acc + guild.channels.cache.size, 0)),
          client.shard.broadcastEval(c => c.voice?.adapters?.size || 0)
        ];
        await Promise.all(promises)
        .then(results => {
           totalGuilds = results[0].reduce((acc, guildCount) => acc + guildCount, 0);
           totalMembers = results[1].reduce((acc, memberCount) => acc + memberCount, 0);
           totalChannels = results[2].reduce((acc, channelCount) => acc + channelCount, 0);
           shardSize = client.shard.count;
            voiceConnections = results[3].reduce((acc, voiceCount) => acc + voiceCount, 0);
        })
        const embed = new EmbedBuilder()
        .setThumbnail(client.user.displayAvatarURL({ dynamic: true, size: 1024 }))
        .setDescription(`**${client.user.username} + Statistics:
          • Owner/Developer: <@891275176409460746>
          • User Count: \`${totalMembers || 0}\`
          • Server Count: \`${totalGuilds || 0}\`
          • Channel Count: \`${totalChannels || 0}\`
          • Shard Count: \`${shardSize || 0}\`
          • Connected Voice: \`${voiceConnections}\`
          • Command Count: \`${client.commands.map(c => c.name).length}\`
          • Operation Time: <t:${Math.floor(Number(Date.now() - client.uptime) / 1000)}:R>
          • Ping: \`${client.ws.ping} MS\`
          • Memory Usage: \`${(process.memoryUsage().heapUsed / 1024 / 1024).toFixed(2)} MB\`
          [Invite Bot](${client.InviteBot}) /  [Support Server](https://discord.gg/zaskhD7PTW)
          **`)
        .setFooter({ text: `${lang?.RequestBY} ${interaction.user.tag}`, iconURL: interaction.user.displayAvatarURL({ dynamic: true }) })
        .setColor(lang.COLOR || client.color)
        .setTimestamp()
        .setImage(lang?.banner);
        return interaction.reply({ embeds: [embed], components: [rowC] }).catch(e => { })
      }
      case "editProfile": {
        let rankkk = await db?.ZiUser?.findOne({ userID: interaction?.user.id }).catch(e => { })
        if (rankkk.lvl < 2) return interaction.reply({ content: `${lang?.canlvl2}`, ephemeral: true }).catch(e => { })

        const modal = new ModalBuilder()
          .setCustomId('editProfilemodal')
          .setTitle(`Edit profile ${interaction.user.tag} `)
          .addComponents(
            new ActionRowBuilder().addComponents(
              new TextInputBuilder()
                .setCustomId('Probcolor')
                .setValue(`${rankkk?.color || client.color}`)
                .setLabel(`Color`)
                .setPlaceholder(`${lang?.hexCOLOR}`)
                .setStyle(TextInputStyle.Short)
                .setRequired(false)
            ),
            new ActionRowBuilder().addComponents(
              new TextInputBuilder()
                .setCustomId('Probimage')
                .setLabel(`Image`)
                .setValue(`${rankkk?.image}`)
                .setPlaceholder(`${lang?.langIMG}`)
                .setStyle(TextInputStyle.Short)
                .setRequired(false)
            )
          )

        return interaction?.showModal(modal);
      }
      case "refProfile": {
        let props = require(`../../commands/profile`);
        return props.run(lang, interaction, true);
      }
      case "refLeaderboard": {
        return require("./../Zibot/Zileaderboard")({ interaction: interaction, lang: lang });
      }
      case "DelPlaylist":{
        const modal = new ModalBuilder()
        .setCustomId('DelPlaylistmodal')
        .setTitle(`Delete playlist ${interaction.user.tag} `)
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
//#endregion
  } catch (e) {
    return client?.errorLog?.send(`**${config?.Zmodule}** <t:${Math.floor(Date.now() / 1000)}:R>\nButton:${e?.stack}`)
  }
}
