module.exports = async (client, interaction) => {
    try{
        switch ( interaction.customId ){
        case "ZiCompSearch":
            const nameS = interaction.fields.getTextInputValue("resu");
        return require("./../ziplayer/ziSearch")( interaction, nameS )
        default:
            console.log(interaction.customId)
    }
    } catch (e) {
        console.log(e)}
    }
    