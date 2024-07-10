const { EmbedBuilder, ActionRowBuilder, ButtonBuilder, ButtonStyle } = require('discord.js');
const translate = require('@iamtraction/google-translate');
const client = require('../bot');
const { ZifetchInteraction, languages } = require('../events/Zibot/ZiFunc');

module.exports = {
  name: "translate",
  description: "Translate any language into user language.",
  description_localizations: {
    "en-US": "Translate any language into user language.",
    "vi": "Dịch bất kỳ ngôn ngữ nào sang ngôn ngữ của người dùng.",
    "ja": "あらゆる言語をユーザーの言語に翻訳します",
    "ko": "모든 언어를 사용자 언어로 번역합니다",
  },
  integration_types: [0, 1],
  contexts: [0, 1, 2],
  options: [{
    name: "transtext",
    description: "Enter the text you want to translate.",
    type: 3,
    required: true,
    autocomplete: true,
  }],
  cooldown: 3,
  NODMPer: false,
  dm_permission: true,
};

module.exports.run = async (lang, interaction) => {
  const mess = await ZifetchInteraction(interaction);
  const args = interaction?.options?.getString('transtext') || interaction?.targetMessage?.content;
  const embed = [];
  const langdef = lang?.langdef || "vi";
  const color = lang?.COLOR || client.color;

  const createEmbed = (text, fromLang) => {
    return new EmbedBuilder()
      .setColor(color)
      .setTitle('Translate:')
      .setDescription(text)
      .setTimestamp()
      .setFooter({
        text: `${languages[fromLang]} -> ${languages[langdef]}`,
        iconURL: interaction.user.displayAvatarURL({ dynamic: true })
      });
  };

  if (args) {
    const translated = await translate(args, { to: langdef });
    embed.push(createEmbed(translated.text, translated.from.language.iso));
  }

  if (interaction?.targetMessage && interaction?.targetMessage?.embeds?.length) {
    let fromLang = "unknown";
    const targetEmbed = interaction.targetMessage.embeds[0].data;
    const translatedEmbed = new EmbedBuilder()
      .setColor(targetEmbed.color || color)
      .setTimestamp()
      .setImage(targetEmbed.image?.url || null)
      .setThumbnail(targetEmbed.thumbnail?.url || null);

    const translateField = async (field, targetLang) => {
      const name = await translate(field.name, { to: targetLang });
      const value = await translate(field.value, { to: targetLang });
      return { name: name.text, value: value.text, inline: field.inline || false };
    };

    if (targetEmbed.description) {
      const description = await translate(targetEmbed.description, { to: langdef });
      fromLang = languages[description.from.language.iso];
      translatedEmbed.setDescription(description.text);
    }

    if (targetEmbed.title) {
      const title = await translate(targetEmbed.title, { to: langdef });
      fromLang = languages[title.from.language.iso];
      translatedEmbed.setTitle(title.text);
    }

    if (targetEmbed.author) {
      const author = await translate(targetEmbed.author.name, { to: langdef });
      fromLang = languages[author.from.language.iso];
      translatedEmbed.setAuthor({
        name: author.text,
        iconURL: targetEmbed.author.icon_url,
        url: targetEmbed.author.url,
      });
    }

    if (targetEmbed.fields?.length) {
      const translatedFields = await Promise.all(targetEmbed.fields.map(field => translateField(field, langdef)));
      translatedEmbed.addFields(translatedFields);
    }

    translatedEmbed.setFooter({
      text: `${fromLang} -> ${languages[langdef]}`,
      iconURL: interaction.user.displayAvatarURL({ dynamic: true })
    });

    embed.push(translatedEmbed);
  }

  const row = new ActionRowBuilder().addComponents(
    new ButtonBuilder()
      .setLabel('❌')
      .setCustomId('cancel')
      .setStyle(ButtonStyle.Secondary)
  );

  if (!interaction.guild) return interaction.editReply({ content: '', embeds: embed });

  return interaction.editReply({ content: '', embeds: embed, components: [row] })
    .then(() => setTimeout(() => mess.edit({ content: '', embeds: embed, components: [] }).catch(() => { }), 30000))
    .catch(() => { });
};
