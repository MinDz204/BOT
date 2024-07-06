const { client } = require("../bot");
const { ZifetchInteraction } = require("../events/Zibot/ZiFunc");
const { ButtonBuilder, ButtonStyle, ActionRowBuilder, EmbedBuilder, AttachmentBuilder } = require("discord.js");
const db = require("../mongoDB");
const { ZCoinFlip } = require("../events/Zibot/game/CoinFlip");

const gameOptions = [
  {
    name: '8 Ball',
    value: 'Z8ball',
    name_localizations: {
      "en-US": "Coin Flip",
      "vi": "Bi a 8",  // Game in Vietnamese
      "ja": "エイトボール", // Game in Japanese
      "ko": "8볼", // Game in Korean
    },
  },
  {
    name: 'Coin Flip',
    value: 'Zcoinflip',
    name_localizations: {
      "en-US": "Coin Flip",
      "vi": "Tung đồng xu",  // Game in Vietnamese
      "ja": "コイン投げ", // Game in Japanese
      "ko": "동전 던지기", // Game in Korean
    },
  },
  {
    name: 'Tic Tac Toe',
    value: 'Zttt',
    name_localizations: {
      "en-US": "Tic Tac Toe",
      "vi": "O X",  // Game in Vietnamese
      "ja": "三目並べ", // Game in Japanese
      "ko": "틱택토", // Game in Korean
    },
  },
  {
    name: 'Tic Tac Toe Rush',
    value: 'ZtttR',
    name_localizations: {
      "en-US": "Tic Tac Toe Rush",
      "vi": "O X mode 2",  // Game in Vietnamese (fast Tic Tac Toe)
      "ja": "三目並べラッシュ", // Game in Japanese (rush)
      "ko": "틱택토 러시", // Game in Korean (rush)
    },
  },
  {
    name: 'Rock Paper Scissors',
    value: 'Zrps',
    name_localizations: {
      "en-US": "Rock Paper Scissors",
      "vi": "Kéo búa bao",  // Game in Vietnamese
      "ja": "じゃんけん", // Game in Japanese
      "ko": "가위 바위 보", // Game in Korean
    },
  },
];


function sendOrEditMessage(zi, interaction, messages, content) {
  const editFunc = zi ? interaction?.message : messages;
  const sendFunc = interaction?.channel;

  editFunc.edit(content).catch(() => {
    sendFunc.send(content);
  });

  if (zi) {
    interaction.deleteReply();
  }
}

module.exports = {
  name: "game",
  description: "Game function.",
  description_localization: {
    "en-US": "Game function.",
    "vi": "Chức năng trò chơi", // Game function in Vietnamese
    "ja": "ゲーム機能", // Game function in Japanese
    "ko": "게임 기능" // Game function in Korean
  },
  integration_types: [0],
  contexts: [0, 1, 2],
  options: [
    {
      name: "name",
      description: "Game Name.",
      description_localizations: {
        "en-US": "Game Name.",
        "vi": "Tên trò chơi ", // Name Game in Vietnamese
        "ja": "ネームゲーム", // Name Game in Japanese
        "ko": "이름 게임", // Name Game in Korean
      },
      type: 3,
      required: true,
      choices: gameOptions,
    }
  ],
  cooldown: 3,
  dm_permission: true,
  run: async (lang, interaction, zi = 0) => {
    const messages = await ZifetchInteraction(interaction);
    const gamename = interaction?.options?.getString("name") || zi;

    if (gamename === "Z8ball") {
      const ROWS = 8;
      const COLS = 8;

      const createButtonRows = () => [
        new ActionRowBuilder()
          .addComponents(
            ...Array(4).fill().map((_, i) =>
              new ButtonBuilder()
                .setCustomId(`Z8ball_col_${i}`)
                .setLabel((i + 1).toString())
                .setStyle(ButtonStyle.Secondary)
            )
          ),
        new ActionRowBuilder()
          .addComponents(
            ...Array(4).fill().map((_, i) =>
              new ButtonBuilder()
                .setCustomId(`Z8ball_col_${4 + i}`)
                .setLabel((4 + i + 1).toString())
                .setStyle(ButtonStyle.Secondary)
            )
          ),
      ];

      const createBoard = () => Array.from({ length: ROWS }, () => Array(COLS).fill('⚪'));

      const renderBoard = board => board.map(row => row.join(' ')).join('\n');

      const board = createBoard();
      const embed = new EmbedBuilder()
        .setTitle("You're playing against a bot! Current Player: 🔴")
        .setDescription(`${renderBoard(board)}\n1️⃣ 2️⃣ 3️⃣ 4️⃣ 5️⃣ 6️⃣ 7️⃣ 8️⃣`)
        .setColor(lang?.COLOR || client.color);

      const content = { embeds: [embed], components: createButtonRows() };
      sendOrEditMessage(zi, interaction, messages, content);
      return;
    }

    if (gamename === "Zttt" || gamename === "ZtttR") {
      const symbols = { 0: "⬜", 1: "❌", 2: "⭕" };

      const createBoard = () => Array(3).fill(null).map(() => Array(3).fill(0));

      const createActionRows = (board, prefix) =>
        Array(3).fill().map((_, row) => {
          const actionRow = new ActionRowBuilder();
          for (let col = 0; col < 3; col++) {
            actionRow.addComponents(
              new ButtonBuilder()
                .setCustomId(`${prefix}${row},${col}`)
                .setLabel(symbols[board[row][col]])
                .setStyle(ButtonStyle.Secondary)
            );
          }
          return actionRow;
        });

      if (gamename === "ZtttR") {
        await db.ZiguildPlay.updateOne(
          { GuildID: interaction?.guild?.id, Game: "ZTTT" },
          {
            $set: {
              data: [],
            },
          },
          { upsert: true }
        );
      }

      const board = createBoard();
      const prefix = gamename === "Zttt" ? "Zttt" : "ZtttR";
      const embed = new EmbedBuilder()
        .setTitle(gamename === "Zttt" ? "Tic Tac Toe" : "Tic Tac Toe Rush")
        .setDescription(JSON.stringify(board));

      const content = { content: ` `, embeds: [embed], components: createActionRows(board, prefix) };
      sendOrEditMessage(zi, interaction, messages, content);
      return;
    }

    if (gamename === "Zrps") {
      const actionRow = new ActionRowBuilder().addComponents(
        new ButtonBuilder().setCustomId("Zrpsrock").setLabel("Rock").setStyle(ButtonStyle.Secondary),
        new ButtonBuilder().setCustomId("Zrpspaper").setLabel("Paper").setStyle(ButtonStyle.Secondary),
        new ButtonBuilder().setCustomId("Zrpsscissors").setLabel("Scissors").setStyle(ButtonStyle.Secondary)
      );

      const embed = new EmbedBuilder()
        .setTitle("Rock Paper Scissors")
        .setImage("https://cdn.discordapp.com/attachments/1160318121308074035/1235007176695742465/rockpaperscissors.png")
        .setColor(lang?.COLOR || client.color);

      const content = { content: ` `, embeds: [embed], components: [actionRow] };
      sendOrEditMessage(zi, interaction, messages, content);
      return;
    }

    if (gamename === "Zcoinflip") {
      const result = Math.random() < 0.5 ? 'Heads' : 'Tails';
      const HeadsIMG = "./events/Zibot/IMGs/GoldcoinHeads.png";
      const TailsIMG = "./events/Zibot/IMGs/Goldcointail.png";

      const canvas = new ZCoinFlip(400, 200)
        .setAuthor(interaction?.user?.tag)
        .setTitle(result)
        .setImage(interaction.user.displayAvatarURL({ extension: "png", forceStatic: true }))
        .setCoin(result === "Heads" ? HeadsIMG : TailsIMG);

      const buffer = await canvas.build({ format: "png" });
      const attachment = new AttachmentBuilder(buffer, { name: "coinflip.png" });

      const actionRowReroll = new ActionRowBuilder().addComponents(
        new ButtonBuilder()
          .setCustomId('ZcoinflipReroll')
          .setLabel('↻')
          .setStyle(ButtonStyle.Secondary)
      );

      const content = { content: ` `, files: [attachment], components: [actionRowReroll] };
      sendOrEditMessage(zi, interaction, messages, content);
      return;
    }

    if (gamename === "Zblackjack") {

      const embed = new EmbedBuilder()
        .setTitle("Blackjack")
        .setColor(lang?.COLOR || client.color)
        .setDescription("Start Black Jack")

      const actionRow = new ActionRowBuilder().addComponents(
        new ButtonBuilder()
          .setCustomId("ZblackjackStart")
          .setLabel("Start Black Jack")
          .setStyle(ButtonStyle.Secondary)
      )
      const content = { content: ` `, embeds: [embed], components: [actionRow] };
      sendOrEditMessage(zi, interaction, messages, content);
      return;
    }
  },
};
