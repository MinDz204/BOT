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

//-------------------------------------------//
module.exports = {
  Ziqueue: model("Ziqueue",Ziqueue),
  ZiUser: model("ZiUser", ZiUser),

}