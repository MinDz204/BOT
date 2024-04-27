const { useMainPlayer, QueryType } = require("discord-player");
const Kitsu = require("kitsu");
const { removeVietnameseTones, Zitrim } = require("../Zibot/ZiFunc");

module.exports = async (client, interaction) => {
  try {
    switch (interaction.commandName) {
      case "p":
      case "play":
        try {
          const player = useMainPlayer();// main player
          const nameS = interaction.options.getString("name", true)
          const results = await player.search(nameS, {
            fallbackSearchEngine: QueryType.YOUTUBE
          });
          return interaction.respond(
            results.tracks
              .slice(0, 10)
              .map((t) => ({
                name: Zitrim(t.title, 100),
                value: Zitrim(t.url, 100)
              }))
          );
        } catch (e) {
          return interaction.respond().catch(e => { })
        }
      case "lyrics":
        try {
          const player = useMainPlayer();// main player
          const nameS = interaction.options.getString("name", true)
          const results = await player.search(nameS, {
            fallbackSearchEngine: QueryType.YOUTUBE
          });
          return interaction.respond(
            results.tracks
              .slice(0, 10)
              .map((t) => ({
                name: Zitrim(t.title, 100),
                value: Zitrim(t.title, 100)
              }))
          );
        } catch (e) {
          return interaction.respond().catch(e => { })
        }
      case "anime":
        try {
          const kitsu = new Kitsu();//kitsu
          const query = interaction.options.getString('name', true);
          const search = encodeURI(removeVietnameseTones(query));
          const { data } = await kitsu.get('anime?filter[text]=' + search + '&page[limit]=' + 10);
          return interaction?.respond(
            data.slice(0, 10).map((t) => ({
              name: t?.titles?.en_jp || t?.titles?.en || t?.titles?.jp_jp,
              value: t?.titles?.en_jp || t?.titles?.en || t?.titles?.jp_jp
            }))
          ).catch(e => { console.log(e) });
        } catch (e) {
          return interaction?.respond().catch(e => {  });
        }
        
      //:::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::://
      default: {
        console.log(interaction?.customId)
        console.log('autpcomp')
        break;
      }
    }
  } catch (e) {
    console.log(e)
  }
}
