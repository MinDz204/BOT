module.exports = {
    name: "ping",
    description: "View bot ping.",
    options: [],
    cooldown: 3,
    run: async (client, interaction) => {
  
      interaction.reply("pong")
  
    },
  };
  