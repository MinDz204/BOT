const { InteractionType } = require('discord.js');
const config = require('../config');

const interactionHandler = {
  [InteractionType.ApplicationCommand]: require("./interaction/Application"),
  [InteractionType.ApplicationCommandAutocomplete]: require("./interaction/Autocomplete"),
  [InteractionType.MessageComponent]: require("./interaction/Button"),
  [InteractionType.ModalSubmit]: require("./interaction/modal"),
};

module.exports = async (client, interaction) => {
  if (interaction.user.bot) return;
  // console.log(interaction);
  const handler = interactionHandler[interaction.type];
  if (handler && config?.interactionCreate?.[InteractionType?.[interaction.type]])  return handler(client, interaction);
};
