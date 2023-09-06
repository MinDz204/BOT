const { useMainPlayer, QueryType } = require("discord-player");
const player = useMainPlayer();
module.exports = async (client, interaction) => {
try{
    switch ( interaction.commandName ){
    case "p":
    case "play":
    const nameS = interaction.options.getString("name",true)
    const results = await player.search(nameS,{
        fallbackSearchEngine: QueryType.YOUTUBE
    });
    return interaction.respond(
        results.tracks
        .filter(t => t.title.length <100 && t.url.length < 100)
        .slice(0, 10)
        .map((t) => ({
            name: t.title,
            value: t.url
        }))
    );

}
} catch (e) {
    console.log(e)}
}
