const config = require("./config");
const mongoose = require("mongoose");
const db = require("./mongoDB");
module.exports = async () => {
  await mongoose.connect(config.MOGOURL || process.env.MONGO, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  }).then(async () => {
    setTimeout(async () => {
      await db.Ziqueue.deleteOne();
    }, 5000)
  }).catch((err) => {
    return console.log("\nMongoDB Error: \n" + err)
  })
  const Ziusr = await db.Zibot.findOne();
  config.Ziusr = Ziusr;
  console.log(`Connected MongoDB`)
}