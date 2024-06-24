const client = require("../../bot");

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
  str = str.trim();
  // Remove punctuations
  // Bỏ dấu câu, kí tự đặc biệt
  str = str.replace(/!|@|%|\^|\*|\(|\)|\+|\=|\<|\>|\?|\/|,|\.|\:|\;|\'|\"|\&|\#|\[|\]|~|\$|_|`|-|{|}|\||\\/g, " ");
  return str;
}

const Zitrim = (str, max) => (str?.length > max ? `${str?.slice(0, max - 3)}...` : str);

async function fetchR(interaction){
  if(!interaction.guild) return interaction.deferReply({ ephemeral: true, fetchReply: true }).catch(e=> console.log );
  let messid;
  try {
    messid = await interaction?.reply({ content: `<a:loading:1151184304676819085> Loading...`, fetchReply: true, allowedMentions: { repliedUser: false } })
  }catch(e){
    messid = await interaction?.channel?.send({ content: `<a:loading:1151184304676819085> Loading...`, fetchReply: true, allowedMentions: { repliedUser: false } })
  }
  await interaction.channel?.sendTyping();
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

function extractId(tag) {
  const regex = /<@(\d+)>/; // Tạo một regular expression để tìm kiếm số ID
  const match = tag.match(regex); // Sử dụng match để tìm kiếm theo regex

  if (match) {
    return match[1]; // Trả về ID (phần trong dấu ngoặc)
  } else {
    return null; // Trả về null nếu không tìm thấy
  }
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
function Zilink(str) {
  // Tìm tất cả các URL trong chuỗi đầu vào
  const match = str.match(/https?:\/\/[^\s)\\]+/g);
  // Trả về URL đầu tiên tìm thấy hoặc null nếu không tìm thấy
  return match ? match[0] : null;
}

function processQuery(query) {
  // Tìm URL trong chuỗi đầu vào
  let url = Zilink(query);
  // Nếu tìm thấy URL, loại bỏ các ký tự không mong muốn
  if (url) {
    url = url.replace(/[()\\]/g, ""); // Loại bỏ các ký tự '(', ')', '\\'
    return url;
  }
  // Nếu không tìm thấy URL, trả về chuỗi đầu vào ban đầu
  return query;
}

function Zicrop(query){
  if(query.includes('Zi=')){
    const queryParts = query.split('Zi=');
    queryParts.shift();
    return queryParts.join(''); 
  } else return query
}

const timeToSeconds = (time) => {
  const timeString = time.toLowerCase();
  let hours = 0,
      minutes = 0,
      seconds = 0,
      soam = 1;
     if( timeString.includes(`-`)){ soam = -1 }
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
  return totalSeconds*soam;
}

const tracsrowslecs = async(res, lang, nameS, interaction) => {
  res = res?.tracks || res;
  const client = require("../../bot");
  const { EmbedBuilder, ActionRowBuilder, StringSelectMenuBuilder, StringSelectMenuOptionBuilder, ButtonBuilder } = require("discord.js");
  const maxTracks = res.filter(t => t?.url.length < 100).slice(0, 20);
  if (!maxTracks.length > 0) return console.error("search err");
  let track_creator = maxTracks.map((track, index) => {
    return new StringSelectMenuOptionBuilder()
      .setLabel(`${index + 1} - ${ track?.queryType }: ${ track?.duration }`)
      .setDescription(` ${Zitrim( track?.title , 90)}`)
      .setValue(`${maxTracks[Number(index)].url}`)
      .setEmoji('<:Playbutton:1230129096160182322>')
  })

  let cancel = new StringSelectMenuOptionBuilder()
    .setLabel("❌")
    .setDescription('cancel')
    .setValue(`cancelSEARCHTRACK`);
  
  const embed = new EmbedBuilder()
    .setColor(lang?.COLOR || client.color)
    .setTitle(`${lang?.PlayerSearch}`)
    .setDescription(`** ${Zitrim( nameS , 200)} **`)
    .setTimestamp()
    .addFields( maxTracks.map((track, i) => ({
      name: `${i + 1}. ${Zitrim(track.title, 100)}`,
      value: `${ track?.queryType }: \`${Zitrim(track.author, 150)}\``,
    }))
  )
    .setFooter({ text: `${lang?.RequestBY} ${interaction?.user?.tag || interaction?.author?.tag}`, iconURL: interaction?.user?.displayAvatarURL({ dynamic: true }) || interaction?.author?.displayAvatarURL({ dynamic: true }) })

  const select = new ActionRowBuilder()
    .addComponents(
      new StringSelectMenuBuilder()
        .setCustomId('Ziselectmusix')
        .setMinValues(1)
        .setMaxValues(1)
        .setPlaceholder('▶️ | Pick the track u want to add to queue.')
        .addOptions( track_creator )
      );
  const buttSearch = new ActionRowBuilder().addComponents(
    new ButtonBuilder()
    .setCustomId('cancel')
    .setLabel('❌')
    .setStyle(2),
    new ButtonBuilder()
    .setCustomId('Zsearchyoutube')
    .setEmoji('<a:youtube:1243683781320380426>')
    .setStyle(2),
    new ButtonBuilder()
    .setCustomId('Zsearchsoundcloud')
    .setEmoji('<a:SOUNDCLOUD:1243684515646541936>')
    .setStyle(2),
    new ButtonBuilder()
    .setCustomId('ZsearchspotifySearch')
    .setEmoji('<a:spotify:1243684999182422097>')
    .setStyle(2),
    // new ButtonBuilder()
    // .setCustomId('ZsearchRelated')
    // .setEmoji("<:gacha:1254121084010102794>")
    // .setStyle(2),
  )
  return { content:``, embeds: [embed], components: [buttSearch, select ] }
}
function ZiplayerOption({ interaction, message, queue, user }){
  const queueMetadata = queue?.metadata || {};
  return {
    metadata: {
      channel: interaction?.channel || message?.channel,
      requestby: interaction?.user || interaction?.author,
      embedCOLOR: user?.color || client.color,
      Zimess: queueMetadata?.Zimess || message || interaction?.message || interaction,
      ZsyncedLyrics: {
        messages: queueMetadata?.ZsyncedLyrics?.messages,
        Status: queueMetadata?.ZsyncedLyrics?.Status || false
      }
    },
    requestedBy: interaction?.user || interaction?.author,
    selfDeaf: true,
    volume: user?.vol || 50,
    maxSize: 200,
    maxHistorySize: 20,
    leaveOnEmpty: true,
    leaveOnEmptyCooldown: 2000,
    leaveOnEnd: true,
    leaveOnEndCooldown: 300000,
    skipOnNoStream: true
  };
}
const animatedIcons = [
  "1150775508045410385",
  "1150776048263364608",
  "1150777291417333840",
  "1150777857761615903",
  "1150777891102150696",
  "1150777933045178399",
  "1150782781144707142",
  "1150782787394228296",
  "1008064606075363398",
  "1231819570281447576",
  "1231819570281447576",
  "1231819570281447576",
  "1238577097363034156",
  "1238577100101779507",
  "1238577101787889754",
  "1238577103025209517",
  "1238577106066346146",
  "1238577108503236629",
  "1238577113548980264",
  "1238577077368651797",
  "1238577079122137108",
  "1238577080858316810",
  "1238577084389916732",
  "1238577086810034176",
  "1238577089335267368",
  "1238577091406987294",
  "1238577093332176937",
  "1238577095488176309"
];
module.exports = {
ZifetchInteraction: fetchR,
removeVietnameseTones,
msToTime,
validURL,
processQuery,
Zilink,
Zicrop,
shuffleArray,
Zitrim,
timeToSeconds,
tracsrowslecs,
extractId,
ZiplayerOption,
animatedIcons
}