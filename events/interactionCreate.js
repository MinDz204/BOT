const { InteractionType } = require('discord.js');

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
  return handler?.(client, interaction);
};
