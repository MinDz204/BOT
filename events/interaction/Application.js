const fs = require("fs");
const { Collection } = require("discord.js");
const { rank } = require("./../Zibot/ZilvlSys");
const config = require("../../config");
module.exports = { name: "Application" }
module.exports = async (client, interaction) => {
  if (interaction.user.bot) return;
  fs.readdir("./commands", (err, files) => {
    if (err) throw err;
    files.forEach(async (f) => {
      let props = require(`../../commands/${f}`);
      if (interaction.commandName.toLowerCase() === props.name.toLowerCase()) {
        if (!config.Discommands.includes(interaction?.commandName))
        try {
          //rank sys------------------------------------------------//
          let lang = await rank({ user: interaction?.user });
          //rank-end------------------------------------------------//
          //cooldows-------------------------------------------------//
          const defaultCooldownDuration = 3;
          const cooldownAmount = (props.cooldown ?? defaultCooldownDuration) * 1000;
          const expirationTime = lang?.cooldowns + cooldownAmount;

          if (Date.now() < expirationTime) {
            const expiredTimestamp = Math.round(expirationTime / 1000);
            return interaction.reply({ content: `${lang?.cooldownsMESS.replace(`{expiredTimestamp}`, expiredTimestamp).replace(`{interaction.commandName}`, interaction.commandName)}`, ephemeral: true });
          }
          //cooldows-end------------------------------------------------//

          if (props && props.NODMPer && !interaction?.guild) return interaction.reply({ content: `${lang?.NODMPer}`, ephemeral: true }).catch(e => { })
          if (props && props.voiceC) {
            if (!interaction.member.voice.channelId) return interaction.reply({ content: `${lang?.NOvoice}`, ephemeral: true }).catch(e => { })
            const voiceCME = interaction?.guild.members.cache.get(client.user.id);
            if (voiceCME.voice.channelId && (voiceCME.voice.channelId !== interaction.member.voice.channelId))
              return interaction.reply({ content: `${lang?.NOvoiceChannel}`, ephemeral: true }).catch(e => { })
          };
          return props.run(lang, interaction);
        } catch (e) {
          return interaction.reply({ content: `ERROR\n\n\`\`\`${e.message}\`\`\``, ephemeral: true }).catch(e => { })
        }
      }
    });
  });
  //context
  fs.readdir("./context", (err, files) => {
    if (err) throw err;
    files.forEach(async (f) => {
      let props = require(`../../context/${f}`);
      if (interaction.commandName.toLowerCase() === props.name.toLowerCase()) {
        if (!config.DisContext.includes(interaction?.commandName))
        try {
          //rank sys------------------------------------------------//
          let lang = await rank({ user: interaction?.user });
          //rank-end------------------------------------------------//
          //cooldows-------------------------------------------------//
          const defaultCooldownDuration = 3;
          const cooldownAmount = (props.cooldown ?? defaultCooldownDuration) * 1000;
          const expirationTime = lang?.cooldowns + cooldownAmount;

          if (Date.now() < expirationTime) {
            const expiredTimestamp = Math.round(expirationTime / 1000);
            return interaction.reply({ content: `${lang?.cooldownsMESS.replace(`{expiredTimestamp}`, expiredTimestamp).replace(`{interaction.commandName}`, interaction.commandName)}`, ephemeral: true });
          }
          //cooldows-end------------------------------------------------//

          if (props && props.NODMPer && !interaction?.guild) return interaction.reply({ content: `${lang?.NODMPer}`, ephemeral: true }).catch(e => { })
          if (props && props.voiceC) {
            if (!interaction.member.voice.channelId) return interaction.reply({ content: `${lang?.NOvoice}`, ephemeral: true }).catch(e => { })
            const voiceCME = interaction?.guild.members.cache.get(client.user.id);
            if (voiceCME.voice.channelId && (voiceCME.voice.channelId !== interaction.member.voice.channelId))
              return interaction.reply({ content: `${lang?.NOvoiceChannel}`, ephemeral: true }).catch(e => { })
          };
          return props.run(lang, interaction);
        } catch (e) {
          return interaction.reply({ content: `ERROR\n\n\`\`\`${e.message}\`\`\``, ephemeral: true }).catch(e => { })
        }
      }
    });
  });
  
}