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
const ZiguildPlay = Schema({
  GuildID: String,
  MessengerID: String,
  Game: String,
  data: Array,
  indes: Number,
})
const voiceManager = Schema({
  userID: String,
  textChannel: String,
  voiceChannel: String,
})

//-------------------------------------------//
module.exports = {
  Ziqueue: model("Ziqueue", Ziqueue),
  ZiUser: model("ZiUser", ZiUser),
  Zibot: model("Zibot", Zibot),
  ZiguildPlay: model("ZiguildPlay", ZiguildPlay),
  voiceManager: model("voiceManager", voiceManager),
  ZiUserLock: model("ZiUserLock", ZiUserLock),
}