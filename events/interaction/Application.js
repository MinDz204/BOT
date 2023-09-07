const fs = require("fs");
const { Collection } = require("discord.js");
module.exports = async (client, interaction) => {
  if (interaction.user.bot) return;
  fs.readdir("./commands", (err, files) => {
    if (err) throw err;
    files.forEach(async (f) => {
      let props = require(`../../commands/${f}`);
      if (interaction.commandName.toLowerCase() === props.name.toLowerCase()) {
        try {
          //cooldows-------------------------------------------------//
          const { cooldowns } = client;
          if (!cooldowns.has(interaction.commandName)) {
            cooldowns.set(interaction.commandName, new Collection());
          }
        
          const now = Date.now();
        const timestamps = cooldowns.get(interaction.commandName);
        const defaultCooldownDuration = 3;
        const cooldownAmount = (props.cooldown ?? defaultCooldownDuration) * 1000;
        
        if (timestamps.has(interaction.user.id)) {
          const expirationTime = timestamps.get(interaction.user.id) + cooldownAmount;
        
          if (now < expirationTime) {
            const expiredTimestamp = Math.round(expirationTime / 1000);
            return interaction.reply({ content: `Please wait, you are on a cooldown for \`${interaction.commandName}\`. You can use it again <t:${expiredTimestamp}:R>.`, ephemeral: true });
          }
        }
          //cooldows-set------------------------------------------------//
        timestamps.set(interaction.user.id, now);
        setTimeout(() => timestamps.delete(interaction.user.id), cooldownAmount);
          //cooldows-end------------------------------------------------//
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
