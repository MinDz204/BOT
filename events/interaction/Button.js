function validURL(str) {
    var pattern = new RegExp('^(https?:\\/\\/)?'+ // protocol
      '((([a-z\\d]([a-z\\d-]*[a-z\\d])*)\\.)+[a-z]{2,}|'+ // domain name
      '((\\d{1,3}\\.){3}\\d{1,3}))'+ // OR ip (v4) address
      '(\\:\\d+)?(\\/[-a-z\\d%_.~+]*)*'+ // port and path
      '(\\?[;&a-z\\d%_.~+=-]*)?'+ // query string
      '(\\#[-a-z\\d_]*)?$','i'); // fragment locator
    return !!pattern.test(str);
  }
module.exports = async (client, interaction) => {
try{
    if (validURL(interaction.customId)){
      await require("./../ziplayer/ziSearch")(interaction, interaction.customId);
      return interaction?.message.delete();
    }
    if (interaction?.customId.includes("Ziplayer")) return require("./../ziplayer/ZiplayerFuns")( interaction )
    switch ( interaction.customId ){
    case "cancel":
      return interaction?.message.delete();
    default:
        console.log(interaction.customId)
}
} catch (e) {
    console.log(e)}
}
