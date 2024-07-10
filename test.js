const { Innertube } = require("youtubei.js");
// const Innertube = re
(async () => {
    const tube = await Innertube.create()

    console.log(await tube.search("Diamond heart"))
})()
