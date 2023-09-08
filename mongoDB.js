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
  lvl: { type: Number, default: 1 },
  coin: { type: Number, default: 0 },
})

//-------------------------------------------//
module.exports = {
  ZiUser: model("ZiUser", ZiUser),
}