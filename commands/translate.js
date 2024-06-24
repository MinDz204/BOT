const { EmbedBuilder, ActionRowBuilder, ButtonBuilder, ButtonStyle } = require('discord.js');
const translate = require('@iamtraction/google-translate');
const ISO6391 = require('iso-639-1');
const client = require('../bot');
const { ZifetchInteraction } = require('../events/Zibot/ZiFunc');

module.exports = {
    name: "translate",
    description: "Translate any language into user language.",
    name_localizations: {
      "en-US": "translate",
      "vi": "dịch",
      "ja": "翻訳",
      "ko": "번역"
    },
    description_localizations: {
      "en-US": "Translate any language into user language.",
      "vi": "Dịch bất kỳ ngôn ngữ nào sang ngôn ngữ của người dùng.",
      "ja": "あらゆる言語をユーザーの言語に翻訳します", // Translate any language to user's language in Japanese
      "ko": "모든 언어를 사용자 언어로 번역합니다", // Translate any language to user's language in Korean
    },
    integration_types: [0 ,1],
    contexts: [0, 1, 2],
    options: [{
        name: "transtext",
        description: "Enter the text you want to translate.",
        type: 3,
        required: true,
      }],
    cooldown: 3,
    NODMPer: false,
    dm_permission: true,
  };

module.exports.run = async (lang, interaction) => {
    let mess = await ZifetchInteraction(interaction);
      const args = interaction?.options?.getString('transtext') || interaction?.targetMessage?.content;
      const translated = await translate(args, { to: lang?.langdef || "vi" });
      let language_name = ISO6391.getName(`${translated.from.language.iso}`);

      const row = new ActionRowBuilder().addComponents(
        new ButtonBuilder()
          .setLabel('❌')
          .setCustomId('cancel')
          .setStyle(ButtonStyle.Secondary));

      const embed = new EmbedBuilder()
        .setColor(lang.COLOR || client.color)
        .setTitle(`Translate:`)
        .setDescription(`**${language_name} -> ${lang?.langdef}:**\n> ${translated.text}`)
        .setTimestamp()
        .setFooter({ text: `${language_name} -> ${lang?.langdef}`, iconURL: interaction.user.displayAvatarURL({ dynamic: true }) })
      if(!interaction.guild) return interaction.editReply({ content:``, embeds: [embed] });
      return interaction.editReply({ content:``, embeds: [embed], components: [row] }).then( setTimeout( async() => {
            return mess.edit({ content:``, embeds: [embed], components: [] }).catch(e => { })
      }, 30000)).catch(e => { });

}