const { useMainPlayer, QueryType } = require("discord-player");
const Kitsu = require("kitsu");
const translate = require('@iamtraction/google-translate');
const { removeVietnameseTones, Zitrim } = require("../Zibot/ZiFunc");
const config = require("./../../config");
const db = require("./../../mongoDB");

module.exports = async (client, interaction) => {
  try {
    switch (interaction.commandName) {
      case "p":
      case "play":
      case "lyrics":
        try {
          const player = useMainPlayer();// main player
          const nameS = interaction.options.getString("name", true)
          const results = await player.search(nameS, {
            fallbackSearchEngine: QueryType.YOUTUBE
          });
          const tracks = results.tracks.filter(t => t?.url.length > 1).slice(0, 10);
          return interaction.respond(
            tracks.map((t) => ({
              name: Zitrim(t.title, 100),
              value: Zitrim(interaction.commandName == "lyrics" ? t.title : t.url, 100)
            }))
          ).catch(e => { });
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
          return interaction?.respond().catch(e => { });
        }
      case "translate": {
        try {
          const userDoc = await db.ZiUser.findOne({ userID: interaction.userID }, "userID lang Xp lvl coin cooldowns color");
          const lang = require(`./../../lang/${userDoc?.lang || "vi"}.js`)
          const args = interaction.options.getString('transtext', true);
          const translated = await translate(args, { to: lang?.langdef || "vi" });
          const val = translated.from.text.value;
          if (val) return interaction?.respond([{
            name: val,
            value: val.replace(/[\[\]]/g, "")
          }]).catch(e => console.log);
          return interaction?.respond().catch(e => { });
        } catch (e) {
          return interaction?.respond().catch(e => { });
        }
      }
      //:::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::://
      default: {
        return client?.errorLog?.send(`**${config?.Zmodule}** <t:${Math.floor(Date.now() / 1000)}:R>\nAutpcomp:${interaction?.customId}`);
      }
    }
  } catch (e) {
    return client?.errorLog?.send(`**${config?.Zmodule}** <t:${Math.floor(Date.now() / 1000)}:R>\nAutpcomp:${e?.stack}`)
  }
}
