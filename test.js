
(async()=>{
    const { Wrapper } = require('enkanetwork.js');

    // Genshin client and Star Rail client.
    const { genshin, starrail } = new Wrapper({ language: "vi", cache: true });
    
    /** options:
     * userAgent: string -> optional (default is enkanetwork.js/v<package_version>)
     * language: string -> optional (default is English)
     * cache: boolean -> optional (default is false)
     */
    
    // Or starrail. Works for both.
    await genshin.getPlayer(835925521)
    .then((player) => console.log(player))
    .catch((err) => console.log(err));

})()