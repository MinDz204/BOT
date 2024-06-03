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
    if (botMember.voice.channelId && botMember.voice.channelId !== member.voice.channelId) {
        return message.reply({ content: lang?.NOvoiceChannel, ephemeral: true }).catch(() => {});
    }

    return ziSearch(message, content);
};

const fetchMessageContent = async (message, refMsgId) => {
    try {
        const mess = await message.channel.messages.fetch(refMsgId, { cache: false, force: true });
        const embedData = mess.embeds[0]?.data;
        const hasSpecialField = embedData?.fields?.[0]?.name.includes("▒") || embedData?.fields?.[0]?.name.includes("█");
        let msgContent = hasSpecialField ? embedData?.author?.url : mess.content;

        return msgContent || embedData?.description;
    } catch (e) {
        console.error(e);
        const reply = await message.reply(lang?.PlayerSearchErr);
        setTimeout(() => {
            reply.delete().catch(() => {});
        }, 10000);
        return null;
    }
};

const handleBotMention = async (message, client, lang, content) => {
    const embed = new EmbedBuilder()
        .setColor(lang?.COLOR || client.color)
        .setTitle("Yo... Ziji desu :3")
        .setDescription(`${lang?.MENstion}\n${config?.Zmodule} ✅`)
        .setURL(`${client?.InviteBot}`)
        .setTimestamp()
        .setFooter({ text: `${lang?.RequestBY} ${message.author.tag}`, iconURL: message.author.displayAvatarURL({ dynamic: true }) })
        .setImage(lang?.banner);

    return message.reply({ embeds: [embed] });
};

module.exports = async (client, message) => {
    if (message.author.bot || message.content.includes("@here") || message.content.includes("@everyone")) return;

    const botMentionRegex = new RegExp(`^<@!?${client.user.id}>( |)$`);
    if (!message.content.includes(`<@${client.user.id}>`) && !message.content.match(botMentionRegex)) return;

    const content = message.content.toLowerCase();
    const lang = await rank({ user: message.author });

    message.react("<a:likee:1210193685501706260>");

    if (message.reference && message.guild && config.messCreate.PlayMusic) {
        const refMsgId = message.reference.messageId;
        const msgContent = await fetchMessageContent(message, refMsgId);
        if (msgContent) {
            return playMusic(lang, message, client, msgContent);
        }
        return;
    }

    if (botMentionRegex.test(content)) {
        return handleBotMention(message, client, lang, content);
    }

    if (config.messCreate.PlayMusic && message.guild) {
        const playContent = message.content.replace(`<@${client.user.id}>`, "").trim();
        return playMusic(lang, message, client, playContent);
    }
};
