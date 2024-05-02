const { ZCoinFlip } = require("./events/Zibot/CoinFlip");
const { writeFile } = require("node:fs/promises");

async function main() {

  const result = Math.random() < 0.5 ? 'Heads' : 'Tails'; // 50-50 chance
  let HeadsIMG = "https://cdn.discordapp.com/attachments/1064851388221358153/1235204111025180772/Gold_coin_icon.png?ex=663384f9&is=66323379&hm=a520ae473255a4d3bdf54ec9f9a2e03fe2e55c2b727f8d31607561bc88590565&";
  let TailsIMG = HeadsIMG;
  
  const canvas = new ZCoinFlip(400, 200) // Create a new canvas
    .setAuthor( "Ziji Studio" )
    .setTitle(`${result}`)
    .setImage("https://cdn.discordapp.com/avatars/891275176409460746/dd231a60dc3ae759b873bbcc836010d8.png?size=1024")
    .setCoin(result == "Heads" ? HeadsIMG : TailsIMG)
  
  const buffer = await canvas.build({ format: "png" });

  await writeFile("image.png", buffer);
}

main();