const { ButtonBuilder, ActionRowBuilder, ButtonStyle, AttachmentBuilder } = require("discord.js");
const { Font, RankCardBuilder } = require("canvacord");
const db = require("./../mongoDB");
const client = require("../bot");
const { ZifetchInteraction } = require("../events/Zibot/ZiFunc");

module.exports = {
  name: "profile",
  description: "View profile.",
  name_localizations: {
    "en-US": "profile",
    "vi": "thông-tin",
    "ja": "プロフィール",
    "ko": "프로필",
  },
  description_localizations: {
    "en-US": "View profile.",
    "vi": "Xem thông tin hồ sơ của bạn.",
    "ja": "プロフィールを見る",
    "ko": "프로필 보기",
  },
  integration_types: [0 ,1],
  contexts: [0, 1, 2],
  options: [
    {
      name: "user",
      description: "Chọn user",
      name_localizations: {
        "en-US": "user",
        "vi": "người-dùng",
        "ja": "ユーザー",
        "ko": "사용자"
      },
      description_localizations: {
        "en-US": "Select user",
        "vi": "Chọn người dùng",
        "ja": "ユーザーを選択",
        "ko": "사용자 선택"
      },
      type: 6,
    },
  ],
  cooldown: 3,
  dm_permission: true,
  run: async (lang, interaction, Zi) => {
    try {
      await ZifetchInteraction(interaction);
      const targetUser = interaction?.options?.getUser("user") || interaction.user;
      const userr = await interaction?.guild?.members.fetch(targetUser) || interaction.user;

      const [userDB, UserI] = await Promise.all([
        db.ZiUser.findOne({ userID: userr.id }),
        db.ZiUser.find(),
      ]);

      const usersort = UserI.sort((a, b) => {
        if (b.lvl !== a.lvl) {
          return b.lvl - a.lvl; 
        }
        return b.Xp - a.Xp; 
      });

      const sss = usersort.findIndex((user) => user.userID === userr.id);

      const strimg = "https://cdn.discordapp.com/attachments/1064851388221358153/1149319190918991934/iu.png";

      const editProf = new ActionRowBuilder().addComponents(
        new ButtonBuilder().setLabel("Edit ✎").setCustomId("editProfile").setStyle(ButtonStyle.Secondary),
        new ButtonBuilder().setLabel("↻").setCustomId("refProfile").setStyle(ButtonStyle.Secondary),
        new ButtonBuilder().setEmoji("<:leaderboard:1154355691063087195>").setCustomId("refLeaderboard").setStyle(ButtonStyle.Secondary),
        new ButtonBuilder().setLabel("❌").setCustomId("cancel").setStyle(ButtonStyle.Secondary),
        new ButtonBuilder().setLabel("←❌").setCustomId("cancelXcancel").setStyle(ButtonStyle.Secondary)
      );

      Font.loadDefault();
      const status = userr.presence?.status || "none";

      const rankCard = new RankCardBuilder()
        .setAvatar(userr.displayAvatarURL({ extension: "png", forceStatic: true }))
        .setUsername(`${userDB?.coin || 0} xu`)
        .setCurrentXP(userDB?.Xp || 0)
        .setLevel(userDB?.lvl || 1)
        .setRequiredXP((userDB?.lvl || 1) * 50 + 1)
        .setProgressCalculator(() => Math.floor(((userDB?.Xp || 0) / ((userDB?.lvl || 1) * 50 + 1)) * 100))
        .setStatus(status)
        .setDisplayName(userr?.tag || userr?.nickname || userr?.user?.tag, userDB?.color || client.color)
        .setBackground(userDB?.image || strimg)
        .setRank(sss + 1)
        .setOverlay(15.5);

      const rankCardBuffer = await rankCard.build({ format: "png" });
      const attachment = new AttachmentBuilder(rankCardBuffer, { name: "RankCard.png" });

      const response = { content: "", files: [attachment], components: [editProf] };
      if(!interaction.guild) response.components = []
      if (!Zi) {
        interaction.editReply(response).catch(() => {
          interaction?.channel?.send(response);
        });
      } else {
        interaction.message.edit(response).catch(console.error);
        interaction.deleteReply();
      }
    } catch (error) {
      console.error("Error in profile command:", error);
      throw error; 
    }
  },
};
