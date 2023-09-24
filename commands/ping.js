const { EmbedBuilder } = require("discord.js");
const client = require('../bot');

module.exports = {
    name: "ping",
    description: "View bot ping.",
    options: [],
    cooldown: 3,
run: async ( lang, interaction ) => {

  interaction?.reply({content:`<a:loading:1151184304676819085> Loading...`, ephemeral: true }).then(async Message => { setTimeout(function(){
    Message?.delete().catch( e => { } );
},10000)}).catch(e => { console.log(e) })

  const start = Date.now();
  interaction?.channel?.send("Pong!").then(async Message => {
    const end = Date.now();
    const embed = new EmbedBuilder()
      .setColor( lang.COLOR|| client.color )
      .setTitle(client?.user?.username + " - Pong!")
      .setThumbnail(client.user.displayAvatarURL())
      .addFields([
        { name: `Message Ping`, value: `\`${end - start}ms\` 🛰️` },
        { name: `Message Latency`, value: `\`${Date.now() - start}ms\` 🛰️` },
        { name: `API Latency`, value: `\`${Math.round(client.ws.ping)}ms\` 🛰️` }
      ])
      .setTimestamp()
      .setFooter({ text: `${lang?.RequestBY} ${interaction.user?.tag}`, iconURL: interaction.user?.displayAvatarURL({ dynamic: true}) })
    return Message.edit({ content:``, embeds: [embed] }).catch(e => { });
}).catch(err => { })

    },
  };
  