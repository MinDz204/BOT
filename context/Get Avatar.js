const { EmbedBuilder, ContextMenuCommandBuilder, ApplicationCommandType } = require('discord.js');
const client = require('../bot');
const { ZifetchInteraction } = require('../events/Zibot/ZiFunc');

module.exports = {
    name: "Get Avatar",
    integration_types: [0 ,1],
    contexts: [0, 1, 2],
    NODMPer: false,
    dm_permission: true,
    type: 2,
    cooldown: 3,
};
  
module.exports.run = async (lang, interaction) => {
    await ZifetchInteraction(interaction);
    let user = interaction.targetUser;
    const avt = user.displayAvatarURL().includes(`.gif`) ?
                user.displayAvatarURL({ size: 1024 }) :
                user.displayAvatarURL({ extension: "png", size: 1024 , forceStatic: true});    const info = new EmbedBuilder()
    .setColor(lang?.COLOR || client.color )
    .setDescription(`${user} Avatar`)
    .setImage(avt)
return interaction?.editReply({ content: ``, embeds: [ info ] }).catch(e => interaction?.user?.send({ embeds: [ info ] }))

  }
