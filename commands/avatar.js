module.exports = {
    name: "avatar",
    description: "View a user's avatar",
    integration_types: [0, 1],
    contexts: [0, 1, 2],
    options: [{
      name: "user",
      description: "Select user",
      type: 6,
      name_localizations: {
        "en-US": "user",
        "vi": "tên",
        "ja": "ユーザー",
        "ko": "사용자",
      },
      description_localizations: {
        "en-US": "Select user",
        "vi": "Chọn người dùng",
        "ja": "ユーザーを選択",
        "ko": "사용자를 선택합니다",
      }
    }],
    cooldown: 3,
    dm_permission: true,
  };
  
const { EmbedBuilder } = require('discord.js');
const { ZifetchInteraction } = require('../events/Zibot/ZiFunc');
const client = require('../bot');

module.exports.run = async ( lang, interaction ) => {
const user = interaction.options.getUser("user") || interaction.user;
await ZifetchInteraction(interaction);
const avt = user.displayAvatarURL().includes(`.gif`) ?
            user.displayAvatarURL({ size: 1024 }) :
            user.displayAvatarURL({ extension: "png", size: 1024 , forceStatic: true});
const info = new EmbedBuilder()
    .setColor(lang?.COLOR || client.color )
    .setDescription(`${user} Avatar`)
    .setImage(avt)
    
return interaction?.editReply({ content: ``, embeds: [ info ] }).catch(e => interaction?.user?.send({ embeds: [ info ] }))
}
  
  