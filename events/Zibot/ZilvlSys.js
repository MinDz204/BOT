const db = require("./../../mongoDB");

const rank = async ({ user, lvlAdd = 1 }) => {
  const userID = user?.id;
  if (!userID) throw new Error("Invalid user ID");
  const userDoc = await db.ZiUser.findOne({ userID }, "userID lang Xp lvl coin cooldowns color");

  const xp = userDoc?.Xp || 0;
  const lvl = userDoc?.lvl || 0;
  const coin = userDoc?.coin || 0;

  const xpALL = xp + lvlAdd;
  const nextLvlThreshold = lvl * 50;
  
  const langFilePath = `./../../lang/${userDoc?.lang || "vi"}.js`;
  const lang = require(langFilePath);

  lang.cooldowns = userDoc?.cooldowns;
  lang.COLOR = userDoc?.color;

  const updateData = {
    userN: user?.tag,
    cooldowns: Date.now(),
  };

  if (xpALL > nextLvlThreshold) {
    updateData.lvl = lvl + 1;
    updateData.coin = coin + (lvl * 100);
    updateData.Xp = xpALL - nextLvlThreshold - 1;
  } else {
    updateData.Xp = xpALL;
  }

  await db.ZiUser.updateOne({ userID }, { $set: updateData }, { upsert: true });

  return lang;
};

module.exports = { rank };
