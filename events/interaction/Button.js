const { ModalBuilder, ActionRowBuilder, TextInputStyle, TextInputBuilder } = require("discord.js");
const db = require("./../../mongoDB");
const { rank } = require("../Zibot/ZilvlSys");
const { validURL } = require("../Zibot/ZiFunc");

module.exports = async (client, interaction) => {
try{
    if (validURL(interaction.customId)){
      await require("./../ziplayer/ziSearch")(interaction, interaction.customId);
      return interaction?.message.delete();
    }
      //rank sys------------------------------------------------//
    let lang = await rank({ user: interaction?.user });
      //cooldows-------------------------------------------------//
    const expirationTime = lang?.cooldowns + 3 * 1000;
    if (Date.now() < expirationTime) {
      const expiredTimestamp = Math.round(expirationTime / 1000);
      return interaction.reply({ content: `${lang?.cooldownsMESS.replace(`{expiredTimestamp}`,expiredTimestamp).replace(`{interaction.commandName}`,`'.'`)}`, ephemeral: true });
    }
      //cooldows-end------------------------------------------------//
    if (interaction?.customId.includes("Ziplayer")) return require("./../ziplayer/ZiplayerFuns")( interaction , lang)

    switch ( interaction.customId ){

    case "cancel":
    return interaction?.message.delete();
    case "QueueCancel":
      await db.Ziqueue.deleteOne({ guildID: interaction?.guild?.id, channelID: interaction?.channel?.id }).catch(e => { });
    return interaction?.message.delete();
    case "DelTrack":{
      const modal = new ModalBuilder()
        .setCustomId('DelTrackmodal')
        .setTitle(`Delete Track ${interaction?.guild?.name} `)
        .addComponents(
          new ActionRowBuilder().addComponents(
            new TextInputBuilder()
            .setCustomId('number')
            .setLabel(`Track Number`)
            .setPlaceholder(`${lang?.Deltrack}`)
            .setStyle(TextInputStyle.Short)
            .setRequired(true)
          )
          )
          return interaction?.showModal(modal);
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
            .setValue(`${rankkk?.color || client.color }`)
            .setLabel(`Color`)
            .setPlaceholder(`${lang?.hexCOLOR}`)
            .setStyle(TextInputStyle.Short)
            .setRequired(false)
          ),
          new ActionRowBuilder().addComponents(
            new TextInputBuilder()
            .setCustomId('Probimage')
            .setLabel(`Image`)
            .setPlaceholder(`${lang?.langIMG}`)
            .setStyle(TextInputStyle.Short)
            .setRequired(false)
          )
        )

    return interaction?.showModal(modal);
    }
    case "refProfile":{
    let props = require(`../../commands/profile`);
    return props.run( lang , interaction, true );
    }
    default:
        console.log(interaction.customId)
}
} catch (e) {
    console.log(e)}
}
