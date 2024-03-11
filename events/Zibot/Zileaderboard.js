const { EmbedBuilder, ActionRowBuilder, ButtonStyle, ButtonBuilder, AttachmentBuilder } = require("discord.js");
const db = require("./../../mongoDB");
const { Font, LeaderboardBuilder } = require("canvacord");
const { ZifetchInteraction } = require("./ZiFunc");
const client = require("../../bot");

module.exports = async ({ interaction, lang }) => {
    let messages = await ZifetchInteraction(interaction);
    let UserI = await db?.ZiUser?.find()

    let ususs = UserI.sort((a, b) => b.lvl - a.lvl)
    .sort((a, b) => b.Xp - a.Xp)
    .filter(user => client.users.cache.has(user.userID))
    .slice(0, 10);
    const name = "Ziji Leaderboard";
    const leaderboardEntries = [];
    let rankNum = 1;

    for (const members of ususs) {
        const member = await client.users.fetch(members.userID)
        const avatar = member.displayAvatarURL({ extension: "png", forceStatic: true });
        const username = member.tag;
        const displayName = member.displayName;
        const level = members.lvl;
        const xp = members.Xp;
        const rank = rankNum;
  
      leaderboardEntries.push({ avatar, username, displayName, level, xp, rank });
      rankNum++;
    }

    const totalMembers = await client.shard.broadcastEval(c =>
        c.guilds.cache.reduce((acc, guild) => acc + guild.memberCount, 0)
      ).then(results => results.reduce((acc, memberCount) => acc + memberCount, 0));

    Font.loadDefault();
    const leaderboard = new LeaderboardBuilder()
        .setHeader({
        title: name,
        image: client.user.displayAvatarURL(),
        subtitle: `${totalMembers} members`,
        })
        .setPlayers(leaderboardEntries);
  const leaderboardBuffer = await leaderboard.build({ format: "png" });

    return messages.edit({
        conten:``,
        files: [
            new AttachmentBuilder(leaderboardBuffer, "leaderboard.png")
        ],
        components: [
            new ActionRowBuilder().addComponents(
            new ButtonBuilder()
                .setLabel("❌")
                .setCustomId("cancel")
                .setStyle(ButtonStyle.Secondary)
            ),
        ],
    }).catch(e => interaction?.channel?.send({
        files: [
            new AttachmentBuilder(leaderboardBuffer, "leaderboard.png")
        ],
        components: [
            new ActionRowBuilder().addComponents(
                new ButtonBuilder()
                    .setLabel("❌")
                    .setCustomId("cancel")
                    .setStyle(ButtonStyle.Secondary)
                ),
        ]}));;

}