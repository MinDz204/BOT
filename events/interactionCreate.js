const { InteractionType } = require("discord.js");
module.exports = async (client, interaction) => {
  if (interaction.user.bot) return;
  switch (interaction.type) {
    case InteractionType.ApplicationCommand:
      return require("./interaction/Application")(client, interaction);
    case InteractionType.ApplicationCommandAutocomplete:
      return require("./interaction/Autocomplete")(client, interaction);
    case InteractionType.MessageComponent:
      return require("./interaction/Button")(client, interaction);
    case InteractionType.ModalSubmit:
      return require("./interaction/modal")(client, interaction);
    default:
      return console.log(interaction?.type) // ping( 1 )
  }
}
