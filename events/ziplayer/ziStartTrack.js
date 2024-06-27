const { EmbedBuilder, ButtonBuilder, ButtonStyle, ActionRowBuilder, StringSelectMenuOptionBuilder, StringSelectMenuBuilder } = require("discord.js");
const client = require('../../bot');
const db = require("./../../mongoDB");
const { Zitrim, animatedIcons } = require("../Zibot/ZiFunc");

const createButton = ({ label, customId, style = ButtonStyle.Success, emoji = null, disabled = false }) => {
  const button = new ButtonBuilder().setCustomId(customId).setStyle(style).setDisabled(disabled);
  if (label) button.setLabel(label);
  if (emoji) button.setEmoji(emoji);
  return button;
};

const zistartButton = async (queue) => {
  const guildID = queue?.guild?.id;
  const channelID = queue?.metadata?.channel?.id;
  const ZiUserLock = await db.ZiUserLock.findOne({ guildID, channelID }).catch(() => null);

  if (!ZiUserLock) {
    const requestby = queue?.metadata?.requestby?.id;
    await db.ZiUserLock.updateOne({ guildID, channelID }, { $set: { status: false, userID: requestby } }, { upsert: true });
  }

  const volicon = queue.node.volume > 60 ? "1150769211526885416" : queue.node.volume > 30 ? "1150769215255625759" : "1150769217763815454";
  const pauseLabel = queue.node.isPaused() ? '▶' : '❚❚';
  const controllEmoji = ZiUserLock?.status ? `<:LOck:1167543711283019776>` : `<:UNlock:1167543715632521368>`;
  const controllStyle = ZiUserLock?.status ? ButtonStyle.Secondary : ButtonStyle.Danger;
  const previousTrackExists = !!queue?.history.previousTrack;

  const prew = createButton({ label: '◁', customId: 'ZiplayerPrew', disabled: !previousTrackExists });
  const pause = createButton({ label: pauseLabel, customId: 'ZiplayerPause' });
  const Next = createButton({ label: '▷', customId: 'ZiplayerNext' });
  const vol = createButton({ emoji: `<:sound:${volicon}>`, customId: 'ZiplayerVol' });
  const seek = createButton({ label: 'Seek', customId: 'ZiplayerSeek' });
  const refsh = createButton({ label: 'F5', customId: 'Ziplayerf5' });
  const shuffl = createButton({ label: '⇩', customId: 'ZiplayersaVetrack' });
  const loopA = createButton({ label: '↻', customId: 'ZiplayerLoopA' });
  const Stop = createButton({ emoji: '⬜', customId: 'ZiplayerStop', style: ButtonStyle.Danger });
  const Controll = createButton({ emoji: controllEmoji, customId: 'ZiplayerControll', style: controllStyle });
  const queuE = createButton({ emoji: `<:queue:1150639849901133894>`, customId: 'ZiplayerQueuE', disabled: queue.isEmpty() });
  const lyrics = createButton({ emoji: '<:lyric:1150770291941851187>', customId: 'ZiplayerLyrics' });
  const AutoPlay = createButton({ label: 'Auto', customId: 'ZiplayerAutoPlay' });
  const Fillter = createButton({ label: 'Fx', customId: 'ZiplayerFillter' });
  const ZSearch = createButton({ emoji: '<:search:1150766173332443189>', customId: 'ZiplayerSeach' });

  const row = new ActionRowBuilder().addComponents(prew, pause, Next, vol, seek);
  const row2 = new ActionRowBuilder().addComponents(refsh, shuffl, loopA, Controll, Stop);
  const row3 = new ActionRowBuilder().addComponents(queuE, lyrics, Fillter, AutoPlay, ZSearch);

  return { row, row2, row3 };
};

const RelatedTracks = async (queue) => {
  const track = queue?.currentTrack || queue?.history.previousTrack;
  const tracks = (await track?.extractor?.getRelatedTracks(track, queue?.history))?.tracks || 
                 (await queue?.player?.extractors.run(async (ext) => {
                   const res = await ext.getRelatedTracks(track, queue?.history);
                   return res?.tracks.length ? res.tracks : false;
                 }))?.result || [];
  return tracks;
};

const RelatedTracksRow = async (queue) => {
  const tracks = await RelatedTracks(queue);
  const maxTracks = tracks.filter(t => t?.url.length < 100).slice(0, 20);

  if (maxTracks.length === 0) {
    return new ActionRowBuilder().addComponents(
      new StringSelectMenuBuilder()
        .setCustomId('Ziselectmusix')
        .setMinValues(1)
        .setMaxValues(1)
        .setPlaceholder('❌ No Tracks!')
        .setDisabled(true)
        .addOptions(new StringSelectMenuOptionBuilder().setLabel(`No Tracks`).setDescription(`00:00`).setValue(`No Tracks`))
    );
  }

  const options = maxTracks.map((track, index) => 
    new StringSelectMenuOptionBuilder()
      .setLabel(`${index + 1} - ${track?.duration}`)
      .setDescription(`. ${Zitrim(track?.title, 90) || "no name"}`)
      .setValue(track.url)
      .setEmoji('<:Playbutton:1230129096160182322>')
  );

  return new ActionRowBuilder().addComponents(
    new StringSelectMenuBuilder()
      .setCustomId('Ziselectmusix')
      .setMinValues(1)
      .setMaxValues(1)
      .setPlaceholder('▶️ | Pick the track u want to add to queue.')
      .addOptions(options)
  );
};

const defaultImage = 'https://cdn.discordapp.com/attachments/1064851388221358153/1215655934546804746/NoImage.png';
const iconMappings = {
  youtube: 'https://cdn.discordapp.com/attachments/1064851388221358153/1243685364502102066/youtube.gif',
  spotify: 'https://cdn.discordapp.com/attachments/1064851388221358153/1243684923626356846/spotify.gif',
  soundcloud: 'https://cdn.discordapp.com/attachments/1064851388221358153/1243684572672037027/SOUNDCLOUD.gif',
  default: 'https://cdn.discordapp.com/attachments/1064851388221358153/1091717240669348010/ezgif.com-crop_1.gif',
};

const ZiPlayerlinkAvt = (query) => {
  const key = Object.keys(iconMappings).find(k => query.toLowerCase().startsWith(k));
  return iconMappings[key] || iconMappings.default;
};

const youtubeMaxImage = (track) => {
  const id = track?.raw?.id || track?.thumbnail?.id || track?.raw?.thumbnail?.id || track?.__metadata?.id || track?.__metadata?.thumbnail?.id || track?.metadata?.id;
  return `https://i3.ytimg.com/vi/${id}/maxresdefault.jpg`;
};

const zistartEmber = async (queue, lang) => {
  const track = queue?.currentTrack;
  const requestby = track?.requestby || queue?.metadata?.requestby;
  const avtlink = ZiPlayerlinkAvt(track?.queryType);
  const methods = [`${lang?.loopOFF}`, `${lang?.loopTrack}`, `${lang?.loopqueue}`, `${lang?.loopauto}`, ' '];

  const progress = queue?.node.createProgressBar({
    indicator: "",
    timecodes: true,
    leftChar: `█`,
    rightChar: `▒`,
    length: 20,
  });

  const timestamps = queue?.node.getTimestamp();
  const trackDurationSymbol = timestamps?.progress === "Infinity" ? "" : "%";
  const trackDuration = timestamps?.progress === "Infinity" ? "∞" : timestamps?.progress;

  const embed = new EmbedBuilder()
    .setAuthor({ name: track?.title, url: track?.url, iconURL: avtlink })
    .setColor(queue?.metadata?.embedCOLOR || client?.color)
    .setTimestamp()
    .setFooter({ text: `${lang?.RequestBY} ${requestby?.tag}`, iconURL: requestby?.displayAvatarURL({ dynamic: true }) })
    .setDescription(
      `${lang?.Volume}: **${queue?.node.volume}**% - ${lang?.Playing}: **${trackDuration}**${trackDurationSymbol} <a:_:${animatedIcons[Math.floor(Math.random() * animatedIcons.length)]}>`
    )
    .addFields(
      { name: ` ${progress}`, value: ' ' }
    );

  if (queue?.filters?.ffmpeg?.toArray().length !== 0) {
    embed.addFields(
      { name: ` `, value: Zitrim(`**Filter: ${queue?.filters?.ffmpeg?.getFiltersEnabled()}**`, 1020), inline: false }
    );
  }

  if (queue.repeatMode !== 0) {
    embed.addFields(
      { name: ` `, value: `**${lang?.LoopMode}: ${methods[queue.repeatMode]}**`, inline: false }
    );
  }

  const imgggg = track?.thumbnail || defaultImage;
  const isYouTube = ['youtube', 'youtubePlaylist', 'youtubeSearch', 'youtubeVideo'].includes(track?.queryType);
  const imageQualities = ["maxresdefault", "hqdefault"];
  
  if (isYouTube && imageQualities.some(quality => imgggg.includes(quality))) {
    embed.setImage(youtubeMaxImage(track));
  } else {
    embed.setThumbnail(imgggg ?? defaultImage);
  }

  return embed;
};

const zistart = async (queue, lang) => {
  if (queue?.currentTrack) {
    const [_embed, _button, _select] = await Promise.all([zistartEmber(queue, lang), zistartButton(queue), RelatedTracksRow(queue)]);
    return { content: ``, embeds: [_embed], components: [_select, _button.row, _button.row2, _button.row3], allowedMentions: { repliedUser: false } };
  }

  const _selecttrack = await RelatedTracksRow(queue);
  const zisearch = new ActionRowBuilder().addComponents(
    createButton({ label: 'Search', customId: 'ZiplayerSeach', style: ButtonStyle.Success }),
    createButton({ emoji: '⬜', customId: 'ZiplayerStop', style: ButtonStyle.Danger })
  );

  const revEmbed = queue?.metadata?.Zimess?.reactions?.message?.embeds || queue?.metadata?.Zimess?.embeds;
  const embess = EmbedBuilder.from(revEmbed ? revEmbed[0] : null).setDescription(`${lang?.queueEMty}`);
  return { content: ``, embeds: [embess], components: [_selecttrack, zisearch], allowedMentions: { repliedUser: false } };
};

module.exports = {
  zistart,
  ZiPlayerlinkAvt,
  RelatedTracksRow
};
