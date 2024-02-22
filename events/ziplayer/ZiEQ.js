//modules:::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::://
const db = require("./../../mongoDB");
const { EmbedBuilder } = require('discord.js');
const client = require('../../bot');
const { drawBarChart } = require("../Zibot/ZiFunc");
//func:::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::://
function extractNumberFromString(inputString) {
    const matches = inputString.match(/-?\d+/);
    // Check if matches is not null before accessing the first element
    return matches ? parseInt(matches[0], 10) : null;
}
function bandless(band) {
    return Math.abs(band) > 1 ? bandless(band / 10) : band;
}

let defBand = [
    { band: 0, gain: 0 },
    { band: 1, gain: 0 },
    { band: 2, gain: 0 },
    { band: 3, gain: 0 },
    { band: 4, gain: 0 },
    { band: 5, gain: 0 },
    { band: 6, gain: 0 },
    { band: 7, gain: 0 },
    { band: 8, gain: 0 },
    { band: 9, gain: 0 },
    { band: 10, gain: 0 },
    { band: 11, gain: 0 },
    { band: 12, gain: 0 },
    { band: 13, gain: 0 },
]
//run:::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::://
module.exports = async (interaction, lang, queue, Gain) => {
  try {
    if(!queue) return;
    await interaction?.deferUpdate().catch(e=>{ });
    const bands = extractNumberFromString(interaction?.customId);
    const NewGain = bandless(extractNumberFromString(Gain)) || 0;

    let user = await db?.ZiUser.findOne({ userID: interaction?.user?.id });
    let userAR = Array.isArray( user.EQband ) &&  user.EQband.length === 0;
    let banstoUP = !userAR ? user.EQband : defBand;
    const index = banstoUP.findIndex(band => band.band === bands);
    
    if (index !== -1) {
        banstoUP[index].gain = NewGain;
    } else {
        console.error(`Band ${bands} not found in the array.`);
    }
    await db.ZiUser.updateOne(
        { userID: interaction?.user?.id },
        { $set: {
            EQband: banstoUP,
        }
      }, { upsert: true }).catch(e => { })
    await queue.filters.equalizer.setEQ( banstoUP );
    // interaction.deferUpdate();
    return interaction?.message.edit({embeds:[ 
        new EmbedBuilder()
    .setColor(lang?.COLOR || client.color )
    .setDescription(`**EQ:**
    ${drawBarChart(banstoUP)}`)
    .setTimestamp()
    .setImage(lang?.banner)
    .setFooter({ text: `${lang?.RequestBY} ${interaction.user.tag}`, iconURL: interaction.user.displayAvatarURL({ dynamic: true }) })
    .setThumbnail('https://cdn.discordapp.com/attachments/1064851388221358153/1172944748294709268/iu.png')
    ]}).catch(e => { });
  } catch (e) {
    console.log(e)
  }
}
