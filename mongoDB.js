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
//-------------------------------------------//
module.exports = {
  Ziqueue: model("Ziqueue", Ziqueue),
  ZiUser: model("ZiUser", ZiUser),
  Zibot: model("Zibot", Zibot),
  Ziguild: model("Ziguild", Ziguild),
}