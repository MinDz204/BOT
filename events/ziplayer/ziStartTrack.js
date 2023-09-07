const { EmbedBuilder, ButtonBuilder, ButtonStyle, ActionRowBuilder } = require("discord.js");
const client = require("./../../index")
const zistartButton = async ( queue ) =>{
    let ziQueue = false;
    let volicon = (queue.node.volume > 60) ? "🔊" : (queue.node.volume > 30) ? "🔉" : "🔈";
    const refsh = new ButtonBuilder()
      .setLabel('F5')
      .setCustomId('Ziplayerf5')
      .setStyle(ButtonStyle.Success);
    const Stop = new ButtonBuilder()
      .setLabel('Stop')
      .setCustomId('ZiplayerStop')
      .setStyle(ButtonStyle.Danger);
    const Next = new ButtonBuilder()
      .setLabel('▷')
      .setCustomId('ZiplayerNext')
      .setStyle(ButtonStyle.Success);
    const pause = new ButtonBuilder()
      .setLabel(`${queue.node.isPaused() ? '▶' : '❚❚'}`)
      .setCustomId('ZiplayerPause')
      .setStyle(ButtonStyle.Success);
    const prew = new ButtonBuilder()
      .setLabel('◁')
      .setCustomId('ZiplayerPrew')
      .setStyle(ButtonStyle.Success);
    const lyric = new ButtonBuilder()
      .setLabel('📄')
      .setCustomId('ZiplayerLyric')
      .setStyle(ButtonStyle.Success);
  
    const vol = new ButtonBuilder()
      .setLabel(`${volicon}`)
      .setCustomId('ZiplayerVol')
      .setStyle(ButtonStyle.Success);
  
    const AutoPlay = new ButtonBuilder()
      .setLabel('Auto')
      .setCustomId('ZiplayerAutoPlay')
      .setStyle(ButtonStyle.Success);
    const loopA = new ButtonBuilder()
      .setLabel('↻')
      .setCustomId('ZiplayerLoopA')
      .setStyle(ButtonStyle.Success);
    const shuffl = new ButtonBuilder()
      .setLabel('⇆')
      .setCustomId('ZiplayerShuffl')
      .setStyle(ButtonStyle.Success);
    const commingfunc = new ButtonBuilder()
    .setLabel('✨')
    .setCustomId('commingfunc')
    .setStyle(ButtonStyle.Success)
    .setDisabled(true);
  
    const queuE = new ButtonBuilder()
      .setLabel(`${ziQueue ? `${ziQueue.page}/${ziQueue.toplam}` : `Queue`}`)
      .setCustomId('ZiplayerQueuE')
      .setStyle(ButtonStyle.Success);
    const Fillter = new ButtonBuilder()
      .setLabel('Fillter')
      .setCustomId('ZiplayerFillter')
      .setDisabled(true)
      .setStyle(ButtonStyle.Success);
  
    const ZSearch = new ButtonBuilder()
      .setLabel('🔍')
      .setCustomId('ZiplayerSeach')
      .setStyle(ButtonStyle.Success);
  
    const Controll = new ButtonBuilder()
      .setLabel('▲')
      .setCustomId('ZiplayerControll')
      .setStyle(ButtonStyle.Secondary);
    const Controlll = new ButtonBuilder()
      .setLabel('▼')
      .setCustomId('ZiplayerControlll')
      .setStyle(ButtonStyle.Secondary);
  
    if (!queue?.history.previousTrack)  prew.setDisabled(true);
    if (queue.isEmpty())  queuE.setDisabled(true);
  
    const row = new ActionRowBuilder().addComponents(prew, pause, Next, vol, lyric);
    const row2 = new ActionRowBuilder().addComponents(refsh, shuffl, loopA, Controlll, Stop);
    const row25 = new ActionRowBuilder().addComponents(refsh, shuffl, loopA, Controll, Stop);
    const row3 = new ActionRowBuilder().addComponents(queuE, commingfunc, Fillter, AutoPlay, ZSearch);
  
  
    return { row, row2, row25, row3 }
  
}

const ZiPlayerlinkAvt = async ( query ) => { 
    switch (query){
      case `youtube`:
      case `youtubePlaylist`:
      case `youtubeSearch`:
      case `youtubeVideo`:
        return `https://cdn.discordapp.com/attachments/1064851388221358153/1091796615389511803/ok2.gif`;;
      case `spotifySong`:
      case `spotifyAlbum`:
      case `spotifySearch`:
      case `spotifyPlaylist`:
        return `https://cdn.discordapp.com/attachments/1064851388221358153/1091797876692230274/spoty.gif`;
      case `soundcloudTrack`:
      case `soundcloudPlaylist`:
      case `soundcloud`:
      case `soundcloudSearch`:
        return `https://cdn.discordapp.com/attachments/1064851388221358153/1091716901463412757/ezgif.com-crop.gif`;
      default:
        return `https://cdn.discordapp.com/attachments/1064851388221358153/1091717240669348010/ezgif.com-crop_1.gif`;
    }
  }
const zistartEmber = async ( queue ) =>{
    const track = queue?.currentTrack;
    let requestby = track?.requestby || queue?.metadata.requestby;
    const avtlink = await ZiPlayerlinkAvt(track?.queryType);
    const methods = [`OFF`, 'bai hat', `hang doi`,'AUTOPLAY',` `];
    const proress = queue?.node.createProgressBar({
        indicator: "O",timecodes: true
    })
    const timestamps = queue?.node.getTimestamp();
    const trackDurationsymbal = timestamps?.progress == "Infinity" ? "": "%"
    const trackDuration = timestamps?.progress == "Infinity" ? "∞": timestamps?.progress
    const embed = new EmbedBuilder()
        .setAuthor({ name: track?.title , url:track?.url, iconURL: avtlink})
        .setColor( queue?.metadata.embedCOLOR || client?.color )
        .setImage(track?.thumbnail)
        .setTimestamp()
        .setFooter({ text: `Được yêu cầu bởi: ${requestby?.tag}`, iconURL: requestby?.displayAvatarURL({ dynamic: true}) })
        .setDescription(`Volume: **${queue?.node.volume}**% - Playing: **${trackDuration}**${trackDurationsymbal}
        LoopMode: ${methods[queue.repeatMode]} - Fillter:${queue.filters.ffmpeg.getFiltersEnabled()}\n
        ${proress}`)
return embed;
}



const zistart = async( queue ) => {
let code;
if(queue?.currentTrack){
    const [ _embed, _button] = await Promise.all([ zistartEmber(queue), zistartButton(queue) ])
    return code = { content:``, embeds: [ _embed ], components:[ _button.row, _button.row25, _button.row3 ] }
}

const zisearch = new ActionRowBuilder().addComponents(
    new ButtonBuilder()
        .setLabel('Search')
        .setCustomId('ZiplayerSeach')
        .setStyle(ButtonStyle.Success)
);
const revEmbed = queue?.metadata?.Zimess.embeds[0];
const embess = new EmbedBuilder.from(revEmbed)
        .setDescription(`hàng đợi trống\n bạn có thể thêm 1 số bài hát`)
return code = { content:``, embeds: [ embess ], components:[ zisearch ] }

}


module.exports = {
    zistart,
    ZiPlayerlinkAvt
}