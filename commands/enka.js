const { SlashCommandBuilder, ActionRowBuilder, StringSelectMenuBuilder, ButtonStyle, EmbedBuilder, AttachmentBuilder } = require("discord.js");
const db = require("./../mongoDB");
const client = require('../bot');
const { Wrapper } = require('enkanetwork.js');

const typeObject = {
	"Anemo": "#03F1CE",
	"Geo": "#FFC256",
	"Cryo": "#B9EFEF",
	"Electro": "#BD84E0",
	"Pyro": "#FEA76E",
	"Hydro": "#08E4FE",
	"Dendro": "#A5C83B"
};
function getImage(id) {
    return 'https://enka.network/ui/' + id + '.png';
}

module.exports = {
    name: "genshin",
    description: "Get Genshin infomation.",
    options: [{
      name: "uid",
      description: "User ID",
      type: 3,
      required: true,
    }],
    cooldown: 3,
    dm_permission: true,
  };
  
module.exports.run = async ( lang, interaction ) => {
    await interaction?.reply({ content: `<a:loading:1151184304676819085> Loading...`})
    let mess = await interaction.fetchReply().catch(e=>{ });
    let uid = interaction.options.getString("uid");
    tempus = client.users.cache.get(uid.replace("<@","").replace(">","")) ;
    let user = tempus || interaction.user;
    let Ziuser = await db.ZiUser.findOne({ userID: user.id }).catch(e => { })
    if (!uid || tempus ) {
        uid = Ziuser?.GIUID;
        if (!uid) return interaction.editReply({
                embeds: [
                    new EmbedBuilder()
                    .setColor("#ff0000")
                    .setDescription("Không tìm thấy UID của bạn, vui lòng thử lại, setup nó bằng /profile")
                ]
        });
    }
    const { genshin, starrail } = new Wrapper({ language: "vi", cache: true });
    let playerData;
    try {
        playerData = await genshin.getPlayer(uid);
    } catch(e) {
        return await mess.edit({ content: 'UID incorrect' });
    }
    await db.ZiUser.updateOne({ userID: user.id }, {
        $set: {
            GIdata: playerData,
        }
      }, { upsert: true }).catch(e => { })
    try {
        const result = playerData;
        let characterList = '';
        result.player.showcase.forEach((item) => {
            return characterList += `${item.name} - ${item.level}\n`;
        });
        const embed = new EmbedBuilder()
            .setAuthor({
                name: `${user.tag}`,
                iconURL: user.displayAvatarURL({ dynamic: true }),
            })
            .setTimestamp()
            .setFooter({ text: `${lang?.RequestBY} ${interaction.user.tag}`, iconURL: interaction.user.displayAvatarURL({ dynamic: true }) })
            .setTitle(`${result.player.username} \`\`\`${result.uid}\`\`\``)
            .setDescription(`${result.player.signature ?? 'None'}
            **AR** : ${result.player.levels.rank} ▴ WL ${result.player.levels.world}
            **Abyss** : ${result.player.abyss.floor} - ${result.player.abyss.chamber}
            **Namecard** : [${result.player.namecard.name}:${result.player.namecard.id}](${getImage(result.player.namecard.assets.icon)})
            **Achievement** : ${result.player.achievements}
            **Character Showcase:**
            \`\`\`${characterList}\`\`\`
            `)
            .setThumbnail(getImage(result.player.profilePicture.assets.icon))
            .setColor(client.color);
            const row = new ActionRowBuilder().addComponents(
                new StringSelectMenuBuilder()
                  .setCustomId("GIrow")
                  .setMaxValues(1)
                  .setMinValues(1)
                  .setPlaceholder("Showcase")
                  .setOptions(result.player.showcase.map((Track, index) => {
                    return { label: `${result.player.showcase[Number(index)].name} - ${result.player.showcase[Number(index)].level}`, value: `GI${user.id}Zi=${result.player.showcase[Number(index)].characterId}`}
                })))
        await mess.edit({
            embeds: [ embed ],
            components:[ row ],
        });
    } catch (error) {
        console.log(error);
    }
}
