const client = require("../bot");
const { ZifetchInteraction } = require("../events/Zibot/ZiFunc");
const { ButtonBuilder, ButtonStyle, ActionRowBuilder, EmbedBuilder, AttachmentBuilder } = require("discord.js");
const db = require("../mongoDB");
const { ZCoinFlip } = require("../events/Zibot/CoinFlip");


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
          { name: '8 Ball', value: 'Z8ball' },
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
    if(gamename == "Z8ball"){
      const ROWS = 8;
      const COLS = 8;
      function createButtonRows() {
        function createActionRow(i) {
          const actionRow = new ActionRowBuilder();
          for (let col = 0; col < 4; col++) {
            actionRow.addComponents(
              new ButtonBuilder()
                  .setCustomId(`Z8ball_col_${i+col}`)
                  .setLabel((i + col + 1).toString())
                  .setStyle(ButtonStyle.Secondary)
                  
            );
          }
          return actionRow;
        }
        return [createActionRow(0), createActionRow(4)];
    }
      function renderBoard(board) {
        return board.map(row => row.join(' ')).join('\n');
    }
      function createBoard() {
        return Array.from({ length: ROWS }, () => Array(COLS).fill('⚪'));
    }
    const board = createBoard(); 
    const embes = new EmbedBuilder()
    .setTitle("You're playing against a bot! Current Player: 🔴")
    .setDescription(`${renderBoard(board)}\n1️⃣ 2️⃣ 3️⃣ 4️⃣ 5️⃣ 6️⃣ 7️⃣ 8️⃣`)
    .setColor(lang?.COLOR || client.color)

    let contenee = {embeds: [embes],
    components: createButtonRows(),}
    if (!zi) {
      messages.edit(contenee).catch(() => {
          interaction?.channel?.send(contenee);
      });
    } else {
        interaction.message.edit(contenee).catch(console.error);
        interaction.deleteReply();
    }
    return;
    }else if( gamename == "Zttt"|| gamename == "ZtttR" ){
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
    return;
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
    return;
    }else if(gamename == "Zcoinflip" ){

      const result = Math.random() < 0.5 ? 'Heads' : 'Tails'; // 50-50 chance
      let HeadsIMG = "./events/Zibot/IMGs/GoldcoinHeads.png";
      let TailsIMG = "./events/Zibot/IMGs/Goldcointail.png";

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
    return;
    }
}};
