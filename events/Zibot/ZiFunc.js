function removeVietnameseTones(str) {
  str = str.replace(/à|á|ạ|ả|ã|â|ầ|ấ|ậ|ẩ|ẫ|ă|ằ|ắ|ặ|ẳ|ẵ/g, "a");
  str = str.replace(/è|é|ẹ|ẻ|ẽ|ê|ề|ế|ệ|ể|ễ/g, "e");
  str = str.replace(/ì|í|ị|ỉ|ĩ/g, "i");
  str = str.replace(/ò|ó|ọ|ỏ|õ|ô|ồ|ố|ộ|ổ|ỗ|ơ|ờ|ớ|ợ|ở|ỡ/g, "o");
  str = str.replace(/ù|ú|ụ|ủ|ũ|ư|ừ|ứ|ự|ử|ữ/g, "u");
  str = str.replace(/ỳ|ý|ỵ|ỷ|ỹ/g, "y");
  str = str.replace(/đ/g, "d");
  str = str.replace(/À|Á|Ạ|Ả|Ã|Â|Ầ|Ấ|Ậ|Ẩ|Ẫ|Ă|Ằ|Ắ|Ặ|Ẳ|Ẵ/g, "A");
  str = str.replace(/È|É|Ẹ|Ẻ|Ẽ|Ê|Ề|Ế|Ệ|Ể|Ễ/g, "E");
  str = str.replace(/Ì|Í|Ị|Ỉ|Ĩ/g, "I");
  str = str.replace(/Ò|Ó|Ọ|Ỏ|Õ|Ô|Ồ|Ố|Ộ|Ổ|Ỗ|Ơ|Ờ|Ớ|Ợ|Ở|Ỡ/g, "O");
  str = str.replace(/Ù|Ú|Ụ|Ủ|Ũ|Ư|Ừ|Ứ|Ự|Ử|Ữ/g, "U");
  str = str.replace(/Ỳ|Ý|Ỵ|Ỷ|Ỹ/g, "Y");
  str = str.replace(/Đ/g, "D");
  // Some system encode vietnamese combining accent as individual utf-8 characters
  // Một vài bộ encode coi các dấu mũ, dấu chữ như một kí tự riêng biệt nên thêm hai dòng này
  str = str.replace(/\u0300|\u0301|\u0303|\u0309|\u0323/g, ""); // ̀ ́ ̃ ̉ ̣  huyền, sắc, ngã, hỏi, nặng
  str = str.replace(/\u02C6|\u0306|\u031B/g, ""); // ˆ ̆ ̛  Â, Ê, Ă, Ơ, Ư
  // Remove extra spaces
  // Bỏ các khoảng trắng liền nhau
  str = str.replace(/ + /g, " ");
  str = str.Zitrim();
  // Remove punctuations
  // Bỏ dấu câu, kí tự đặc biệt
  str = str.replace(/!|@|%|\^|\*|\(|\)|\+|\=|\<|\>|\?|\/|,|\.|\:|\;|\'|\"|\&|\#|\[|\]|~|\$|_|`|-|{|}|\||\\/g, " ");
  return str;
}

const Zitrim = (str, max) => (str.length > max ? `${str.slice(0, max - 3)}...` : str);
async function fetchR(interaction){
let messid = await interaction?.reply({ content: `<a:loading:1151184304676819085> Loading...`})
try{
  return await interaction.fetchReply().catch(e=>{ });
}catch(e){
  return await interaction.channel?.messages.fetch({ message: messid , cache: false, force: true })
}

}
function msToTime(s) {
  let time = Math.floor(Number(Date.now() + s) / 1000)
  return (`<t:${time}:R>`)
}

function validURL(str) {
  var pattern = new RegExp('^(https?:\\/\\/)?' + // protocol
    '((([a-z\\d]([a-z\\d-]*[a-z\\d])*)\\.)+[a-z]{2,}|' + // domain name
    '((\\d{1,3}\\.){3}\\d{1,3}))' + // OR ip (v4) address
    '(\\:\\d+)?(\\/[-a-z\\d%_.~+]*)*' + // port and path
    '(\\?[;&a-z\\d%_.~+=-]*)?' + // query string
    '(\\#[-a-z\\d_]*)?$', 'i'); // fragment locator
  return !!pattern.test(str);
}
function Zilink(str){
  const match = str.match(/(https?:\/\/[^\s]+)/g);
  return match ? match[0] : null;
}
function shuffleArray(array) {
  for (var i = array.length - 1; i > 0; i--) { 
 
      // Generate random number 
      var j = Math.floor(Math.random() * (i + 1));
                 
      var temp = array[i];
      array[i] = array[j];
      array[j] = temp;
  }
     
  return array;
}
function processQuery(qAuery) {
  let query = Zilink(qAuery)
  // Regular expression to match YouTube and YouTube Music URLs
  const youtubeRegex = new RegExp(/^(?:https?:\/\/)?(?:www\.)?(?:music\.)?youtube\.com\/playlist\?list=(.*)$/);
  // If the query matches the YouTube regex, remove the &si= part of the URL
  if (query.match(youtubeRegex) && query.includes('&si=')) {
    const queryParts = query.split('&si=');
    queryParts.pop();
    return queryParts.join('');
  } else {
    // Otherwise, return the query as-is
    return query;
  }
}
function Zicrop(query){
  if(query.includes('Zi=')){
    const queryParts = query.split('Zi=');
    queryParts.shift();
    return queryParts.join(''); 
  } else return query
}
function getAvatar(user) {
  if(!user.avatar) return `https://cdn.discordapp.com/embed/avatars/${(user.discriminator % 5)}.png`
  return `https://cdn.discordapp.com/avatars/${user.id}/${user.avatar}.jpg`
}
function drawBarChart(data) {
  return data.map(({ band, gain }) => {
      const barLength = Math.round(Math.abs(gain) * 20); // Scale gain to adjust bar length

      // Draw the bar chart using Unicode characters
      const bar = gain >= 0 ? '+'.repeat(barLength) : '-'.repeat(barLength);

      // Add spaces before the line if band is less than 10
      const bandLabel = band < 9 ? ` Band ${band + 1} :` : ` Band ${band + 1}:`;

      return `${bandLabel} ${bar} = (${gain})`;
  }).join('\n');
}


const timeToSeconds = (time) => {
  const timeString = time.toLowerCase();
  let hours = 0,
      minutes = 0,
      seconds = 0;

  // Check if the timeString consists only of digits
  if (/^\d+$/.test(timeString)) {
      seconds = parseInt(timeString);
  }

  // Check if the timeString is in the format "m:s" or "h:m:s"
  else if (/^\d+:\d+(\:\d+)?$/.test(timeString)) {
      const timeParts = timeString.split(":");
      const numParts = timeParts.length;

      if (numParts === 2) {
          minutes = parseInt(timeParts[0]);
          seconds = parseInt(timeParts[1]);
      } else if (numParts === 3) {
          hours = parseInt(timeParts[0]);
          minutes = parseInt(timeParts[1]);
          seconds = parseInt(timeParts[2]);
      }
  }

  // Otherwise, parse the timeString into hours, minutes, and seconds
  else {
      const regex = /(\d+)\s*(h|m|s)/g;
      let match;
      let valid = false; // Flag to track if any valid match is found

      while ((match = regex.exec(timeString)) !== null) {
          const value = parseInt(match[1]);

          if (match[2] === 'h') {
              hours = value;
              valid = true;
          }
          else if (match[2] === 'm') {
              minutes = value;
              valid = true;
          }
          else if (match[2] === 's') {
              seconds = value;
              valid = true;
          }
      }

      // If no valid match is found, return false
      if (!valid) {
          return false;
      }
  }


  const totalSeconds = hours * 3600 + minutes * 60 + seconds;
  return totalSeconds;
}

const tracsrowslecs = async(res, lang, nameS, interaction) => {
  res = res?.tracks || res;
  const client = require("../../bot");
  const { EmbedBuilder, ActionRowBuilder, StringSelectMenuBuilder, StringSelectMenuOptionBuilder } = require("discord.js");
  const maxTracks = res.filter(t => t?.url.length < 100).slice(0, 20);

  let track_creator = maxTracks.map((track, index) => {
    return new StringSelectMenuOptionBuilder()
      .setLabel(`${index + 1}.${Zitrim( track?.title , 25)}`)
      .setDescription(`${ track?.duration }`)
      .setValue(`${maxTracks[Number(index)].url}`)
      .setEmoji('<:Playbutton:1230129096160182322>')
  })

  let cancel = new StringSelectMenuOptionBuilder()
    .setLabel("❌")
    .setDescription('cancel')
    .setValue(`cancelSEARCHTRACK`);
  
  const embed = new EmbedBuilder()
    .setColor(lang?.COLOR || client.color)
    .setTitle(`${lang?.PlayerSearch} ${Zitrim( nameS , 200)}`)
    .setDescription(`${maxTracks.map((track, i) => `**${i + 1}**. ${Zitrim( track?.title , 35)} | \`${Zitrim(track.author,10)}\``).join('\n')}\n <:cirowo:1007607994097344533>`)
    .setTimestamp()
    .setFooter({ text: `${lang?.RequestBY} ${interaction?.user?.tag || interaction?.author?.tag}`, iconURL: interaction?.user?.displayAvatarURL({ dynamic: true }) || interaction?.author?.displayAvatarURL({ dynamic: true }) })

  const select = new ActionRowBuilder()
    .addComponents(
      new StringSelectMenuBuilder()
        .setCustomId('Ziselectmusix')
        .setMinValues(1)
        .setMaxValues(1)
        .setPlaceholder('Make a selection!')
        .addOptions( track_creator )
        .addOptions( cancel )
      );

  return { content:``, embeds: [embed], components: [ select ] }
}

module.exports = {
ZifetchInteraction :fetchR,
removeVietnameseTones,
msToTime,
validURL,
processQuery,
Zilink,
Zicrop,
shuffleArray,
Zitrim,
drawBarChart,
timeToSeconds,
tracsrowslecs
}