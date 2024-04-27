const { EmbedBuilder, ButtonBuilder, ButtonStyle, ActionRowBuilder, StringSelectMenuOptionBuilder, StringSelectMenuBuilder } = require("discord.js");
const client = require('../../bot');

// const { rank } = require("../Zibot/ZilvlSys"); 
const db = require("./../../mongoDB");
const { Zitrim } = require("../Zibot/ZiFunc");
const zistartButton = async (queue) => {
  const guildID = queue?.guild?.id;
  const channelID = queue?.metadata?.channel?.id;
  // Fetch ZiQueue and ZiUserLock objects asynchronously, handling exceptions gracefully
  const [ziQueue, ZiUserLock] = await Promise.all([
    db.Ziqueue.findOne({ guildID, channelID }).catch(() => null),
    db.ZiUserLock.findOne({ guildID, channelID }).catch(() => null),
  ]);
  // If ZiUserLock is null, set the status and userID, then update the database
  if (!ZiUserLock) {
    const requestby = queue?.metadata?.requestby?.id; // Get requestor ID
    await db.ZiUserLock.updateOne({ guildID, channelID },
      { $set: { status: false, userID: requestby } },
      { upsert: true } // Ensure entry exists
    );
  }
  
  let volicon = (queue.node.volume > 60) ? "1150769211526885416" :
                (queue.node.volume > 30) ? "1150769215255625759" :
                                           "1150769217763815454";
  // Helper function to create a button with default settings
function createButton({ label, customId, style = ButtonStyle.Success, emoji = null, disabled = false }) {
  const button = new ButtonBuilder()
    .setCustomId(customId)
    .setStyle(style)
    .setDisabled(disabled);

  if (label) {
    button.setLabel(label);
  }

  if (emoji) {
    button.setEmoji(emoji);
  }

  return button;
}

// Conditional button labels and statuses
const pauseLabel = queue.node.isPaused() ? '▶' : '❚❚';
const controllEmoji = ZiUserLock?.status ? `<:LOck:1167543711283019776>` : `<:UNlock:1167543715632521368>`;
const controllStyle = ZiUserLock?.status ? ButtonStyle.Secondary : ButtonStyle.Danger;
const previousTrackExists = !!queue?.history.previousTrack;

// Creating buttons using the helper function
const prew = createButton({ label: '◁', customId: 'ZiplayerPrew', disabled: !previousTrackExists });
const pause = createButton({ label: pauseLabel, customId: 'ZiplayerPause' });
const Next = createButton({ label: '▷', customId: 'ZiplayerNext' });
const vol = createButton({ emoji: `<:sound:${volicon}>`, customId: 'ZiplayerVol' });
const seek = createButton({ label: 'Seek', customId: 'ZiplayerSeek' });
const refsh = createButton({ label: 'F5', customId: 'Ziplayerf5' });
const shuffl = createButton({ label: '⤮', customId: 'ZiplayerShuffl' });
const loopA = createButton({ label: '↻', customId: 'ZiplayerLoopA' });
const Stop = createButton({ emoji: '⬜', customId: 'ZiplayerStop', style: ButtonStyle.Danger });
const Controll = createButton({ emoji: controllEmoji, customId: 'ZiplayerControll', style: controllStyle });

const queuE = createButton({
  customId: 'ZiplayerQueuE',
  label: ziQueue ? `${ziQueue.page}/${ziQueue.toplam}` : null,
  emoji: !ziQueue ? `<:queue:1150639849901133894>` : null,
  disabled: queue.isEmpty(),
});
const lyrics = createButton({ emoji: '<:lyric:1150770291941851187>', customId: 'ZiplayerLyrics'});
const AutoPlay = createButton({ label: 'Auto', customId: 'ZiplayerAutoPlay' });
const Fillter = createButton({ label: 'Fx', customId: 'ZiplayerFillter' });
const ZSearch = createButton({ emoji: '<:search:1150766173332443189>', customId: 'ZiplayerSeach' });

// Building action rows
const row = new ActionRowBuilder().addComponents(prew, pause, Next, vol, seek);
const row2 = new ActionRowBuilder().addComponents(refsh, shuffl, loopA, Controll, Stop);
const row3 = new ActionRowBuilder().addComponents(queuE, lyrics, Fillter, AutoPlay, ZSearch);

return { row, row2, row3 };

}
const RelatedTracks = async (queue) => {
  const track = queue?.currentTrack || queue?.history.previousTrack;
  const tracks = (await track?.extractor?.getRelatedTracks(track, queue?.history ))?.tracks || (await queue?.player?.extractors.run(async (ext) => {
    const res = await ext.getRelatedTracks(track, queue.history);
    if (!res?.tracks.length) return false;
    return res?.tracks;
  }))?.result || [];
  return tracks;
}
const RelatedTracksRow = async (queue) => {
  let resu = await RelatedTracks(queue)
  const maxTracks = resu.filter(t => t?.url.length < 100).slice(0, 20);
  let track_creator = maxTracks.map((track, index) => {
    return new StringSelectMenuOptionBuilder()
      .setLabel(`${index + 1}.${Zitrim( track?.title , 20)}`)
      .setDescription(`${ track?.duration }`)
      .setValue(`${maxTracks[Number(index)].url}`)
      .setEmoji('<:Playbutton:1230129096160182322>')
  })
  if(track_creator?.length === 0){
    return new ActionRowBuilder()
      .addComponents(
        new StringSelectMenuBuilder()
          .setCustomId('Ziselectmusix')
          .setMinValues(1)
          .setMaxValues(1)
          .setPlaceholder('❌ No Tracks!')
          .setDisabled( true )
          .addOptions( 
          new StringSelectMenuOptionBuilder()
            .setLabel(`No Tracks`)
            .setDescription(`00:00`)
            .setValue(`No Tracks`)
          )
        );
    }
  return new ActionRowBuilder()
    .addComponents(
      new StringSelectMenuBuilder()
        .setCustomId('Ziselectmusix')
        .setMinValues(1)
        .setMaxValues(1)
        .setPlaceholder('▶️ | Pick the track u want to add to queue.')
        .addOptions( track_creator )
      );
}

const ZiPlayerlinkAvt = (query) => ({
  youtube: 'https://cdn.discordapp.com/attachments/1064851388221358153/1091796615389511803/ok2.gif',
  youtubePlaylist: 'https://cdn.discordapp.com/attachments/1064851388221358153/1091796615389511803/ok2.gif',
  youtubeSearch: 'https://cdn.discordapp.com/attachments/1064851388221358153/1091796615389511803/ok2.gif',
  youtubeVideo: 'https://cdn.discordapp.com/attachments/1064851388221358153/1091796615389511803/ok2.gif',

  spotifySong: 'https://cdn.discordapp.com/attachments/1064851388221358153/1091797876692230274/spoty.gif',
  spotifyAlbum: 'https://cdn.discordapp.com/attachments/1064851388221358153/1091797876692230274/spoty.gif',
  spotifySearch: 'https://cdn.discordapp.com/attachments/1064851388221358153/1091797876692230274/spoty.gif',
  spotifyPlaylist: 'https://cdn.discordapp.com/attachments/1064851388221358153/1091797876692230274/spoty.gif',

  soundcloudTrack: 'https://cdn.discordapp.com/attachments/1064851388221358153/1091716901463412757/ezgif.com-crop.gif',
  soundcloudPlaylist: 'https://cdn.discordapp.com/attachments/1064851388221358153/1091716901463412757/ezgif.com-crop.gif',
  soundcloud: 'https://cdn.discordapp.com/attachments/1064851388221358153/1091716901463412757/ezgif.com-crop.gif',
  soundcloudSearch: 'https://cdn.discordapp.com/attachments/1064851388221358153/1091716901463412757/ezgif.com-crop.gif',
}[query] || 'https://cdn.discordapp.com/attachments/1064851388221358153/1091717240669348010/ezgif.com-crop_1.gif');


function ZiImg(track) {
  let id = track?.raw?.id || track?.thumbnail?.id || track?.raw?.thumbnail?.id || track?.__metadata?.id || track?.__metadata?.thumbnail?.id || track?.metadata?.id;
  switch (track?.queryType) {
    case `youtube`:
    case `youtubePlaylist`:
    case `youtubeSearch`:
    case `youtubeVideo`:
      return `https://i3.ytimg.com/vi/${id}/maxresdefault.jpg`;
    default:
      return track?.thumbnail
  }
}
const zistartEmber = async (queue, lang) => {
  const track = queue?.currentTrack;
  const animeted = [
    "1150775508045410385",
    "1150776048263364608",
    "1150777291417333840",
    "1150777857761615903",
    "1150777891102150696",
    "1150777933045178399",
    "1150782781144707142",
    "1150782787394228296"]
  let requestby = track?.requestby || queue?.metadata.requestby;
  const avtlink = await ZiPlayerlinkAvt(track?.queryType);
  const methods = [`${lang?.loopOFF}`, `${lang?.loopTrack}`, `${lang?.loopqueue}`, `${lang?.loopauto}`, ` `];
  const proress = queue?.node.createProgressBar({
    indicator: "",
    timecodes: true,
    leftChar: `█`,
    rightChar: `▒`,
    length: 20,
  })
  const imgggg = await ZiImg(track)
  const timestamps = queue?.node.getTimestamp();
  const trackDurationsymbal = timestamps?.progress == "Infinity" ? "" : "%"
  const trackDuration = timestamps?.progress == "Infinity" ? "∞" : timestamps?.progress
  return new EmbedBuilder()
    .setAuthor({ name: track?.title, url: track?.url, iconURL: avtlink })
    .setColor(queue?.metadata?.embedCOLOR || client?.color)
    .setImage(`${imgggg??`https://cdn.discordapp.com/attachments/1064851388221358153/1215655934546804746/NoImage.png`}`)
    .setTimestamp()
    .setFooter({ text: `${lang?.RequestBY} ${requestby?.tag}`, iconURL: requestby?.displayAvatarURL({ dynamic: true }) })
    .setDescription(`${lang?.Volume}: **${queue?.node.volume}**% - ${lang?.Playing}: **${trackDuration}**${trackDurationsymbal} <a:dance:${animeted[Math.floor(Math.random() * 8)]}>
        ${lang?.LoopMode}: **${methods[queue.repeatMode]}** - Fillter: ${queue?.filters?.ffmpeg?.getFiltersEnabled()} \n
        `)
    .addFields({ name: `${proress}`, value: ` ` })

}

const start = async (queue, lang) => {

  if (queue?.currentTrack) {
    const [_embed, _button, _select] = await Promise.all([zistartEmber(queue, lang), zistartButton(queue), RelatedTracksRow(queue)])
    return { content: ``, embeds: [_embed], components: [_select, _button.row, _button.row2, _button.row3] }
  }
  const  _selecttrack = await RelatedTracksRow(queue);
  const zisearch = new ActionRowBuilder().addComponents(
    new ButtonBuilder()
      .setLabel('Search')
      .setCustomId('ZiplayerSeach')
      .setStyle(ButtonStyle.Success),
    new ButtonBuilder()
      .setEmoji('⬜')
      .setCustomId('ZiplayerStop')
      .setStyle(ButtonStyle.Danger)
  );
  const revEmbed = queue?.metadata?.Zimess?.reactions?.message?.embeds || queue?.metadata?.Zimess?.embeds;
  const embess = EmbedBuilder.from(revEmbed?revEmbed[0]:null)
    .setDescription(`${lang?.queueEMty}`)
  return { content: ``, embeds: [embess], components: [_selecttrack, zisearch] }
}

module.exports = {
  zistart: start,
  ZiPlayerlinkAvt
}