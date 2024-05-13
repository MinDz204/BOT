const { AttachmentBuilder } = require('discord.js');
const { canvacord } = require("canvacord");
const { ZifetchInteraction } = require('../events/Zibot/ZiFunc');

module.exports = {
  name: "action",
  description: "Use Action.",
  integration_types: [0 ,1],
  contexts: [0, 1, 2],
  options: [
    {
      name: "name",
      description: "Name Action type.",
      type: 3,
      required: true,
      choices: [
        { name: 'triggered', value: 'triggered' },
        { name: 'fused', value: 'fused' },
        { name: 'kissed', value: 'kissed' },
        { name: 'spanked', value: 'spanked' },
        { name: 'slapped', value: 'slapped' },
        { name: 'beautiful', value: 'beautiful' },
        { name: 'facepalm', value: 'facepalm' },
        { name: 'rainbow', value: 'rainbow' },
        { name: 'rip', value: 'rip' },
        { name: 'trash', value: 'trash' },
        { name: 'hitler', value: 'hitler' },
      ],
    },
    {
      name: "user",
      description: "User to use action.",
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
