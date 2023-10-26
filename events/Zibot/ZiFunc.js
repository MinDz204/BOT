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


const renderFrame = async (frame, user, data, Guild ) => {
  //::::::::::::::::::::mudule:::::::::::::::::::::::::::://
  const Canvas = require('@napi-rs/canvas');
  const jimp = require('jimp');
  /* Load the font */
  // Canvas.registerFont(require('@canvas-fonts/arial-bold'), {
  //   family: 'Arial Bold',
  // });
  //:::::::::::: BUILD ::::::::::::://
  let width = 700, height = 250;  
  console.log(frame.frameInfo)
  let FWidth = data[0]?.frameInfo?.width || data[1]?.frameInfo?.width || data[2]?.frameInfo?.width || frame.frameInfo.width
  let FHeight = data[0]?.frameInfo?.height || data[1]?.frameInfo?.height || data[2]?.frameInfo?.height || frame.frameInfo.height
  const canvas = Canvas.createCanvas(width, height);
  const ctx = canvas.getContext('2d');
  
  let scale = Math.max(width / FWidth, height / FHeight);
  let x = (width / 2) - (FWidth / 2) * scale;
  let y = (height / 2) - (FHeight / 2) * scale;

  let layer = await Canvas.loadImage('./events/Zibot/layer.png');
  let background = await jimp.read(frame.getImage()._obj);
  
  background.blur(2);
  background = await background.getBufferAsync('image/png');
  
  ctx.drawImage(await Canvas.loadImage(background), x, y, FWidth * scale, FHeight * scale);
  
  ctx.strokeRect(0, 0, width, height);
  ctx.drawImage(layer, 0, 0, width, height);
  let name = user.username;
  name = name.length > 12 ? name.substring(0, 12).trim() + '...' : name;
  
  ctx.font = `bold 36px Arial Bold`;
  ctx.fillStyle = '#FFFFFF';
  ctx.textAlign = 'start';
  ctx.strokeStyle = '#f5f5f5';
  ctx.fillText(`Welcome ${name}`, 278, 113);
  ctx.strokeText(`Welcome ${name}`, 278, 113);
  
  ctx.font = `bold 25px Arial Bold`;
  ctx.fillStyle = '#FFFFFF';
  ctx.fillText(`#${Guild?.name}`, 352, 156);
  
  let avatar = await jimp.read(
    getAvatar(user)
  );
  avatar.resize(1024, 1024);
  avatar.circle();
  avatar = await avatar.getBufferAsync('image/png');
  avatar = await Canvas.loadImage(avatar);
  
  ctx.drawImage(avatar, 72, 48, 150, 150);
  
  return ctx;
}

module.exports = { removeVietnameseTones, msToTime, validURL, processQuery, renderFrame, Zilink, Zicrop, shuffleArray }