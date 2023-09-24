const { EmbedBuilder } = require("discord.js");
const client = require('../bot');
const SteamAPIKey = "DDC8118250E17D86ED42E2502E9D2980";

const getSteamID64 = async ( input )=> {
  try {
    const data = await (await fetch(`https://api.steampowered.com/ISteamUser/ResolveVanityURL/v0001/?key=${SteamAPIKey}&vanityurl=` + input)).json();
    return data?.response?.steamid || input;
  }catch(e){ return input }
}

function getSteamIDName(url) {
  let urll = url.replace(/^(https?:\/\/)?steamcommunity\.com\/(profiles\/|id\/)?(\w+)/, "$3");
  if (urll.includes("/")) urll = urll.replace("/", "")
  return urll
  }

const fetchPlayerStats = async (steamID, gameID) => {
    const url = `https://api.steampowered.com/ISteamUserStats/GetUserStatsForGame/v0002/?key=${SteamAPIKey}&steamid=${steamID}&appid=${gameID}`;
    const response = await fetch(url);
    const data = await response.json();
  if (response.status === 200) {
    return data;
  } else {
    return null
  }
};
const fetchPlayerUser = async (steamID) => {
  const url =  `https://api.steampowered.com/ISteamUser/GetPlayerSummaries/v0002/?key=${SteamAPIKey}&steamids=${steamID}`;
  const response = await fetch(url);
  const data = await response.json();
if (response.status === 200) {
  return data;
} else {
  return null
}
}

module.exports = {
    name: "csgo",
    description: "Thống kê của một người chơi Counter-Strike: Global Offensive.",
    options: [{
        name: "id",
        description: "link/id profile steam",
        type: 3,
        required: true,
      }],
    cooldown: 3,
    run: async ( lang, interaction ) => {
      //defer
      interaction?.reply({content:`<a:loading:1151184304676819085> Loading...`, ephemeral: true }).then(async Message => { setTimeout(function(){
        Message?.delete().catch( e => { } );
    },10000)}).catch(e => { console.log(e) })

        const username = interaction.options.getString("id");
        let linkkkk = await getSteamID64( getSteamIDName(username) )

        if (isNaN(linkkkk)) {
          await interaction.editReply("Không tìm thấy hồ sơ của người chơi.");
          return;
        }
        const body = await fetchPlayerStats(linkkkk, 730);
        const PlayerUser = await fetchPlayerUser(linkkkk)
        if (!body.playerstats) {
            await interaction.editReply("Không tìm thấy hồ sơ của người chơi.");
            return;
          }
        const overview =  body.playerstats.stats
        Playerr = PlayerUser?.response?.players[0]
        const embed = new EmbedBuilder()
            .setColor( lang.COLOR|| client.color )
            .setAuthor({ name: `${Playerr?.personaname} - ${Playerr?.loccountrycode}:` , url:`${Playerr?.profileurl}`, iconURL: `${Playerr?.avatarfull}`})
            .setThumbnail(`${Playerr?.avatarfull}`)
            .setDescription(`**Map:**
            > **Office:** ${overview[71]?.value}  |   **Cobblestone:** ${overview[72]?.value}
            > **Dust II:** ${overview[73]?.value}   |   **Inferno:** ${overview[74]?.value}
            > **Nuke:** ${overview[75]?.value}  |   **Train:** ${overview[76]?.value}
            ▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬`)
            .addFields([
              {name:"Player", value: `${overview[96]?.value}`, inline:true},
              {name:"Kills", value: `${overview[0]?.value}`, inline:true},
              {name:"Deaths", value: `${overview[1]?.value}`, inline:true},
              {name:"Damge", value: `${overview[6]?.value}`, inline:true},
              {name:"Time Played", value: `${overview[2]?.value}`, inline:true},
              {name:"Wins", value: `${overview[5]?.value}`, inline:true},
              {name:"Damage", value: `${overview[7]?.value}`, inline:true},
              {name:"Kills Knife", value: `${overview[9]?.value}`, inline:true},
              {name:"Kills Headshot", value: `${overview[24]?.value}`, inline:true},
              {name:"Rounds Played", value: `${overview[44]?.value}`, inline:true},
              {name:"mvps", value: `${overview[92]?.value}`, inline:true},
              {name:"Wins", value: `${overview[95]?.value}`, inline:true},
              {name:"Wins Pistol", value: `${overview[26]?.value}`, inline:true},
              {name:"Score", value: `${overview[98]?.value}`, inline:true},
               {name:"Losses", value: `${overview[96]?.value -overview[95]?.value}`, inline:true},
            ])
            .setTimestamp()
            .setFooter({ text: `${lang?.RequestBY} ${interaction.user?.tag}`, iconURL: interaction.user?.displayAvatarURL({ dynamic: true}) })
            .setImage('https://cdn.discordapp.com/attachments/1064851388221358153/1122054818425479248/okk.png');
            
        await interaction.channel.send({embeds:[ embed ]});

    },
  };
  