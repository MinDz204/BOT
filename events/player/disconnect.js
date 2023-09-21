

module.exports = async ( client, queue, track ) =>{
    return queue?.metadata?.Zimess?.edit({ components:[ ] }).catch(e => { })
}