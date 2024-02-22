const { EmbedBuilder, ButtonBuilder, ButtonStyle, ActionRowBuilder } = require('discord.js');
const client = require('../../bot');
const { ZiPlayerlinkAvt } = require('./ziStartTrack');

const lyric = async (trackk, user, lang, queue) => {
  const row = new ActionRowBuilder().addComponents(
    new ButtonBuilder()
    .setLabel('↼')
    .setCustomId('ZiplayerSEEK0')
    .setStyle(ButtonStyle.Secondary),
    new ButtonBuilder()
    .setLabel('↼30')
    .setCustomId('ZiplayerSEEKP30')
    .setStyle(ButtonStyle.Secondary),
    new ButtonBuilder()
    .setLabel('↼10')
    .setCustomId('ZiplayerSEEKP10')
    .setStyle(ButtonStyle.Secondary),
    new ButtonBuilder()
    .setLabel('10⇀')
    .setCustomId('ZiplayerSEEK10')
    .setStyle(ButtonStyle.Secondary),
    new ButtonBuilder()
    .setLabel('30⇀')
    .setCustomId('ZiplayerSEEK30')
    .setStyle(ButtonStyle.Secondary));
  const row2 = new ActionRowBuilder().addComponents(
    new ButtonBuilder()
    .setLabel('Custom Seek ↭')
    .setCustomId('ZiplayerSEEKINP')
    .setStyle(ButtonStyle.Success),
    new ButtonBuilder()
      .setLabel('❌')
      .setCustomId('cancel')
      .setStyle(ButtonStyle.Danger));

  const proress = queue?.node.createProgressBar({
    indicator: "",
    timecodes: true,
    leftChar: `█`,
    rightChar: `▒`,
    length: 20,
  })
  //embed
  let Ziic = await ZiPlayerlinkAvt(trackk?.queryType)
  const info = new EmbedBuilder()
    .setColor(lang?.COLOR || client.color)
    .setTimestamp()
    .setFooter({ text: `${lang?.RequestBY} ${user?.tag}`, iconURL: user?.displayAvatarURL({ dynamic: true }) })
    .setAuthor({ name: `${trackk?.title}`, iconURL: `${Ziic}`, url: trackk?.url })
    .setDescription(`**Seek panel:**`)
    .addFields({ name: `${proress}`, value: ` ` })
    .setImage(lang?.banner)

  return { embeds: [info], components: [row,row2] }
};
module.exports = { lyricFind: lyric }