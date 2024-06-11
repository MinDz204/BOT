const { useMainPlayer, useQueue } = require('discord-player');
const { EmbedBuilder } = require('discord.js');
const db = require("./../mongoDB");
const { processQuery, ZifetchInteraction } = require('../events/Zibot/ZiFunc');
const player = useMainPlayer();
const client = require('../bot');

module.exports = {
  name: "play",
  description: "Play or Add music and play next.",
  name_localizations: {
    "en-US": "play",
    "vi": "phát",
    "ja": "再生",
    "ko": "재생"
  },
  description_localizations: {
    "en-US": "Play or Add music and play next.",
    "vi": "Phát hoặc Thêm nhạc và phát tiếp theo.",
    "ja": "音楽を再生または追加して、次に再生します",
    "ko": "음악을 재생하거나 추가하고 다음으로 재생합니다",
  },
  integration_types: [0],
  contexts: [0, 1, 2],
  options: [{
    name: "name",
    description: "Name Song",
    name_localizations: {
      "en-US": "name",
      "vi": "tên",  // Name in Vietnamese
      "ja": "名前", // Name in Japanese
      "ko": "이름" // Name in Korean
    },
    description_localizations: {
      "en-US": "Name Song",
      "vi": "Tựa đề bài hát",  // Song title in Vietnamese (more accurate)
      "ja": "曲名", // Song title in Japanese
      "ko": "노래 제목" // Song title in Korean
    },
    
    type: 3,
    required: true,
    autocomplete: true,
  }],
  voiceC: true,
  NODMPer: true,
  cooldown: 3,
  dm_permission: false,
  run: async (lang, interaction) => {

    let messages = await ZifetchInteraction(interaction);
    const queues = useQueue(interaction.guild.id);
    const nameS = interaction.options.getString("name");
    let userddd = await db.ZiUser.findOne({ userID: interaction.user.id }).catch(e => { })
    let res;

    let queue = player?.nodes?.create(interaction.guild, {
      metadata: {
        channel: interaction.channel,
        requestby: interaction.user,
        embedCOLOR: userddd?.color || client.color,
        Zimess: queues?.metadata ? queues?.metadata?.Zimess : messages,
        ZsyncedLyrics: { messages: queues?.metadata?.ZsyncedLyrics?.messages , Status: queues?.metadata?.ZsyncedLyrics?.Status || false },
      },
      requestedBy: interaction.user,
      volume: userddd?.vol || 50,
      maxSize: 200,
      maxHistorySize: 20,
      leaveOnEmpty: true,
      leaveOnEmptyCooldown: 2000,
      leaveOnEnd: true,
      leaveOnEndCooldown: 300000,
      skipOnNoStream: true,
      selfDeaf: true,
    });

    try {
      res = await player.search(await processQuery(nameS), {
        requestedBy: interaction.user,
      });
      if (!queue.connection) await queue.connect(
        interaction?.member.voice.channelId,
        { deaf: true })
    } catch (e) {
      return interaction?.channel.send(`${lang?.PlayerSearchErr}`).then(async Message => {
        setTimeout(function() {
          Message?.delete().catch(e => { });
        }, 10000)
      }).catch(e => { console.log(e) });
    }
    const entry = queue.tasksQueue.acquire();
    await entry.getTask()
    res.playlist ? queue.addTrack(res?.tracks) : queue.insertTrack(res?.tracks[0], 0);
    try {
      if (!queue.isPlaying()) await queue.node.play()
    } finally {
      queue.tasksQueue.release();
    }
    if(queues?.metadata)  return messages.delete().catch(e => {});
    return;
  },
};
