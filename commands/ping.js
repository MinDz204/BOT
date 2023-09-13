const client = require("..");
const { useMainPlayer, QueryType } = require('discord-player');
const { YouTubeExtractor, Internal, YoutubeExtractor } = require("@discord-player/extractor")
const player = useMainPlayer();
module.exports = {
    name: "ping",
    description: "View bot ping.",
    options: [],
    cooldown: 3,
    run: async ( lang, interaction ) => {
let youtube = new YoutubeExtractor()
      let res =  await player.search(`Là em tự đa tình 是我在做多情种`,{
        fallbackSearchEngine: QueryType.YOUTUBE,
        requestedBy:interaction.user,
      });
      console.log(res.tracks)

        let resss = youtube.getRelatedTracks(res.tracks[0], res.tracks)
      interaction.reply( resss )
    },
  };
  