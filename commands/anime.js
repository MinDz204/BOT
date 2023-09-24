const { EmbedBuilder, ActionRowBuilder, ButtonBuilder, ButtonStyle, Message } = require('discord.js');
const Kitsu = require('kitsu');
const { removeVietnameseTones } = require('../events/Zibot/ZiFunc');
const client = require('../bot');
const kitsu = new Kitsu();

module.exports = {
  name: "anime",
  description: "get anime infomation.",
  options: [{
    name: "name",
    description: "Name anime",
    type: 3,
    required: true,
    autocomplete: true,
  }],
  cooldown: 3,
  run: async ( lang, interaction ) => {
    const name = interaction.options.getString("name");
    interaction?.reply({content:`<a:loading:1151184304676819085> Loading...`, ephemeral: true }).then(async Message => { setTimeout(function(){
      Message?.delete().catch( e => { } );
  },10000)}).catch(e => { console.log(e) })
    let search = encodeURI(removeVietnameseTones(name))
    const { data } = await kitsu.get('anime?filter[text]=' + search + '&page[limit]=' + 2)
    const anime = data[0];
    let title = anime?.titles?.en_jp || anime?.titles?.en || anime.titles?.ja_jp || "unknown";
    const info = new EmbedBuilder()
        .setColor(lang?.COLOR || client.color )
        .setTitle(`**${title}**`)
        .setURL(`https://kitsu.io/anime/${anime?.id}`)
        .setDescription(`**Synopsis:**\n> ${anime?.synopsis.replace(/<[^>]*>/g,"").split("\n")[0]}
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

    return interaction.channel.send({ embeds: [ info ] })
  },
};
