module.exports = {
  name: "anime",
  description: "Get anime information.",
  integration_types: [0, 1],
  contexts: [0, 1, 2],
  options: [{
    name: "name",
    description: "Name anime",
    type: 3,
    required: true,
    autocomplete: true,
    name_localizations: {
      "en-US": "name",
      "vi": "tên",
      "ja": "名前",
      "ko": "이름"
    },
    description_localizations: {
      "en-US": "Name anime",
      "vi": "Tên anime",
      "ja": "アニメの名前",
      "ko": "애니메 이름"
    }
  }],
  cooldown: 3,
  dm_permission: true,
};

const { EmbedBuilder } = require('discord.js');
const Kitsu = require('kitsu');
const { removeVietnameseTones, ZifetchInteraction } = require('../events/Zibot/ZiFunc');
const client = require('../bot');
const kitsu = new Kitsu();

module.exports.run = async (lang, interaction) => {
  const name = interaction.options.getString("name");
  await ZifetchInteraction(interaction);

  let search = encodeURI(removeVietnameseTones(name))
  const { data } = await kitsu.get('anime?filter[text]=' + search + '&page[limit]=' + 2)
  const anime = data[0];
  let title = anime?.titles?.en_jp || anime?.titles?.en || anime.titles?.ja_jp || "unknown";
  const info = new EmbedBuilder()
    .setColor(lang?.COLOR || client.color)
    .setTitle(`**${title}**`)
    .setURL(`https://kitsu.io/anime/${anime?.id}`)
    .setDescription(`**Synopsis:**\n> ${anime?.synopsis.replace(/<[^>]*>/g, "").split("\n")[0]}
      **[[Trailer]](https://www.youtube.com/watch?v=${anime?.youtubeVideoId})**`)
    .setTimestamp()
    .setThumbnail(anime?.posterImage?.original)
    .setImage(anime?.coverImage?.large)
    .setFooter({ text: `${lang?.RequestBY} ${interaction.user.tag}`, iconURL: interaction.user.displayAvatarURL({ dynamic: true }) })
    .addFields([
      { name: "**🗓️ Date:**", value: `${anime?.startDate ? anime.startDate : "Unknown"}/${anime?.endDate ? anime.endDate : "Unknown"}`, inline: true },
      { name: "**⭐ Rating:**", value: `${anime?.averageRating ? anime.averageRating : "??"}`, inline: true },
      { name: "**📇 Type:**", value: `${anime?.showType ? anime.showType : "Unknown"}`, inline: true },
      { name: "**🎞️ Episodes:**", value: `${anime?.episodeCount ? anime.episodeCount : "??"}`, inline: true },
      { name: "**⏱️ Duration:**", value: `${anime?.episodeLength ? anime.episodeLength : "??"} minutes`, inline: true },
      { name: "**🏆 Rank:**", value: `${anime?.ratingRank ? anime.ratingRank : "Unknwon"}`, inline: true },
    ])
  return interaction?.editReply({ content: ``, embeds: [info] }).catch(e => interaction?.user?.send({ embeds: [info] }))
}

