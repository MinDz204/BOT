const { EmbedBuilder, ButtonBuilder, ButtonStyle, ActionRowBuilder } = require("discord.js");
const client = require("../..");

// const { rank } = require("../Zibot/ZilvlSys"); 
const db = require ("./../../mongoDB")
const zistartButton = async ( queue ) =>{
    let ziQueue = await db.Ziqueue.findOne({ guildID: queue?.guild?.id, channelID: queue?.metadata?.channel?.id }).catch(e=>{ });
    let volicon = (queue.node.volume > 60) ? "1150769211526885416" : (queue.node.volume > 30) ? "1150769215255625759" : "1150769217763815454";
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
      .setEmoji('<:lyric:1150770291941851187>')
      .setCustomId('ZiplayerLyric')
      .setStyle(ButtonStyle.Success);
  
    const vol = new ButtonBuilder()
      .setEmoji(`<:sound:${volicon}>`)
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
      .setLabel('⤮')
      .setCustomId('ZiplayerShuffl')
      .setStyle(ButtonStyle.Success);
    const commingfunc = new ButtonBuilder()
    .setLabel('✨')
    .setCustomId('commingfunc')
    .setStyle(ButtonStyle.Success)
    .setDisabled(true);
  
    const queuE = new ButtonBuilder()
      .setCustomId('ZiplayerQueuE')
      .setStyle(ButtonStyle.Success);
    const Fillter = new ButtonBuilder()
      .setLabel('Fx')
      .setCustomId('ZiplayerFillter')
      .setStyle(ButtonStyle.Success);
  
    const ZSearch = new ButtonBuilder()
      .setEmoji('<:search:1150766173332443189>')
      .setCustomId('ZiplayerSeach')
      .setStyle(ButtonStyle.Success);
  const animeted = [
      "1150775508045410385",
      "1150776048263364608",
      "1150777291417333840",
      "1150777857761615903",
      "1150777891102150696",
      "1150777933045178399",
      "1150782781144707142",
      "1150782787394228296"]
    const Controll = new ButtonBuilder()
      .setEmoji(`<a:dance:${ animeted[Math.floor(Math.random() * 8)] } >`)
      .setCustomId('ZiplayerControll')
      .setStyle(ButtonStyle.Secondary)
      .setDisabled(true);
    
  
    if (!queue?.history.previousTrack)  prew.setDisabled(true);
    if (queue.isEmpty())  queuE.setDisabled(true);
    if (ziQueue){
      queuE.setLabel(`${ziQueue.page}/${ziQueue.toplam}`)
    }else {
      queuE.setEmoji(`<:queue:1150639849901133894>`)
    }
  
    const row = new ActionRowBuilder().addComponents(prew, pause, Next, vol, lyric);
    const row2 = new ActionRowBuilder().addComponents(refsh, shuffl, loopA, Controll, Stop);
    const row3 = new ActionRowBuilder().addComponents(queuE, commingfunc, Fillter, AutoPlay, ZSearch);
  
  
    return { row, row2, row3 }
  
}

const ZiPlayerlinkAvt = async ( query ) => { 
    switch (query){
      case `youtube`:
      case `youtubePlaylist`:
      case `youtubeSearch`:
      case `youtubeVideo`:
        return `https://cdn.discordapp.com/attachments/1064851388221358153/1091796615389511803/ok2.gif`;
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
const zistartEmber = async ( queue , lang ) =>{
    const track = queue?.currentTrack;
    let requestby = track?.requestby || queue?.metadata.requestby;
    const avtlink = await ZiPlayerlinkAvt(track?.queryType);
    const methods = [`${lang?.loopOFF}`, `${lang?.loopTrack}`, `${lang?.loopqueue}`,`${lang?.loopauto}`,` `];
    const proress = queue?.node.createProgressBar({
        indicator: "",
        timecodes: true,
        leftChar:`█`,
        rightChar:`▒`,
        length: 20,
    })
    const timestamps = queue?.node.getTimestamp();
    const trackDurationsymbal = timestamps?.progress == "Infinity" ? "": "%"
    const trackDuration = timestamps?.progress == "Infinity" ? "∞": timestamps?.progress
    const embed = new EmbedBuilder()
        .setAuthor({ name: track?.title , url:track?.url, iconURL: avtlink})
        .setColor( queue?.metadata.embedCOLOR || client?.color )
        .setImage(track?.queryType == "youtube"? `https://i3.ytimg.com/vi/${track?.raw?.id}/maxresdefault.jpg`: track?.thumbnail)
        .setTimestamp()
        .setFooter({ text: `${lang?.RequestBY} ${requestby?.tag}`, iconURL: requestby?.displayAvatarURL({ dynamic: true}) })
        .setDescription(`${lang?.Volume}: **${queue?.node.volume}**% - ${lang?.Playing}: **${trackDuration}**${trackDurationsymbal}
        ${lang?.LoopMode}: ${methods[queue.repeatMode]} - Fillter:${queue.filters.ffmpeg.getFiltersEnabled()}\n
        ${proress}`)
return embed;
}

const zistart = async( queue , lang ) => {
let code;

if(queue?.currentTrack){
    const [ _embed, _button] = await Promise.all([ zistartEmber(queue, lang), zistartButton(queue) ])
    return code = { content:``, embeds: [ _embed ], components:[ _button.row, _button.row2, _button.row3 ] }
}

const zisearch = new ActionRowBuilder().addComponents(
    new ButtonBuilder()
        .setLabel('Search')
        .setCustomId('ZiplayerSeach')
        .setStyle(ButtonStyle.Success)
);
const revEmbed = queue?.metadata?.Zimess.embeds[0];
const embess = EmbedBuilder.from(revEmbed)
        .setDescription(`${lang?.queueEMty}`)
return code = { content:``, embeds: [ embess ], components:[ zisearch ] }
}

module.exports = {
    zistart,
    ZiPlayerlinkAvt
}