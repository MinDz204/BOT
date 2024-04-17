const { ButtonBuilder, ActionRowBuilder, ButtonStyle, AttachmentBuilder } = require("discord.js");
const { Font, RankCardBuilder } = require("canvacord");
const db = require("./../mongoDB");
const client = require('../bot');
const { ZifetchInteraction } = require("../events/Zibot/ZiFunc");
module.exports = {
  name: "profile",
  description: "View profile.",
  options: [{
    name: "user",
    description: "chọn user",
    type: 6,
  }],
  cooldown: 3,
  dm_permission: true,
  run: async (lang, interaction, Zi) => {
    let messages = await ZifetchInteraction(interaction);
    let userr =  await interaction.guild?.members.fetch(interaction?.options?.getUser("user") || interaction.user ) || interaction.user;
    let userDB = await db.ZiUser.findOne({ userID: userr.id })
    let UserI = await db?.ZiUser?.find()
    const sss = UserI.sort((a, b) => b.lvl - a.lvl)
      .sort((a, b) => b.Xp - a.Xp)
      .findIndex((user) => user.userID === userr.id);
    let strimg = `https://cdn.discordapp.com/attachments/1064851388221358153/1149319190918991934/iu.png?ex=65fc26e8&is=65e9b1e8&hm=2941beeaef776eb14c8d0c1e41d3990adf60854da49e91958e7296a4cdd2b9f7&`
    let editProf = new ActionRowBuilder().addComponents(
      new ButtonBuilder()
        .setLabel("edit ✎")
        .setCustomId("editProfile")
        .setStyle(ButtonStyle.Secondary),
      new ButtonBuilder()
        .setLabel("↻")
        .setCustomId("refProfile")
        .setStyle(ButtonStyle.Secondary),
      new ButtonBuilder()
        .setEmoji("<:leaderboard:1154355691063087195>")
        .setCustomId("refLeaderboard")
        .setStyle(ButtonStyle.Secondary),
      new ButtonBuilder()
        .setLabel("❌")
        .setCustomId("cancel")
        .setStyle(ButtonStyle.Secondary)
    )

  Font.loadDefault();
  const status = userr.presence && userr.presence.status
  ? userr.presence.status
  : 'none';
  const rankCard = new RankCardBuilder()
    .setAvatar(userr.displayAvatarURL({ dynamic: false, format: 'png' }))
    .setUsername(`${userDB?.coin || 0} xu`)
    // .setUsername("@wumpus")
    .setCurrentXP(userDB?.Xp || 0)
    .setLevel(userDB?.lvl || 1)
    .setRequiredXP((userDB?.lvl || 1) * 50 + 1)
    .setProgressCalculator(() => {
      return Math.floor(((userDB?.Xp || 0)/(userDB?.lvl * 50 + 1) * 100));
    })
    .setStatus(status)
    .setDisplayName(userr?.username, userDB?.color || client.color)
    .setBackground(userDB?.image || strimg)
    .setRank(sss + 1)
    .setOverlay(15.5);
    const rankCardBuffer = await rankCard.build({ format: "png" });
    const attachment = new AttachmentBuilder(rankCardBuffer, { name: "RankCard.png" });
    if (!Zi) return messages?.edit({content:``, files: [attachment], components: [editProf] }).catch(e => interaction?.channel?.send({ files: [attachment], components: [editProf] }));
    interaction.message.edit({content:``, files: [attachment], components: [editProf] }).catch(e => {console.log(e) });
    interaction.deleteReply();
  },
};
