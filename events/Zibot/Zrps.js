const { EmbedBuilder } = require("discord.js");
const client = require("../../bot");

const choices = {
    rock: '🪨',
    paper: '📄',
    scissors: '✂️'
  };
  
  function getRandomChoice() {
    const keys = Object.keys(choices);
    const randomKey = keys[Math.floor(Math.random() * keys.length)];
    return {
      name: randomKey,
      symbol: choices[randomKey]
    };
  }
  
  function determineWinner(userChoice, botChoice) {
    if (userChoice === botChoice.name) {
      return 'It\'s a draw!';
    }
  
    if (
      (userChoice === 'rock' && botChoice.name === 'scissors') ||
      (userChoice === 'scissors' && botChoice.name === 'paper') ||
      (userChoice === 'paper' && botChoice.name === 'rock')
    ) {
      return 'You win!';
    } else {
      return 'You lose!';
    }
  }



module.exports = async (interaction, lang) => {
    const userChoice = interaction?.customId.replace('Zrps', '');
    const botChoice = getRandomChoice();

    const result = determineWinner(userChoice, botChoice);

    const embed = new EmbedBuilder()
      .setTitle("Rock Paper Scissors")
      .setImage("https://cdn.discordapp.com/attachments/1160318121308074035/1235007176695742465/rockpaperscissors.png")
      .setColor(lang?.COLOR || client.color)
      .setDescription(`You chose ${choices[userChoice]}.\nBot chose ${botChoice.symbol}.\n\n**${result}**`);
    await interaction.deferUpdate().catch(e => console.log );
    await interaction.message.edit({ embeds: [embed] }).catch(e => console.log );
}