const fs = require("fs/promises");
const { PermissionsBitField } = require("discord.js");
const { rank } = require("./../Zibot/ZilvlSys");
const config = require("../../config");

// Load command and context files once
let commandFiles;
let contextFiles;

(async function initialize() {
  try {
    commandFiles = await fs.readdir("./commands");
    contextFiles = await fs.readdir("./context");
  } catch (error) {
    console.error("Error loading command/context files:", error);
  }
})();

module.exports = async (client, interaction) => {
  if (interaction.user.bot || !commandFiles || !contextFiles) return;

  try {
    switch (interaction.commandType) {
      case 1:
        return await processFiles(client, interaction, commandFiles, "./../../commands", config.Discommands);
      case 2:
      case 3:
        return await processFiles(client, interaction, contextFiles, "./../../context", config.DisContext);

      default:
        return;
    }
  } catch (error) {
    console.error("Error handling interaction:", error);
    await sendErrorToUser(interaction, error, client);
  }
};

async function processFiles(client, interaction, files, dir, disallowList) {
  const commandName = interaction.commandName.toLowerCase();

  for (const file of files) {
    const props = require(`${dir}/${file}`);

    if (commandName !== props.name.toLowerCase() || disallowList.includes(interaction.commandName)) {
      continue;
    }

    const lang = await rank({ user: interaction.user });
    if (!lang) {
      return await sendErrorToUser(interaction, new Error("Unable to retrieve user language."), client);
    }

    const now = Date.now();

    // Check cooldowns
    const cooldownAmount = (props.cooldown ?? 3) * 1000;
    if (lang.cooldowns && now < lang.cooldowns + cooldownAmount) {
      const expiredTimestamp = Math.round((lang.cooldowns + cooldownAmount) / 1000);
      return interaction.reply({
        content: lang.cooldownsMESS
          .replace("{expiredTimestamp}", expiredTimestamp)
          .replace("{interaction.commandName}", interaction.commandName),
        ephemeral: true,
      });
    }

    // Permission checks
    if (props.NODMPer && !interaction.guild) {
      return interaction.reply({ content: lang.NODMPer, ephemeral: true });
    }

    if (interaction.guild) {
      const hasPermission = interaction.channel.permissionsFor(client.user).has([
        PermissionsBitField.Flags.SendMessages,
        PermissionsBitField.Flags.ViewChannel,
      ]);

      if (!hasPermission) {
        return interaction.reply({ content: lang.NOPer, ephemeral: true });
      }
    }

    // Voice channel checks
    if (props.voiceC && !interaction.member.voice.channelId) {
      return interaction.reply({ content: lang.NOvoice, ephemeral: true });
    }

    const clientVoiceChannel = interaction?.guild?.members?.cache.get(client.user.id)?.voice?.channelId;
    if (props.voiceC && clientVoiceChannel && clientVoiceChannel !== interaction.member?.voice.channelId) {
      return interaction.reply({ content: lang.NOvoiceChannel, ephemeral: true });
    }

    try {
      return await props.run(lang, interaction);
    } catch (commandError) {
      console.error("Error processing command:", commandError);
      return await sendErrorToUser(interaction, commandError, client);
    }
  }
}

async function sendErrorToUser(interaction, error, client) {
  try {
    await interaction.user.send({ content: `ERROR\n\n\`\`\`${error.message}\`\`\`` });
    return client?.errorLog?.send(`**${config?.Zmodule}** <t:${Math.floor(Date.now() / 1000)}:R>\nAPP:${error?.stack}`)
  } catch (sendError) {
    console.error("Error sending error message to user:", sendError);
    return client?.errorLog?.send(`**${config?.Zmodule}** <t:${Math.floor(Date.now() / 1000)}:R>\nAPP:${sendError?.stack}`)
  }
}
