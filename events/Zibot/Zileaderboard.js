const { EmbedBuilder, ActionRowBuilder, ButtonStyle, ButtonBuilder, AttachmentBuilder } = require("discord.js");
const db = require("./../../mongoDB");
const { Font, LeaderboardBuilder } = require("canvacord");
const { ZifetchInteraction } = require("./ZiFunc");
const client = require("../../bot");

module.exports = async ({ interaction, lang }) => {
    let messages = await ZifetchInteraction(interaction);
    // Fetch all users from the database
    let UserI = await db?.ZiUser?.find();

    // Combined sorting logic: First by level in descending order, then by XP in descending order
    let ususs = UserI.sort((a, b) => {
        if (b.lvl !== a.lvl) {
            return b.lvl - a.lvl; // First, sort by level
        } else {
            return b.Xp - a.Xp; // If levels are the same, sort by XP
        }
    })
        .filter(user => client.users.cache.has(user.userID)) // Filter users present in the cache
        .slice(0, 10); // Keep only the top 10 users

    // Leaderboard name and entry array
    const name = "Ziji Leaderboard";
    const leaderboardEntries = [];
    let rankNum = 1;

    // Build leaderboard entries
    for (const members of ususs) {
        const member = await client.users.fetch(members.userID);
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
            image: client.user.displayAvatarURL({ extension: "png", forceStatic: true }),
            subtitle: `${totalMembers} members`,
        })
        .setPlayers(leaderboardEntries);
    const leaderboardBuffer = await leaderboard.build({ format: "png" });
    // Define the message to edit with a consistent structure for error handling
    const leaderboardMessage = {
        content: '',
        files: [new AttachmentBuilder(leaderboardBuffer, "leaderboard.png")],
        components: [
            new ActionRowBuilder().addComponents(
                new ButtonBuilder()
                    .setLabel("❌")
                    .setCustomId("cancel")
                    .setStyle(ButtonStyle.Secondary)
            ),
        ],
    };
    // Try to edit the original message, and handle errors with fallback
    try {
        await messages.edit(leaderboardMessage);
    } catch (e) {
        await interaction?.channel?.send(leaderboardMessage);
    }

}