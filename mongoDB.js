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
const playlist = Schema({
  userID: String,
  userN: String,
  private: Boolean,
  listname: String,
  Song: Array,
})
//-------------------------------------------//
module.exports = {
  ZiUser: model("ZiUser", ZiUser),
  ZiguildPlay: model("ZiguildPlay", ZiguildPlay),
  voiceManager: model("voiceManager", voiceManager),
  ZiUserLock: model("ZiUserLock", ZiUserLock),
  playlist: model("playlist", playlist),
}