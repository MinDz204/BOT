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
  let mess = await ZifetchInteraction(interaction);
  const args = interaction?.options?.getString('transtext') || interaction?.targetMessage?.content;
  const embed = [];
  const langdef = languages[`${lang?.langdef}`];
  if (args) {
    const translated = await translate(args, { to: lang?.langdef || "vi" });
    embed.push(
      new EmbedBuilder()
        .setColor(lang?.COLOR || client.color)
        .setTitle(`Translate:`)
        .setDescription(` ${translated.text}`)
        .setTimestamp()
        .setFooter({ text: `${languages[`${translated.from.language.iso}`]} -> ${langdef}`, iconURL: interaction.user.displayAvatarURL({ dynamic: true }) })
    )
  }
  if (interaction?.targetMessage && interaction?.targetMessage?.embeds?.[0]) {
    const taget_embed = interaction.targetMessage.embeds[0].data;
    let language_name;
    const temoEmbed = new EmbedBuilder()
      .setColor(taget_embed?.color || lang?.COLOR || client.color)
      .setTimestamp()
      .setImage(taget_embed?.image?.url || null)
      .setThumbnail(taget_embed?.thumbnail?.url || null)
    //translate 
    if (taget_embed?.description) {
      const description = await translate(taget_embed?.description, { to: lang?.langdef || "vi" });
      language_name = languages[`${description.from.language.iso}`];
      temoEmbed.setDescription(description?.text || null)
    }
    if (taget_embed?.title) {
      const title = await translate(taget_embed?.title, { to: lang?.langdef || "vi" });
      language_name = languages[`${title.from.language.iso}`];
      temoEmbed.setTitle(title?.text || null)
    }
    if (taget_embed?.author) {
      const author = await translate(taget_embed?.author?.name, { to: lang?.langdef || "vi" });
      language_name = languages[`${author.from.language.iso}`];
      temoEmbed.setAuthor({
        name: author?.text || null,
        iconURL: taget_embed?.author?.icon_url || null,
        url: taget_embed?.author?.url || null
      })
    }
    if (taget_embed?.fields && taget_embed?.fields.length) {
      const translatedFields = taget_embed?.fields.map(async (field) => {
        const field_name = await translate(field?.name, { to: lang?.langdef || "vi" });
        const field_value = await translate(field?.value, { to: lang?.langdef || "vi" });
        return { name: field_name?.text || null, value: field_value?.text || null, inline: field?.inline || false }
      });
      const _filds = await Promise.all(translatedFields)
      temoEmbed.addFields(..._filds)

    }
    temoEmbed.setFooter({ text: `${language_name} -> ${langdef}`, iconURL: interaction.user.displayAvatarURL({ dynamic: true }) })

    embed.push(temoEmbed)
  }
  const row = new ActionRowBuilder().addComponents(
    new ButtonBuilder()
      .setLabel('❌')
      .setCustomId('cancel')
      .setStyle(ButtonStyle.Secondary));
  if (!interaction.guild) return interaction.editReply({ content: ``, embeds: embed });
  return interaction.editReply({ content: ``, embeds: embed, components: [row] }).then(setTimeout(async () => {
    return mess.edit({ content: ``, embeds: embed, components: [] }).catch(e => { })
  }, 30000)).catch(e => { });
}