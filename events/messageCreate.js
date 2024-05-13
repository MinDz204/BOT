const { EmbedBuilder } = require("discord.js");
const { rank } = require("./Zibot/ZilvlSys");
const config = require("../config");
const ziSearch = require("./ziplayer/ziSearch");
const playMusic = async (lang, message, client, content) => {
    const member = message.member;
    if (!member.voice.channelId) {
        return message.reply({ content: lang?.NOvoice, ephemeral: true }).catch(() => {});
    }

    const botMember = message.guild.members.cache.get(client.user.id);
    const botChannelId = botMember.voice.channelId;
    const memberChannelId = member.voice.channelId;

    if (botChannelId && botChannelId !== memberChannelId) {
        return message.reply({ content: lang?.NOvoiceChannel, ephemeral: true }).catch(() => {});
    }

    return ziSearch(message, content);
};

module.exports = async (client, message) => {
    if (message.author.bot) return;
    if (message.content.includes("@here") || message.content.includes("@everyone")) return;
    if (!message.content.includes(`<@${client.user.id}>`)) return;

    const content = message?.content.toLowerCase();
    const lang = await rank({ user: message.author });

//////////////////////////////////////////////////////////////////////////////////
    message.react("<a:likee:1210193685501706260>");
    if (message?.reference && message?.guild) {
        const refMsgId = message.reference.messageId;
        return message.channel.messages.fetch(refMsgId, { cache: false, force: true })
            .then(async (mess) => {
                let msgContent;
                const embedData = mess.embeds[0]?.data;
                const hasSpecialField = embedData?.fields[0]?.name.includes("▒") || 
                                        embedData?.fields[0]?.name.includes("█");
    
                if (hasSpecialField) {
                    msgContent = embedData.author?.url;
                } else {
                    msgContent = mess.content;
                }
                
                return playMusic(lang, message, client, msgContent);
            })
            .catch(async() => {
                const reply = await message.reply(lang?.PlayerSearchErr);
                setTimeout(() => {
                    reply.delete().catch(() => {});
                }, 10000);
            });
    }

    const isBotMentioned = content.match(new RegExp(`^<@!?${client.user.id}>( |)$`));
    if (isBotMentioned) {
        const embed = new EmbedBuilder()
            .setColor(lang?.COLOR || client.color)
            .setTitle("Yo... Ziji desu :3")
            .setDescription(`${lang?.MENstion}\n${config?.Zmodule} ✅`)
            .setURL(`${client?.InviteBot}`)
            .setTimestamp()
            .setFooter({ text: `${lang?.RequestBY} ${message.author.tag}`, iconURL: message.author.displayAvatarURL({ dynamic: true }) })
            .setImage(lang?.banner);

        return message.reply({ embeds: [embed] });
    }

    if (config.messCreate.PlayMusic && message.guild) {
        const playContent = message.content.replace(`<@${client.user.id}>`, "").trim();
        return playMusic(lang, message, client, playContent);
    }
};
