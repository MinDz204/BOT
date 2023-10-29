
const { ModalBuilder, TextInputStyle, ActionRowBuilder, TextInputBuilder, ButtonBuilder, ButtonStyle, StringSelectMenuBuilder, EmbedBuilder } = require("discord.js");
const db = require("./../../mongoDB");
const config = require("../../config");
const client = require("../../bot");
function Zicut(query){
    let ziesad = query.replace("GI","")
      const queryParts = ziesad.split('Zi=');
      let shift = queryParts.shift();
      let pop = queryParts.pop();
      return { Zishift: shift, Zipop: pop }
  }
function getImage(id) {
    return 'https://enka.network/ui/' + id + '.png';
}
module.exports = async (interaction, lang) => {
if(!config.messCreate.GI) return;
  try {
    interaction.update().catch(e => { });
let key = interaction?.values[0];
const { Zishift, Zipop } = Zicut(key)
user = client.users.cache.get(Zishift);
if (!user) return;
let Ziuser = await db.ZiUser.findOne({ userID: user.id }).catch(e => { });
let data = Ziuser.GIdata[0]
// console.log(data.characters)
let focuse = data.characters.filter(x => x.characterId === Number(Zipop))[0];
let embed = new EmbedBuilder()
    .setAuthor({
        name: `${focuse?.name} - ${focuse?.properties.level.val} - ❤ ${focuse?.friendship.level}`,
        iconURL: getImage(focuse?.assets?.icon),
    })
    .setTimestamp()
    .setFooter({ text: `${lang?.RequestBY} ${interaction.user.tag}`, iconURL: interaction.user.displayAvatarURL({ dynamic: true }) })
    .setThumbnail(getImage(focuse?.assets?.gachaIcon))
    .setDescription(`**Skills:**
    > ${focuse?.skills?.normalAttacks?.name} - lv: ${focuse?.skills?.normalAttacks?.level}
    > ${focuse?.skills?.elementalSkill?.name} - lv: ${focuse?.skills?.elementalSkill?.level}
    > ${focuse?.skills?.elementalBurst?.name} - lv: ${focuse?.skills?.elementalBurst?.level}
    **Weapon:** ${focuse?.equipment?.weapon?.name} - lv: ${focuse?.equipment?.weapon?.level}
    **Artifacts:**
    > ${focuse?.equipment?.artifacts[0]?.name} | ${focuse?.equipment?.artifacts[0]?.setName}
    > ${focuse?.equipment?.artifacts[1]?.name} | ${focuse?.equipment?.artifacts[1]?.setName}
    > ${focuse?.equipment?.artifacts[2]?.name} | ${focuse?.equipment?.artifacts[2]?.setName}
    > ${focuse?.equipment?.artifacts[3]?.name} | ${focuse?.equipment?.artifacts[3]?.setName}
    `)
    .addFields([
        { name: `Hp:`, value: `${Number(focuse?.stats?.maxHp?.value).toFixed(4)}`, inline: true },
        { name: `Atk:`, value: `${Number(focuse?.stats?.atk?.value).toFixed(4)}`, inline: true },
        { name: `Def:`, value: `${Number(focuse?.stats?.def?.value).toFixed(4)}`, inline: true },
        { name: `elemental Mastery:`, value: `${Number(focuse?.stats?.elementalMastery?.value).toFixed(4)}`, inline: true },
        { name: `energy Recharge:`, value: `${(100 * Number(focuse?.stats?.energyRecharge?.value)).toFixed(4)}%`, inline: true },
        { name: `crit Rate:`, value: `${(100 * Number(focuse?.stats?.critRate?.value)).toFixed(4)}%`, inline: true },
        { name: `crit Damage:`, value: `${(100 * Number(focuse?.stats?.critDamage?.value)).toFixed(4)}%`, inline: true },
        ])
    // console.log(focuse)
    return interaction?.message.edit({embeds:[embed]}).catch(e => { });
  } catch (e) {
    console.log(e)
  }
  return;
}