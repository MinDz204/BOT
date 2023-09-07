const { ButtonBuilder, ActionRowBuilder, ButtonStyle, AttachmentBuilder } = require("discord.js");
const canvacord = require("canvacord");
const db = require("./../mongoDB");
module.exports = {
    name: "profile",
    description: "View profile.",
    options: [{
        name: "user",
        description: "chọn user",
        type: 6,
      }],
    cooldown: 3,
    run: async (client, interaction) => {
        let userr = interaction.options.getUser("user") || interaction.user;
        let userDB = await db.ZiUser.findOne({ userID: userr.id })
        let strimg = `https://cdn.discordapp.com/attachments/1064851388221358153/1149319190918991934/iu.png`
        let editProf = new ActionRowBuilder().addComponents(
                    new ButtonBuilder()
                    .setLabel("edit ✎")
                    .setCustomId("editProfile")
                    .setStyle(ButtonStyle.Secondary)
                    )
        const rank = new canvacord.Rank()
            .setAvatar(userr.displayAvatarURL({ dynamic: false, format: 'png' }) )
            .setDiscriminator(`${userDB?.coin} xu`)
            .setCurrentXP(userDB?.Xp || 0)  
            .setLevel(userDB?.lvl || 1)
            .setRequiredXP( (userDB?.lvl || 1) * 50 + 1)
            .setStatus("dnd")
            .setProgressBar(userDB?.color || client.color, "COLOR")
            .setCustomStatusColor( userDB?.color || client.color )
            .setUsername(userr?.username, userDB?.color || client.color)
            .setBackground("IMAGE",userDB?.image || strimg )
  
                
        rank.build()
            .then(data => { 
                const attachment = new AttachmentBuilder(data, { name:"RankCard.png"});
                interaction.reply({ files: [ attachment ], components: [editProf] }).catch( e => { } );
            });
    },
  };
  