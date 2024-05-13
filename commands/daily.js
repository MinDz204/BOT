const { EmbedBuilder } = require("discord.js");
const db = require("./../mongoDB");
const client = require("../bot");
const { rank } = require("../events/Zibot/ZilvlSys");
const { msToTime, ZifetchInteraction } = require("../events/Zibot/ZiFunc");

module.exports = {
  name: "daily",
  description: "View profile.",
  options: [],
  cooldown: 3,
  dm_permission: true,
  integration_types: [0 ,1],
  contexts: [0, 1, 2],
  run: async (lang, interaction) => {
    const userId = interaction.user.id;
    await ZifetchInteraction(interaction);

    let userDB = await db.ZiUser.findOne({ userID: userId }).catch(() => null); // Use null as default
    const embed = new EmbedBuilder()
      .setTimestamp()
      .setFooter({
        text: `${lang?.RequestBY} ${interaction.user.tag}`,
        iconURL: interaction.user.displayAvatarURL({ dynamic: true }),
      });

    const claimInterval = 86400000; // 24 hours in milliseconds
    const timeSinceLastClaim = Date.now() - (userDB?.claimcheck || 0);

    if (userDB && timeSinceLastClaim < claimInterval) {
      // Calculate remaining time
      const timeLeft = msToTime(claimInterval - timeSinceLastClaim);
      embed.setColor("#1a81e8").setDescription(lang?.claimfail.replace("houurss", timeLeft));
    } else {
      // User can claim daily
      embed.setColor(lang?.COLOR || client.color);
      
      // Add level and update database in one operation
      await rank({ user: interaction.user, lvlAdd: 49 });
      await db.ZiUser.updateOne(
        { userID: userId },
        { $set: { claimcheck: Date.now() } },
        { upsert: true }
      );

      // No need for a separate query, use the previous data and local calculations for XP and level
      const level = (userDB?.lvl || 0) + 1;
      const xp = (userDB?.Xp || 0) + 49;
      const nextLevelXp = level * 50 + 1;

      embed.setDescription(`${lang?.claimsuss} lvl: ${level} xp: ${xp}/${nextLevelXp}`);
    }

    try {
      await interaction.editReply({ content: ` `, embeds: [embed] });
    } catch (e) {
      await interaction?.user?.send({ content: ` `, embeds: [embed] });
    }
  },
};
