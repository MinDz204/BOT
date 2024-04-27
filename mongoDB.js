const { Schema, model } = require("mongoose");
//-------------------------------------------//
const ZiUser = Schema({
  userN: String,
  userID: String,
  link: String,
  image: String,
  color: String,
  lang: String,
  Xp: Number,
  vol: Number,
  cooldowns: Number,
  claimcheck: Number,
  GIUID: Number,
  GIdata:Array,
  GIrow: Array,
  EQband: Array,
  lvl: { type: Number, default: 1 },
  coin: { type: Number, default: 0 },
})

const ZiUserLock = Schema({
  guildID: String,
  channelID: String,
  userID: String,
  messageID: String,
  status: Boolean,
})

const Ziqueue = Schema({
  guildID: String,
  channelID: String,
  messageID: String,
  page: Number,
  toplam: Number,
})
const Zibot = Schema({
  keygen: String,
  channelID: String,
  gif: String,
})
//-------------------------------------------//
const Ziguild = Schema({
  GuildID: String,
  channelID: String,
  content: String,
  img: String,
})
const voiceManager = Schema({
  userID: String,
  textChannel: String,
  voiceChannel: String,
})
const useLyrics = Schema({
  guildID: String,
  channelID: String,
  userID: String,
  messageID: String,
  liveLyricsID: String,
  status: Boolean,
  ms1:Number,
  ms2:Number,
})
//-------------------------------------------//
module.exports = {
  Ziqueue: model("Ziqueue", Ziqueue),
  ZiUser: model("ZiUser", ZiUser),
  Zibot: model("Zibot", Zibot),
  Ziguild: model("Ziguild", Ziguild),
  voiceManager: model("voiceManager", voiceManager),
  ZiUserLock: model("ZiUserLock", ZiUserLock),
  useLyrics: model("useLyrics", useLyrics),
}