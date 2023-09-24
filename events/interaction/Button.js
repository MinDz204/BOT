const { ModalBuilder, ActionRowBuilder, TextInputStyle, TextInputBuilder, EmbedBuilder, ButtonBuilder, ButtonStyle } = require("discord.js");
const db = require("./../../mongoDB");
const { rank } = require("../Zibot/ZilvlSys");
const { validURL } = require("../Zibot/ZiFunc");

module.exports = async (client, interaction) => {
  try {
    if (validURL(interaction.customId)) {
      await require("./../ziplayer/ziSearch")(interaction, interaction.customId);
      return interaction?.message.delete();
    }
    //rank sys------------------------------------------------//
    let lang = await rank({ user: interaction?.user });
    //cooldows-------------------------------------------------//
    const expirationTime = lang?.cooldowns + 3 * 1000;
    if (Date.now() < expirationTime) {
      const expiredTimestamp = Math.round(expirationTime / 1000);
      return interaction.reply({ content: `${lang?.cooldownsMESS.replace(`{expiredTimestamp}`, expiredTimestamp).replace(`{interaction.commandName}`, `'.'`)}`, ephemeral: true });
    }
    //cooldows-end------------------------------------------------//
    if (interaction?.customId.includes("Ziplayer")) return require("./../ziplayer/ZiplayerFuns")(interaction, lang)

    switch (interaction.customId) {

      case "cancel":
        return interaction?.message.delete();
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
                .setLabel(`Track Number`)
                .setPlaceholder(`${lang?.Deltrack}`)
                .setStyle(TextInputStyle.Short)
                .setRequired(true)
            )
          )
        return interaction?.showModal(modal);
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
          .setImage('https://cdn.discordapp.com/attachments/1064851388221358153/1122054818425479248/okk.png');
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
        let UserI = await db?.ZiUser?.find()
        return interaction.reply({
          embeds: [
            new EmbedBuilder()
              .setDescription(
                UserI.sort((a, b) => b.lvl - a.lvl)
                  .sort((a, b) => b.Xp - a.Xp)
                  .filter(user => client.users.cache.has(user.userID))
                  .slice(0, 10)
                  .map((user, position) => `**${position + 1}** | **${(client.users.cache.get(user.userID).tag)}**: Level: **${user.lvl}** | Xp: **${user.Xp}**`)
                  .join('\n'))
              .setColor(lang.COLOR || client.color)
              .setTitle("Zi bot top 10 leaderboard:")
              .setTimestamp()
              .setFooter({
                text: `${lang?.RequestBY} ${interaction.user.tag}`,
                iconURL: interaction.user.displayAvatarURL({ dynamic: true })
              })
              .setImage('https://cdn.discordapp.com/attachments/1064851388221358153/1122054818425479248/okk.png')
          ],
          components: [
            new ActionRowBuilder().addComponents(
              new ButtonBuilder()
                .setLabel("❌")
                .setCustomId("cancel")
                .setStyle(ButtonStyle.Secondary)
            ),
          ],
        });
      }
      default:
        console.log(interaction.customId)
    }
  } catch (e) {
    console.log(e)
  }
}
