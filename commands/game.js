const client = require("../bot");
const { ZifetchInteraction } = require("../events/Zibot/ZiFunc");
const { ButtonBuilder, ButtonStyle, ActionRowBuilder, EmbedBuilder, AttachmentBuilder } = require("discord.js");
const db = require("../mongoDB");
const { ZCoinFlip } = require("../events/Zibot/CoinFlip");

const symbols = { 0: "⬜", 1: "❌", 2: "⭕" };

function createBoard() {
  return Array(3).fill(null).map(() => Array(3).fill(0));
}

function createActionRow(row, board,Ztttt) {
  const actionRow = new ActionRowBuilder();
  for (let col = 0; col < 3; col++) {
    actionRow.addComponents(
      new ButtonBuilder()
        .setCustomId(`${Ztttt}${row},${col}`)
        .setLabel(symbols[board[row][col]])
        .setStyle(ButtonStyle.Secondary)
    );
  }
  return actionRow;
}

module.exports = {
  name: "game",
  description: "Game function.",
  options: [
    {
        name: "name",
        description: "Name Game.",
        type: 3,
        required: true,
        choices: [
          { name: 'Coin Flip', value: 'Zcoinflip' },
          { name: 'Tic Tac Toe', value: 'Zttt' },
          { name: 'Tic Tac Toe Rush', value: 'ZtttR' },
          { name: 'Rock Paper Scissors', value: 'Zrps' },
        ],
      }
  ],
  cooldown: 3,
  dm_permission: true,
  run: async (lang, interaction, zi ) => {
    const messages = await ZifetchInteraction(interaction);
    const gamename = interaction?.options?.getString("name") || zi;
    if( gamename == "Zttt"|| gamename == "ZtttR" ){
        const board = createBoard();
        if(gamename == "ZtttR"){
        await db?.ZiguildPlay.updateOne(
          { GuildID: interaction?.guild?.id, Game: "ZTTT" },
          {
              $set: {
                  data: [ ]
              }
          },
          { upsert: true }
      );}
        const actionRows = [];
        for (let row = 0; row < 3; row++) {
        actionRows.push(createActionRow(row, board, gamename == "Zttt"? "Zttt" : "ZtttR" ));
        }

        const embed = {
        title: gamename == "Zttt" ? "Tic Tac Toe" :" Tic Tac Toe Rush",
        description: JSON.stringify(board),
        };
    if (!zi) {
        messages.edit({ content: ` `,embeds: [embed], components: actionRows }).catch(() => {
            interaction?.channel?.send({ content: ` `,embeds: [embed], components: actionRows });
        });
    } else {
        interaction.message.edit({ content: ` `,embeds: [embed], components: actionRows }).catch(console.error);
        interaction.deleteReply();
    }
    }else if(gamename == "Zrps" ){
    const row = new ActionRowBuilder().addComponents(
      new ButtonBuilder()
       .setCustomId("Zrpsrock")
       .setLabel("Rock")
       .setStyle(ButtonStyle.Secondary),
      new ButtonBuilder()
       .setCustomId("Zrpspaper")
       .setLabel("Paper")
       .setStyle(ButtonStyle.Secondary),
      new ButtonBuilder()
       .setCustomId("Zrpsscissors")
       .setLabel("Scissors")
       .setStyle(ButtonStyle.Secondary)
    )
     const embes = new EmbedBuilder()
     .setTitle("Rock Paper Scissors")
     .setImage("https://cdn.discordapp.com/attachments/1160318121308074035/1235007176695742465/rockpaperscissors.png")
     .setColor(lang?.COLOR || client.color)
    if (!zi) {
      messages.edit({ content: ` `,embeds: [embes], components: [row] }).catch(() => {
          interaction?.channel?.send({ content: ` `,embeds: [embes], components: [row] });
      });
    } else {
        interaction?.message.edit({ content: ` `,embeds: [embes], components: [row] }).catch(console.error);
        interaction.deleteReply();
    }
    }else if(gamename == "Zcoinflip" ){

      const result = Math.random() < 0.5 ? 'Heads' : 'Tails'; // 50-50 chance
      let HeadsIMG = "https://cdn.discordapp.com/attachments/1064851388221358153/1235204111025180772/Gold_coin_icon.png?ex=663384f9&is=66323379&hm=a520ae473255a4d3bdf54ec9f9a2e03fe2e55c2b727f8d31607561bc88590565&";
      let TailsIMG = "https://cdn.discordapp.com/attachments/1064851388221358153/1235213238006845542/Gold_coin_icon2.png?ex=66338d79&is=66323bf9&hm=17171d954d2fdf20655a23daeb20ff535b44e439017e0b249b42a2b06d28a22d&";

      const canvas = new ZCoinFlip(400, 200) // Create a new canvas
        .setAuthor( interaction?.user?.tag )
        .setTitle(`${result}`)
        .setImage(interaction?.user.displayAvatarURL({ extension: "png", forceStatic: true }))
        .setCoin(result == "Heads" ? HeadsIMG : TailsIMG)
      const actionRowReroll = new ActionRowBuilder().addComponents(
          new ButtonBuilder()
            .setCustomId('ZcoinflipReroll')
            .setLabel('↻')
            .setStyle(ButtonStyle.Secondary)
        );
      const buffer = await canvas.build({ format: "png" });
      const attachment = new AttachmentBuilder(buffer, { name: "coinflip.png"});
      if (!zi) {
        messages.edit({ content: ` `, files: [attachment], components: [actionRowReroll] }).catch(() => {
            interaction?.channel?.send({ content: ` `, files: [attachment], components: [actionRowReroll] });
        });
    } else {
        interaction.message.edit({ content: ` `, files: [attachment], components: [actionRowReroll] }).catch(console.error);
        interaction.deleteReply();
    }
    }
}};
