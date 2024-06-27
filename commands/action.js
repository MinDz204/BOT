const { AttachmentBuilder } = require('discord.js');
const { canvacord } = require("canvacord");
const { ZifetchInteraction } = require('../events/Zibot/ZiFunc');

module.exports = {
  name: "action",
  description: "Use action.",
  name_localizations: {
    "en-US": "action",
    "vi": "hành-động",
    "ja": "アクション",
    "ko": "행동"
  },
  description_localizations: {
    "en-US": "Use action.",
    "vi": "Sử dụng hành động.",
    "ja": "アクションを使用します。",
    "ko": "행동을 사용하세요."
  },
  integration_types: [0, 1],
  contexts: [0, 1, 2],
  options: [
    {
      name: "name",
      description: "Name Action type.",
      name_localizations: {
        "en-US": "name",
        "vi": "tên",
        "ja": "名前",
        "ko": "이름"
      },
      description_localizations: {
        "en-US": "Name Action type.",
        "vi": "Tên của hành động",
        "ja": "アクションタイプの名前。",
        "ko": "행동 유형의 이름."
      },
      type: 3,
      required: true,
      choices: [
        {
          name: "triggered",
          value: "triggered",
          name_localizations: {
            "en-US": "triggered",
            "vi": "kích hoạt",
            "ja": "トリガーされた",
            "ko": "트리거됨"
          }
        },
        {
          name: "fused",
          value: "fused",
          name_localizations: {
            "en-US": "fused",
            "vi": "hợp nhất",
            "ja": "融合された",
            "ko": "융합됨"
          }
        },
        {
          name: "kissed",
          value: "kissed",
          name_localizations: {
            "en-US": "kissed",
            "vi": "hôn",
            "ja": "キスされた",
            "ko": "키스됨"
          }
        },
        {
          name: "spanked",
          value: "spanked",
          name_localizations: {
            "en-US": "spanked",
            "vi": "bị đánh",
            "ja": "スパンキングされた",
            "ko": "스팽킹됨"
          }
        },
        {
          name: "slapped",
          value: "slapped",
          name_localizations: {
            "en-US": "slapped",
            "vi": "bị tát",
            "ja": "平手打ちされた",
            "ko": "따귀맞음"
          }
        },
        {
          name: "beautiful",
          value: "beautiful",
          name_localizations: {
            "en-US": "beautiful",
            "vi": "đẹp",
            "ja": "美しい",
            "ko": "아름다운"
          }
        },
        {
          name: "facepalm",
          value: "facepalm",
          name_localizations: {
            "en-US": "facepalm",
            "vi": "chán nản",
            "ja": "フェイスパーム",
            "ko": "페이스팔"
          }
        },
        {
          name: "rainbow",
          value: "rainbow",
          name_localizations: {
            "en-US": "rainbow",
            "vi": "cầu vồng",
            "ja": "虹",
            "ko": "무지개"
          }
        },
        {
          name: "rip",
          value: "rip",
          name_localizations: {
            "en-US": "rip",
            "vi": "r.i.p",
            "ja": "R.I.P.",
            "ko": "R.I.P."
          }
        },
        {
          name: "trash",
          value: "trash",
          name_localizations: {
            "en-US": "trash",
            "vi": "rác",
            "ja": "ゴミ",
            "ko": "쓰레기"
          }
        },
        {
          name: "hitler",
          value: "hitler",
          name_localizations: {
            "en-US": "hitler",
            "vi": "hitler",
            "ja": "ヒトラー",
            "ko": "히틀러"
          }
        }
      ]
    },
    {
      name: "user",
      description: "User to use action.",
      name_localizations: {
        "en-US": "user",
        "vi": "người-dùng",
        "ja": "ユーザー",
        "ko": "사용자"
      },
      description_localizations: {
        "en-US": "User to use action.",
        "vi": "Người dùng để sử dụng hành động.",
        "ja": "アクションを使用するユーザー。",
        "ko": "행동을 사용할 사용자."
      },
      type: 6,
      required: false,
    },
  ],
  cooldown: 10,
  dm_permission: true,
  run: async (lang, interaction) => {
    await ZifetchInteraction(interaction);

    const name = interaction.options.getString("name");
    const targetUser = interaction.options.getUser("user") || interaction.user;

    const userAvatar = interaction.user.displayAvatarURL({
      extension: "png",
      forceStatic: true,
    });

    const targetAvatar = targetUser.displayAvatarURL({
      extension: "png",
      forceStatic: true,
    });

    let image;

    const actionHandlers = {
      triggered: () => canvacord.triggered(targetAvatar),
      fused: () => canvacord.fuse(userAvatar, targetAvatar),
      kissed: () => canvacord.kiss(userAvatar, targetAvatar),
      spanked: () => canvacord.slap(userAvatar, targetAvatar),
      slapped: () => canvacord.slap(userAvatar, targetAvatar),
      beautiful: () => canvacord.beautiful(targetAvatar),
      facepalm: () => canvacord.facepalm(targetAvatar),
      rainbow: () => canvacord.rainbow(targetAvatar),
      rip: () => canvacord.rip(targetAvatar),
      trash: () => canvacord.trash(userAvatar),
      hitler: () => canvacord.hitler(userAvatar),
    };

    if (actionHandlers[name]) {
      image = await actionHandlers[name]();
    } else {
      image = targetAvatar;
    }

    return interaction.editReply({
      content: "",
      files: [
        new AttachmentBuilder(image, {
          name: name !== "triggered" ? `${name}.png` : `${name}.gif`,
        }),
      ],
    });
  },
};
