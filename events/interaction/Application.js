const fs = require("fs");

module.exports = async (client, interaction) => {
  if (interaction.user.bot) return;
  fs.readdir("./commands", (err, files) => {
    if (err) throw err;
    files.forEach(async (f) => {
      let props = require(`../../commands/${f}`);
      if (interaction.commandName.toLowerCase() === props.name.toLowerCase()) {
        try {
          if (props && props.NODMPer && !interaction?.guild) return interaction.reply({ content: "command no dm", ephemeral: true }).catch(e => { })
          if (props && props.voiceC) {
            if (!interaction.member.voice.channelId) return interaction.reply({ content: "no voice", ephemeral: true }).catch(e => { })
            const voiceCME = interaction?.guild.members.cache.get(client.user.id);
            if (voiceCME.voice.channelId && (voiceCME.voice.channelId !== interaction.member.voice.channelId))
              return interaction.reply({ content: "khac channel", ephemeral: true }).catch(e => { })
          };
          return props.run(client, interaction);
        } catch (e) {
          return interaction.reply({ content: `ERROR\n\n\`\`\`${e.message}\`\`\``, ephemeral: true }).catch(e => { })
        }
      }
    });
  });
}
