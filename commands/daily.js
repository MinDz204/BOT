const { EmbedBuilder } = require("discord.js");
const db = require("./../mongoDB");
const client = require('..');
const { rank } = require("../events/Zibot/ZilvlSys");
const { msToTime } = require("../events/Zibot/ZiFunc");

module.exports = {
    name: "daily",
    description: "View profile.",
    options: [ ],
    cooldown: 3,
    run: async ( lang, interaction ) => {

      interaction?.reply({content:`<a:loading:1151184304676819085> Loading...`, ephemeral: true }).then(async Message => { setTimeout(function(){
        Message.delete();
    },10000)}).catch(e => { console.log(e) })
    
        let userDB = await db.ZiUser.findOne({ userID: interaction.user.id }).catch(e => { })

      const embed = new EmbedBuilder()
        .setTimestamp()
        .setFooter({ text: `${lang?.RequestBY} ${interaction.user.tag}`, iconURL: interaction.user.displayAvatarURL({ dynamic: true }) })

      if (userDB?.claimcheck !== null && 86400000 - (Date.now() - userDB?.claimcheck) > 0) {
        const timeleft = msToTime(86400000 - (Date.now() - userDB?.claimcheck))
        embed.setColor("#1a81e8")
        embed.setDescription(lang?.claimfail.replace("houurss", timeleft));
      } else {
        embed.setColor(lang?.COLOR || client.color);
        await rank({ user: interaction.user, lvlAdd: 49})
        await db.usercustom.updateOne({ userID: interaction.user.id }, {
          $set: { claimcheck: Date.now() }
        }, { upsert: true });

        let userDB2 = await db.ZiUser.findOne({ userID: interaction.user.id }).catch(e => { })
        embed.setDescription(`${lang?.claimsuss} lvl: ${userDB2?.lvl} xp: ${userDB2?.Xp}/${userDB2?.lvl * 50 + 1}`);
      }

      return interaction.channel.send({ embeds: [embed] }).catch(e => { })
    },
  };
  