const db = require("./../../mongoDB");
const rank = async ({ user, lvlAdd }) => {
  let Userrrr = await db.ZiUser.findOne({ userID: user?.id });
  let lang = require(`./../../lang/${Userrrr?.lang || "vi"}.js`);
  let xp = Userrrr?.Xp || 0;
  let xpALL = xp + (lvlAdd || 1)
  let lvll = Userrrr?.lvl || 0
  let coin = Userrrr?.coin || 0
  lang.cooldowns = Userrrr?.cooldowns;
  lang.COLOR = Userrrr?.color;
  if (xpALL > (lvll * 50)) {
    await db.ZiUser.updateOne({ userID: user?.id }, {
      $set: {
        lvl: lvll + 1,
        coin: coin + lvll * 100,  //lvl2 => 2*100
        Xp: xpALL - (lvll * 50 + 1),
      }
    }, { upsert: true })
  } else {
    await db.ZiUser.updateOne({ userID: user?.id }, {
      $set: {
        Xp: xpALL,
        userN: user?.tag,
        cooldowns: Date.now(),
      }
    }, { upsert: true })
  }
  return lang
}
module.exports = { rank }