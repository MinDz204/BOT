const { EmbedBuilder, ButtonBuilder, ButtonStyle, ActionRowBuilder } = require('discord.js');
const db = require("../../mongoDB");
const client = require("./../../index")
const{ ZiPlayerlinkAvt } = require('./ziStartTrack');
const { lyricsExtractor } = require('@discord-player/extractor');
// Tạo một hàm để tìm lời bài hát.
async function searchForLyrics(songName) {
    const lyricsFinder = lyricsExtractor('zNcdOMl6eT89oKQR70sNWdqA556aJ2_0m6Iav4KeIuq0WyWc03rsLcFWElOB0Ma6');
    const lyrics = await lyricsFinder.search(songName).catch(() => null);
    return lyrics;
  }

const lyricFind = async (trackk, user, lang ) => {
    let code;

let usedd = await db?.ZiUser?.findOne({ userID: user?.id }).catch(e => { })
const row = new ActionRowBuilder().addComponents(
    new ButtonBuilder()
        .setLabel('❌')
        .setCustomId('cancel')
        .setStyle(ButtonStyle.Danger));
//embed
const info = new EmbedBuilder()
    .setColor( usedd?.color || client.color)
    .setImage(`https://i3.ytimg.com/vi/${trackk?.raw?.id}/maxresdefault.jpg`)
    .setTimestamp()
    .setFooter({ text: `${lang?.RequestBY} ${user?.tag}`, iconURL: user?.displayAvatarURL({ dynamic: true })})
    .addFields([
        { name: "**🗓️ Date:**", value: `${trackk?.raw?.uploadedAt? trackk?.raw?.uploadedAt:"Unknown"}`, inline: true },
        { name: "**⭐ views:**", value: `${trackk?.raw?.views? trackk?.raw?.views : "??"}`, inline: true },
        { name: "**⏱️ Duration:**", value: `${trackk?.raw?.durationFormatted? trackk?.raw?.durationFormatted:"??"} minutes`, inline: true },
      ]);
//sercher lyr
    const lyrics = await searchForLyrics(trackk?.title);
    if (!lyrics){
        let Ziic = await ZiPlayerlinkAvt(trackk?.queryType)
        info.setAuthor({ name: `${trackk?.title}`, iconURL: `${Ziic}`, url: trackk?.url });
        info.setDescription(`No Lyrics Found For \`${trackk?.title}\``);
    }else{
        const trimmedLyrics = lyrics?.lyrics.substring(0, 1980)
        info.setAuthor({
            name: lyrics?.artist?.name,
            iconURL: lyrics?.artist?.image,
            url: lyrics?.url
        });
        info.setThumbnail(lyrics?.image)
        info.setDescription(`[**${trackk?.title}**](${trackk?.url})\n**Lyric:**\n${trimmedLyrics.length === 1980 ? `${trimmedLyrics}...` : trimmedLyrics}\n`);
    }

    return code = { embeds: [info],components: [row] }

};
module.exports = { lyricFind }