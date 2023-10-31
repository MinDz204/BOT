const { SlashCommandBuilder, ApplicationCommandType,ContextMenuCommandBuilder } = require('discord.js');
(async()=>{
    const data = new ContextMenuCommandBuilder()
	.setName('User Information')
	.setType(ApplicationCommandType.User);
    console.log(data)
})()